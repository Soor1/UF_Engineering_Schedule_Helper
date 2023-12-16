import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [majors, setMajors] = useState([]);
  const [selectedMajor1, setSelectedMajor1] = useState("");
  const [selectedMajor2, setSelectedMajor2] = useState("");
  const [overlapCourses, setOverlapCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the available majors from the server
    fetch("/major_data")
      .then(res => res.json())
      .then(data => {
        setMajors(Object.keys(data));
      });
  }, []);

  const handleMajorChange = (e, setMajor) => {
    // Update the selected major when the user makes a selection
    setMajor(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Fetch overlapping courses for the selected majors
    fetch(`/overlap_courses?major1=${encodeURIComponent(selectedMajor1)}&major2=${encodeURIComponent(selectedMajor2)}`)
      .then(res => res.json())
      .then(data => {
        console.log("Received response:", data);
        // Ensure that overlapCourses is an array, even if there are no overlapping courses
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
      <h1 className="text-2xl mb-6">UF Engineering Major Course Overlap</h1>
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
          <ul>
            {overlapCourses.map((course, i) => (
              <li key={i} className="mb-2">{course}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;