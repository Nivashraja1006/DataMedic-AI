import pandas as pd
import numpy as np
from datetime import datetime
import re
from typing import Dict, List, Any
from sklearn.ensemble import IsolationForest
from fuzzywuzzy import fuzz

class DataProfiler:
    """Analyzes datasets and generates profiles"""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.rows = len(df)
        self.cols = len(df.columns)
        
    def profile(self) -> List[Dict]:
        """Generate column profiles"""
        profiles = []
        for col in self.df.columns:
            profile = {
                'column_name': col,
                'column_type': self._detect_type(col),
                'null_percentage': (self.df[col].isnull().sum() / self.rows) * 100,
                'unique_percentage': (self.df[col].nunique() / self.rows) * 100,
                'missing_count': int(self.df[col].isnull().sum()),
                'unique_count': int(self.df[col].nunique()),
                'min_value': str(self.df[col].min()) if pd.api.types.is_numeric_dtype(self.df[col]) else None,
                'max_value': str(self.df[col].max()) if pd.api.types.is_numeric_dtype(self.df[col]) else None,
                'mean_value': float(self.df[col].mean()) if pd.api.types.is_numeric_dtype(self.df[col]) else None,
                'median_value': float(self.df[col].median()) if pd.api.types.is_numeric_dtype(self.df[col]) else None,
                'std_deviation': float(self.df[col].std()) if pd.api.types.is_numeric_dtype(self.df[col]) else None,
            }
            profiles.append(profile)
        return profiles
    
    def _detect_type(self, col: str) -> str:
        """Detect column type"""
        if pd.api.types.is_numeric_dtype(self.df[col]):
            return 'numeric'
        elif pd.api.types.is_datetime64_any_dtype(self.df[col]):
            return 'datetime'
        elif self.df[col].nunique() / len(self.df[col].dropna()) < 0.05:
            return 'category'
        else:
            return 'string'

class QualityScorer:
    """Calculates data quality scores based on 6 dimensions"""
    
    # Weights for each dimension
    WEIGHTS = {
        'completeness': 0.20,
        'validity': 0.20,
        'consistency': 0.17,
        'uniqueness': 0.17,
        'accuracy': 0.13,
        'integrity': 0.13
    }
    
    def __init__(self, df: pd.DataFrame, profiles: List[Dict], issues: List[Dict]):
        self.df = df
        self.profiles = profiles
        self.issues = issues
        
    def calculate_overall_score(self) -> float:
        """Calculate overall quality score (0-100)"""
        scores = {
            'completeness': self._score_completeness(),
            'validity': self._score_validity(),
            'consistency': self._score_consistency(),
            'uniqueness': self._score_uniqueness(),
            'accuracy': self._score_accuracy(),
            'integrity': self._score_integrity(),
        }
        
        overall = sum(scores[dim] * self.WEIGHTS[dim] for dim in scores)
        return min(100, max(0, round(overall, 1)))
    
    def get_dimension_scores(self) -> Dict[str, float]:
        """Get individual dimension scores"""
        return {
            'completeness': self._score_completeness(),
            'validity': self._score_validity(),
            'consistency': self._score_consistency(),
            'uniqueness': self._score_uniqueness(),
            'accuracy': self._score_accuracy(),
            'integrity': self._score_integrity(),
        }
    
    def _score_completeness(self) -> float:
        """Score based on missing values"""
        null_pcts = [p['null_percentage'] for p in self.profiles]
        avg_null = np.mean(null_pcts) if null_pcts else 0
        return 100 - avg_null
    
    def _score_validity(self) -> float:
        """Score based on format issues"""
        format_issues = [i for i in self.issues if i.get('category') == 'format']
        if not self.df.size or self.df.size == 0:
            return 100
        affected_rows = sum(i.get('affected_rows', 0) for i in format_issues)
        return max(0, 100 - (affected_rows / len(self.df)) * 100)
    
    def _score_consistency(self) -> float:
        """Score based on consistency issues"""
        consistency_issues = [i for i in self.issues if i.get('category') == 'consistency']
        if not self.df.size or self.df.size == 0:
            return 100
        affected_rows = sum(i.get('affected_rows', 0) for i in consistency_issues)
        return max(0, 100 - (affected_rows / len(self.df)) * 100)
    
    def _score_uniqueness(self) -> float:
        """Score based on duplicate records"""
        duplicate_issues = [i for i in self.issues if i.get('category') == 'duplicate']
        if not self.df.size or self.df.size == 0:
            return 100
        affected_rows = sum(i.get('affected_rows', 0) for i in duplicate_issues)
        return max(0, 100 - (affected_rows / len(self.df)) * 100)
    
    def _score_accuracy(self) -> float:
        """Score based on outliers and anomalies"""
        outlier_issues = [i for i in self.issues if i.get('category') == 'outlier']
        if not self.df.size or self.df.size == 0:
            return 100
        affected_rows = sum(i.get('affected_rows', 0) for i in outlier_issues)
        # Lower weight for outliers as they might be legitimate
        return max(0, 100 - (affected_rows / len(self.df)) * 50)
    
    def _score_integrity(self) -> float:
        """Score based on type and constraint violations"""
        type_issues = [i for i in self.issues if i.get('category') == 'type']
        if not self.df.size or self.df.size == 0:
            return 100
        affected_rows = sum(i.get('affected_rows', 0) for i in type_issues)
        return max(0, 100 - (affected_rows / len(self.df)) * 100)

class IssueDetector:
    """Detects data quality issues"""
    
    def __init__(self, df: pd.DataFrame, profiles: List[Dict]):
        self.df = df
        self.profiles = profiles
        self.issues = []
        
    def detect_all_issues(self) -> List[Dict]:
        """Detect all types of issues"""
        self.detect_missing_values()
        self.detect_duplicates()
        self.detect_format_issues()
        self.detect_consistency_issues()
        self.detect_outliers()
        self.detect_type_issues()
        return self.issues
    
    def detect_missing_values(self):
        """Detect missing/null values"""
        for col in self.df.columns:
            null_count = self.df[col].isnull().sum()
            if null_count > 0:
                null_pct = (null_count / len(self.df)) * 100
                severity = 'High' if null_pct > 10 else 'Medium' if null_pct > 5 else 'Low'
                self.issues.append({
                    'category': 'missing',
                    'severity': severity,
                    'column_name': col,
                    'title': f'{null_count} missing values in {col}',
                    'description': f'{null_pct:.1f}% of rows have missing values',
                    'affected_rows': int(null_count),
                    'recommendation': f'Impute missing values or remove affected rows'
                })
    
    def detect_duplicates(self):
        """Detect exact and fuzzy duplicates"""
        # Exact duplicates
        duplicate_rows = self.df.duplicated().sum()
        if duplicate_rows > 0:
            self.issues.append({
                'category': 'duplicate',
                'severity': 'High',
                'title': f'{duplicate_rows} exact duplicate records',
                'description': 'Found completely identical rows',
                'affected_rows': int(duplicate_rows),
                'recommendation': 'Remove duplicate rows'
            })
        
        # Check for near-duplicates if dataset is not too large
        if len(self.df) < 10000:
            string_cols = self.df.select_dtypes(include=['object']).columns
            if len(string_cols) > 0:
                col = string_cols[0]
                near_dupes = self._find_near_duplicates(self.df[col])
                if near_dupes > 0:
                    self.issues.append({
                        'category': 'duplicate',
                        'severity': 'Medium',
                        'column_name': col,
                        'title': f'{near_dupes} potential fuzzy duplicates',
                        'description': 'Found rows with high string similarity',
                        'affected_rows': near_dupes,
                        'recommendation': 'Review and merge similar records'
                    })
    
    def _find_near_duplicates(self, series: pd.Series, threshold: int = 90) -> int:
        """Find fuzzy duplicates"""
        duplicates = set()
        values = series.dropna().unique()
        for i, val1 in enumerate(values):
            for val2 in values[i+1:]:
                if fuzz.token_sort_ratio(str(val1), str(val2)) > threshold:
                    duplicates.add(str(val1))
        return len(duplicates)
    
    def detect_format_issues(self):
        """Detect invalid formats (email, phone, date)"""
        email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        phone_pattern = r'^[\d\-\(\)\s\+]+$'
        
        for col in self.df.columns:
            if 'email' in col.lower():
                invalid = self.df[col].dropna().apply(
                    lambda x: not re.match(email_pattern, str(x))
                ).sum()
                if invalid > 0:
                    self.issues.append({
                        'category': 'format',
                        'severity': 'High',
                        'column_name': col,
                        'title': f'{invalid} invalid email formats',
                        'description': f'Found emails not matching standard format',
                        'affected_rows': int(invalid),
                        'recommendation': 'Validate and correct email formats'
                    })
            elif 'phone' in col.lower():
                invalid = self.df[col].dropna().apply(
                    lambda x: not re.match(phone_pattern, str(x))
                ).sum()
                if invalid > 0:
                    self.issues.append({
                        'category': 'format',
                        'severity': 'Medium',
                        'column_name': col,
                        'title': f'{invalid} invalid phone formats',
                        'description': 'Found phones not matching standard format',
                        'affected_rows': int(invalid),
                        'recommendation': 'Standardize phone number format'
                    })
    
    def detect_consistency_issues(self):
        """Detect inconsistent categories and values"""
        for col in self.df.columns:
            profile = next((p for p in self.profiles if p['column_name'] == col), None)
            if profile and profile['column_type'] == 'category':
                # Check for case inconsistencies
                unique_vals = self.df[col].dropna().unique()
                lower_vals = [str(v).lower() for v in unique_vals]
                if len(set(lower_vals)) < len(unique_vals):
                    # Case inconsistency found
                    self.issues.append({
                        'category': 'consistency',
                        'severity': 'Medium',
                        'column_name': col,
                        'title': f'Inconsistent formatting in {col}',
                        'description': 'Found values with different cases/spacing',
                        'affected_rows': len(unique_vals),
                        'recommendation': 'Standardize category values'
                    })
    
    def detect_outliers(self):
        """Detect statistical outliers"""
        for col in self.df.columns:
            if pd.api.types.is_numeric_dtype(self.df[col]):
                try:
                    # Isolation Forest for outlier detection
                    X = self.df[[col]].dropna().values
                    if len(X) > 10:
                        iso_forest = IsolationForest(contamination=0.05, random_state=42)
                        outliers = iso_forest.fit_predict(X)
                        outlier_count = (outliers == -1).sum()
                        
                        if outlier_count > 0:
                            self.issues.append({
                                'category': 'outlier',
                                'severity': 'Low',
                                'column_name': col,
                                'title': f'{outlier_count} statistical outliers in {col}',
                                'description': 'Detected unusual values that deviate from pattern',
                                'affected_rows': int(outlier_count),
                                'recommendation': 'Review outliers for legitimacy or errors'
                            })
                except:
                    pass
    
    def detect_type_issues(self):
        """Detect type mismatches"""
        for col in self.df.columns:
            profile = next((p for p in self.profiles if p['column_name'] == col), None)
            if profile and profile['column_type'] == 'numeric':
                # Try to convert and see if there are non-numeric values
                non_numeric = self.df[col].apply(
                    lambda x: pd.isna(x) or (isinstance(x, (int, float)) and not isinstance(x, bool))
                )
                invalid_count = (~non_numeric).sum()
                if invalid_count > 0:
                    self.issues.append({
                        'category': 'type',
                        'severity': 'Low',
                        'column_name': col,
                        'title': f'{invalid_count} non-numeric values in numeric column',
                        'description': 'Column expected to be numeric contains other types',
                        'affected_rows': int(invalid_count),
                        'recommendation': 'Convert to numeric or reclassify column'
                    })
