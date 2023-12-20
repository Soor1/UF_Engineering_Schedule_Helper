import React, { useState, useEffect } from 'react';
import './App.css';
import 'handsontable/dist/handsontable.full.min.css';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { CSVLink } from 'react-csv';

registerAllModules();

export const ExampleComponent = () => {
  const initialData = [
    [" ","Summer 1","Fall 1" ,"Spring 1","Summer 2","Fall 2" ,"Spring 2","Summer 3","Fall 3" ,"Spring 3","Summer 4","Fall 4" ,"Spring 4"],
    ["Course 1"],
    ["Course 2"],
    ["Course 3"],
    ["Course 4"],
    ["Course 5"],
    [],
    ["Total Credits"],
  ];

  const [data, setData] = useState(initialData);

  return (
    <div>
      <HotTable
        data={data}
        rowHeaders={true}
        colHeaders={true}
        height="auto"
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        afterChange={(changes) => {
          // Ensure changes is an array before iterating over it
          if (Array.isArray(changes)) {
            // Update the state with the changed data
            const newData = data.map(row => [...row]);
            changes.forEach(([row, prop, oldValue, newValue]) => {
              newData[row][prop] = newValue;
            });
            setData(newData);
          }
        }}
      />

      <div className="mt-4 text-center">
        <button
          type="button"
          className="bg-blue-500 text-white p-2 rounded cursor-pointer"
          style={{ marginTop: '1.5rem', width: '300px' }}
          onClick={() => {
            // Trigger the CSV download when the button is clicked
            const csvData = data.map(row => row.join(',')).join('\n');
            const blob = new Blob([csvData], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'course_schedule.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          Download Course Schedule
        </button>
      </div>

    </div>
  );
};

function App() {
  const [majors, setMajors] = useState([]);
  const [selectedMajor1, setSelectedMajor1] = useState("");
  const [selectedMajor2, setSelectedMajor2] = useState("");
  const [overlapCourses, setOverlapCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/major_data")
      .then(res => res.json())
      .then(data => {
        setMajors(Object.keys(data));
      });
  }, []);

  const handleMajorChange = (e, setMajor) => {
    setMajor(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch(`/overlap_courses?major1=${encodeURIComponent(selectedMajor1)}&major2=${encodeURIComponent(selectedMajor2)}`)
      .then(res => res.json())
      .then(data => {
        console.log("Received response:", data);
        setOverlapCourses(data.overlap_courses || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  return (
    <div className="container mx-auto mt-8 p-8 bg-white rounded shadow-md max-w-md">
      <h1 className="text-2xl mb-6">UF Engineering Schedule Helper</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <label className="block mb-2">
          Select Major 1:
          <select
            value={selectedMajor1}
            onChange={(e) => handleMajorChange(e, setSelectedMajor1)}
            className="block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a Major</option>
            {majors.map((major, i) => (
              <option key={i} value={major}>{major}</option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Select Major 2:
          <select
            value={selectedMajor2}
            onChange={(e) => handleMajorChange(e, setSelectedMajor2)}
            className="block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a Major</option>
            {majors.map((major, i) => (
              <option key={i} value={major}>{major}</option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={!selectedMajor1 || !selectedMajor2 || loading}
          className={`bg-blue-500 text-white p-2 rounded cursor-pointer ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'Loading...' : 'Get Overlapping Courses'}
        </button>
      </form>

      {overlapCourses.length === 0 ? (
        <p className="text-green-500">{loading ? 'Loading...' : 'No overlapping courses found.'}</p>
      ) : (
        <div>
          <p className="text-xl font-semibold mb-4">Overlapping Courses:</p>
          <div className="overlapping-courses">
            {overlapCourses.map((course, i) => (
              <div key={i} className="mb-2">{course}</div>
            ))}
          </div>
        </div>
      )}


      <div className="mt-4">
      <hr />
      <p>
        <a href="https://ufcourses.org/" target="_blank" rel="noopener noreferrer" style={{ color: 'black',}}>
          <strong>UF Course Search (Credits: Jim Su and Matthew DeGuzman):</strong>
        </a> Best way to search what courses and professors are available (RateMyProfessor built-in).
      </p>
      <p>
        <a href="https://one.uf.edu/soc/" target="_blank" rel="noopener noreferrer" style={{ color: 'black',}}>
          <strong>One.UF Course Search:</strong>
        </a> UF website to search what courses and professors are available.
      </p>
      <p>
        <a href="https://career.ufl.edu/gain-experience/student-outcomes/" target="_blank" rel="noopener noreferrer" style={{ color: 'black',}}>
          <strong>Career Connections Center Student Outcomes:</strong>
        </a> Explore student outcomes (salary, location, etc.) for graduates of all majors.
      </p>
      <p>
        <a href="https://gatorevals.aa.ufl.edu/public-results/" target="_blank" rel="noopener noreferrer" style={{ color: 'black',}}>
          <strong>GatorEvals:</strong>
        </a> View course evaluation data for any professor on campus.
      </p>
      <p>
        <a href="https://www.registr-uf.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'black',}}>
          <strong>Registr:</strong>
        </a> Best way to plan the course schedule for the upcoming semester.
      </p>
      <hr />
    </div>

      
      <ExampleComponent />

      <div className="mt-4 text-center text-gray-500">
        <p>
          <strong>Created By:</strong> <a href="https://www.linkedin.com/in/soor-hansalia/" target="_blank" rel="noopener noreferrer" style={{ color: 'black',}}>Soor Hansalia</a>
        </p>
      </div>
    </div>
  );
}

export default App;
