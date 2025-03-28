import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Navbar from "../Components/Navbar";
import backgroundImg from "../Assets/background.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Mapping of province/territory IDs to names
const provinceIdToName = {
  1: "Alberta",
  2: "British Columbia",
  3: "Manitoba",
  4: "New Brunswick",
  5: "Newfoundland and Labrador",
  6: "Northwest Territories",
  7: "Nova Scotia",
  8: "Nunavut",
  9: "Ontario",
  10: "Prince Edward Island",
  11: "Quebec",
  12: "Saskatchewan",
  13: "Yukon",
};

const ViewStatisticsPage = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [independentVariables, setIndependentVariables] = useState([]);
  const [dependentVariables, setDependentVariables] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedIndependent, setSelectedIndependent] = useState("");
  const [selectedDependent, setSelectedDependent] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sqlData, setSqlData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Computed statistics
  const [nationalStats, setNationalStats] = useState(null);
  const [provinceStats, setProvinceStats] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("All");

  // Store the dependent answer mapping from your JSON file
  const [dependentAnswerMapping, setDependentAnswerMapping] = useState({});

  // --- 1) FETCH THE DATA ---

  // 1a) Fetch the raw SQL data from your backend
  useEffect(() => {
    if (selectedYear) {
      axios
        .get("http://localhost:5001/api/all_data", {
          headers: { db: `${selectedYear}_democracy_checkup` },
        })
        .then((response) => {
          setSqlData(response.data);
        })
        .catch((err) => {
          console.error("Error fetching SQL data:", err);
        });
    }
  }, [selectedYear]);

  // 1b) Fetch the question JSON data for independent/dependent mappings
  useEffect(() => {
    if (selectedYear) {
      import(`../Data/questions${selectedYear}.json`)
        .then((response) => {
          const data = response.default;

          if (data.independent) {
            const independent = Object.entries(data.independent).map(
              ([key, value]) => ({
                id: key,
                mainQuestion: value.mainQuestion,
                answersMapping: value.answersMapping,
              })
            );
            setIndependentVariables(independent);
          }

          if (data.dependent) {
            const dependent = Object.entries(data.dependent).map(
              ([key, value]) => ({
                id: key,
                mainQuestion: value.mainQuestion,
                mapping: value.answersMapping,
              })
            );
            setDependentVariables(dependent);
          }
        })
        .catch((error) => {
          console.error("JSON data error:", error);
        });
    } else {
      setIndependentVariables([]);
      setDependentVariables([]);
      setFilters([]);
    }
  }, [selectedYear]);

  // --- 2) UPDATE FILTER & MAPPING ---

  // 2a) Update the filter options when the independent variable changes
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

  // 2b) Keep track of the current dependent question’s answer mapping
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

  // 2c) Handle filter selection in the multi-select
  const handleFilterChange = (e) => {
    const { options } = e.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setSelectedFilters(selectedValues);
  };

  // Toggle modal for filters
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // --- 3) STATISTICS CALCULATION ---

  // Exclude -99 and compute average, median, stdDev, sampleSize, min, max
  const computeStatistics = (data, field) => {
    const values = data
      .map((row) => Number(row[field]))
      .filter((val) => !isNaN(val) && val !== -99);

    if (values.length === 0) {
      return {
        average: 0,
        median: 0,
        stdDev: 0,
        sampleSize: 0,
        min: 0,
        max: 0,
      };
    }

    const sampleSize = values.length;
    const average = values.reduce((acc, cur) => acc + cur, 0) / sampleSize;
    const sorted = [...values].sort((a, b) => a - b);

    const median =
      sampleSize % 2 === 0
        ? (sorted[sampleSize / 2 - 1] + sorted[sampleSize / 2]) / 2
        : sorted[Math.floor(sampleSize / 2)];

    const variance =
      values.reduce((acc, cur) => acc + (cur - average) ** 2, 0) / sampleSize;
    const stdDev = Math.sqrt(variance);

    return {
      average,
      median,
      stdDev: parseFloat(stdDev.toFixed(1)),
      sampleSize,
      min: sorted[0],
      max: sorted[sorted.length - 1],
    };
  };

  // --- 4) GENERATE STATISTICS ON BUTTON CLICK ---

  const generateStatistics = () => {
    if (!sqlData || sqlData.length === 0 || !selectedDependent) {
      console.error("Insufficient data or dependent variable not selected");
      return;
    }

    // 4a) Filter data if filters are selected
    let filteredData = [...sqlData];
    if (selectedFilters.length > 0 && selectedIndependent) {
      filteredData = filteredData.filter((row) =>
        selectedFilters.includes(row[selectedIndependent])
      );
    }

    // 4b) Compute national stats
    const national = computeStatistics(filteredData, selectedDependent);
    setNationalStats(national);

    // 4c) Group by province for breakdown
    const grouped = {};
    filteredData.forEach((row) => {
      const provId = row.dc21_province; // or however your data references the province
      if (!grouped[provId]) {
        grouped[provId] = [];
      }
      grouped[provId].push(row);
    });

    // 4d) Compute stats per province
    const statsArray = Object.entries(grouped).map(([provId, rows]) => {
      const numericId = Number(provId);
      const stats = computeStatistics(rows, selectedDependent);
      return {
        province: provinceIdToName[numericId],
        ...stats,
      };
    });

    setProvinceStats(statsArray);
  };

  // Control which province stats to display
  const displayedProvinceStats =
    selectedProvince === "All"
      ? provinceStats
      : provinceStats.filter((stat) => stat.province === selectedProvince);

  // Data for the Recharts bar chart
  const chartData = displayedProvinceStats.map((stat) => ({
    province: stat.province,
    average: stat.average,
  }));

  // --- 5) RANGE VISUALIZATION HELPERS ---

  // We’ll list ALL possible codes (excluding -99) from the JSON mapping
  // so we can place them on the bottom of the range.
  const getAllCodes = () => {
    return Object.keys(dependentAnswerMapping)
      .map(Number)
      .filter((code) => code !== -99)
      .sort((a, b) => a - b);
  };

  // A small helper to convert a numeric code to its display label
  const getAnswerLabel = (code) => {
    return dependentAnswerMapping[code]?.Display || `Value ${code}`;
  };

  // Clamping function
  const clamp = (val, mn, mx) => Math.max(mn, Math.min(val, mx));

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative z-10">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gray-50 p-6">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
            Statistics Panel
          </h1>

          {/* -- Data Selection Form -- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Year Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full h-12 rounded-lg border border-gray-300 p-2"
              >
                <option value="">Select Year</option>
                {[2019, 2020, 2021, 2022, 2023, 2024].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Independent Variable */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Independent Variable
              </label>
              <select
                value={selectedIndependent}
                onChange={(e) => setSelectedIndependent(e.target.value)}
                className="w-full h-12 rounded-lg border border-gray-300 p-2"
              >
                <option value="">Select Independent Variable</option>
                {independentVariables.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.mainQuestion}
                  </option>
                ))}
              </select>
            </div>

            {/* Dependent Variable */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Dependent Variable
              </label>
              <select
                value={selectedDependent}
                onChange={(e) => setSelectedDependent(e.target.value)}
                className="w-full h-12 rounded-lg border border-gray-300 p-2"
              >
                <option value="">Select Dependent Variable</option>
                {dependentVariables.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.mainQuestion}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Button (opens modal) */}
            {filters.length > 0 && (
              <div>
                <button
                  onClick={toggleModal}
                  className="w-full h-12 bg-red-500 text-white rounded-lg font-medium"
                >
                  Filter By
                </button>
              </div>
            )}
          </div>

          {/* -- Modal for Filters -- */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={toggleModal}
            contentLabel="Filter Selection"
            ariaHideApp={false}
            className="relative z-50 bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-20"
            overlayClassName="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <h2 className="text-xl font-bold mb-4">Select Filters</h2>
            <select
              multiple
              value={selectedFilters}
              onChange={handleFilterChange}
              className="w-full h-40 rounded-lg border border-gray-300 p-2"
            >
              {filters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.display}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={toggleModal}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={toggleModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </Modal>

          {/* -- Generate Statistics Button -- */}
          <div className="flex justify-center mb-8">
            <button
              onClick={generateStatistics}
              className="w-full md:w-1/2 h-14 bg-green-600 text-white rounded-xl text-lg font-bold"
            >
              Generate Statistics
            </button>
          </div>

          {/* -- National Overview -- */}
          {nationalStats && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                National Overview
              </h2>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Sample Size Card */}
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Sample Size</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {nationalStats.sampleSize}
                  </p>
                </div>

                {/* Range Visualization */}
                <div className="flex-1 bg-white p-4 rounded-lg shadow-sm relative">
                  <h3 className="text-lg font-semibold mb-4">Range</h3>

                  {(() => {
                    // 1) Gather all possible codes from the JSON mapping
                    const allCodes = getAllCodes();
                    if (allCodes.length === 0) {
                      return <p>No valid codes found in mapping.</p>;
                    }

                    // 2) Define a global "mapping min" and "mapping max"
                    //    for the entire set of possible responses.
                    const mappingMin = allCodes[0];
                    const mappingMax = allCodes[allCodes.length - 1];

                    // 3) Pull out numeric stats
                    const { average, median, stdDev } = nationalStats;

                    // 4) Compute std dev boundaries and clamp them
                    const stdLeft = clamp(average - stdDev, mappingMin, mappingMax);
                    const stdRight = clamp(average + stdDev, mappingMin, mappingMax);

                    // Also clamp average and median so dots don’t go off-track
                    const avgClamped = clamp(average, mappingMin, mappingMax);
                    const medClamped = clamp(median, mappingMin, mappingMax);

                    // 5) Positioning helpers
                    const range = mappingMax - mappingMin || 1;
                    const toPercent = (val) =>
                      ((val - mappingMin) / range) * 100;

                    return (
                      <div className="relative w-full" style={{ height: "60px" }}>
                        {/* The main track (centered vertically) */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full"
                        />

                        {/* The std dev band */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-2 bg-yellow-300 opacity-50"
                          style={{
                            left: `${toPercent(stdLeft)}%`,
                            width: `${toPercent(stdRight) - toPercent(stdLeft)}%`,
                          }}
                        />

                        {/* Dot + label for left std dev boundary */}
                        <div
                          className="absolute text-center"
                          style={{
                            left: `${toPercent(stdLeft)}%`,
                            top: "0%",
                          }}
                        >
                          <div
                            className="text-xs font-semibold text-yellow-600 mb-1"
                            style={{ transform: "translateX(-50%)" }}
                          >
                            -StdDev
                          </div>
                          <div
                            className="w-3 h-3 bg-yellow-600 rounded-full mx-auto"
                            style={{ transform: "translate(-50%, 0)" }}
                          />
                        </div>

                        {/* Dot + label for right std dev boundary */}
                        <div
                          className="absolute text-center"
                          style={{
                            left: `${toPercent(stdRight)}%`,
                            top: "0%",
                          }}
                        >
                          <div
                            className="text-xs font-semibold text-yellow-600 mb-1"
                            style={{ transform: "translateX(-50%)" }}
                          >
                            +StdDev
                          </div>
                          <div
                            className="w-3 h-3 bg-yellow-600 rounded-full mx-auto"
                            style={{ transform: "translate(-50%, 0)" }}
                          />
                        </div>

                        {/* Average dot + label on top */}
                        <div
                          className="absolute text-center"
                          style={{
                            left: `${toPercent(avgClamped)}%`,
                            top: "0%",
                          }}
                        >
                          <div
                            className="text-xs font-semibold text-blue-600 mb-1"
                            style={{ transform: "translateX(-50%)" }}
                          >
                            Avg
                          </div>
                          <div
                            className="w-3 h-3 bg-blue-600 rounded-full mx-auto"
                            style={{ transform: "translate(-50%, 0)" }}
                          />
                        </div>

                        {/* Median dot + label on top */}
                        <div
                          className="absolute text-center"
                          style={{
                            left: `${toPercent(medClamped)}%`,
                            top: "0%",
                          }}
                        >
                          <div
                            className="text-xs font-semibold text-green-600 mb-1"
                            style={{ transform: "translateX(-50%)" }}
                          >
                            Med
                          </div>
                          <div
                            className="w-3 h-3 bg-green-600 rounded-full mx-auto"
                            style={{ transform: "translate(-50%, 0)" }}
                          />
                        </div>

                        {/* Markers for ALL possible codes (responses) along the bottom */}
                        {allCodes.map((code) => {
                          const label = getAnswerLabel(code);
                          return (
                            <div
                              key={code}
                              className="absolute text-center"
                              style={{
                                left: `${toPercent(code)}%`,
                                bottom: "0%",
                              }}
                            >
                              <div
                                className="w-2 h-2 bg-gray-600 rounded-full mx-auto"
                                style={{ transform: "translate(-50%, 0)" }}
                              />
                              <div
                                className="text-xs text-gray-600 mt-1"
                                style={{ transform: "translateX(-50%)" }}
                              >
                                {label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* -- Province/Territory Breakdown -- */}
          {provinceStats.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                By Province/Territory
              </h2>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Select Province/Territory
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full h-12 rounded-lg border border-gray-300 p-2"
                >
                  <option value="All">All Provinces/Territories</option>
                  {Object.values(provinceIdToName).map((provName) => (
                    <option key={provName} value={provName}>
                      {provName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Province Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {displayedProvinceStats.map((prov, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {prov.province}
                    </h3>
                    <p>
                      <strong>Average:</strong> {prov.average.toFixed(1)}
                    </p>
                    <p>
                      <strong>Median:</strong> {prov.median.toFixed(1)}
                    </p>
                    <p>
                      <strong>Std. Deviation:</strong> {prov.stdDev}
                    </p>
                    <p>
                      <strong>Sample Size:</strong> {prov.sampleSize}
                    </p>
                    <p>
                      <strong>Range:</strong> {prov.min} – {prov.max}
                    </p>
                  </div>
                ))}
              </div>

              {/* Averages Graph using Recharts */}
              {chartData.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Averages Graph
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="province" />
                      <YAxis
                        label={{
                          value: "Average",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip />
                      <Bar dataKey="average" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewStatisticsPage;
