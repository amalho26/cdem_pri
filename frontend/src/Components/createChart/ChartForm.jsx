import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import {BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell} from "recharts";
import ChartTypeSelector from "./ChartTypeSelector";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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
  const [chartType, setChartType] = useState("");
  const [graphTitle, setGraphTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sqlData, setSqlData] = useState([]);
  const isFormComplete = selectedYear && selectedDependent && chartType && graphTitle;

  useEffect(() => {
    if (selectedYear) {
      axios
        .get("http://playground.c-dem.ca/api/all_data", {
          headers: { db: `${selectedYear}_democracy_checkup` },
        })
        .then((response) => {
          setSqlData(response.daxta);
          console.log("SQL Data:", response.data);
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    }
    console.log(sqlData)
  }, [selectedYear]);

  //questions
  useEffect(() => {
    if (selectedYear) {
      const fetchData = async () => {
        try {
          const response = await import(`../../Data/questions${selectedYear}.json`);
          const data = response.default;

          if (data.independent) {
            const independent = Object.entries(data.independent).map(([key, value]) => ({
              id: key,
              mainQuestion: value.mainQuestion,
              answersMapping: value.answersMapping,
            }));
            setIndependentVariables(independent);
          }

          if (data.dependent) {
            const dependent = Object.entries(data.dependent).map(([key, value]) => ({
              id: key,
              mainQuestion: value.mainQuestion,
              mapping: value.answersMapping,
            }));
            setDependentVariables(dependent);
          }
        } catch (error) {
          console.error("JSON data error:", error);
        }
      };

      fetchData();
    } else {
      setIndependentVariables([]);
      setDependentVariables([]);
      setFilters([]);
    }
  }, [selectedYear]);

  //filter updates
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

  //filters
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

  const renderCustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{backgroundColor: "#fff", border: "1px solid #ccc", padding: 10,}}>
          <p>{`${label} : Count ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  //graph data
const generateGraph = () => {
  try {
    if (!sqlData || sqlData.length === 0) {
      console.error("No data available to generate graph.");
      return;
    }

    let filteredData = [...sqlData];
    if (selectedFilters && selectedFilters.length > 0) {
      filteredData = filteredData.filter((row) =>
        selectedFilters.includes(row[selectedIndependent])
      );
    }

    //filter out -99
    filteredData = filteredData.filter(
      (row) => row[selectedDependent] !== -99 && row[selectedDependent] !== "-99"
    );

    const selectedData = filteredData.map((row) => ({
      independent: row[selectedIndependent],
      dependent: row[selectedDependent],
    }));

    const frequencyMap = selectedData.reduce((acc, row) => {
      const value = row.dependent;
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

    const formattedData = Object.entries(frequencyMap).map(([key, count]) => ({
      dependent: dependentAnswerMapping[key]?.Display || `Value ${key}`,
      count: count,
    }));

    setGraphData(formattedData);
  } catch (error) {
    console.error("Error generating graph:", error);
  }
};


  //export pdf
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

  return (
    <div className="px-4 py-3 flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <h1 className="text-[#181010] text-2xl font-bold mb-4 text-center">
          Create a New Chart
        </h1>

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
            <p className="text-[#181010] text-base font-medium mb-2">
              Independent Variable
            </p>
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

        {filters.length > 0 && (
          <div className="mb-4">
            <button className="w-full h-14 bg-[#f5f0f0] text-[#181010] rounded-xl text-base font-medium" onClick={toggleModal}>
              Filter By
            </button>

            <Modal
              isOpen={isModalOpen}
              onRequestClose={toggleModal}
              contentLabel="Filter Selection"
              ariaHideApp={false}
              className="relative z-[60] bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-20"
              overlayClassName="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <h2 className="text-lg font-bold mb-4">Select Filters</h2>
              <div className="mb-4">
                <label className="flex flex-col">
                  <select multiple value={selectedFilters} onChange={handleFilterChange} className="w-full h-40 rounded-xl bg-[#f5f0f0] p-4 text-base">
                    {filters.map((filter) => (
                      <option key={filter.id} value={filter.id}>
                        {filter.display}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex justify-end gap-4">
                <button className="bg-gray-300 px-4 py-2 rounded-lg" onClick={toggleModal}>
                  Cancel
                </button>
                <button className="bg-[#ff0000] text-white px-4 py-2 rounded-lg" onClick={toggleModal}>
                  Apply Filters
                </button>
              </div>
            </Modal>
          </div>
        )}

        <div className="mb-4">
          <label className="flex flex-col">
            <p className="text-[#181010] text-base font-medium mb-2">
              Dependent Variable
            </p>
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

        <div className="mb-4">
          <ChartTypeSelector setChartType={setChartType} />
        </div>

        <div className="mb-4">
          <label className="flex flex-col">
            <p className="text-[#181010] text-base font-medium mb-2">
              Graph Title
            </p>
            <input
              type="text"
              value={graphTitle}
              onChange={(e) => setGraphTitle(e.target.value)}
              placeholder="Enter graph title"
              className="w-full h-14 rounded-xl bg-[#f5f0f0] p-4 text-base"
            />
          </label>
        </div>

        <div className="flex items-center space-x-4 mt-4">
          {isFormComplete && (
            <button className="flex-1 h-14 bg-[#ff0000] text-white rounded-xl text-lg font-bold" onClick={generateGraph}>
              Generate Graph
            </button>
          )}

          {graphData.length > 0 && (
            <button className="flex-1 h-14 bg-[#ff0000] text-white rounded-xl text-lg font-bold" onClick={exportToPDF}>
              Export Chart as PDF
            </button>
          )}
        </div>
      </div>

      <div className="md:w-1/2 bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
        {graphData.length > 0 ? (
          <div id="graph-container" className="w-full">
            <h2 className="text-xl font-bold mb-4 text-center text-[#181010]">
              {graphTitle}
            </h2>

            {chartType === "Bar" && (
              <div className="flex justify-center">
                <BarChart width={700} height={500} data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}  barGap={0}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="dependent"
                    type="category"
                    scale="band"
                    tick={{ angle: -90, textAnchor: "end" }}
                    interval={0}
                    height={100}
                    label={{
                      value: "Dependent Variable",
                      position: "bottom",
                      offset: 20,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Count",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                    }}
                  />
                  <Tooltip content={renderCustomBarTooltip} cursor={{ fill: "rgba(196,196,196,0.3)" }}/>
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" barSize={40} />
                </BarChart>
              </div>
            )}

            {chartType === "Pie" && (
              <div className="flex justify-center">
                <PieChart width={500} height={400} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <Pie data={graphData} dataKey="count" nameKey="dependent" cx="50%" cy="45%" outerRadius={120} fill="#8884d8" label={({ percent }) => `${(percent * 100).toFixed(1)}%`}>
                    {graphData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 50}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      padding: "10px",
                      marginTop: "20px",
                      backgroundColor: "#fff",
                      width: "90%",
                      margin: "0 auto",
                    }}
                  />
                  <Tooltip />
                </PieChart>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              Your chart will appear here once generated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartForm;
