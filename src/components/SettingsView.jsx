/**
 * SettingsView – User preferences and app configuration
 */

import React, { useState, useEffect } from "react";
import {
  MdSettings,
  MdPalette,
  MdLanguage,
  MdNotifications,
  MdSpeed,
  MdInfo,
} from "react-icons/md";
import { WiThermometer } from "react-icons/wi";

const DEFAULT_SETTINGS = {
  tempUnit: "celsius",
  windUnit: "kmh",
  theme: "dark",
  notifications: true,
  autoRefresh: true,
  refreshInterval: 30,
  language: "en",
};

export default function SettingsView() {
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem("weatherSettings");
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem("weatherSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("weatherSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem("weatherSettings", JSON.stringify(DEFAULT_SETTINGS));
    setSaved(false);
  };

  return (
    <div className="settings-view">
      <div className="settings-header">
        <h2 className="settings-title">
          <MdSettings size={24} /> Settings
        </h2>
        <p className="settings-sub">Customize your weather experience</p>
      </div>

      {/* Units */}
      <div className="settings-card">
        <div className="settings-card-header">
          <WiThermometer size={22} />
          <h3>Units</h3>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <p className="setting-label">Temperature</p>
            <p className="setting-desc">Choose temperature display unit</p>
          </div>
          <div className="setting-toggle-group">
            <button
              className={`stg-btn ${settings.tempUnit === "celsius" ? "stg-active" : ""}`}
              onClick={() => updateSetting("tempUnit", "celsius")}
            >
              °C
            </button>
            <button
              className={`stg-btn ${settings.tempUnit === "fahrenheit" ? "stg-active" : ""}`}
              onClick={() => updateSetting("tempUnit", "fahrenheit")}
            >
              °F
            </button>
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <p className="setting-label">Wind Speed</p>
            <p className="setting-desc">Choose wind speed unit</p>
          </div>
          <div className="setting-toggle-group">
            <button
              className={`stg-btn ${settings.windUnit === "kmh" ? "stg-active" : ""}`}
              onClick={() => updateSetting("windUnit", "kmh")}
            >
              km/h
            </button>
            <button
              className={`stg-btn ${settings.windUnit === "ms" ? "stg-active" : ""}`}
              onClick={() => updateSetting("windUnit", "ms")}
            >
              m/s
            </button>
            <button
              className={`stg-btn ${settings.windUnit === "mph" ? "stg-active" : ""}`}
              onClick={() => updateSetting("windUnit", "mph")}
            >
              mph
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="settings-card">
        <div className="settings-card-header">
          <MdPalette size={20} />
          <h3>Appearance</h3>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <p className="setting-label">Theme</p>
            <p className="setting-desc">App color scheme</p>
          </div>
          <div className="setting-toggle-group">
            <button
              className={`stg-btn ${settings.theme === "dark" ? "stg-active" : ""}`}
              onClick={() => updateSetting("theme", "dark")}
            >
              🌙 Dark
            </button>
            <button
              className={`stg-btn ${settings.theme === "light" ? "stg-active" : ""}`}
              onClick={() => updateSetting("theme", "light")}
            >
              ☀️ Light
            </button>
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <p className="setting-label">Language</p>
            <p className="setting-desc">Interface language</p>
          </div>
          <div className="setting-toggle-group">
            {[
              { id: "en", label: "English" },
              { id: "es", label: "Español" },
              { id: "fr", label: "Français" },
            ].map((lang) => (
              <button
                key={lang.id}
                className={`stg-btn ${settings.language === lang.id ? "stg-active" : ""}`}
                onClick={() => updateSetting("language", lang.id)}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data & Refresh */}
      <div className="settings-card">
        <div className="settings-card-header">
          <MdSpeed size={20} />
          <h3>Data & Refresh</h3>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <p className="setting-label">Auto Refresh</p>
            <p className="setting-desc">Automatically update weather data</p>
          </div>
          <label className="setting-switch">
            <input
              type="checkbox"
              checked={settings.autoRefresh}
              onChange={(e) => updateSetting("autoRefresh", e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {settings.autoRefresh && (
          <div className="setting-row">
            <div className="setting-info">
              <p className="setting-label">Refresh Interval</p>
              <p className="setting-desc">Minutes between updates</p>
            </div>
            <div className="setting-toggle-group">
              {[15, 30, 60].map((min) => (
                <button
                  key={min}
                  className={`stg-btn ${settings.refreshInterval === min ? "stg-active" : ""}`}
                  onClick={() => updateSetting("refreshInterval", min)}
                >
                  {min}m
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="setting-row">
          <div className="setting-info">
            <p className="setting-label">Notifications</p>
            <p className="setting-desc">Weather alerts and updates</p>
          </div>
          <label className="setting-switch">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSetting("notifications", e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>
      </div>

      {/* About */}
      <div className="settings-card">
        <div className="settings-card-header">
          <MdInfo size={20} />
          <h3>About</h3>
        </div>
        <div className="settings-about">
          <div className="about-row">
            <span>Version</span>
            <span className="about-value">1.0.0</span>
          </div>
          <div className="about-row">
            <span>Data Source</span>
            <span className="about-value">OpenWeatherMap</span>
          </div>
          <div className="about-row">
            <span>AI Engine</span>
            <span className="about-value">Built-in Rule Engine</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="settings-actions">
        <button className="settings-save-btn" onClick={handleSave}>
          {saved ? "✓ Saved!" : "Save Settings"}
        </button>
        <button className="settings-reset-btn" onClick={handleReset}>
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
