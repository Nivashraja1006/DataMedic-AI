from flask import Flask, jsonify
from flask_cors import CORS
import os

# Initialize app
app = Flask(__name__)
CORS(app)

# Home route (for testing)
@app.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "DataMedic AI Backend Running 🚀"
    })

# Health check (VERY IMPORTANT for Render)
@app.route("/health")
def health():
    return "OK", 200


# Example API route
@app.route("/api/test")
def test():
    return jsonify({
        "message": "API is working ✅"
    })


# Run locally (NOT used in Render)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)