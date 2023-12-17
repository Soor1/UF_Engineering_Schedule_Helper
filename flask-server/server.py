from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

conn = sqlite3.connect('major_data.db')
cursor = conn.cursor()

def get_overlap_courses(major1, major2):
    cursor.execute('SELECT value FROM major_data WHERE key = ? OR key = ?', (major1, major2))
    rows = cursor.fetchall()

    courses_major1 = json.loads(rows[0][0]) if rows and rows[0] else []
    courses_major2 = json.loads(rows[1][0]) if rows and len(rows) > 1 and rows[1] else []

    overlapping_courses = list(set(courses_major1) & set(courses_major2))
    return overlapping_courses

@app.route("/overlap_courses")
def overlap_courses():
    major1 = request.args.get("major1")
    major2 = request.args.get("major2")

    if not major1 or not major2:
        return jsonify({"error": "Please provide both majors"}), 400

    overlapping_courses = get_overlap_courses(major1, major2)
    return jsonify({"overlap_courses": overlapping_courses})

@app.route("/major_data")
def course_data():
    cursor.execute('SELECT * FROM major_data')
    rows = cursor.fetchall()

    major_data = {row[0]: json.loads(row[1]) for row in rows}
    
    return jsonify(major_data)

if __name__ == "__main__":
    app.run(debug=True)
