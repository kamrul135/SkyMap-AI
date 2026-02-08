/**
 * Sidebar – left navigation panel with search, recent searches & suggestions
 */

import React, { useState } from "react";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";
import {
  MdSearch,
  MdLocationCity,
  MdMap,
  MdSettings,
  MdTrendingUp,
  MdClose,
} from "react-icons/md";

/** Pick a weather icon based on the weather condition string */
function getWeatherIcon(condition) {
  if (!condition) return <WiDaySunny />;
  const c = condition.toLowerCase();
  if (c.includes("thunder")) return <WiThunderstorm />;
  if (c.includes("rain") || c.includes("drizzle")) return <WiRain />;
  if (c.includes("snow")) return <WiSnow />;
  if (c.includes("fog") || c.includes("mist") || c.includes("haze"))
    return <WiFog />;
  if (c.includes("cloud") || c.includes("overcast")) return <WiCloud />;
  return <WiDaySunny />;
}

const suggestedCities = [
  { name: "Tokyo", country: "JP", temp: 28, condition: "Clear" },
  { name: "London", country: "GB", temp: 16, condition: "Clouds" },
  { name: "New York", country: "US", temp: 24, condition: "Rain" },
  { name: "Dubai", country: "AE", temp: 42, condition: "Clear" },
];

export default function Sidebar({ onSearch, loading, recentSearches = [], currentCity, activeNav, onNavChange }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
    }
  };

  const navItems = [
    { id: "weather", icon: <WiDaySunny size={22} />, label: "Weather" },
    { id: "cities", icon: <MdLocationCity size={20} />, label: "Cities" },
    { id: "map", icon: <MdMap size={20} />, label: "Map" },
    { id: "trends", icon: <MdTrendingUp size={20} />, label: "Trends" },
    { id: "settings", icon: <MdSettings size={20} />, label: "Settings" },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <WiDaySunny size={28} />
        <span>SkyMap AI</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeNav === item.id ? "nav-active" : ""}`}
            onClick={() => onNavChange(item.id)}
            title={item.label}
          >
            {item.icon}
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Search */}
      <form className="sidebar-search" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <MdSearch className="sidebar-search-icon" size={20} />
          <input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="City name"
          />
          {query && (
            <button
              type="button"
              className="sidebar-search-clear"
              onClick={() => setQuery("")}
            >
              <MdClose size={16} />
            </button>
          )}
        </div>
        <button 
          type="submit" 
          className="sidebar-search-btn"
          disabled={loading || !query.trim()}
          title="Search"
        >
          <MdSearch size={18} />
        </button>
      </form>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Recent Searches</h4>
          <ul className="recent-list">
            {recentSearches.map((city, i) => (
              <li key={i}>
                <button
                  className="recent-item"
                  onClick={() => onSearch(city)}
                >
                  <MdLocationCity size={16} />
                  <span>{city}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested Cities */}
      <div className="sidebar-section">
        <h4 className="sidebar-section-title">Popular Cities</h4>
        <div className="suggested-cities">
          {suggestedCities.map((city) => (
            <button
              key={city.name}
              className={`suggested-city ${
                currentCity === city.name ? "suggested-active" : ""
              }`}
              onClick={() => onSearch(city.name)}
            >
              <div className="sc-icon">{getWeatherIcon(city.condition)}</div>
              <div className="sc-info">
                <span className="sc-name">{city.name}</span>
                <span className="sc-country">{city.country}</span>
              </div>
              <span className="sc-temp">{city.temp}°</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
