import React, { useState, useEffect } from "react";

// Mock Header Component
import Navbar from "../Components/Navbar"; // Use the header from your previous implementation

// JSON Data Example
import studiesData from "../Data/studies"; // Import the JSON file with all the studies

const ExportDataPage = () => {
  const [studies, setStudies] = useState([]);

  const handleDownload = (filePath) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filePath.split("/").pop();
    link.click();
  };

  // Load the studies from the JSON directory
  useEffect(() => {
    setStudies(studiesData); // Assuming `studiesData` contains the studies structured by category
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Old Header */}
      <Navbar />

      <div className="px-10 py-6">
        <h1 className="text-4xl font-bold text-[#181010] mb-6">Export Data</h1>
        {studies.length > 0 ? (
          studies.map((category, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-bold text-[#181010] mb-4">{category.category}</h2>
              <div className="flex flex-col gap-4">
                {category.files.map((file, fileIndex) => (
                  <Accordion key={fileIndex} file={file} handleDownload={handleDownload} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>Loading studies...</p>
        )}
      </div>
    </div>
  );
};

// Accordion Component
const Accordion = ({ file, handleDownload }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-6 py-4 text-left text-[#181010] font-medium focus:outline-none"
      >
        <span>{file.name}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <button
            onClick={() => handleDownload(file.path)}
            className="px-4 py-2 bg-[#ff0000] text-white rounded-lg font-bold hover:bg-[#cc0000]"
          >
            Download PDF
          </button>
          <span className="mx-2"></span>
          <button
            onClick={() => handleDownload(file.path)}
            className="px-4 py-2 bg-[#ff0000] text-white rounded-lg font-bold hover:bg-[#cc0000]"
          >
            Download CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportDataPage;
