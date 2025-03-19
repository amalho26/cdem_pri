import React from "react";

const InfoControl = ({ currentHover, mapType }) => {
  return (
    <div
      className="leaflet-top leaflet-right p-2 bg-white shadow-lg rounded-lg"
      style={{ padding: "10px", fontSize: "14px", lineHeight: "1.5" }}
    >
      <strong>Info</strong>
      <div className="mt-2">
        {currentHover.name ? (
          <>
            <p>
              <strong>{mapType === "province" ? "Province:" : "Region:"}</strong>{" "}
              {currentHover.name}
            </p>
            <p>
              <strong>Membership:</strong>{" "}
              {currentHover.membership || "No Data"}
            </p>
          </>
        ) : (
          <p>Hover over a region</p>
        )}
      </div>
    </div>
  );
};

export default InfoControl;
