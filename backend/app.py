import hashlib
import io
import json
import os
import secrets
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 200 * 1024 * 1024

CORS(app)

users = {}
tokens = {}
datasets = {}
next_dataset_id = 1
DATASETS_FILE = Path(os.environ.get("DATASETS_FILE", Path(__file__).with_name("datasets.json")))


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def password_digest(password):
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def user_payload(user):
    return {
        "username": user["username"],
        "email": user["email"],
        "role": "analyst",
        "created_at": user["created_at"],
    }


def current_user():
    header = request.headers.get("Authorization", "")
    token = header.removeprefix("Bearer ").strip()
    return tokens.get(token)


def require_user():
    user = current_user()
    if user is None:
        return None, (jsonify({"error": "Authentication required"}), 401)
    return user, None


def read_uploaded_file(upload):
    filename = secure_filename(upload.filename or "")
    suffix = os.path.splitext(filename)[1].lower()
    payload = upload.read()
    if suffix == ".csv":
        frame = pd.read_csv(io.BytesIO(payload))
    elif suffix in {".xlsx", ".xls"}:
        frame = pd.read_excel(io.BytesIO(payload))
    elif suffix == ".json":
        frame = pd.read_json(io.BytesIO(payload))
    else:
        raise ValueError("Supported formats are CSV, Excel, and JSON")
    if frame.empty or len(frame.columns) == 0:
        raise ValueError("The uploaded dataset is empty")
    return filename, frame


def dataset_analysis(frame):
    row_count = len(frame)
    cell_count = max(frame.size, 1)
    missing = int(frame.isna().sum().sum())
    duplicates = int(frame.duplicated().sum())
    numeric = frame.select_dtypes(include=np.number)
    outliers = 0
    if not numeric.empty:
        deviations = (numeric - numeric.median()).abs()
        threshold = numeric.std().replace(0, np.nan) * 3
        outliers = int(deviations.gt(threshold).any(axis=1).sum())
    null_percent = missing / cell_count * 100
    duplicate_percent = duplicates / max(row_count, 1) * 100
    outlier_percent = outliers / max(row_count, 1) * 100
    score = max(0, min(100, round(100 - null_percent * 0.45 - duplicate_percent * 0.3 - outlier_percent * 0.15, 1)))
    issues = []
    if missing:
        issues.append({"category": "missing", "severity": "Medium", "title": f"{missing} missing values", "affected_rows": missing})
    if duplicates:
        issues.append({"category": "duplicate", "severity": "High", "title": f"{duplicates} duplicate rows", "affected_rows": duplicates})
    if outliers:
        issues.append({"category": "outlier", "severity": "Low", "title": f"{outliers} potential outliers", "affected_rows": outliers})
    return {
        "rows": row_count,
        "cols": len(frame.columns),
        "overall_score": score,
        "quality_score": score,
        "missing_values": missing,
        "duplicate_rows": duplicates,
        "outliers": outliers,
        "null_percent": round(null_percent, 2),
        "duplicate_percent": round(duplicate_percent, 2),
        "outlier_percent": round(outlier_percent, 2),
        "issues": issues,
        "preview": frame.head(5).replace({np.nan: None}).to_dict(orient="records"),
    }


def public_dataset(dataset):
    return {key: value for key, value in dataset.items() if key != "frame"}


def load_datasets():
    if not DATASETS_FILE.exists():
        return {}, 1

    try:
        stored_datasets = json.loads(DATASETS_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}, 1

    loaded = {}
    for item in stored_datasets:
        frame_data = item.pop("frame", {"columns": [], "data": []})
        dataset_id = int(item["id"])
        loaded[dataset_id] = {
            **item,
            "id": dataset_id,
            "frame": pd.DataFrame(frame_data.get("data", []), columns=frame_data.get("columns", [])),
        }

    return loaded, max(loaded, default=0) + 1


def persist_datasets():
    DATASETS_FILE.parent.mkdir(parents=True, exist_ok=True)
    stored_datasets = []
    for dataset in datasets.values():
        item = public_dataset(dataset)
        item["frame"] = json.loads(dataset["frame"].to_json(orient="split", date_format="iso"))
        stored_datasets.append(item)
    DATASETS_FILE.write_text(json.dumps(stored_datasets), encoding="utf-8")


datasets, next_dataset_id = load_datasets()


@app.get("/")
def home():
    return {"status": "success", "message": "Backend running"}


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/register")
def register():
    body = request.get_json(silent=True) or {}
    username = str(body.get("username", "")).strip()
    email = str(body.get("email", "")).strip().lower()
    password = str(body.get("password", ""))
    if not username or not email or len(password) < 6:
        return jsonify({"error": "Username, email, and a password of at least 6 characters are required"}), 400
    if email in users:
        return jsonify({"error": "An account with that email already exists"}), 409
    user = {"username": username, "email": email, "password": password_digest(password), "created_at": now_iso()}
    users[email] = user
    token = secrets.token_urlsafe(32)
    tokens[token] = user
    return jsonify({"access_token": token, "user": user_payload(user)}), 201


@app.post("/login")
def login():
    body = request.get_json(silent=True) or {}
    email = str(body.get("email", "")).strip().lower()
    user = users.get(email)
    if user is None or user["password"] != password_digest(str(body.get("password", ""))):
        return jsonify({"error": "Invalid email or password"}), 401
    token = secrets.token_urlsafe(32)
    tokens[token] = user
    return jsonify({"access_token": token, "user": user_payload(user)})


@app.get("/api/auth/me")
def profile():
    user, error = require_user()
    if error:
        return error
    return jsonify(user_payload(user))


def upload_dataset(require_auth=True):
    global next_dataset_id
    user = current_user()
    if require_auth and user is None:
        return jsonify({"error": "Authentication required"}), 401
    upload = request.files.get("file")
    if upload is None:
        return jsonify({"error": "Attach a dataset as the file field"}), 400
    try:
        filename, frame = read_uploaded_file(upload)
    except (ValueError, pd.errors.ParserError, UnicodeDecodeError) as exc:
        return jsonify({"error": str(exc)}), 400
    dataset_id = next_dataset_id
    next_dataset_id += 1
    analysis = dataset_analysis(frame)
    dataset = {
        "id": dataset_id,
        "name": request.form.get("name") or filename,
        "file_type": os.path.splitext(filename)[1].lstrip(".").lower(),
        "rows": analysis["rows"],
        "cols": analysis["cols"],
        "size": request.content_length or 0,
        "quality_score": analysis["quality_score"],
        "created_at": now_iso(),
        "updated_at": now_iso(),
        "owner": user["email"] if user else "anonymous",
        "analysis": analysis,
        "frame": frame,
    }
    datasets[dataset_id] = dataset
    persist_datasets()
    return jsonify({"dataset": public_dataset(dataset)}), 201


@app.post("/upload")
def upload():
    return upload_dataset(require_auth=False)


@app.post("/api/datasets/upload")
def upload_api_dataset():
    return upload_dataset()


@app.get("/api/datasets")
def list_datasets():
    user, error = require_user()
    if error:
        return error
    return jsonify([public_dataset(item) for item in datasets.values() if item["owner"] == user["email"]])


@app.get("/api/datasets/<int:dataset_id>")
def get_dataset(dataset_id):
    user, error = require_user()
    if error:
        return error
    dataset = datasets.get(dataset_id)
    if dataset is None or dataset["owner"] != user["email"]:
        return jsonify({"error": "Dataset not found"}), 404
    return jsonify(public_dataset(dataset))


@app.post("/api/datasets/<int:dataset_id>/analyze")
def analyze_dataset(dataset_id):
    user, error = require_user()
    if error:
        return error
    dataset = datasets.get(dataset_id)
    if dataset is None or dataset["owner"] != user["email"]:
        return jsonify({"error": "Dataset not found"}), 404
    dataset["analysis"] = dataset_analysis(dataset["frame"])
    dataset["quality_score"] = dataset["analysis"]["quality_score"]
    persist_datasets()
    return jsonify(dataset["analysis"])


@app.post("/api/datasets/<int:dataset_id>/profile")
def profile_dataset(dataset_id):
    user, error = require_user()
    if error:
        return error
    dataset = datasets.get(dataset_id)
    if dataset is None or dataset["owner"] != user["email"]:
        return jsonify({"error": "Dataset not found"}), 404

    frame = dataset["frame"]
    columns_profile = [
        {
            "name": column,
            "type": str(frame[column].dtype),
            "null_count": int(frame[column].isna().sum()),
            "null_percent": round(float(frame[column].isna().mean() * 100), 2),
            "unique_count": int(frame[column].nunique(dropna=True)),
        }
        for column in frame.columns
    ]
    return jsonify({"columns_profile": columns_profile})


@app.get("/api/datasets/<int:dataset_id>/issues")
def get_dataset_issues(dataset_id):
    user, error = require_user()
    if error:
        return error
    dataset = datasets.get(dataset_id)
    if dataset is None or dataset["owner"] != user["email"]:
        return jsonify({"error": "Dataset not found"}), 404
    issues = dataset["analysis"].get("issues", [])
    severity = request.args.get("severity")
    if severity:
        issues = [issue for issue in issues if issue.get("severity") == severity]
    return jsonify(issues)


@app.post("/api/datasets/<int:dataset_id>/detect-issues")
def detect_dataset_issues(dataset_id):
    user, error = require_user()
    if error:
        return error
    dataset = datasets.get(dataset_id)
    if dataset is None or dataset["owner"] != user["email"]:
        return jsonify({"error": "Dataset not found"}), 404
    dataset["analysis"] = dataset_analysis(dataset["frame"])
    persist_datasets()
    return jsonify({"issues": dataset["analysis"].get("issues", [])})


@app.post("/api/datasets/<int:dataset_id>/score")
def score_dataset(dataset_id):
    user, error = require_user()
    if error:
        return error
    dataset = datasets.get(dataset_id)
    if dataset is None or dataset["owner"] != user["email"]:
        return jsonify({"error": "Dataset not found"}), 404
    return jsonify({"quality_score": dataset["analysis"].get("quality_score", dataset["quality_score"])})


@app.post("/api/copilot")
def copilot():
    return jsonify({"answer": "Upload a dataset to profile missing values, duplicates, formats, and outliers."})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
