// src/components/StatisticsPage.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ViewStatisticsPage = () => {
  // Example data for charts:
  // Replace with actual data from Canada only.
  const importanceData = [
    { label: "Not Important At All", value: 10 },
    { label: "Not Very Important", value: 15 },
    { label: "Somewhat Important", value: 30 },
    { label: "Very Important", value: 45 },
  ];

  const frequencyData = [
    { label: "Never", value: 25 },
    { label: "Once/Twice a Year", value: 30 },
    { label: "Once/Twice a Month", value: 20 },
    { label: "Once/Twice a Week", value: 15 },
    { label: "Daily", value: 10 },
  ];

  // Example summary stats for Canada
  // (Replace these with your real values)
  const stats = {
    weightedAverage: 4.62,
    countryRoundAverage: 44.6,
    countryRoundMedian: 30,
    pooledMean: 35,
    pooledStdDev: 3.0,
    sampleSize: 1200,
    marginOfError: "±2.8%",
    confidenceInterval: "95%",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Statistical Summary (Canada)
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Weighted Average</p>
            <h2 className="text-xl font-bold text-gray-800">
              {stats.weightedAverage}
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Country Round Avg</p>
            <h2 className="text-xl font-bold text-gray-800">
              {stats.countryRoundAverage}
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Country Round Median</p>
            <h2 className="text-xl font-bold text-gray-800">
              {stats.countryRoundMedian}
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Pooled Mean</p>
            <h2 className="text-xl font-bold text-gray-800">
              {stats.pooledMean}
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Pooled Std. Dev.</p>
            <h2 className="text-xl font-bold text-gray-800">
              {stats.pooledStdDev}
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Sample Size</p>
            <h2 className="text-xl font-bold text-gray-800">
              {stats.sampleSize}
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Margin of Error</p>
            <h2 className="text-xl font-bold text-gray-800">
              {stats.marginOfError}
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Confidence Interval</p>
            <h2 className="text-xl font-bold text-gray-800">
              {stats.confidenceInterval}
            </h2>
          </div>
        </div>

        {/* Importance of Religion Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Importance of Religion
          </h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={importanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4F46E5" /> {/* Indigo-600 */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Frequency of Religious Practice Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Frequency of Religious Practice
          </h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={frequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#EC4899" /> {/* Pink-500 */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStatisticsPage;
