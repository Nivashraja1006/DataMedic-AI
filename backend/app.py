import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Home route
@app.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "DataMedic AI Backend Running 🚀"
    })

# Health check (IMPORTANT for Render)
@app.route("/health")
def health():
    return "OK", 200

# Example API
@app.route("/api/test")
def test():
    return jsonify({"msg": "API working perfectly 🔥"})


# IMPORTANT for local testing
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)