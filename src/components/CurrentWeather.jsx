/**
 * CurrentWeather – hero card showing live weather for the searched city
 */

import React from "react";
import { iconUrl } from "../services/weatherApi";
import { toTimeString, windDirection, msToKmh } from "../utils/helpers";
import {
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiSunrise,
  WiSunset,
  WiCloud,
} from "react-icons/wi";
import { MdVisibility } from "react-icons/md";

export default function CurrentWeather({ data }) {
  if (!data) return null;

  return (
    <div className="current-weather card">
      {/* ---- left: temp & description ---- */}
      <div className="cw-main">
        <div className="cw-location">
          <h2>
            {data.city}, {data.country}
          </h2>
          <p className="cw-desc">{data.description}</p>
        </div>

        <div className="cw-temp-row">
          <img src={iconUrl(data.icon)} alt={data.description} />
          <span className="cw-temp">{data.temp}°C</span>
        </div>

        <p className="cw-feels">
          Feels like <strong>{data.feelsLike}°C</strong> &nbsp;|&nbsp;
          H: {data.tempMax}° &nbsp; L: {data.tempMin}°
        </p>
      </div>

      {/* ---- right: detail grid ---- */}
      <div className="cw-details">
        <Detail icon={<WiHumidity />}    label="Humidity"    value={`${data.humidity}%`} />
        <Detail icon={<WiStrongWind />}  label="Wind"        value={`${msToKmh(data.windSpeed)} km/h ${windDirection(data.windDeg)}`} />
        <Detail icon={<WiBarometer />}   label="Pressure"    value={`${data.pressure} hPa`} />
        <Detail icon={<MdVisibility />}  label="Visibility"  value={`${data.visibility} km`} />
        <Detail icon={<WiCloud />}       label="Clouds"      value={`${data.clouds}%`} />
        <Detail icon={<WiSunrise />}     label="Sunrise"     value={toTimeString(data.sunrise, data.timezone)} />
        <Detail icon={<WiSunset />}      label="Sunset"      value={toTimeString(data.sunset, data.timezone)} />
      </div>
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="cw-detail-item">
      <span className="cw-detail-icon">{icon}</span>
      <div>
        <p className="cw-detail-label">{label}</p>
        <p className="cw-detail-value">{value}</p>
      </div>
    </div>
  );
}
