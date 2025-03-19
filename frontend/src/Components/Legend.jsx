import React from "react";

const Legend = ({ getColor, heatValues }) => {
  return (
    <div
      className="leaflet-bottom leaflet-left p-2 bg-white shadow-lg rounded-lg"
      style={{ padding: "10px", fontSize: "14px", lineHeight: "1.5" }}
    >
      <strong>Legend</strong>
      <div className="flex flex-col mt-2">
        {heatValues.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              style={{
                background: getColor(value),
                width: "20px",
                height: "20px",
                display: "inline-block",
                borderRadius: "3px",
              }}
            ></span>
            <span>{`>= ${value}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
