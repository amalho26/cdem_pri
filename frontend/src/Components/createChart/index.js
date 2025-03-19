import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const ChartForm = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [independentVariables, setIndependentVariables] = useState([]);
  const [dependentVariables, setDependentVariables] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedIndependent, setSelectedIndependent] = useState("");
  const [selectedDependent, setSelectedDependent] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [dependentAnswerMapping, setDependentAnswerMapping] = useState({});

  // Load the JSON file based on the selected year
  useEffect(() => {
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
              answersMapping: value.answersMapping || {}, // Ensure answersMapping is available
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

  // Update dependent answer mapping when the dependent variable changes
  useEffect(() => {
    const selectedDependentQuestion = dependentVariables.find(
      (item) => item.id === selectedDependent
    );
    if (selectedDependentQuestion) {
      setDependentAnswerMapping(selectedDependentQuestion.answersMapping || {});
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

  // Fetch data from SQL when the "Generate Graph" button is clicked
  const generateGraph = async () => {
    try {
      const tableName = `democracy_checkup_${selectedYear}`;
      const response = await axios.post("http://localhost:5001/api/fetch-data", {
        table: tableName,
        columns: [selectedIndependent, selectedDependent],
        filters: selectedFilters,
      });

      // Calculate the frequency of each value in the dependent variable
      const frequencyMap = response.data.reduce((acc, row) => {
        const value = row[selectedDependent];
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {});

      // Map the dependent values to their display text
      const formattedData = Object.entries(frequencyMap).map(([key, count]) => ({
        dependent: dependentAnswerMapping[key]?.Display || `Value ${key}`, // Use Display or fallback
        frequency: count,
      }));

      setGraphData(formattedData);
    } catch (error) {
      console.error("Error fetching data from SQL:", error);
    }
  };

  // Check if all inputs are selected
  const isFormComplete = selectedYear && selectedDependent;

  return (
    <div className="px-4 py-3">
      <h1 className="text-[#181010] text-2xl font-bold mb-4">Create a New Chart</h1>

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
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Bar Graph</h2>
          <BarChart
            width={800}
            height={400}
            data={graphData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="dependent"
              label={{ value: "Dependent Variable", position: "insideBottom", offset: -5 }}
            />
            <YAxis label={{ value: "Frequency", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="frequency" fill="#8884d8" />
          </BarChart>
        </div>
      )}
    </div>
  );
};

export default ChartForm;
