from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

file_path = "/Users/soorhansalia/VS_Code/Major_Overlap/flask-server/major_data.json"

with open(file_path, 'r') as json_file:
    major_data = json.load(json_file)

def get_overlap_courses(major1, major2):
    courses_major1 = major_data.get(major1, [])
    courses_major2 = major_data.get(major2, [])

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
    return jsonify(major_data)

if __name__ == "__main__":
    app.run(debug=True)
