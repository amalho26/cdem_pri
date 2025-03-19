import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Map from "../Components/Map/Map";
import Modal from "react-modal";

const ViewInteractiveMapPage = () => {
  const [independentVariables,setIndependentVariables]=useState([]);
  const [dependentVariables,setDependentVariables]=useState([]);
  const [filters,setFilters]=useState([]);
  const [selectedIndependent,setSelectedIndependent] = useState("");
  const [selectedDependent,setSelectedDependent] = useState("");
  const [selectedFilters,setSelectedFilters] = useState([]);
  const [mapData,setMapData] = useState([]);
  const [selectedYear,setSelectedYear] = useState("");
  const [loading,setLoading] = useState(false);
  const [isModalOpen,setIsModalOpen] = useState(false);
  const [provinceCounts,setProvinceCounts] = useState([]);
 
  useEffect(()=>{
    if (selectedYear) {
      const getIndependentVariables= async()=> {
        try {
          const response=await import(`../Data/questions${selectedYear}.json`);
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

  // Fetch map data
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        const response = await axios.post("http://localhost:5001/api/fetch", {
          table: "democracy_checkup_2022",
          independent: selectedIndependent,
          dependent: selectedDependent || null,
          filters: selectedFilters || null,
        });
        const provinceCounts = response.data.reduce((acc, record) => {
          const provinceId = record.dc22_province; // Adjust column name as needed
          acc[provinceId] = (acc[provinceId] || 0) + 1;
          return acc;
        }, {});

        // Convert to an array of objects for easier usage
        const formattedCounts = Object.entries(provinceCounts).map(([province, count]) => ({
          province: Number(province),
          count,
        }));

        setMapData(response.data);
        setProvinceCounts(formattedCounts);
        console.log(response.data);
        console.log(formattedCounts);
      } catch (error) {
        console.error("Error fetching map data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedIndependent) {
      fetchMapData();
    }
  }, [selectedIndependent, selectedDependent, selectedFilters]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex flex-col items-center px-10 py-5">
        <div className="max-w-[960px] w-full">
          <h1 className="text-2xl font-bold">View Interactive Map</h1>

          {/* Year Selection */}
          <div className="mb-4">
            <label>
              <p className="font-medium mb-2">Year</p>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full h-14 bg-gray-100 rounded-lg p-4"
              >
                <option value="">Select Year</option>
                {[2019, 2020, 2021, 2022, 2023, 2024].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Independent Variables */}
          <div className="mb-4">
            <label>
              <p className="font-medium mb-2">Select Independent Variable</p>
              <select
                value={selectedIndependent}
                onChange={(e) => setSelectedIndependent(e.target.value)}
                className="w-full h-14 bg-gray-100 rounded-lg p-4"
              >
                <option value="">Select Independent Variable</option>
                {independentVariables.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.mainQuestion}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Filters */}
          <div className="mb-4">
            <button
              className="w-full h-14 bg-gray-100 rounded-lg text-gray-700"
              onClick={toggleModal}
            >
              Filter By
            </button>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={toggleModal}
              className="bg-white p-6 rounded-lg max-w-lg mx-auto relative z-[1050]"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[1040]"
              ariaHideApp={false}
            >
              <h2 className="font-bold text-lg">Select Filters</h2>
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
                className="w-full h-40 bg-gray-100 rounded-lg p-4"
              >
                {filters.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.display}
                  </option>
                ))}
              </select>
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  onClick={toggleModal}
                >
                  Apply Filters
                </button>
              </div>
            </Modal>
          </div>

          {/* Dependent Variables */}
          <div className="mb-4">
            <label>
              <p className="font-medium mb-2">Select Dependent Variable</p>
              <select
                value={selectedDependent}
                onChange={(e) => setSelectedDependent(e.target.value)}
                className="w-full h-14 bg-gray-100 rounded-lg p-4"
              >
                <option value="">Select Dependent Variable</option>
                {dependentVariables.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.mainQuestion}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {loading ? <p>Loading...</p> : <Map data={mapData} provinceCounts={provinceCounts} />}

        </div>
      </main>
    </div>
  );
};

export default ViewInteractiveMapPage;
