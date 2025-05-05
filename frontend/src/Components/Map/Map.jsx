import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

const provinceNameToId = Object.entries(provinceIdToName).reduce(
  (acc, [id, name]) => ({ ...acc, [name]: parseInt(id) }),
  {}
);

//frequency colors
const getColorProvince = (frequency) => {
  return frequency > 1000
    ? "#800026"
    : frequency > 500
    ? "#BD0026"
    : frequency > 200
    ? "#E31A1C"
    : frequency > 100
    ? "#FC4E2A"
    : frequency > 50
    ? "#FD8D3C"
    : frequency > 20
    ? "#FEB24C"
    : frequency > 10
    ? "#FED976"
    : "#FFEDA0";
};

const getColorRiding = (frequency) => {
  return frequency > 100
    ? "#800026"
    : frequency > 80
    ? "#BD0026"
    : frequency > 65
    ? "#E31A1C"
    : frequency > 40
    ? "#FC4E2A"
    : frequency > 25
    ? "#FD8D3C"
    : frequency > 10
    ? "#FEB24C"
    : frequency > 5
    ? "#FED976"
    : "#FFEDA0";
};

const highlightStyle = {
  weight: 3,
  color: "#ff7800",
  fillOpacity: 0.5,
  fillColor: "#ff7800",
};

/**
 * @param {string} description -contains riding details
 * @returns {number|null} -riding id
 */
const getFeduidFromDescription = (description) => {
  if (!description) return null;
  const parser = new DOMParser();
  const doc = parser.parseFromString(description, "text/html");
  const rows = doc.querySelectorAll("tr");
  for (let row of rows) {
    const cells = row.querySelectorAll("td");
    if (cells.length >= 2 && cells[0].textContent.trim() === "FEDNUM") {
      const idStr = cells[1].textContent.trim();
      return parseInt(idStr, 10);
    }
  }
  return null;
};

const Map = ({ provinceCounts, ridingCounts, viewMode }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);

//fetching data
  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const geoJsonPath =
          viewMode === "province"
            ? "/georef-canada-province.geojson"
            : "/riding.json";
        const response = await fetch(geoJsonPath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
      }
    };
    fetchGeoJson();
  }, [viewMode]);

  //by province or riding
  const styleFeature = (feature) => {
    if (viewMode === "province") {
      const provinceName = feature.properties.prov_name_en;
      const provinceId = provinceNameToId[provinceName];
      console.log("Province ID:", provinceId);
      console.log("Province Counts:", provinceCounts);
      const frequency = provinceCounts.find((entry) => entry.province === provinceId)?.count || 0;
      return {
        weight: 1,
        color: "#3388ff",
        fillOpacity: 0.7,
        fillColor: getColorProvince(frequency),
      };
    } else if (viewMode === "riding") {
      let feduid = feature.properties.feduid;
      if (!feduid && feature.properties.description) {
        feduid = getFeduidFromDescription(feature.properties.description);
      }
      const frequency =
        ridingCounts.find((entry) => entry.riding === feduid)?.count || 0;
      return {
        weight: 1,
        color: "#3388ff",
        fillOpacity: 0.7,
        fillColor: getColorRiding(frequency),
      };
    }
  };

  //hovering
  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle(highlightStyle);
    layer.bringToFront();
  };

  const resetHighlight = (e) => {
    const layer = e.target;
    layer.setStyle(styleFeature(layer.feature));
  };

  //based on province/region
  const onEachFeature = (feature, layer) => {
    if (viewMode === "province") {
      const provinceName = feature.properties.prov_name_en;
      const provinceId = provinceNameToId[provinceName];
      const frequency =
        provinceCounts.find((entry) => entry.province === provinceId)?.count || 0;
      layer.bindTooltip(`${provinceName} (Total: ${frequency})`, {
        sticky: true,
      });
    } else if (viewMode === "riding") {
      const ridingName = feature.properties.name;
      let feduid = feature.properties.feduid;
      if (!feduid && feature.properties.description) {
        feduid = getFeduidFromDescription(feature.properties.description);
      }
      const frequency =
        ridingCounts.find((entry) => entry.riding === feduid)?.count || 0;
      layer.bindTooltip(`${ridingName} (Total: ${frequency})`, {
        sticky: true,
      });
    }

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        className="h-full w-full"
        center={[62.0, -96.0]} 
        zoom={4}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="&copy;"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
