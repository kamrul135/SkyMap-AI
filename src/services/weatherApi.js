/**
 * ============================================================
 *  Weather API Service
 * ============================================================
 *  Handles all communication with the OpenWeather API.
 *  We use two endpoints:
 *    1. Current Weather  – gives live temperature, humidity, etc.
 *    2. One Call 3.0      – gives 7-day forecast + hourly data.
 *
 *  If One Call is not available on a free key we fall back to
 *  the 5-day / 3-hour forecast endpoint and reshape the data.
 * ============================================================
 */

import axios from "axios";

// --------------- configuration ---------------
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || "";
const BASE    = "https://api.openweathermap.org/data/2.5";

// --------------- helpers ---------------

/** Build a complete URL for a given endpoint */
const url = (path, params = {}) => {
  const query = new URLSearchParams({
    appid: API_KEY,
    units: "metric",          // Celsius by default
    ...params,
  }).toString();
  return `${BASE}${path}?${query}`;
};

/** Map an OpenWeather icon code to the full icon URL */
export const iconUrl = (code) =>
  `https://openweathermap.org/img/wn/${code}@2x.png`;

// ------------ public functions ------------

/**
 * Fetch current weather for a city name.
 * Returns a normalised object our components can consume directly.
 */
export async function fetchCurrentWeather(city) {
  const { data } = await axios.get(url("/weather", { q: city }));

  return {
    city: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,                 // m/s
    windDeg: data.wind.deg,
    visibility: data.visibility / 1000,          // km
    clouds: data.clouds.all,                     // %
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    dt: data.dt,
    timezone: data.timezone,
    coord: data.coord,                           // { lat, lon }
    rain: data.rain ? data.rain["1h"] || data.rain["3h"] || 0 : 0,
    snow: data.snow ? data.snow["1h"] || data.snow["3h"] || 0 : 0,
  };
}

/**
 * Fetch a 7-day forecast.
 *
 * Strategy:
 *   1. Try the One Call 3.0 endpoint (requires a paid / "One Call" subscription).
 *   2. If that fails (403 / 401), fall back to the free 5-day/3-hour endpoint
 *      and aggregate each day's data into a single daily object.
 */
export async function fetchForecast(lat, lon) {
  try {
    return await fetchOneCallForecast(lat, lon);
  } catch {
    return await fetchFiveDayForecast(lat, lon);
  }
}

// ---- One Call 3.0 (paid tier) ----
async function fetchOneCallForecast(lat, lon) {
  const oneCallUrl =
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}` +
    `&exclude=minutely,alerts&units=metric&appid=${API_KEY}`;

  const { data } = await axios.get(oneCallUrl);

  return data.daily.slice(0, 7).map((d) => ({
    dt: d.dt,
    tempDay: Math.round(d.temp.day),
    tempNight: Math.round(d.temp.night),
    tempMin: Math.round(d.temp.min),
    tempMax: Math.round(d.temp.max),
    humidity: d.humidity,
    windSpeed: d.wind_speed,
    description: d.weather[0].description,
    icon: d.weather[0].icon,
    pop: Math.round((d.pop || 0) * 100),         // precipitation probability %
    rain: d.rain || 0,
    uvi: d.uvi,
  }));
}

// ---- 5-day / 3-hour (free tier) ----
async function fetchFiveDayForecast(lat, lon) {
  const { data } = await axios.get(
    url("/forecast", { lat, lon, cnt: 40 })       // up to 5 days × 8 slots
  );

  // Group the 3-hour slots by calendar day
  const grouped = {};
  data.list.forEach((item) => {
    const day = new Date(item.dt * 1000).toISOString().slice(0, 10);
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(item);
  });

  // Convert each group to a single daily summary
  return Object.entries(grouped)
    .slice(0, 7)
    .map(([, slots]) => {
      const temps    = slots.map((s) => s.main.temp);
      const humids   = slots.map((s) => s.main.humidity);
      const winds    = slots.map((s) => s.wind.speed);
      const pops     = slots.map((s) => s.pop || 0);
      const rains    = slots.map((s) => (s.rain ? s.rain["3h"] || 0 : 0));

      // Pick the most frequent weather description
      const desc     = mostFrequent(slots.map((s) => s.weather[0].description));
      const icon     = slots[Math.floor(slots.length / 2)].weather[0].icon;

      return {
        dt: slots[0].dt,
        tempDay: Math.round(avg(temps)),
        tempNight: Math.round(Math.min(...temps)),
        tempMin: Math.round(Math.min(...temps)),
        tempMax: Math.round(Math.max(...temps)),
        humidity: Math.round(avg(humids)),
        windSpeed: +(avg(winds).toFixed(1)),
        description: desc,
        icon: icon.replace("n", "d"),             // always use day icon
        pop: Math.round(Math.max(...pops) * 100),
        rain: +(rains.reduce((a, b) => a + b, 0).toFixed(1)),
        uvi: null,                                 // not available on free tier
      };
    });
}

// ---- tiny util helpers ----
const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
const mostFrequent = (arr) => {
  const freq = {};
  arr.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
};
