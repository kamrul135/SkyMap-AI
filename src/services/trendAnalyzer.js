/**
 * ============================================================
 *  Weather Trend Analyzer
 * ============================================================
 *  Analyses the 7-day forecast to detect patterns, trends,
 *  and actionable insights that go beyond current conditions.
 *
 *  Produces:
 *    • Temperature trend  (warming / cooling / stable)
 *    • Rain outlook       (dry spell / rainy period / mixed)
 *    • Best outdoor day   (pick the best day for activities)
 *    • Weekend forecast    (quick summary for planning)
 *    • Weather alerts      (heat-wave, cold snap, storm watch)
 *    • Activity windows    (best time-slots for specific activities)
 *
 *  Every insight includes:
 *    - emoji    → quick visual cue
 *    - title    → one-line summary
 *    - detail   → 1-2 sentence explanation
 *    - confidence → "high" | "medium" | "low"
 *
 * ============================================================
 */

// ============================================================
//  Main public function
// ============================================================

/**
 * Analyse 7-day forecast data and return trend-based insights.
 *
 * @param {Array}  forecast – normalised daily forecast array
 * @param {Object} current  – current weather (for context)
 * @returns {Object} trends
 */
export function analyseWeatherTrends(forecast = [], current = null) {
  if (!forecast || forecast.length < 2) {
    return { available: false, insights: [] };
  }

  const insights = [];

  // ── Temperature trend ──
  insights.push(detectTempTrend(forecast));

  // ── Rain pattern ──
  insights.push(detectRainPattern(forecast));

  // ── Best outdoor day ──
  insights.push(findBestOutdoorDay(forecast));

  // ── Weekend outlook ──
  const weekendInsight = weekendOutlook(forecast);
  if (weekendInsight) insights.push(weekendInsight);

  // ── Severe weather alerts ──
  const alerts = detectAlerts(forecast, current);
  insights.push(...alerts);

  // ── Activity recommendations ──
  insights.push(activityRecommendation(forecast, current));

  return {
    available: true,
    insights: insights.filter(Boolean),
    summary: generateTrendSummary(forecast, current),
  };
}

// ============================================================
//  Trend detectors
// ============================================================

function detectTempTrend(forecast) {
  const temps = forecast.map((d) => d.tempDay ?? d.tempMax);
  const firstHalf = avg(temps.slice(0, Math.ceil(temps.length / 2)));
  const secondHalf = avg(temps.slice(Math.ceil(temps.length / 2)));
  const diff = secondHalf - firstHalf;

  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = maxTemp - minTemp;

  if (diff > 4) {
    return {
      id: "temp-trend",
      emoji: "📈",
      title: "Warming Trend Ahead",
      detail: `Temperatures are expected to rise by ~${Math.round(diff)}°C over the next few days. Highs could reach ${maxTemp}°C.`,
      type: "trend",
      confidence: diff > 6 ? "high" : "medium",
    };
  }
  if (diff < -4) {
    return {
      id: "temp-trend",
      emoji: "📉",
      title: "Cooling Trend Ahead",
      detail: `Expect a drop of ~${Math.round(Math.abs(diff))}°C. Lows may reach ${minTemp}°C — dress warmly.`,
      type: "trend",
      confidence: Math.abs(diff) > 6 ? "high" : "medium",
    };
  }
  return {
    id: "temp-trend",
    emoji: "➡️",
    title: "Stable Temperatures",
    detail: `Temperatures will stay between ${minTemp}°C and ${maxTemp}°C (${range}°C range). Consistent conditions ahead.`,
    type: "trend",
    confidence: range < 5 ? "high" : "medium",
  };
}

function detectRainPattern(forecast) {
  const rainyDays = forecast.filter((d) => d.pop >= 50).length;
  const totalDays = forecast.length;
  const totalRain = forecast.reduce((sum, d) => sum + (d.rain || 0), 0);

  if (rainyDays === 0) {
    return {
      id: "rain-pattern",
      emoji: "☀️",
      title: "Dry Spell Expected",
      detail: `No significant rain in the next ${totalDays} days. Great for outdoor planning!`,
      type: "pattern",
      confidence: "high",
    };
  }
  if (rainyDays >= totalDays * 0.6) {
    return {
      id: "rain-pattern",
      emoji: "🌧️",
      title: "Rainy Period Ahead",
      detail: `Rain expected on ${rainyDays} of the next ${totalDays} days (~${Math.round(totalRain)}mm total). Keep an umbrella handy.`,
      type: "pattern",
      confidence: rainyDays >= totalDays * 0.8 ? "high" : "medium",
    };
  }
  return {
    id: "rain-pattern",
    emoji: "🌦️",
    title: "Mixed Conditions",
    detail: `Rain likely on ${rainyDays} out of ${totalDays} days. Check daily before heading out.`,
    type: "pattern",
    confidence: "medium",
  };
}

function findBestOutdoorDay(forecast) {
  if (forecast.length === 0) return null;

  // Score each day for outdoor suitability
  const scored = forecast.map((day, idx) => {
    const temp = day.tempDay ?? day.tempMax;
    const tempScore = temp >= 18 && temp <= 28 ? 100 : temp >= 10 && temp <= 35 ? 60 : 20;
    const rainScore = Math.max(0, 100 - (day.pop || 0));
    const windScore = (day.windSpeed || 0) < 5 ? 100 : (day.windSpeed || 0) < 10 ? 60 : 20;

    return {
      idx,
      day,
      score: tempScore * 0.4 + rainScore * 0.4 + windScore * 0.2,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  const dayLabel = best.idx === 0 ? "Today" : dayName(best.day.dt);
  const temp = best.day.tempDay ?? best.day.tempMax;

  return {
    id: "best-day",
    emoji: "🏆",
    title: `Best Day: ${dayLabel}`,
    detail: `${dayLabel} scores highest for outdoor activities — ${temp}°C, ${best.day.pop || 0}% rain chance. Plan accordingly!`,
    type: "recommendation",
    confidence: best.score > 80 ? "high" : best.score > 60 ? "medium" : "low",
  };
}

function weekendOutlook(forecast) {
  // Find Saturday & Sunday in the forecast
  const weekendDays = forecast.filter((d) => {
    const dow = new Date(d.dt * 1000).getDay();
    return dow === 0 || dow === 6; // Sunday = 0, Saturday = 6
  });

  if (weekendDays.length === 0) return null;

  const avgTemp = avg(weekendDays.map((d) => d.tempDay ?? d.tempMax));
  const maxPop = Math.max(...weekendDays.map((d) => d.pop || 0));
  const hasRain = maxPop > 40;

  return {
    id: "weekend",
    emoji: hasRain ? "🌂" : "🎉",
    title: `Weekend: ${hasRain ? "Rain Possible" : "Looking Good!"}`,
    detail: hasRain
      ? `Weekend temps around ${Math.round(avgTemp)}°C with up to ${maxPop}% rain chance. Have a backup indoor plan.`
      : `Weekend should be pleasant at ~${Math.round(avgTemp)}°C with low rain risk. Enjoy outdoor activities!`,
    type: "outlook",
    confidence: weekendDays.length >= 2 ? "medium" : "low",
  };
}

function detectAlerts(forecast, current) {
  const alerts = [];
  const temps = forecast.map((d) => d.tempMax);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...forecast.map((d) => d.tempMin));

  // Heat wave: 3+ consecutive days above 35°C
  let heatStreak = 0;
  for (const d of forecast) {
    if (d.tempMax >= 35) heatStreak++;
    else heatStreak = 0;
    if (heatStreak >= 3) {
      alerts.push({
        id: "heat-wave",
        emoji: "🔥",
        title: "Heat Wave Warning",
        detail: `3+ consecutive days above 35°C expected (peak: ${maxTemp}°C). Stay hydrated and avoid midday sun.`,
        type: "alert",
        confidence: "high",
      });
      break;
    }
  }

  // Cold snap: temp drops more than 10°C in 2 days
  for (let i = 1; i < forecast.length; i++) {
    const drop = (forecast[i - 1].tempMax) - (forecast[i].tempMax);
    if (drop >= 10) {
      alerts.push({
        id: "cold-snap",
        emoji: "🥶",
        title: "Sudden Cold Snap",
        detail: `Temperature dropping ~${Math.round(drop)}°C between ${dayName(forecast[i - 1].dt)} and ${dayName(forecast[i].dt)}. Prepare warm clothing.`,
        type: "alert",
        confidence: "high",
      });
      break;
    }
  }

  // Storm watch: any day with high pop + high wind
  const stormDays = forecast.filter((d) => d.pop >= 70 && (d.windSpeed || 0) > 8);
  if (stormDays.length > 0) {
    const stormDay = stormDays[0];
    alerts.push({
      id: "storm-watch",
      emoji: "⛈️",
      title: "Storm Watch",
      detail: `${dayName(stormDay.dt)} shows high rain chance (${stormDay.pop}%) with strong winds. Consider rescheduling outdoor plans.`,
      type: "alert",
      confidence: "medium",
    });
  }

  return alerts;
}

function activityRecommendation(forecast, current) {
  const bestRunDay = forecast.find(
    (d) => (d.tempDay ?? d.tempMax) >= 10 && (d.tempDay ?? d.tempMax) <= 25 && d.pop < 30 && (d.windSpeed || 0) < 8
  );

  const activities = [];

  if (current) {
    const t = current.temp;
    if (t >= 15 && t <= 30 && (current.rain || 0) === 0) activities.push("jogging 🏃");
    if (t >= 20 && t <= 35 && (current.rain || 0) === 0) activities.push("cycling 🚴");
    if (t >= 5 && t <= 25) activities.push("hiking 🥾");
    if (current.windSpeed < 5 && t >= 15) activities.push("picnic 🧺");
    if (t < 0 && (current.snow || 0) > 0) activities.push("skiing ⛷️");
  }

  if (activities.length === 0) activities.push("indoor workouts 🏋️");

  return {
    id: "activities",
    emoji: "🎯",
    title: "Suggested Activities",
    detail: `Based on current & forecast conditions: ${activities.join(", ")}. ${
      bestRunDay
        ? `Best running day: ${dayName(bestRunDay.dt)} (${bestRunDay.tempDay ?? bestRunDay.tempMax}°C, ${bestRunDay.pop}% rain).`
        : ""
    }`,
    type: "recommendation",
    confidence: activities.length > 2 ? "high" : "medium",
  };
}

// ============================================================
//  Summary generator
// ============================================================

function generateTrendSummary(forecast, current) {
  const temps = forecast.map((d) => d.tempDay ?? d.tempMax);
  const avgTemp = Math.round(avg(temps));
  const rainyDays = forecast.filter((d) => d.pop >= 50).length;

  let outlook = "";
  if (rainyDays === 0) outlook = "Clear skies dominate the week.";
  else if (rainyDays <= 2) outlook = "Mostly dry with occasional rain.";
  else outlook = "A wet week ahead — plan accordingly.";

  const tempTrend =
    temps[temps.length - 1] - temps[0] > 3
      ? "warming"
      : temps[temps.length - 1] - temps[0] < -3
      ? "cooling"
      : "steady";

  return {
    text: `${outlook} Average high: ${avgTemp}°C, trend: ${tempTrend}.`,
    avgTemp,
    rainyDays,
    totalDays: forecast.length,
    tempTrend,
  };
}

// ============================================================
//  Helpers
// ============================================================

function avg(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function dayName(unix) {
  return new Date(unix * 1000).toLocaleDateString("en-US", { weekday: "short" });
}
