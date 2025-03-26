import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Map from "../Components/Map/Map";
import Modal from "react-modal";

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
  const [sqlData, setSqlData] = useState([]);

  // Load questions based on the selected year
  useEffect(() => {
    if (selectedYear) {
      const getIndependentVariables = async () => {
        try {
          const response = await import(`../Data/questions${selectedYear}.json`);
          const data = response.default;

          // Process independent variables
          setIndependentVariables(
            Object.entries(data.independent || {}).map(([key, value]) => ({
              id: key,
              mainQuestion: value.mainQuestion,
              answersMapping: value.answersMapping,
            }))
          );

          // Process dependent variables
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

  // Update filters based on the selected independent variable
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

  // Fetch and filter map data using axios.get (like in ChartForm)
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
          // Start with all data from the DB
          let filteredData = response.data;
          console.log(filteredData[4].dc21_province);
          for(let i=0; i<filteredData.length; i++){
            if(response.data[i].dc21_province=="3" || response.data[i].dc21_province==8 || response.data[i].dc21_province==13){
              console.log(response.data);
            }
          }
          
          

          // Apply filtering based on the selected independent variable and filters.
          // This mimics the ChartForm logic: if filters are selected, only include rows
          // where the value in the column [selectedIndependent] matches one of the selectedFilters.
          if (selectedFilters && selectedFilters.length > 0) {
            filteredData = filteredData.filter((row) =>
              selectedFilters.includes(row[selectedIndependent])
            );
          }

          // Compute province counts from the filtered data.
          const provinceCounts = filteredData.reduce((acc, record) => {
            const provinceId = record.dc21_province; // Adjust column name as needed
            acc[provinceId] = (acc[provinceId] || 0) + 1;
            return acc;
          }, {});

          const formattedCounts = Object.entries(provinceCounts).map(
            ([province, count]) => ({
              province: Number(province),
              count,
            })
          );
          console.log(filteredData);
          console.log(formattedCounts);
          setMapData(filteredData);
          setProvinceCounts(formattedCounts);
        })
        .catch((error) => {
          console.error("Error fetching map data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedYear, selectedIndependent, selectedDependent, selectedFilters]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar Form */}
        <aside id="sidebar" className="w-80 bg-gray-50 p-6 border-r border-gray-200 relative">
          <h1 className="text-2xl font-bold mb-4">View Interactive Map</h1>
          {/* Year Selection */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Year</label>
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
          {/* Independent Variables */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Independent Variable</label>
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
          {/* Filters */}
          <div className="mb-4">
            <button
              className="w-full h-12 bg-blue-600 text-white rounded-lg"
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
            <label className="block mb-2 font-medium">Select Dependent Variable</label>
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
        </aside>
        {/* Main Map Display */}
        <main className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg font-semibold">Loading...</p>
            </div>
          ) : (
            <Map provinceCounts={provinceCounts} />
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewInteractiveMapPage;