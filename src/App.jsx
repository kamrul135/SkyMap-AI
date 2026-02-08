/**
 * ============================================================
 *  App.jsx – root component (redesigned with sidebar layout)
 * ============================================================
 */

import React, { useState } from "react";
import "./styles/App.css";

import Sidebar               from "./components/Sidebar";
import CurrentWeather        from "./components/CurrentWeather";
import ForecastCard          from "./components/ForecastCard";
import AiInsights            from "./components/AiInsights";
import WeatherTrends         from "./components/WeatherTrends";
import AiAssistantChat       from "./components/AiAssistantChat";
import OutfitRecommendation  from "./components/OutfitRecommendation";
import CitiesView            from "./components/CitiesView";
import MapView               from "./components/MapView";
import TrendsView            from "./components/TrendsView";
import SettingsView           from "./components/SettingsView";
import useWeather            from "./hooks/useWeather";

export default function App() {
  const { current, forecast, insights, trends, loading, error, search } = useWeather();
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeNav, setActiveNav] = useState("weather");

  // Track recent searches & switch to weather view
  const handleSearch = (city) => {
    search(city);
    setActiveNav("weather");
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
      return [city, ...filtered].slice(0, 5);
    });
  };

  // Cities view: select a city and switch to weather
  const handleSelectCity = (city) => {
    handleSearch(city);
  };

  // Render the active section
  const renderSection = () => {
    switch (activeNav) {
      case "cities":
        return <CitiesView onSelectCity={handleSelectCity} />;

      case "map":
        return (
          <MapView
            currentCoords={
              current ? { lat: current.coord?.lat, lon: current.coord?.lon } : null
            }
            cityName={current?.city}
          />
        );

      case "trends":
        return (
          <TrendsView
            trends={trends}
            forecast={forecast}
            insights={insights}
          />
        );

      case "settings":
        return <SettingsView />;

      case "weather":
      default:
        return (
          <>
            {/* ---- error message ---- */}
            {error && <p className="error-msg">{error}</p>}

            {/* ---- loading spinner ---- */}
            {loading && <div className="loading-spinner" />}

            {/* ---- weather content ---- */}
            {!loading && current ? (
              <>
                <CurrentWeather data={current} />

                <div className="content-grid">
                  <div className="content-primary">
                    <ForecastCard forecast={forecast} />
                    <AiInsights insights={insights} />
                    <WeatherTrends trends={trends} />
                    <OutfitRecommendation items={insights?.outfit} />
                  </div>
                  <div className="content-secondary">
                    <AiAssistantChat
                      insights={insights}
                      trends={trends}
                      current={current}
                      forecast={forecast}
                    />
                  </div>
                </div>
              </>
            ) : (
              !loading &&
              !error && (
                <div className="welcome">
                  <span className="welcome-emoji">🌤️</span>
                  <h1>SkyMap AI</h1>
                  <p>
                    Search for any city to get real-time weather data
                    <br />
                    powered by intelligent AI insights.
                  </p>
                </div>
              )
            )}
          </>
        );
    }
  };

  return (
    <div className="app-layout">
      {/* ---- sidebar ---- */}
      <Sidebar
        onSearch={handleSearch}
        loading={loading}
        recentSearches={recentSearches}
        currentCity={current?.city}
        activeNav={activeNav}
        onNavChange={setActiveNav}
      />

      {/* ---- main content ---- */}
      <main className="main-content">
        {renderSection()}
      </main>
    </div>
  );
}
