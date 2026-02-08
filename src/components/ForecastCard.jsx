/**
 * ForecastCard – redesigned forecast with today's hourly + 7-day forecast
 */

import React from "react";
import { iconUrl } from "../services/weatherApi";
import { toDayName } from "../utils/helpers";

export default function ForecastCard({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  const today = forecast[0];
  const weekForecast = forecast.slice(0, 7);

  return (
    <div className="forecast-container">
      {/* Today's Forecast */}
      <div className="card forecast-today">
        <h3 className="section-title">📅 Today's Forecast</h3>
        <div className="today-highlight">
          <div className="today-main">
            <img src={iconUrl(today.icon)} alt={today.description} />
            <div>
              <p className="today-temp">
                {today.tempMax}° / {today.tempMin}°
              </p>
              <p className="today-desc">{today.description}</p>
            </div>
          </div>
          <div className="today-stats">
            <div className="today-stat">
              <span className="ts-label">Rain</span>
              <span className="ts-value">💧 {today.pop}%</span>
            </div>
            <div className="today-stat">
              <span className="ts-label">Wind</span>
              <span className="ts-value">💨 {today.windSpeed ? `${(today.windSpeed * 3.6).toFixed(0)} km/h` : "N/A"}</span>
            </div>
            <div className="today-stat">
              <span className="ts-label">Humidity</span>
              <span className="ts-value">💧 {today.humidity || "N/A"}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="card forecast-week">
        <h3 className="section-title">🗓️ 7-Day Forecast</h3>
        <div className="forecast-strip">
          {weekForecast.map((day, idx) => (
            <div className="forecast-day" key={idx}>
              <p className="fd-day">{idx === 0 ? "Today" : toDayName(day.dt)}</p>
              <img src={iconUrl(day.icon)} alt={day.description} />
              <p className="fd-temp">
                <span className="fd-hi">{day.tempMax}°</span>
                <span className="fd-lo">{day.tempMin}°</span>
              </p>
              <p className="fd-desc">{day.description}</p>
              <p className="fd-rain">💧 {day.pop}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
