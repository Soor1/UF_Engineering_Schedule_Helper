import sqlite3
import json

with open('major_data.json', 'r') as json_file:
    data = json.load(json_file)

conn = sqlite3.connect('major_data.db')
cursor = conn.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS major_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT,
        value TEXT
    )
''')

for key, value in data.items():
    cursor.execute('INSERT INTO major_data (key, value) VALUES (?, ?)', (key, json.dumps(value)))

conn.commit()
conn.close()
