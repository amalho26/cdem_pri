import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ provinceCounts }) => {
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);

  const canadaGeoDataPath = "/georef-canada-province.geojson"; // GeoJSON should be in the public folder

  // Province ID to Name Mapping
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

  // Reverse Mapping (Name to ID)
  const provinceNameToId = Object.entries(provinceIdToName).reduce(
    (acc, [id, name]) => ({ ...acc, [name]: parseInt(id) }),
    {}
  );

  // Default styles for provinces
  const defaultStyle = {
    weight: 1,
    color: "#3388ff",
    fillOpacity: 0.2,
    fillColor: "transparent",
  };

  // Style for highlighting provinces
  const highlightStyle = {
    weight: 3,
    color: "#ff7800",
    fillOpacity: 0.5,
    fillColor: "#ff7800",
  };

  // Map color intensities for heat map
  const getColor = (frequency) => {
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

  // Load GeoJSON data
  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch(canadaGeoDataPath);
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
  }, []);

  // Style each province based on its frequency
  const styleFeature = (feature) => {
    const provinceName = feature.properties.prov_name_en; // Assuming GeoJSON has a `name` field
    const provinceId = provinceNameToId[provinceName]; // Get province ID from name
    const frequency =
      provinceCounts.find((entry) => entry.province === provinceId)?.count || 0;

    return {
      weight: 1,
      color: "#3388ff",
      fillOpacity: 0.7,
      fillColor: getColor(frequency),
    };
  };

  // Highlight province on hover
  const highlightFeature = (e) => {
    const layer = e.target;
    const provinceName = layer.feature.properties.prov_name_en; // Assuming GeoJSON has a `name` field
    const provinceId = provinceNameToId[provinceName]; // Get province ID from name
    const frequency =
      provinceCounts.find((entry) => entry.province === provinceId)?.count || 0;

    setHoveredProvince({ name: provinceName, frequency });
    layer.setStyle(highlightStyle);
    layer.bringToFront();
  };

  // Reset highlight on mouse out
  const resetHighlight = (e) => {
    const layer = e.target;
    setHoveredProvince(null);
    layer.setStyle(styleFeature(layer.feature));
  };

  // Attach events to each GeoJSON feature
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  };

  return (
    <div>
      <MapContainer
        style={{ height: "400px", width: "100%" }}
        center={[62.0, -96.0]} // Centered on Canada
        zoom={4}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
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
      {hoveredProvince && (
        <div
          style={{
            marginTop: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Hovering over: {hoveredProvince.name} (Total: {hoveredProvince.frequency})
        </div>
      )}
    </div>
  );
};

export default Map;
