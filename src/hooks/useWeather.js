/**
 * ============================================================
 *  useWeather – custom React hook
 * ============================================================
 *  Encapsulates all data-fetching & AI analysis logic so
 *  components stay clean and presentational.
 *
 *  Usage:
 *    const { current, forecast, insights, trends, loading, error, search } = useWeather();
 *    search("London");
 * ============================================================
 */

import { useState, useCallback } from "react";
import { fetchCurrentWeather, fetchForecast } from "../services/weatherApi";
import { getFullAnalysis } from "../services/mlAdapter";

export default function useWeather() {
  const [current, setCurrent]   = useState(null);
  const [forecast, setForecast] = useState([]);
  const [insights, setInsights] = useState(null);
  const [trends, setTrends]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  /**
   * Search for a city – fetches current weather, forecast,
   * then runs the AI engine + trend analyser over the data.
   *
   * The mlAdapter routes to the current AI provider
   * (rule-based today, ML model tomorrow — zero UI changes).
   */
  const search = useCallback(async (city) => {
    if (!city) return;
    setLoading(true);
    setError(null);

    try {
      // 1) Current weather
      const cur = await fetchCurrentWeather(city);
      setCurrent(cur);

      // 2) 7-day forecast (uses lat/lon from the current response)
      const fc = await fetchForecast(cur.coord.lat, cur.coord.lon);
      setForecast(fc);

      // 3) Full AI analysis (insights + trends) via adapter
      const { insights: ai, trends: tr } = await getFullAnalysis(cur, fc);
      setInsights(ai);
      setTrends(tr);
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "City not found. Please check the spelling."
          : err.response?.status === 401
          ? "Invalid API key. Add your key to the .env file."
          : "Something went wrong. Please try again later.";
      setError(msg);
      setCurrent(null);
      setForecast([]);
      setInsights(null);
      setTrends(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { current, forecast, insights, trends, loading, error, search };
}
