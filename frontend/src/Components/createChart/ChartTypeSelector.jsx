import React from "react";

const ChartTypeSelector = ({ setChartType }) => {
  const chartTypes = ["Bar", "Scatter", "Pie"];

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  return (
    <div className="px-4 py-3">
      <h3 className="text-lg font-bold mb-4">Chart Type</h3>
      <div className="flex flex-col gap-3">
        {chartTypes.map((type, index) => (
          <label
            key={index}
            className="flex items-center gap-4 border border-[#e7dada] p-4 rounded-xl"
          >
            <input
              type="radio"
              name="chartType"
              value={type}
              onChange={handleChartTypeChange}
              className="h-5 w-5 border-2 border-[#e7dada] checked:border-[#181010]"
            />
            <p className="text-[#181010] text-sm font-medium">{type}</p>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ChartTypeSelector;
