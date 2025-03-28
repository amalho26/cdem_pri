import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Map from "../Components/Map/Map";
import Modal from "react-modal";
import backgroundImg from "../Assets/background.png";

const ViewInteractiveMapPage = () => {
  const [independentVariables, setIndependentVariables] = useState([]);
  const [dependentVariables, setDependentVariables] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedIndependent, setSelectedIndependent] = useState("");
  const [selectedDependent, setSelectedDependent] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provinceCounts, setProvinceCounts] = useState([]);
  // Add a separate state for riding-level counts
  const [ridingCounts, setRidingCounts] = useState([]);
  const [sqlData, setSqlData] = useState([]);
  // New state for toggling view mode
  const [viewMode, setViewMode] = useState("province");

  // Load question definitions for the selected year
  useEffect(() => {
    if (selectedYear) {
      const getIndependentVariables = async () => {
        try {
          const response = await import(`../Data/questions${selectedYear}.json`);
          const data = response.default;
          setIndependentVariables(
            Object.entries(data.independent || {}).map(([key, value]) => ({
              id: key,
              mainQuestion: value.mainQuestion,
              answersMapping: value.answersMapping,
            }))
          );
          setDependentVariables(
            Object.entries(data.dependent || {}).map(([key, value]) => ({
              id: key,
              mainQuestion: value.mainQuestion,
            }))
          );
        } catch (error) {
          console.error("Error loading JSON data:", error);
        }
      };
      getIndependentVariables();
    } else {
      setIndependentVariables([]);
      setDependentVariables([]);
    }
  }, [selectedYear]);

  // Load the filter options based on the selected Independent Variable
  useEffect(() => {
    if (selectedIndependent) {
      const selectedQuestion = independentVariables.find(
        (item) => item.id === selectedIndependent
      );
      setFilters(
        selectedQuestion
          ? Object.entries(selectedQuestion.answersMapping).map(([key, value]) => ({
              id: key,
              display: value.Display,
            }))
          : []
      );
    } else {
      setFilters([]);
    }
  }, [selectedIndependent, independentVariables]);

  // Fetch data from the API, then compute both province-level and riding-level counts
  useEffect(() => {
    if (selectedYear && selectedIndependent) {
      setLoading(true);
      axios
        .get("http://localhost:5001/api/all_data", {
          headers: {
            db: `${selectedYear}_democracy_checkup`,
          },
        })
        .then((response) => {
          let filteredData = response.data;
          if (selectedFilters && selectedFilters.length > 0) {
            filteredData = filteredData.filter((row) =>
              selectedFilters.includes(row[selectedIndependent])
            );
          }
          // 1) Province-level frequencies
          const provinceFrequency = filteredData.reduce((acc, record) => {
            const provinceId = record.dc21_province; // e.g. 1, 2, 3...
            acc[provinceId] = (acc[provinceId] || 0) + 1;
            return acc;
          }, {});
          const formattedProvinceCounts = Object.entries(provinceFrequency).map(
            ([province, count]) => ({
              province: Number(province),
              count,
            })
          );
          // 2) Riding-level frequencies
          const ridingFrequency = filteredData.reduce((acc, record) => {
            const feduid = record.feduid; // <--- Make sure this column name matches your DB
            if (feduid) {
              acc[feduid] = (acc[feduid] || 0) + 1;
            }
            return acc;
          }, {});
          const formattedRidingCounts = Object.entries(ridingFrequency).map(
            ([riding, count]) => ({
              riding: Number(riding),
              count,
            })
          );

          setMapData(filteredData);
          setProvinceCounts(formattedProvinceCounts);
          setRidingCounts(formattedRidingCounts);
          console.log(formattedRidingCounts);
        })
        .catch((error) => {
          console.error("Error fetching map data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedYear, selectedIndependent, selectedDependent, selectedFilters, viewMode]);

  // Modal toggle
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 h-screen overflow-hidden">
        <aside id="sidebar" className="w-80 bg-gray-50 p-6 border-r border-gray-200 relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url(${backgroundImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-4">View Interactive Map</h1>
            {/* Year Selection */}
            <div className="mb-4">
              <label className="block mb-2 font-bold">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full h-12 bg-gray-100 rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Year</option>
                {[2019, 2020, 2021, 2022, 2023, 2024].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            {/* View Mode Selection */}
            <div className="mb-4">
              <label className="block mb-2 font-bold">View Mode</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full h-12 bg-gray-100 rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="province">Province/Territory</option>
                <option value="riding">Riding</option>
              </select>
            </div>
            {/* Independent Variables */}
            <div className="mb-4">
              <label className="block mb-2 font-bold">Select Independent Variable</label>
              <select
                value={selectedIndependent}
                onChange={(e) => setSelectedIndependent(e.target.value)}
                className="w-full h-12 bg-gray-100 rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Independent Variable</option>
                {independentVariables.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.mainQuestion}
                  </option>
                ))}
              </select>
            </div>
            {/* Filter By */}
            <div className="mb-4">
              <button
                className="w-full h-12 bg-red-500 text-white rounded-lg"
                onClick={toggleModal}
              >
                Filter By
              </button>
              <Modal
                isOpen={isModalOpen}
                onRequestClose={toggleModal}
                parentSelector={() => document.getElementById("sidebar")}
                className="bg-white p-6 rounded-lg max-w-lg mx-auto relative z-50"
                overlayClassName="absolute inset-0 bg-black bg-opacity-50 z-40"
                ariaHideApp={false}
              >
                <h2 className="font-bold text-lg mb-4">Select Filters</h2>
                <select
                  multiple
                  value={selectedFilters}
                  onChange={(e) =>
                    setSelectedFilters(
                      Array.from(e.target.options)
                        .filter((option) => option.selected)
                        .map((option) => option.value)
                    )
                  }
                  className="w-full h-40 bg-gray-100 rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {filters.map((filter) => (
                    <option key={filter.id} value={filter.id}>
                      {filter.display}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    onClick={toggleModal}
                  >
                    Apply Filters
                  </button>
                </div>
              </Modal>
            </div>
            {/* Dependent Variables */}
            <div className="mb-4">
              <label className="block mb-2 font-bold">Select Dependent Variable</label>
              <select
                value={selectedDependent}
                onChange={(e) => setSelectedDependent(e.target.value)}
                className="w-full h-12 bg-gray-100 rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Dependent Variable</option>
                {dependentVariables.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.mainQuestion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>
        {/* Main Map Area */}
        <main className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg font-semibold">Loading...</p>
            </div>
          ) : (
            <div className="w-full h-full">
              {/* Pass both provinceCounts and ridingCounts to the Map */}
              <Map
                provinceCounts={provinceCounts}
                ridingCounts={ridingCounts}
                viewMode={viewMode}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewInteractiveMapPage;
