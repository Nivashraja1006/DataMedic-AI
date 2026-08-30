from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='analyst')  # admin, analyst, viewer
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    datasets = db.relationship('Dataset', backref='owner', lazy=True, cascade='all, delete-orphan')
    activity_logs = db.relationship('ActivityLog', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

class Dataset(db.Model):
    __tablename__ = 'datasets'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_type = db.Column(db.String(20))  # csv, excel, json
    rows = db.Column(db.Integer)
    cols = db.Column(db.Integer)
    size = db.Column(db.BigInteger)
    quality_score = db.Column(db.Float, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    profiles = db.relationship('DataProfile', backref='dataset', lazy=True, cascade='all, delete-orphan')
    issues = db.relationship('Issue', backref='dataset', lazy=True, cascade='all, delete-orphan')
    versions = db.relationship('DatasetVersion', backref='dataset', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'file_type': self.file_type,
            'rows': self.rows,
            'cols': self.cols,
            'size': self.size,
            'quality_score': self.quality_score,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class DataProfile(db.Model):
    __tablename__ = 'data_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    dataset_id = db.Column(db.Integer, db.ForeignKey('datasets.id'), nullable=False)
    column_name = db.Column(db.String(255), nullable=False)
    column_type = db.Column(db.String(50))
    null_percentage = db.Column(db.Float)
    unique_percentage = db.Column(db.Float)
    min_value = db.Column(db.String(255))
    max_value = db.Column(db.String(255))
    mean_value = db.Column(db.Float)
    median_value = db.Column(db.Float)
    std_deviation = db.Column(db.Float)
    missing_count = db.Column(db.Integer)
    unique_count = db.Column(db.Integer)
    profile_data = db.Column(db.JSON)  # For categorical frequencies, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'column_name': self.column_name,
            'column_type': self.column_type,
            'null_percentage': self.null_percentage,
            'unique_percentage': self.unique_percentage,
            'mean_value': self.mean_value,
            'median_value': self.median_value,
            'std_deviation': self.std_deviation,
            'missing_count': self.missing_count,
            'unique_count': self.unique_count
        }

class Issue(db.Model):
    __tablename__ = 'issues'
    
    id = db.Column(db.Integer, primary_key=True)
    dataset_id = db.Column(db.Integer, db.ForeignKey('datasets.id'), nullable=False)
    category = db.Column(db.String(50))  # duplicate, missing, format, consistency, outlier, type
    severity = db.Column(db.String(20))  # High, Medium, Low
    column_name = db.Column(db.String(255))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    affected_rows = db.Column(db.Integer)
    recommendation = db.Column(db.Text)
    status = db.Column(db.String(20), default='open')  # open, applied, dismissed
    details = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'severity': self.severity,
            'column_name': self.column_name,
            'title': self.title,
            'description': self.description,
            'affected_rows': self.affected_rows,
            'recommendation': self.recommendation,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }

class DatasetVersion(db.Model):
    __tablename__ = 'dataset_versions'
    
    id = db.Column(db.Integer, primary_key=True)
    dataset_id = db.Column(db.Integer, db.ForeignKey('datasets.id'), nullable=False)
    version_number = db.Column(db.Integer, nullable=False)
    label = db.Column(db.String(255))
    description = db.Column(db.Text)
    quality_score = db.Column(db.Float)
    changes_applied = db.Column(db.JSON)
    file_path = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'version_number': self.version_number,
            'label': self.label,
            'quality_score': self.quality_score,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(255), nullable=False)
    entity_type = db.Column(db.String(50))  # dataset, issue, etc.
    entity_id = db.Column(db.Integer)
    details = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'action': self.action,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'created_at': self.created_at.isoformat()
        }
