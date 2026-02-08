/**
 * WeatherTrends – displays AI-detected weather patterns and recommendations
 *
 * Shows:
 *  - Weekly summary sentence
 *  - Trend insights (temp trend, rain pattern, best day, alerts, etc.)
 *  - Each insight has confidence badge, type badge, and detail text
 */

import React from "react";

export default function WeatherTrends({ trends }) {
  if (!trends || !trends.available) return null;

  const { insights, summary } = trends;

  return (
    <div className="card trends-card">
      <h3 className="section-title">📊 AI Trend Analysis</h3>

      {/* ── Weekly summary ── */}
      {summary && (
        <div className="trends-summary">
          <p>{summary.text}</p>
          <div className="trends-summary-stats">
            <span className="ts-stat">
              🌡️ Avg high: <strong>{summary.avgTemp}°C</strong>
            </span>
            <span className="ts-stat">
              🌧️ Rainy days: <strong>{summary.rainyDays}/{summary.totalDays}</strong>
            </span>
            <span className="ts-stat">
              📈 Trend: <strong>{summary.tempTrend}</strong>
            </span>
          </div>
        </div>
      )}

      {/* ── Insight cards ── */}
      <div className="trends-grid">
        {insights.map((insight) => (
          <TrendInsight key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}

function TrendInsight({ insight }) {
  const { emoji, title, detail, type, confidence } = insight;

  const typeColors = {
    trend: "var(--accent)",
    pattern: "var(--accent2)",
    recommendation: "var(--green)",
    outlook: "var(--yellow)",
    alert: "var(--red)",
  };

  return (
    <div className={`trend-insight ${type === "alert" ? "trend-alert" : ""}`}>
      <div className="trend-header">
        <span className="trend-emoji">{emoji}</span>
        <div className="trend-title-group">
          <p className="trend-title">{title}</p>
          <div className="trend-badges">
            <span
              className="trend-badge"
              style={{ backgroundColor: typeColors[type] || "var(--surface2)" }}
            >
              {type}
            </span>
            <span className={`trend-confidence conf-${confidence}`}>
              {confidence}
            </span>
          </div>
        </div>
      </div>
      <p className="trend-detail">{detail}</p>
    </div>
  );
}
