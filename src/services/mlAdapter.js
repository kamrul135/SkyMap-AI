/**
 * ============================================================
 *  ML Adapter Layer — Scalable Architecture for Future AI
 * ============================================================
 *  This module acts as the **bridge** between the UI and any
 *  AI / ML backend. Right now it wraps the local rule-based
 *  engine, but it is designed so you can swap in:
 *
 *    • A TensorFlow.js model loaded in the browser
 *    • A REST call to a Python Flask / FastAPI ML server
 *    • An OpenAI / Gemini / Claude API call
 *    • A Hugging Face Inference endpoint
 *
 *  The rest of the app only imports from THIS file,
 *  so changing the AI source is a one-file change.
 *
 *  ┌──────────────────────────────────────────────┐
 *  │                  React UI                    │
 *  └──────────────┬───────────────────────────────┘
 *                 │  calls
 *  ┌──────────────▼───────────────────────────────┐
 *  │           mlAdapter.js  (this file)          │
 *  │  • getInsights()                             │
 *  │  • getTrendAnalysis()                        │
 *  │  • predictComfort()                          │
 *  └──────┬───────────────┬───────────────────────┘
 *         │ current       │ future
 *  ┌──────▼──────┐  ┌─────▼──────────────────┐
 *  │ Rule-based  │  │ TF.js / REST / LLM API │
 *  │ aiEngine.js │  │  (just swap imports)    │
 *  └─────────────┘  └────────────────────────-┘
 *
 *  HOW TO UPGRADE TO A REAL ML MODEL:
 *  ----------------------------------
 *  1. Create a new file, e.g. `services/mlModel.js`
 *  2. Export the same function signatures (analyseWeather, etc.)
 *  3. Change the import in THIS file from `./aiEngine` to `./mlModel`
 *  4. Done! Every component automatically uses the new model.
 *
 * ============================================================
 */

import { analyseWeather } from "./aiEngine";
import { analyseWeatherTrends } from "./trendAnalyzer";

// ── Provider enum (for future use) ──────────────────────────
export const AI_PROVIDERS = {
  LOCAL_RULES: "local-rules",
  TENSORFLOW_JS: "tensorflow-js",
  REST_API: "rest-api",
  LLM_API: "llm-api",
};

// Current provider — change this when upgrading
const CURRENT_PROVIDER = AI_PROVIDERS.LOCAL_RULES;

// ── Public API ──────────────────────────────────────────────

/**
 * Get full AI insights for current weather + forecast.
 * This is the single entry point the UI should call.
 *
 * @param {Object} current  – normalised current-weather object
 * @param {Array}  forecast – normalised 7-day forecast array
 * @returns {Object} { insights, trends, meta }
 */
export async function getFullAnalysis(current, forecast = []) {
  const startTime = performance.now();

  // ── Step 1: Core insights (rule-based today, ML tomorrow) ──
  const insights = await resolveInsights(current, forecast);

  // ── Step 2: Trend analysis over the forecast window ──
  const trends = analyseWeatherTrends(forecast, current);

  const elapsed = Math.round(performance.now() - startTime);

  return {
    insights,
    trends,
    meta: {
      provider: CURRENT_PROVIDER,
      version: "2.0.0",
      analysisTimeMs: elapsed,
      timestamp: Date.now(),
    },
  };
}

// ── Internal provider routing ───────────────────────────────

async function resolveInsights(current, forecast) {
  switch (CURRENT_PROVIDER) {
    case AI_PROVIDERS.LOCAL_RULES:
      return analyseWeather(current, forecast);

    case AI_PROVIDERS.TENSORFLOW_JS:
      // Future: import and call a TF.js model
      // return await tfModel.predict(featureVector(current, forecast));
      throw new Error("TensorFlow.js provider not yet implemented");

    case AI_PROVIDERS.REST_API:
      // Call Python ML API (Flask server)
      return await callPythonMLAPI(current, forecast);

    case AI_PROVIDERS.LLM_API:
      // Future: call OpenAI / Gemini for natural-language insights
      throw new Error("LLM API provider not yet implemented");

    default:
      return analyseWeather(current, forecast);
  }
}

/**
 * Call the Python Flask ML API for predictions.
 * 
 * Setup:
 *   1. Train model: cd ml-model && python train_model.py
 *   2. Start API: python api_server.py
 *   3. Change CURRENT_PROVIDER to REST_API above
 */
async function callPythonMLAPI(current, forecast) {
  const ML_API_URL = process.env.REACT_APP_ML_API_URL || 'http://localhost:5000';

  try {
    // Prepare features for the ML model
    const features = {
      temperature: current.temp,
      humidity: current.humidity,
      wind_speed: current.windSpeed,
      visibility: current.visibility,
      clouds: current.clouds,
      pressure: current.pressure,
      rain_1h: current.rain || 0,
    };

    // Call ML API
    const response = await fetch(`${ML_API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features),
    });

    if (!response.ok) {
      throw new Error(`ML API error: ${response.status}`);
    }

    const mlResult = await response.json();

    // Convert ML output to our standard insights format
    return convertMLToInsights(mlResult, current, forecast);
  } catch (error) {
    console.error('ML API call failed:', error);
    // Fallback to rule-based engine
    console.warn('Falling back to rule-based engine');
    return analyseWeather(current, forecast);
  }
}

/**
 * Convert ML API response to our standard insights format.
 * This ensures the UI doesn't need to change when switching providers.
 */
function convertMLToInsights(mlResult, current, forecast) {
  // Map ML comfort level to 0-100 score
  const comfortMap = {
    'High': 85,
    'Medium': 60,
    'Low': 35,
  };
  const comfort = comfortMap[mlResult.comfort_level] || 60;

  // Build comfort breakdown (simplified for ML model)
  const comfortBreakdown = [
    {
      factor: 'Temperature',
      score: current.temp >= 18 && current.temp <= 26 ? 100 : 60,
      weight: 0.35,
      contribution: comfort * 0.35,
      idealRange: '18–26°C',
      reason: `${current.temp}°C — ${mlResult.explanation.split('.')[0] || 'measured'}`,
    },
    {
      factor: 'Humidity',
      score: current.humidity >= 35 && current.humidity <= 60 ? 100 : 60,
      weight: 0.25,
      contribution: comfort * 0.25,
      idealRange: '35–60%',
      reason: `${current.humidity}% humidity`,
    },
    {
      factor: 'Wind Speed',
      score: current.windSpeed <= 5 ? 100 : 60,
      weight: 0.20,
      contribution: comfort * 0.20,
      idealRange: '0–5 m/s',
      reason: `${current.windSpeed} m/s wind speed`,
    },
    {
      factor: 'Rain Probability',
      score: Math.max(0, 100 - mlResult.rain_probability * 100),
      weight: 0.12,
      contribution: comfort * 0.12,
      idealRange: '0–20%',
      reason: `${Math.round(mlResult.rain_probability * 100)}% rain chance`,
    },
    {
      factor: 'Visibility',
      score: current.visibility >= 8 ? 100 : 60,
      weight: 0.08,
      contribution: comfort * 0.08,
      idealRange: '> 8 km',
      reason: `${current.visibility} km visibility`,
    },
  ];

  // Generate recommendations based on ML predictions
  const goOutside = mlResult.comfort_level === 'High'
    ? {
        emoji: '☀️',
        level: 'yes',
        text: 'Great weather! Perfect for outdoor activities.',
        confidence: 'high',
        reasoning: [`ML model: ${mlResult.comfort_level} comfort`, mlResult.explanation],
      }
    : mlResult.comfort_level === 'Low'
    ? {
        emoji: '😐',
        level: 'no',
        text: "Conditions aren't ideal for going outside.",
        confidence: 'medium',
        reasoning: [`ML model: ${mlResult.comfort_level} comfort`, mlResult.explanation],
      }
    : {
        emoji: '🙂',
        level: 'maybe',
        text: 'Decent weather. Going outside is fine with preparation.',
        confidence: 'medium',
        reasoning: [`ML model: ${mlResult.comfort_level} comfort`, mlResult.explanation],
      };

  const umbrella = {
    emoji: mlResult.will_rain ? '☂️' : '😎',
    needed: mlResult.will_rain,
    text: mlResult.will_rain
      ? `Bring an umbrella! ${Math.round(mlResult.rain_probability * 100)}% rain chance.`
      : `Skies look clear — no umbrella needed.`,
    confidence: mlResult.rain_probability > 0.7 ? 'high' : 'medium',
    reasoning: [
      `ML prediction: ${mlResult.will_rain ? 'Rain expected' : 'No rain'}`,
      `Probability: ${Math.round(mlResult.rain_probability * 100)}%`,
    ],
  };

  const travel = {
    emoji: mlResult.comfort_level === 'High' ? '✈️' : '⚠️',
    suitable: mlResult.comfort_level !== 'Low',
    text:
      mlResult.comfort_level === 'High'
        ? 'Great day for travel!'
        : 'Be cautious if travelling.',
    confidence: 'medium',
    reasoning: [`ML model: ${mlResult.comfort_level} comfort`],
  };

  // Use rule-based outfit recommendation (ML doesn't predict this yet)
  const { outfit, uvAdvice } = analyseWeather(current, forecast);

  return {
    comfort,
    comfortBreakdown,
    dominantFactor: {
      factor: 'Machine Learning',
      reason: `ML model predicts ${mlResult.comfort_level} comfort with ${
        Math.round(
          mlResult.comfort_probabilities[mlResult.comfort_level] * 100
        )
      }% confidence`,
    },
    goOutside,
    umbrella,
    travel,
    outfit,
    uvAdvice,
    rainProbability: Math.round(mlResult.rain_probability * 100),
    detailedScores: {
      temperature: comfortBreakdown[0].score,
      humidity: comfortBreakdown[1].score,
      wind: comfortBreakdown[2].score,
      visibility: comfortBreakdown[4].score,
    },
    mlMetadata: {
      provider: 'Python ML API',
      version: mlResult.model_version,
      comfort_probs: mlResult.comfort_probabilities,
      rain_prob: mlResult.rain_probability,
    },
  };
}

/**
 * Convert raw weather data into a flat feature vector
 * that an ML model would consume.
 *
 * This is a **reference implementation** — when you build
 * your real model, you'll adjust these features.
 *
 * @example
 *   featureVector(current)
 *   // → [22, 24, 60, 3.5, 10, 40, 15, 0, 0]
 */
export function featureVector(current) {
  return [
    current.temp,
    current.feelsLike,
    current.humidity,
    current.windSpeed,
    current.visibility,
    current.clouds,
    current.pressure,
    current.rain || 0,
    current.snow || 0,
  ];
}

/**
 * Feature names (matches the vector above).
 * Useful for model interpretability / SHAP charts.
 */
export const FEATURE_NAMES = [
  "temperature",
  "feelsLike",
  "humidity",
  "windSpeed",
  "visibility",
  "clouds",
  "pressure",
  "rain",
  "snow",
];
