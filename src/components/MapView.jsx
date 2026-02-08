/**
 * MapView – Interactive weather map using OpenStreetMap and OpenWeatherMap tile layers
 */

import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { MdLayers, MdMyLocation, MdLocationOn } from "react-icons/md";
import {
  WiThermometer,
  WiCloud,
  WiRain,
  WiStrongWind,
  WiBarometer,
} from "react-icons/wi";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || "";

// Component to handle map center changes
function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lon], zoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

const MAP_LAYERS = [
  { id: "temp_new", label: "Temperature", icon: <WiThermometer size={18} /> },
  { id: "clouds_new", label: "Clouds", icon: <WiCloud size={18} /> },
  { id: "precipitation_new", label: "Rain", icon: <WiRain size={18} /> },
  { id: "wind_new", label: "Wind", icon: <WiStrongWind size={18} /> },
  { id: "pressure_new", label: "Pressure", icon: <WiBarometer size={18} /> },
];

export default function MapView({ currentCoords, cityName }) {
  const [activeLayer, setActiveLayer] = useState("temp_new");
  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState(
    currentCoords || { lat: 30, lon: 0 }
  );
  const [showWeatherLayer, setShowWeatherLayer] = useState(true);
  const mapRef = useRef(null);

  // Auto-center on city when coordinates change
  useEffect(() => {
    if (currentCoords) {
      setCenter(currentCoords);
      setZoom(8);
    }
  }, [currentCoords]);

  const handleCenterOnCurrent = () => {
    if (currentCoords) {
      setCenter(currentCoords);
      setZoom(8);
    }
  };

  // OpenWeatherMap tile URL for weather layers
  const getWeatherTileUrl = () => 
    `https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${API_KEY}`;

  return (
    <div className="map-view">
      <div className="map-header">
        <h2 className="map-title">
          <MdLayers size={24} /> Weather Map
        </h2>
        <div className="map-header-actions">
          {cityName && (
            <div className="map-current-city">
              <MdLocationOn size={18} />
              <span>{cityName}</span>
            </div>
          )}
          {currentCoords && (
            <button className="map-locate-btn" onClick={handleCenterOnCurrent}>
              <MdMyLocation size={18} /> Recenter
            </button>
          )}
        </div>
      </div>

      {/* Layer selector */}
      <div className="map-layers">
        {MAP_LAYERS.map((layer) => (
          <button
            key={layer.id}
            className={`map-layer-btn ${
              activeLayer === layer.id ? "map-layer-active" : ""
            }`}
            onClick={() => setActiveLayer(layer.id)}
          >
            {layer.icon}
            <span>{layer.label}</span>
          </button>
        ))}
      </div>

      {/* Map container */}
      <div className="map-container">
        <MapContainer
          center={[center.lat, center.lon]}
          zoom={zoom}
          ref={mapRef}
          style={{ height: "100%", width: "100%", borderRadius: "12px" }}
          zoomControl={false}
        >
          <MapController center={center} zoom={zoom} />
          
          {/* OpenStreetMap base layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* OpenWeatherMap weather overlay layer */}
          {API_KEY && showWeatherLayer && (
            <TileLayer
              url={getWeatherTileUrl()}
              opacity={0.6}
              attribution='Weather data &copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
            />
          )}
          
          {/* Marker for current location */}
          {currentCoords && (
            <Marker position={[currentCoords.lat, currentCoords.lon]}>
              <Popup>
                <strong>{cityName || "Current Location"}</strong>
                <br />
                Lat: {currentCoords.lat.toFixed(4)}
                <br />
                Lon: {currentCoords.lon.toFixed(4)}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Zoom controls */}
      <div className="map-zoom">
        <button onClick={() => {
          const newZoom = Math.min(zoom + 1, 18);
          setZoom(newZoom);
          if (mapRef.current) {
            mapRef.current.setZoom(newZoom);
          }
        }}>+</button>
        <span className="map-zoom-level">{zoom}x</span>
        <button onClick={() => {
          const newZoom = Math.max(zoom - 1, 2);
          setZoom(newZoom);
          if (mapRef.current) {
            mapRef.current.setZoom(newZoom);
          }
        }}>−</button>
      </div>

      {/* Toggle weather layer */}
      {API_KEY && (
        <div className="map-layer-toggle">
          <label>
            <input
              type="checkbox"
              checked={showWeatherLayer}
              onChange={(e) => setShowWeatherLayer(e.target.checked)}
            />
            Show Weather Layer
          </label>
        </div>
      )}

      {/* Map legend */}
      <div className="map-legend">
        <h4 className="map-legend-title">Map Legend</h4>
        <div className="map-legend-items">
          {activeLayer === "temp_new" && (
            <>
              <div className="legend-item"><span className="legend-color" style={{background: "#1a237e"}} />-40°C</div>
              <div className="legend-item"><span className="legend-color" style={{background: "#42a5f5"}} />-20°C</div>
              <div className="legend-item"><span className="legend-color" style={{background: "#66bb6a"}} />0°C</div>
              <div className="legend-item"><span className="legend-color" style={{background: "#fdd835"}} />20°C</div>
              <div className="legend-item"><span className="legend-color" style={{background: "#ef5350"}} />40°C</div>
            </>
          )}
          {activeLayer === "clouds_new" && (
            <>
              <div className="legend-item"><span className="legend-color" style={{background: "transparent", border: "1px solid var(--surface3)"}} />Clear</div>
              <div className="legend-item"><span className="legend-color" style={{background: "rgba(255,255,255,0.3)"}} />Partial</div>
              <div className="legend-item"><span className="legend-color" style={{background: "rgba(255,255,255,0.7)"}} />Overcast</div>
            </>
          )}
          {activeLayer === "precipitation_new" && (
            <>
              <div className="legend-item"><span className="legend-color" style={{background: "#a5d6a7"}} />Light</div>
              <div className="legend-item"><span className="legend-color" style={{background: "#42a5f5"}} />Moderate</div>
              <div className="legend-item"><span className="legend-color" style={{background: "#1565c0"}} />Heavy</div>
              <div className="legend-item"><span className="legend-color" style={{background: "#4a148c"}} />Extreme</div>
            </>
          )}
          {activeLayer === "wind_new" && (
            <>
              <div className="legend-item"><span className="legend-color" style={{background: "#e8f5e9"}} />Calm</div>
              <div className="legend-item"><span className="legend-color" style={{background: "#ffeb3b"}} />Breezy</div>
              <div className="legend-item"><span className="legend-color" style={{background: "#ff9800"}} />Strong</div>
              <div className="legend-item"><span className="legend-color" style={{background: "#d32f2f"}} />Storm</div>
            </>
          )}
          {activeLayer === "pressure_new" && (
            <>
              <div className="legend-item"><span className="legend-color" style={{background: "#7b1fa2"}} />Low</div>
              <div className="legend-item"><span className="legend-color" style={{background: "#4caf50"}} />Normal</div>
              <div className="legend-item"><span className="legend-color" style={{background: "#ff5722"}} />High</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
