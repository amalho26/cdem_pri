import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Scatter,
  ScatterChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ChartTypeSelector from "./ChartTypeSelector";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ChartForm = ({data}) => {
  const [selectedYear, setSelectedYear] = useState("");
  const [independentVariables, setIndependentVariables] = useState([]);
  const [dependentVariables, setDependentVariables] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedIndependent, setSelectedIndependent] = useState("");
  const [selectedDependent, setSelectedDependent] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [dependentAnswerMapping, setDependentAnswerMapping] = useState({});
  const [chartType, setChartType] = useState("");
  const [graphTitle, setGraphTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load the JSON file based on the selected year
  useEffect(() => {
    
    console.log(data)
    if (selectedYear) {
      const fetchData = async () => {
        try {
          const response = await import(`../../Data/questions${selectedYear}.json`);
          const data = response.default;

          // Load independent variables
          if (data.independent) {
            const independent = Object.entries(data.independent).map(([key, value]) => ({
              id: key,
              mainQuestion: value.mainQuestion,
              answersMapping: value.answersMapping,
            }));
            setIndependentVariables(independent);
          }

          // Load dependent variables
          if (data.dependent) {
            const dependent = Object.entries(data.dependent).map(([key, value]) => ({
              id: key,
              mainQuestion: value.mainQuestion,
              mapping: value.answersMapping,
            }));
            setDependentVariables(dependent);
          }
        } catch (error) {
          console.error("Error loading JSON data:", error);
        }
      };

      fetchData();
    } else {
      setIndependentVariables([]);
      setDependentVariables([]);
      setFilters([]);
    }
  }, [selectedYear]);

  // Update filters when an independent variable is selected
  useEffect(() => {
    if (selectedIndependent) {
      const selectedQuestion = independentVariables.find(
        (item) => item.id === selectedIndependent
      );
      if (selectedQuestion) {
        const filterOptions = Object.entries(selectedQuestion.answersMapping).map(
          ([key, value]) => ({
            id: key,
            display: value.Display,
          })
        );
        setFilters(filterOptions);
      } else {
        setFilters([]);
      }
    } else {
      setFilters([]);
    }
  }, [selectedIndependent, independentVariables]);

  useEffect(() => {
    const selectedDependentQuestion = dependentVariables.find(
      (item) => item.id === selectedDependent
    );
    if (selectedDependentQuestion) {
      setDependentAnswerMapping(selectedDependentQuestion.mapping || {});
    } else {
      setDependentAnswerMapping({});
    }
  }, [selectedDependent, dependentVariables]);

  // Handle multiple filter selection
  const handleFilterChange = (e) => {
    const { options } = e.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setSelectedFilters(selectedValues);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  

  const generateGraph = () => {
    try {
      if (!data || data.length === 0) {
        console.error("No data available to generate graph.");
        return;
      }
  
      console.log("Selected Independent Variable:", selectedIndependent);
      console.log("Selected Dependent Variable:", selectedDependent);
      console.log("Selected Filters:", selectedFilters);
  
      // Step 1: Ensure selectedIndependent and selectedDependent exist
      if (!selectedIndependent || !selectedDependent) {
        console.error("Independent and dependent variables must be selected.");
        return;
      }
  
      // Step 2: Filter the data based on selected filters
      let filteredData = [...data]; // Copy data to avoid mutation
  
      if (selectedFilters && selectedFilters.length > 0) {
        filteredData = filteredData.filter(row =>
          selectedFilters.includes(row[selectedIndependent])
        );
      }
  
      // Step 3: Extract only the selected columns
      const selectedData = filteredData.map(row => ({
        independent: row[selectedIndependent],
        dependent: row[selectedDependent],
      }));
  
      // Step 4: Compute frequency of each value in the dependent variable
      const frequencyMap = selectedData.reduce((acc, row) => {
        const value = row.dependent;
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {});
  
      // Step 5: Format data for graph
      const formattedData = Object.entries(frequencyMap).map(([key, count]) => ({
        dependent: dependentAnswerMapping[key]?.Display || `Value ${key}`,
        frequency: count,
      }));
  
       setGraphData(formattedData);
    } catch (error) {
      console.error("Error generating graph:", error);
    }
  };
  
  
  // Fetch data from SQL when the "Generate Graph" button is clicked
  // const generateGraph = async () => {
  //   try {
  //     const tableName = `democracy_checkup_${selectedYear}`;
  //     const response = await axios.post("http://localhost:5001/api/all-data", {
  //       table: tableName,
  //       columns: [selectedIndependent, selectedDependent],
  //       filters: selectedFilters,
  //     });

  //     // Calculate the frequency of each value in the dependent variable
  //     const frequencyMap = response.data.reduce((acc, row) => {
  //       const value = row[selectedDependent];
  //       acc[value] = (acc[value] || 0) + 1;
  //       return acc;
  //     }, {});

  //     // Format the data for the graph
  //     const formattedData = Object.entries(frequencyMap).map(([key, count]) => ({
  //       dependent: dependentAnswerMapping[key]?.Display || `Value ${key}`,
  //       frequency: count,
  //     }));

  //     setGraphData(formattedData);
  //   } catch (error) {
  //     console.error("Error fetching data from SQL:", error);
  //   }
  // };

  // Export graph and title to PDF
  const exportToPDF = () => {
    const input = document.getElementById("graph-container");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.text(graphTitle, 105, 10, { align: "center" });
      pdf.addImage(imgData, "PNG", 10, 20, 190, 100);
      pdf.save("chart.pdf");
    });
  };

  // Check if all inputs are selected
  const isFormComplete = selectedYear && selectedDependent && chartType && graphTitle;

  return (
    <div className="px-4 py-3">
      <h1 className="text-[#181010] text-2xl font-bold mb-4 text-center">Create a New Chart</h1>

      {/* Year Selection */}
      <div className="mb-4">
        <label className="flex flex-col">
          <p className="text-[#181010] text-base font-medium mb-2">Year</p>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full h-14 rounded-xl bg-[#f5f0f0] p-4 text-base"
          >
            <option value="">Select Year</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </label>
      </div>

      <div className="mb-4">
        <label className="flex flex-col">
          <p className="text-[#181010] text-base font-medium mb-2">Independent Variable</p>
          <select
            value={selectedIndependent}
            onChange={(e) => setSelectedIndependent(e.target.value)}
            className="w-full h-14 rounded-xl bg-[#f5f0f0] p-4 text-base"
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
      {/* Filters */}
      {filters.length > 0 && (
        <div className="mb-4">
          <button
            className="w-full h-14 bg-[#f5f0f0] text-[#181010] rounded-xl text-base font-medium"
            onClick={toggleModal}
          >
            Filter By
          </button>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={toggleModal}
            contentLabel="Filter Selection"
            ariaHideApp={false}
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <h2 className="text-lg font-bold mb-4">Select Filters</h2>
            <div className="mb-4">
              <label className="flex flex-col">
                <select
                  multiple
                  value={selectedFilters}
                  onChange={handleFilterChange}
                  className="w-full h-40 rounded-xl bg-[#f5f0f0] p-4 text-base"
                >
                  {filters.map((filter) => (
                    <option key={filter.id} value={filter.id}>
                      {filter.display}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg"
                onClick={toggleModal}
              >
                Cancel
              </button>
              <button
                className="bg-[#ff0000] text-white px-4 py-2 rounded-lg"
                onClick={toggleModal}
              >
                Apply Filters
              </button>
            </div>
          </Modal>
        </div>
      )}

       {/* Dependent Variable */}
       <div className="mb-4">
        <label className="flex flex-col">
          <p className="text-[#181010] text-base font-medium mb-2">Dependent Variable</p>
          <select
            value={selectedDependent}
            onChange={(e) => setSelectedDependent(e.target.value)}
            className="w-full h-14 rounded-xl bg-[#f5f0f0] p-4 text-base"
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

      {/* Chart Type Selector */}
      <div className="mb-4">
        <label className="flex flex-col">
        <ChartTypeSelector setChartType={setChartType} />
        </label>
      </div>
      

      {/* Graph Title */}
      <div className="mb-4">
        <label className="flex flex-col">
          <p className="text-[#181010] text-base font-medium mb-2">Graph Title</p>
          <input
            type="text"
            value={graphTitle}
            onChange={(e) => setGraphTitle(e.target.value)}
            placeholder="Enter graph title"
            className="w-full h-14 rounded-xl bg-[#f5f0f0] p-4 text-base"
          />
        </label>
      </div>

      {/* Generate Graph Button */}
      {isFormComplete && (
        <div className="mt-4">
          <button
            className="w-full h-14 bg-[#ff0000] text-white rounded-xl text-lg font-bold"
            onClick={generateGraph}
          >
            Generate Graph
          </button>
        </div>
      )}

      {/* Display Graph */}
      {graphData.length > 0 && (
  <div id="graph-container" className="mt-6 flex flex-col items-center">
    <h2 className="text-lg font-bold mb-4">{graphTitle}</h2>
    {chartType === "Bar" && (
      <div className="flex justify-center">
        <BarChart
          width={800}
          height={400}
          data={graphData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dependent" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="frequency" fill="#8884d8" />
        </BarChart>
      </div>
    )}
    {chartType === "Pie" && (
      <div className="flex justify-center">
        <PieChart width={400} height={400}>
          <Pie
            data={graphData}
            dataKey="frequency"
            nameKey="dependent"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
          >
            {graphData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`hsl(${index * 50}, 70%, 50%)`} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    )}
    {chartType === "Scatter" && (
      <div className="flex justify-center">
        <ScatterChart width={800} height={400}>
          <CartesianGrid />
          <XAxis type="category" dataKey="dependent" />
          <YAxis type="number" dataKey="frequency" />
          <Tooltip />
          <Scatter data={graphData} fill="#8884d8" />
        </ScatterChart>
      </div>
    )}
    <div className="mt-4">
      <button
        className="w-full max-w-xs h-14 bg-[red] text-white rounded-xl text-lg font-bold"
        onClick={exportToPDF}
      >
        Export
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default ChartForm;
