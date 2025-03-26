import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ provinceCounts }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  const canadaGeoDataPath = "/georef-canada-province.geojson"; // GeoJSON in public folder
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

  // Styles for hover highlight
  const highlightStyle = {
    weight: 3,
    color: "#ff7800",
    fillOpacity: 0.5,
    fillColor: "#ff7800",
  };

  // Choropleth color scale
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

  // Load GeoJSON once
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

  // Default style for each province
  const styleFeature = (feature) => {
    const provinceName = feature.properties.prov_name_en;
    const provinceId = provinceNameToId[provinceName];
    const frequency =
      provinceCounts.find((entry) => entry.province === provinceId)?.count || 0;

    return {
      weight: 1,
      color: "#3388ff",
      fillOpacity: 0.7,
      fillColor: getColor(frequency),
    };
  };

  // Highlight on mouseover
  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle(highlightStyle);
    layer.bringToFront();
  };

  // Reset style on mouseout
  const resetHighlight = (e) => {
    const layer = e.target;
    layer.setStyle(styleFeature(layer.feature));
  };

  // Bind tooltip and hover events
  const onEachFeature = (feature, layer) => {
    const provinceName = feature.properties.prov_name_en;
    const provinceId = provinceNameToId[provinceName];
    const frequency =
      provinceCounts.find((entry) => entry.province === provinceId)?.count || 0;

    // Bind a Leaflet tooltip showing the province & count
    layer.bindTooltip(`${provinceName} (Total: ${frequency})`, {
      sticky: true,
    });

    // Set up hover handlers
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  };

  return (
    // Make this div fill the parent container
    <div className="w-full h-full">
      <MapContainer
        // Use h-full w-full to ensure the map fills its container
        className="h-full w-full"
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
    </div>
  );
};

export default Map;
