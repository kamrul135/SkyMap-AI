/**
 * TrendsView – Full-page trend analysis with deeper weather analytics
 *
 * Shows the existing WeatherTrends component plus additional stats:
 *  - Temperature trend chart (text-based)
 *  - Forecast comparison cards
 *  - Weekly pattern summary
 */

import React from "react";
import { iconUrl } from "../services/weatherApi";
import { toDayName, comfortColor } from "../utils/helpers";
import { MdTrendingUp, MdTrendingDown, MdTrendingFlat } from "react-icons/md";
import WeatherTrends from "./WeatherTrends";

export default function TrendsView({ trends, forecast, insights }) {
  return (
    <div className="trends-view">
      <div className="trends-view-header">
        <h2 className="trends-view-title">
          <MdTrendingUp size={24} /> Weather Trends & Analytics
        </h2>
        <p className="trends-view-sub">
          AI-powered weather pattern analysis and forecasting insights
        </p>
      </div>

      {/* Stats overview */}
      {forecast && forecast.length > 0 && (
        <div className="trends-stats-row">
          <StatCard
            label="Week Avg High"
            value={`${Math.round(
              forecast.reduce((s, d) => s + d.tempMax, 0) / forecast.length
            )}°C`}
            icon={<MdTrendingUp size={20} />}
            color="var(--accent)"
          />
          <StatCard
            label="Week Avg Low"
            value={`${Math.round(
              forecast.reduce((s, d) => s + d.tempMin, 0) / forecast.length
            )}°C`}
            icon={<MdTrendingDown size={20} />}
            color="var(--accent2)"
          />
          <StatCard
            label="Rain Chance"
            value={`${Math.round(
              forecast.reduce((s, d) => s + d.pop, 0) / forecast.length
            )}%`}
            icon="🌧️"
            color="var(--blue, var(--accent))"
          />
          <StatCard
            label="Comfort Score"
            value={insights?.comfort ?? "—"}
            icon="😊"
            color={insights ? comfortColor(insights.comfort) : "var(--text-dim)"}
          />
        </div>
      )}

      {/* Temperature bar chart */}
      {forecast && forecast.length > 0 && (
        <div className="card trends-chart-card">
          <h3 className="section-title">🌡️ Temperature Range</h3>
          <div className="temp-chart">
            {forecast.slice(0, 7).map((day, i) => {
              const maxRange = Math.max(...forecast.map((d) => d.tempMax));
              const minRange = Math.min(...forecast.map((d) => d.tempMin));
              const range = maxRange - minRange || 1;
              const highPct = ((day.tempMax - minRange) / range) * 100;
              const lowPct = ((day.tempMin - minRange) / range) * 100;

              return (
                <div className="temp-bar-col" key={i}>
                  <span className="temp-bar-hi">{day.tempMax}°</span>
                  <div className="temp-bar-track">
                    <div
                      className="temp-bar-fill"
                      style={{
                        bottom: `${lowPct}%`,
                        height: `${highPct - lowPct}%`,
                      }}
                    />
                  </div>
                  <span className="temp-bar-lo">{day.tempMin}°</span>
                  <span className="temp-bar-day">
                    {i === 0 ? "Today" : toDayName(day.dt)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Forecast detail table */}
      {forecast && forecast.length > 0 && (
        <div className="card trends-table-card">
          <h3 className="section-title">📋 Forecast Details</h3>
          <div className="trends-table">
            <div className="trends-table-header">
              <span>Day</span>
              <span>Condition</span>
              <span>High / Low</span>
              <span>Rain %</span>
              <span>Trend</span>
            </div>
            {forecast.slice(0, 7).map((day, i) => {
              const prevTemp = i > 0 ? forecast[i - 1].tempMax : day.tempMax;
              const diff = day.tempMax - prevTemp;

              return (
                <div className="trends-table-row" key={i}>
                  <span className="tt-day">
                    <img src={iconUrl(day.icon)} alt="" className="tt-icon" />
                    {i === 0 ? "Today" : toDayName(day.dt)}
                  </span>
                  <span className="tt-desc">{day.description}</span>
                  <span className="tt-temps">
                    <strong>{day.tempMax}°</strong> / {day.tempMin}°
                  </span>
                  <span className="tt-rain">{day.pop}%</span>
                  <span className={`tt-trend ${diff > 0 ? "trend-up" : diff < 0 ? "trend-down" : "trend-flat"}`}>
                    {diff > 0 ? <MdTrendingUp size={16} /> : diff < 0 ? <MdTrendingDown size={16} /> : <MdTrendingFlat size={16} />}
                    {diff !== 0 && `${diff > 0 ? "+" : ""}${diff}°`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Existing AI Trend Analysis */}
      <WeatherTrends trends={trends} />

      {/* No data state */}
      {(!forecast || forecast.length === 0) && !trends && (
        <div className="trends-empty">
          <MdTrendingUp size={48} />
          <h3>No Trend Data Yet</h3>
          <p>Search for a city to see weather trends and analytics.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="trend-stat-card">
      <div className="tsc-icon" style={{ color }}>
        {typeof icon === "string" ? <span>{icon}</span> : icon}
      </div>
      <div className="tsc-value" style={{ color }}>{value}</div>
      <div className="tsc-label">{label}</div>
    </div>
  );
}
