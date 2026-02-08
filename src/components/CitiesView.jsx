/**
 * CitiesView – Saved/favorite cities with live weather data
 */

import React, { useState, useEffect } from "react";
import { fetchCurrentWeather, iconUrl } from "../services/weatherApi";
import {
  MdAdd,
  MdClose,
  MdLocationCity,
  MdRefresh,
  MdSearch,
} from "react-icons/md";
import { WiHumidity, WiStrongWind } from "react-icons/wi";

const DEFAULT_CITIES = ["London", "Tokyo", "New York", "Paris", "Sydney"];

export default function CitiesView({ onSelectCity }) {
  const [savedCities, setSavedCities] = useState(() => {
    const stored = localStorage.getItem("savedCities");
    return stored ? JSON.parse(stored) : DEFAULT_CITIES;
  });
  const [cityData, setCityData] = useState({});
  const [loadingCities, setLoadingCities] = useState({});
  const [addInput, setAddInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
  }, [savedCities]);

  // Fetch weather for all saved cities
  useEffect(() => {
    fetchAllCities();
    // eslint-disable-next-line
  }, []);

  const fetchAllCities = async () => {
    setFetchError(null);
    for (const city of savedCities) {
      await fetchCityWeather(city);
    }
  };

  const fetchCityWeather = async (city) => {
    setLoadingCities((prev) => ({ ...prev, [city]: true }));
    try {
      const data = await fetchCurrentWeather(city);
      setCityData((prev) => ({ ...prev, [city]: data }));
    } catch {
      // silently skip failed fetches
    } finally {
      setLoadingCities((prev) => ({ ...prev, [city]: false }));
    }
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    const city = addInput.trim();
    if (!city) return;
    if (savedCities.some((c) => c.toLowerCase() === city.toLowerCase())) {
      setFetchError("City already in list");
      return;
    }

    setFetchError(null);
    try {
      const data = await fetchCurrentWeather(city);
      setSavedCities((prev) => [...prev, data.city]);
      setCityData((prev) => ({ ...prev, [data.city]: data }));
      setAddInput("");
      setShowAdd(false);
    } catch {
      setFetchError("City not found. Check spelling.");
    }
  };

  const removeCity = (city) => {
    setSavedCities((prev) => prev.filter((c) => c !== city));
    setCityData((prev) => {
      const next = { ...prev };
      delete next[city];
      return next;
    });
  };

  return (
    <div className="cities-view">
      <div className="cities-header">
        <h2 className="cities-title">
          <MdLocationCity size={24} /> Saved Cities
        </h2>
        <div className="cities-actions">
          <button className="cities-btn" onClick={fetchAllCities} title="Refresh all">
            <MdRefresh size={18} /> Refresh
          </button>
          <button
            className="cities-btn cities-btn-accent"
            onClick={() => setShowAdd(!showAdd)}
          >
            <MdAdd size={18} /> Add City
          </button>
        </div>
      </div>

      {/* Add city form */}
      {showAdd && (
        <form className="cities-add-form" onSubmit={handleAddCity}>
          <div className="cities-add-input">
            <MdSearch size={18} />
            <input
              type="text"
              placeholder="Enter city name..."
              value={addInput}
              onChange={(e) => setAddInput(e.target.value)}
              autoFocus
            />
          </div>
          <button type="submit" className="cities-btn cities-btn-accent">
            Add
          </button>
          <button
            type="button"
            className="cities-btn"
            onClick={() => {
              setShowAdd(false);
              setAddInput("");
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {fetchError && <p className="cities-error">{fetchError}</p>}

      {/* City cards grid */}
      <div className="cities-grid">
        {savedCities.map((city) => {
          const data = cityData[city];
          const isLoading = loadingCities[city];

          return (
            <div
              key={city}
              className="city-card"
              onClick={() => onSelectCity && onSelectCity(city)}
            >
              {/* Remove button */}
              <button
                className="city-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCity(city);
                }}
                title="Remove city"
              >
                <MdClose size={14} />
              </button>

              {isLoading || !data ? (
                <div className="city-card-loading">
                  <p className="city-card-name">{city}</p>
                  {isLoading && <div className="city-mini-spinner" />}
                </div>
              ) : (
                <>
                  <div className="city-card-top">
                    <div>
                      <p className="city-card-name">{data.city}</p>
                      <p className="city-card-country">{data.country}</p>
                    </div>
                    <img src={iconUrl(data.icon)} alt={data.description} className="city-card-icon" />
                  </div>

                  <div className="city-card-temp">{data.temp}°C</div>
                  <p className="city-card-desc">{data.description}</p>

                  <div className="city-card-stats">
                    <span className="city-stat">
                      <WiHumidity size={16} /> {data.humidity}%
                    </span>
                    <span className="city-stat">
                      <WiStrongWind size={16} /> {(data.windSpeed * 3.6).toFixed(0)} km/h
                    </span>
                    <span className="city-stat">
                      Feels {data.feelsLike}°
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <p className="cities-hint">Click a city card to view full weather details</p>
    </div>
  );
}
