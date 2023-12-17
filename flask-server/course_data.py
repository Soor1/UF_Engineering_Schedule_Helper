import requests
from bs4 import BeautifulSoup
import json

def get_course_codes_for_major(url):
    response = requests.get(url)
    html_code = response.text

    parser = BeautifulSoup(html_code, 'html.parser')
    code_elements = parser.find_all('td', class_='codecol')

    course_codes = []
    for code in code_elements:
        if code.find('a') is not None:
            course_code = code.find('a').text.replace('\xa0', ' ').strip()
            if course_code and len(course_code) <= 9:
                course_codes.append(course_code)

    unique_course_codes = list(set(course_codes))
    return unique_course_codes

def make_major_data():
    major_urls = [
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/ARO_BSAE/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/BE_BSBE/BE_BSBE01/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/BE_BSBE/BE_BSBE02/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/BE_BSBE/BE_BSBE03/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/BE_BSBE/BE_BSBE04/',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/BME_BSBM/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/CHE_BSCH/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/CVE_BSCE/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/CPE_BSCO/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/CPS_BSCS/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/DAS_BSDA/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/ELE_BSEE/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/EVE_BSEN/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/ISE_BSIS/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/MSE_BSMS/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/MCE_BSME/#modelsemesterplantext',
        'https://catalog.ufl.edu/UGRD/colleges-schools/UGENG/NUE_BSNE/#modelsemesterplantext'
    ]

    majors = [
        "Aerospace Engineering", "Agricultural Production Engineering", "Biosystems Engineering",
        "Land and Water Resources Engineering", "Packaging Engineering", "Biomedical Engineering",
        "Chemical Engineering", "Civil Engineering", "Computer Engineering", "Computer Science",
        "Digital Arts and Science", "Electrical Engineering", "Environmental Engineering",
        "Industrial and Systems Engineering", "Material Science and Engineering", "Mechanical Engineering",
        "Nuclear Engineering"
    ]

    major_data = {}
    for major_url, major in zip(major_urls, majors):
        courses = get_course_codes_for_major(major_url)
        major_data[major] = courses

    return major_data

file_path = "/Users/soorhansalia/VS_Code/Major_Overlap/flask-server/major_data.json"

# Save the dictionary as a JSON file
course_data = make_major_data()
with open(file_path, 'w') as json_file:
    json.dump(course_data, json_file)