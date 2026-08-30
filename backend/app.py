from __future__ import annotations

import io
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

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 200 * 1024 * 1024

jwt = JWTManager(app)

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PHONE_PATTERN = re.compile(r"^[+\d][\d\s().-]{7,}$")

# In-memory user store for demo (replace with database)
users = {}
datasets_store = {}

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PHONE_PATTERN = re.compile(r"^[+\d][\d\s().-]{7,}$")


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
    """Generate comprehensive data profile"""
    numeric = frame.select_dtypes(include=np.number)
    outlier_count = 0
    if not numeric.empty and len(frame) > 8:
        model = IsolationForest(random_state=42, contamination="auto")
        outlier_count = int((model.fit_predict(numeric.fillna(numeric.median())) == -1).sum())

    missing = int(frame.isna().sum().sum())
    duplicate = int(frame.duplicated().sum())
    total_cells = max(frame.size, 1)
    quality = round(max(0, 100 - ((missing / total_cells) * 45) - ((duplicate / max(len(frame), 1)) * 30) - ((outlier_count / max(len(frame), 1)) * 15)), 1)
    
    columns = []
    for name in frame.columns:
        series = frame[name]
        # Detect column type
        col_type = "numeric" if pd.api.types.is_numeric_dtype(series) else "datetime" if pd.api.types.is_datetime64_any_dtype(series) else "category" if series.nunique() / max(len(series), 1) < 0.05 else "string"
        
        columns.append({
            "name": str(name),
            "type": col_type,
            "null_percent": round(float(series.isna().mean() * 100), 2),
            "unique_percent": round(float(series.nunique(dropna=True) / max(len(series), 1) * 100), 2),
            "missing_count": int(series.isna().sum()),
            "unique_count": int(series.nunique(dropna=True)),
            "sample": str(series.dropna().iloc[0]) if not series.dropna().empty else None,
        })

    return {
        "rows": int(len(frame)),
        "columns": int(len(frame.columns)),
        "quality_score": quality,
        "missing_values": missing,
        "duplicate_rows": duplicate,
        "outliers": outlier_count,
        "columns_profile": columns,
        "preview": frame.head(10).replace({np.nan: None}).to_dict(orient="records"),
    }


def summarize_dataset_analysis(frame):
    """Compute a summary used by the live dashboard and real-time quality widgets."""
    profile = profile_dataset(frame)
    issues = detect_all_issues(frame)

    total_rows = max(len(frame), 1)
    total_cells = max(frame.size, 1)
    null_percent = round(float(frame.isna().sum().sum() / total_cells * 100), 2)
    duplicate_percent = round(float(frame.duplicated().sum() / total_rows * 100), 2)

    invalid_issue_count = sum(1 for issue in issues if issue["category"] in {"format", "missing"})
    validity_score = max(0.0, 100 - (invalid_issue_count / max(len(issues) or 1, 1) * 100))
    if issues:
        validity_score = max(0.0, 100 - (sum(1 for issue in issues if issue["category"] in {"format", "missing"}) / max(len(issues), 1) * 100))
    else:
        validity_score = 100.0

    outlier_percent = round(float(profile["outliers"] / total_rows * 100), 2)
    overall_score = float(profile["quality_score"])

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

    return {
        "overall_score": round(overall_score, 1),
        "null_percent": null_percent,
        "duplicate_percent": duplicate_percent,
        "validity_score": round(validity_score, 1),
        "outlier_percent": outlier_percent,
        "missing_values": int(profile["missing_values"]),
        "duplicate_rows": int(profile["duplicate_rows"]),
        "outliers": int(profile["outliers"]),
        "issues": issues,
        "profile": profile,
        "insights": insights,
        "status": "completed" if overall_score >= 70 else "needs-review",
    }


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
def signup():
    """User registration"""
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
        'message': 'User created successfully',
        'access_token': access_token,
        'user': {
            'username': data['username'],
            'email': data['email'],
            'role': users[data['email']]['role']
        }
    }), 201

@app.post("/api/auth/login")
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
        dataset = {
            'id': dataset_id,
            'name': request.form.get('name', file.filename),
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
    
    # Default answer
    default_answer = "Based on the dataset profile, I recommend: 1) Address high-severity missing values first, 2) Remove or merge duplicate records, 3) Validate format-related issues (emails, phones), 4) Investigate statistical outliers"
    
    # Context-aware answers based on keyword matching
    if not question:
        return jsonify({"answer": default_answer}), 200
    
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
    app.run(host="0.0.0.0", port=5000, debug=True)
