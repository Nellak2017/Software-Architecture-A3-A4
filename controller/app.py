from flask import Flask, jsonify, request
from flask_cors import CORS # Import CORS from flask_cors
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

DATABASE_HOST = os.getenv('DB_HOST')
DATABASE_USER = os.getenv('DB_USER')
DATABASE_PASSWORD = os.getenv('DB_PASSWORD')
DATABASE_NAME = os.getenv('DB_NAME')

def connect_to_database():
    """Helper function to establish a connection to the MySQL database."""
    try:
        conn = mysql.connector.connect(
            unix_socket=f'/cloudsql/{DATABASE_HOST}',
            user=DATABASE_USER,
            password=DATABASE_PASSWORD,
            database=DATABASE_NAME,
        )
        return conn
    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/api/circularshift', methods=['POST'])
def post_circular_shift():
    """Endpoint to insert circular shifts associated with a potentially long input string."""
    try:
        # Parse request data
        data = request.json
        input_string = data.get('input_string')
        output_lines = data.get('output_lines')

        if not input_string or not output_lines:
            return jsonify(error='Input string and output lines are required in the request body'), 400

        # Join output lines into a single string with newline separators
        value_string = '\n'.join(output_lines)

        # Insert data into the database
        conn = connect_to_database()
        if conn:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO CircularShift (input, value) VALUES (%s, %s)', (input_string, value_string))
            conn.commit()
            conn.close()
            return jsonify(message='Circular shifts added successfully')
        else:
            return jsonify(error='Failed to connect to the database'), 500
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/api/circularshift', methods=['GET'])
def get_circular_shift():
    """Endpoint to retrieve circular shifts associated with a specific input string."""
    try:
        # Get input_string from query parameters
        input_string = request.args.get('input_string')

        if not input_string:
            return jsonify(error='Input string is required in the query parameters'), 400

        # Query the database for values associated with the input_string
        conn = connect_to_database()
        if conn:
            cursor = conn.cursor()
            cursor.execute('SELECT value FROM CircularShift WHERE input = %s', (input_string,))
            result = cursor.fetchall()
            conn.close()

            if not result:
                return jsonify(message='No values found for the input string'), 404

            # Extract values from the result
            values = [row[0] for row in result]
            return jsonify(values=values)
        else:
            return jsonify(error='Failed to connect to the database'), 500
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/api/circularshift', methods=['DELETE'])
def delete_circular_shift():
    """Endpoint to delete circular shifts associated with a specific input string."""
    try:
        # Get input_string from query parameters
        input_string = request.args.get('input_string')

        if not input_string:
            return jsonify(error='Input string is required in the query parameters'), 400

        # Delete the circular shifts from the database
        conn = connect_to_database()
        if conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM CircularShift WHERE input = %s', (input_string,))
            conn.commit()
            conn.close()
            return jsonify(message=f'Circular shifts for input "{input_string}" deleted successfully')
        else:
            return jsonify(error='Failed to connect to the database'), 500
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)