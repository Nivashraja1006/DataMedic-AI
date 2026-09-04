from __future__ import annotations

import io
import math
import os
import re
from pathlib import Path
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sklearn.ensemble import IsolationForest
from werkzeug.utils import secure_filename
from fuzzywuzzy import fuzz

try:
    import openai
except Exception:  # pragma: no cover - optional dependency
    openai = None

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",
    "https://your-vercel-app.vercel.app",
])

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 200 * 1024 * 1024
app.config['ENVIRONMENT'] = os.environ.get('FLASK_ENV', 'production')

jwt = JWTManager(app)


@app.errorhandler(400)
def handle_bad_request(error):
    return jsonify({'error': 'Bad request', 'details': str(error)}), 400


@app.errorhandler(404)
def handle_not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def handle_server_error(error):
    app.logger.exception('Unhandled API error')
    return jsonify({'error': 'Internal server error'}), 500

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PHONE_PATTERN = re.compile(r"^[+\d][\d\s().-]{7,}$")

# In-memory user store for demo (replace with database)
users = {}
datasets_store = {}


def clean_numeric(value, default=0.0):
    """Convert values to a finite float and never leak NaN or inf into JSON."""
    try:
        number = float(value)
        if pd.isna(number) or not math.isfinite(number):
            return float(default)
        return float(number)
    except (TypeError, ValueError):
        return float(default)


def sanitize_json(value):
    """Recursively replace NaN/inf/None semantics with JSON-safe values."""
    if isinstance(value, dict):
        return {str(key): sanitize_json(item) for key, item in value.items()}
    if isinstance(value, list):
        return [sanitize_json(item) for item in value]
    if isinstance(value, tuple):
        return [sanitize_json(item) for item in value]
    if isinstance(value, np.generic):
        return sanitize_json(value.item())
    if isinstance(value, (np.integer, np.floating)):
        return sanitize_json(value.item())
    if isinstance(value, float):
        if pd.isna(value) or not math.isfinite(value):
            return 0.0
        return float(value)
    if value is None:
        return None
    return value


def safe_float(value, default=0.0):
    """Return a finite float or a safe default."""
    try:
        numeric = float(value)
    except (TypeError, ValueError):
        return float(default)

    if pd.isna(numeric) or not np.isfinite(numeric):
        return float(default)
    return float(numeric)


def safe_divide(numerator, denominator, default=0.0):
    """Prevent division by zero and NaN propagation."""
    numerator = safe_float(numerator, 0.0)
    denominator = safe_float(denominator, 0.0)
    if denominator == 0:
        return float(default)
    result = numerator / denominator
    return safe_float(result, default)


def local_ai_insight(frame, dataset_name="dataset"):
    """Fallback insight engine when OpenAI is unavailable or not configured."""
    try:
        validate_dataset(frame)
    except ValueError:
        return "The uploaded dataset is empty or invalid. Please provide a valid CSV, Excel, or JSON file."

    summary = summarize_dataset_analysis(frame)
    issues = summary.get("issues", [])
    row_count = max(len(frame), 1)
    null_pct = summary.get("null_percent", 0)
    duplicate_pct = summary.get("duplicate_percent", 0)
    outlier_pct = summary.get("outlier_percent", 0)

    if issues:
        first_issue = issues[0]
        issue_text = first_issue.get("title", "data quality issue")
        return (
            f"{dataset_name.title()} shows {issue_text.lower()} as the highest-priority issue. "
            f"I recommend fixing missing values and duplicate rows first, then validating format consistency "
            f"before using the file for modeling or reporting."
        )

    if null_pct > 12:
        return f"{dataset_name.title()} has a significant missing-value rate. Consider imputation or row cleanup before modeling."
    if duplicate_pct > 4:
        return f"{dataset_name.title()} contains notable duplicate records. Remove duplicates to improve trust and model accuracy."
    if outlier_pct > 8:
        return f"{dataset_name.title()} includes several outliers that may reflect anomalies. Review them before finalizing the analysis."
    if row_count < 50:
        return f"{dataset_name.title()} is relatively small but structurally healthy. It is ready for quick review and downstream analysis."

    return f"{dataset_name.title()} looks broadly healthy and stable. No critical quality issues were detected in the current scan."


def generate_openai_insight(summary, dataset_name="dataset"):
    """Generate a short AI insight using OpenAI when an API key is configured."""
    if openai is None:
        return None

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return None

    try:
        client = openai.OpenAI(api_key=api_key)
        prompt = (
            f"You are a data quality analyst. Dataset name: {dataset_name}. "
            f"Metrics: rows={summary.get('rows', 0)}, columns={summary.get('cols', 0)}, "
            f"null_percent={summary.get('null_percent', 0)}, duplicate_percent={summary.get('duplicate_percent', 0)}, "
            f"outlier_percent={summary.get('outlier_percent', 0)}, quality_score={summary.get('overall_score', 0)}. "
            "Give a concise, actionable insight in 1 short paragraph."
        )
        response = client.responses.create(
            model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
            input=prompt,
        )

        text = getattr(response, "output_text", None) or ""
        if isinstance(text, str) and text.strip():
            return text.strip()
    except Exception:
        return None

    return None


def validate_dataset(frame):
    """Ensure we only process a valid DataFrame with usable structure."""
    if frame is None or not isinstance(frame, pd.DataFrame):
        raise ValueError("Dataset is missing or invalid")
    if frame.empty:
        raise ValueError("Dataset is empty")
    if len(frame.columns) == 0:
        raise ValueError("Dataset has no columns")
    return frame


def read_dataset(upload):
    suffix = Path(upload.filename or "").suffix.lower()
    payload = upload.read()
    if suffix == ".csv":
        return pd.read_csv(io.BytesIO(payload))
    if suffix in {".xlsx", ".xls"}:
        return pd.read_excel(io.BytesIO(payload))
    if suffix == ".json":
        return pd.read_json(io.BytesIO(payload))
    raise ValueError("Supported formats are CSV, Excel, and JSON")


def profile_dataset(frame):
    """Generate comprehensive data profile."""
    try:
        validate_dataset(frame)
    except ValueError:
        return {
            "rows": 0,
            "columns": 0,
            "quality_score": 0.0,
            "missing_values": 0,
            "duplicate_rows": 0,
            "outliers": 0,
            "columns_profile": [],
            "preview": [],
        }

    numeric = frame.select_dtypes(include=np.number)
    outlier_count = 0
    if not numeric.empty and len(frame) > 8:
        try:
            model = IsolationForest(random_state=42, contamination="auto")
            outlier_count = int((model.fit_predict(numeric.fillna(numeric.median())) == -1).sum())
        except Exception:
            outlier_count = 0

    missing = int(frame.isna().sum().sum())
    duplicate = int(frame.duplicated().sum())
    total_cells = max(int(frame.size), 1)
    row_count = max(int(len(frame)), 1)

    quality = round(
        max(
            0.0,
            100
            - ((safe_divide(float(missing), float(total_cells), 0.0)) * 45)
            - ((safe_divide(float(duplicate), float(row_count), 0.0)) * 30)
            - ((safe_divide(float(outlier_count), float(row_count), 0.0)) * 15),
        ),
        1,
    )

    columns = []
    for name in frame.columns:
        series = frame[name]
        series_length = max(int(len(series)), 1)
        col_type = (
            "numeric"
            if pd.api.types.is_numeric_dtype(series)
            else "datetime"
            if pd.api.types.is_datetime64_any_dtype(series)
            else "category"
            if safe_divide(float(series.nunique(dropna=True)), float(series_length), 0.0) < 0.05
            else "string"
        )

        null_percent = safe_divide(float(series.isna().sum()), float(series_length), 0.0) * 100
        unique_percent = safe_divide(float(series.nunique(dropna=True)), float(series_length), 0.0) * 100

        columns.append({
            "name": str(name),
            "type": col_type,
            "null_percent": round(float(null_percent), 2),
            "unique_percent": round(float(unique_percent), 2),
            "missing_count": int(series.isna().sum()),
            "unique_count": int(series.nunique(dropna=True)),
            "sample": str(series.dropna().iloc[0]) if not series.dropna().empty else None,
        })

    preview_data = frame.head(10).replace({np.nan: None, np.inf: None, -np.inf: None})
    safe_preview = sanitize_json(preview_data.to_dict(orient="records"))
    return {
        "rows": int(len(frame)),
        "columns": int(len(frame.columns)),
        "quality_score": float(safe_float(quality, 0.0)),
        "missing_values": missing,
        "duplicate_rows": duplicate,
        "outliers": outlier_count,
        "columns_profile": sanitize_json(columns),
        "preview": safe_preview,
    }


def summarize_dataset_analysis(frame):
    """Compute a summary used by the live dashboard and real-time quality widgets."""
    try:
        validate_dataset(frame)
    except ValueError:
        return {
            "overall_score": 0.0,
            "null_percent": 0.0,
            "duplicate_percent": 0.0,
            "validity_score": 0.0,
            "outlier_percent": 0.0,
            "missing_values": 0,
            "duplicate_rows": 0,
            "outliers": 0,
            "issues": [],
            "profile": profile_dataset(frame),
            "insights": ["The dataset is empty or invalid and requires a valid file to run analysis."],
            "status": "needs-review",
        }

    profile = profile_dataset(frame)
    issues = detect_all_issues(frame)

    total_rows = max(len(frame), 1)
    total_cells = max(int(frame.size), 1)
    null_percent = round(float(safe_divide(float(frame.isna().sum().sum()), float(total_cells), 0.0) * 100), 2)
    duplicate_percent = round(float(safe_divide(float(frame.duplicated().sum()), float(total_rows), 0.0) * 100), 2)

    invalid_issue_count = sum(1 for issue in issues if issue["category"] in {"format", "missing"})
    validity_score = max(0.0, 100 - (invalid_issue_count / max(len(issues) or 1, 1) * 100))
    if issues:
        validity_score = max(0.0, 100 - (sum(1 for issue in issues if issue["category"] in {"format", "missing"}) / max(len(issues), 1) * 100))
    else:
        validity_score = 100.0

    outlier_percent = round(float(safe_divide(float(profile["outliers"]), float(total_rows), 0.0) * 100), 2)
    overall_score = float(safe_float(profile["quality_score"], 0.0))

    insights = []
    if null_percent > 10:
        insights.append("High null rates are reducing completeness and may distort downstream analysis.")
    if duplicate_percent > 5:
        insights.append("Duplicate rows are inflating counts and should be reviewed before modeling.")
    if validity_score < 80:
        insights.append("Several values appear to violate format expectations, especially in identity-like fields.")
    if outlier_percent > 8:
        insights.append("A notable share of outliers indicates operational anomalies or sudden shifts in the input data.")
    if not insights:
        insights.append("The dataset is structurally healthy with no major anomalies detected in the current scan.")

    summary = {
        "overall_score": round(overall_score, 1),
        "null_percent": float(safe_float(null_percent, 0.0)),
        "duplicate_percent": float(safe_float(duplicate_percent, 0.0)),
        "validity_score": round(float(safe_float(validity_score, 0.0)), 1),
        "outlier_percent": float(safe_float(outlier_percent, 0.0)),
        "missing_values": int(profile["missing_values"]),
        "duplicate_rows": int(profile["duplicate_rows"]),
        "outliers": int(profile["outliers"]),
        "issues": sanitize_json(issues),
        "profile": sanitize_json(profile),
        "insights": sanitize_json(insights),
        "status": "completed" if overall_score >= 70 else "needs-review",
    }
    return sanitize_json(summary)


def detect_all_issues(frame):
    """Comprehensive issue detection"""
    issues = []
    
    # Missing values
    for column in frame.columns:
        series = frame[column]
        missing_count = int(series.isna().sum())
        missing_percent = float(series.isna().mean() * 100)
        
        if missing_count > 0:
            severity = "High" if missing_percent > 10 else "Medium" if missing_percent > 5 else "Low"
            issues.append({
                "id": len(issues),
                "category": "missing",
                "severity": severity,
                "column": str(column),
                "title": f"{missing_count} missing values",
                "description": f"{missing_percent:.1f}% of values are missing",
                "affected_rows": missing_count,
                "recommendation": "Impute missing values or remove rows"
            })
    
    # Duplicates
    duplicate_count = int(frame.duplicated().sum())
    if duplicate_count > 0:
        issues.append({
            "id": len(issues),
            "category": "duplicate",
            "severity": "High",
            "column": "all columns",
            "title": f"{duplicate_count} duplicate records",
            "description": "Found completely identical rows",
            "affected_rows": duplicate_count,
            "recommendation": "Remove or merge duplicate rows"
        })
    
    # Format issues
    for column in frame.columns:
        series = frame[column]
        col_name = str(column).lower()
        
        if "email" in col_name:
            invalid = int(series.dropna().astype(str).apply(lambda x: not EMAIL_PATTERN.match(x)).sum())
            if invalid > 0:
                issues.append({
                    "id": len(issues),
                    "category": "format",
                    "severity": "High",
                    "column": str(column),
                    "title": f"{invalid} invalid email formats",
                    "description": "Emails do not match standard format",
                    "affected_rows": invalid,
                    "recommendation": "Validate and fix email formats"
                })
        
        if "phone" in col_name:
            invalid = int(series.dropna().astype(str).apply(lambda x: not PHONE_PATTERN.match(x)).sum())
            if invalid > 0:
                issues.append({
                    "id": len(issues),
                    "category": "format",
                    "severity": "Medium",
                    "column": str(column),
                    "title": f"{invalid} invalid phone formats",
                    "description": "Phone numbers do not match standard format",
                    "affected_rows": invalid,
                    "recommendation": "Standardize phone number format"
                })
    
    # Outliers
    numeric = frame.select_dtypes(include=np.number)
    if not numeric.empty and len(frame) > 10:
        model = IsolationForest(random_state=42, contamination=0.05)
        predictions = model.fit_predict(numeric.fillna(numeric.median()))
        outlier_count = int((predictions == -1).sum())
        if outlier_count > 0:
            issues.append({
                "id": len(issues),
                "category": "outlier",
                "severity": "Low",
                "column": "numeric columns",
                "title": f"{outlier_count} statistical outliers",
                "description": "Detected unusual values deviating from pattern",
                "affected_rows": outlier_count,
                "recommendation": "Review outliers for legitimacy"
            })
    
    return issues


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "datamedic-ai"})

# ===== AUTHENTICATION ENDPOINTS =====

@app.post("/api/auth/signup")
@app.post("/register")
def signup():
    """User registration"""
    print("Register endpoint hit")
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if data['email'] in users:
        return jsonify({'error': 'Email already registered'}), 409
    
    # Simple password hashing (in production use bcrypt)
    import hashlib
    password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
    
    users[data['email']] = {
        'id': len(users),
        'username': data['username'],
        'email': data['email'],
        'password_hash': password_hash,
        'role': data.get('role', 'analyst'),
        'created_at': datetime.utcnow().isoformat()
    }
    
    access_token = create_access_token(identity=data['email'])
    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'user': {
            'username': data['username'],
            'email': data['email'],
            'role': users[data['email']]['role']
        }
    }), 200

@app.post("/api/auth/login")
@app.post("/login")
def login():
    """User login"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    if data['email'] not in users:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    import hashlib
    password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
    
    if users[data['email']]['password_hash'] != password_hash:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    access_token = create_access_token(identity=data['email'])
    user = users[data['email']]
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'username': user['username'],
            'email': user['email'],
            'role': user['role']
        }
    }), 200

@app.get("/api/auth/me")
@jwt_required()
def get_profile():
    """Get current user profile"""
    email = get_jwt_identity()
    if email not in users:
        return jsonify({'error': 'User not found'}), 404
    
    user = users[email]
    return jsonify({
        'username': user['username'],
        'email': user['email'],
        'role': user['role'],
        'created_at': user['created_at']
    }), 200

# ===== DATASET MANAGEMENT =====

@app.get("/api/datasets")
@jwt_required()
def get_datasets():
    """Get all datasets for current user"""
    email = get_jwt_identity()
    user_datasets = [d for d in datasets_store.values() if d['owner'] == email]
    return jsonify(user_datasets), 200

@app.get("/api/datasets/<int:dataset_id>")
@jwt_required()
def get_dataset(dataset_id):
    """Get specific dataset"""
    email = get_jwt_identity()
    if dataset_id not in datasets_store:
        return jsonify({'error': 'Dataset not found'}), 404
    
    dataset = datasets_store[dataset_id]
    if dataset['owner'] != email:
        return jsonify({'error': 'Access denied'}), 403
    
    return jsonify(dataset), 200

@app.post("/api/datasets/upload")
@jwt_required()
def upload_dataset():
    """Upload a new dataset"""
    email = get_jwt_identity()
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Validate file type
    allowed_extensions = {'csv', 'xlsx', 'json', 'xls'}
    ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
    
    if ext not in allowed_extensions:
        return jsonify({'error': 'Invalid file type. Allowed: CSV, Excel, JSON'}), 400
    
    try:
        # Read file
        if ext == 'csv':
            df = pd.read_csv(file)
        elif ext in {'xlsx', 'xls'}:
            df = pd.read_excel(file)
        elif ext == 'json':
            df = pd.read_json(file)
        
        # Save file
        filename = secure_filename(file.filename)
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S_')
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], timestamp + filename)
        df.to_csv(filepath, index=False)
        
        # Create dataset record
        dataset_id = len(datasets_store)
        analysis = summarize_dataset_analysis(df)
        dataset_name = request.form.get('name', file.filename)
        ai_summary = generate_openai_insight({
            'rows': len(df),
            'cols': len(df.columns),
            'null_percent': analysis.get('null_percent', 0),
            'duplicate_percent': analysis.get('duplicate_percent', 0),
            'outlier_percent': analysis.get('outlier_percent', 0),
            'overall_score': analysis.get('overall_score', 0),
        }, dataset_name) or local_ai_insight(df, dataset_name)
        dataset = {
            'id': dataset_id,
            'name': dataset_name,
            'file_path': filepath,
            'file_type': ext,
            'rows': len(df),
            'cols': len(df.columns),
            'size': os.path.getsize(filepath),
            'quality_score': analysis['overall_score'],
            'owner': email,
            'created_at': datetime.utcnow().isoformat(),
            'profiles': analysis['profile']['columns_profile'],
            'issues': analysis['issues'],
            'analysis': {
                'overall_score': analysis['overall_score'],
                'null_percent': analysis['null_percent'],
                'duplicate_percent': analysis['duplicate_percent'],
                'validity_score': analysis['validity_score'],
                'outlier_percent': analysis['outlier_percent'],
                'insights': analysis['insights'],
                'ai_insight': ai_summary,
            },
            'versions': []
        }
        
        datasets_store[dataset_id] = dataset
        
        return jsonify({
            'message': 'Dataset uploaded successfully',
            'dataset': dataset,
            'analysis': dataset['analysis']
        }), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ===== DATA PROFILING =====


@app.post("/api/datasets/<int:dataset_id>/profile")
@jwt_required()
def profile_dataset_endpoint(dataset_id):
    """Profile a dataset"""
    email = get_jwt_identity()
    
    if dataset_id not in datasets_store:
        return jsonify({'error': 'Dataset not found'}), 404
    
    dataset = datasets_store[dataset_id]
    if dataset['owner'] != email:
        return jsonify({'error': 'Access denied'}), 403
    
    try:
        df = pd.read_csv(dataset['file_path'])
        profile = profile_dataset(df)
        dataset['profiles'] = profile['columns_profile']
        dataset['quality_score'] = profile['quality_score']
        return jsonify(profile), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.post("/api/datasets/<int:dataset_id>/analyze")
@jwt_required()
def analyze_dataset_endpoint(dataset_id):
    """Run the live quality analysis pipeline for a dataset."""
    email = get_jwt_identity()

    if dataset_id not in datasets_store:
        return jsonify({'error': 'Dataset not found'}), 404

    dataset = datasets_store[dataset_id]
    if dataset['owner'] != email:
        return jsonify({'error': 'Access denied'}), 403

    try:
        df = pd.read_csv(dataset['file_path'])
        result = summarize_dataset_analysis(df)
        dataset['quality_score'] = result['overall_score']
        dataset['profiles'] = result['profile']['columns_profile']
        dataset['issues'] = result['issues']
        dataset['analysis'] = {
            'overall_score': result['overall_score'],
            'null_percent': result['null_percent'],
            'duplicate_percent': result['duplicate_percent'],
            'validity_score': result['validity_score'],
            'outlier_percent': result['outlier_percent'],
            'insights': result['insights'],
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.post("/api/datasets/<int:dataset_id>/detect-issues")
@jwt_required()
def detect_issues_endpoint(dataset_id):
    """Detect data quality issues"""
    email = get_jwt_identity()
    
    if dataset_id not in datasets_store:
        return jsonify({'error': 'Dataset not found'}), 404
    
    dataset = datasets_store[dataset_id]
    if dataset['owner'] != email:
        return jsonify({'error': 'Access denied'}), 403
    
    try:
        df = pd.read_csv(dataset['file_path'])
        issues = detect_all_issues(df)
        dataset['issues'] = issues
        return jsonify({'issues': issues}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.get("/api/datasets/<int:dataset_id>/issues")
@jwt_required()
def get_dataset_issues(dataset_id):
    """Get detected issues for dataset"""
    email = get_jwt_identity()
    
    if dataset_id not in datasets_store:
        return jsonify({'error': 'Dataset not found'}), 404
    
    dataset = datasets_store[dataset_id]
    if dataset['owner'] != email:
        return jsonify({'error': 'Access denied'}), 403
    
    severity = request.args.get('severity')
    issues = dataset.get('issues', [])
    
    if severity:
        issues = [i for i in issues if i['severity'] == severity]
    
    return jsonify(issues), 200

@app.post("/api/datasets/<int:dataset_id>/score")
@jwt_required()
def score_dataset_endpoint(dataset_id):
    """Calculate quality score"""
    email = get_jwt_identity()
    
    if dataset_id not in datasets_store:
        return jsonify({'error': 'Dataset not found'}), 404
    
    dataset = datasets_store[dataset_id]
    if dataset['owner'] != email:
        return jsonify({'error': 'Access denied'}), 403
    
    try:
        df = pd.read_csv(dataset['file_path'])
        profile = profile_dataset(df)
        dataset['quality_score'] = profile['quality_score']
        
        dimension_scores = {
            'completeness': 100 - profile['missing_values'] / max(df.size, 1) * 100,
            'validity': 100 - len([i for i in dataset.get('issues', []) if i['category'] == 'format']) / max(len(df), 1) * 100,
            'consistency': 100 - len([i for i in dataset.get('issues', []) if i['category'] == 'consistency']) / max(len(df), 1) * 100,
            'uniqueness': 100 - profile['duplicate_rows'] / max(len(df), 1) * 100,
            'accuracy': 100 - profile['outliers'] / max(len(df), 1) * 50,
            'integrity': 100 - len([i for i in dataset.get('issues', []) if i['category'] == 'type']) / max(len(df), 1) * 100
        }
        
        return jsonify({
            'overall_score': profile['quality_score'],
            'dimension_scores': dimension_scores
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ===== LEGACY ENDPOINTS (for backward compatibility) =====


# ===== LEGACY ENDPOINTS (for backward compatibility) =====

@app.post("/api/analyze")
def analyze():
    upload = request.files.get("file")
    if not upload:
        return jsonify({"error": "Attach a dataset as the file field"}), 400
    try:
        frame = read_dataset(upload)
        result = profile_dataset(frame)
        result["issues"] = detect_all_issues(frame)
        return jsonify(result)
    except (ValueError, pd.errors.ParserError) as error:
        return jsonify({"error": str(error)}), 400

@app.post("/api/copilot")
def copilot():
    """AI Copilot endpoint for data quality questions"""
    body = request.get_json(silent=True) or {}
    question = body.get("question", "").lower()
    dataset_id = body.get("dataset_id")
    
    default_answer = "Based on the dataset profile, I recommend: 1) Address high-severity missing values first, 2) Remove or merge duplicate records, 3) Validate format-related issues (emails, phones), 4) Investigate statistical outliers"

    if dataset_id is not None and dataset_id in datasets_store:
        dataset = datasets_store[dataset_id]
        current_analysis = dataset.get('analysis', {})
        if current_analysis.get('ai_insight'):
            default_answer = current_analysis['ai_insight']

    if not question:
        return jsonify({"answer": default_answer}), 200

    if openai is not None and os.environ.get("OPENAI_API_KEY"):
        try:
            client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
            instruction = (
                "You are a data quality analyst. Answer in short, measurable, practical steps. "
                f"Context: {question}."
            )
            response = client.responses.create(
                model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
                input=instruction,
            )
            response_text = getattr(response, "output_text", None) or ""
            if isinstance(response_text, str) and response_text.strip():
                return jsonify({"answer": response_text.strip()}), 200
        except Exception:
            pass

    # Context-aware answers based on keyword matching
    if "why" in question and "low" in question:
        return jsonify({"answer": "Your data quality score is low due to: missing values, duplicates, and format inconsistencies. Start by profiling your data to see the specific issues."}), 200
    
    if "fix" in question or "should" in question:
        return jsonify({"answer": "I recommend fixing issues in this order: 1) High-severity format errors (emails, phones), 2) Duplicate records (remove exact duplicates and review near-duplicates), 3) Missing values (impute or remove), 4) Consistency issues (normalize categories), 5) Review outliers"}), 200
    
    if "missing" in question or "null" in question:
        return jsonify({"answer": "For missing values: 1) Determine if missing data is random or systematic, 2) Consider imputation (mean, median, mode) or deletion depending on percentage, 3) For critical columns, investigate the cause of missing data"}), 200
    
    if "duplicate" in question:
        return jsonify({"answer": "For duplicate records: 1) Remove exact duplicates, 2) Identify near-duplicates using similarity matching, 3) For fuzzy duplicates, review and merge manually to avoid losing data, 4) Document which records were merged"}), 200
    
    if "format" in question or "invalid" in question:
        return jsonify({"answer": "For format issues: 1) Validate against standard patterns (emails, phones, dates), 2) Flag invalid values without auto-correcting (to preserve data integrity), 3) Either fix manually or standardize format across the column"}), 200
    
    return jsonify({"answer": default_answer}), 200

if __name__ == "__main__":
    port = int(os.environ.get('PORT', '5000'))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get('FLASK_DEBUG', '0') == '1')
