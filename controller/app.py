from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS from flask_cors

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Example route
@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify(message='Hello from Flask!')

if __name__ == '__main__':
    app.run(debug=True)