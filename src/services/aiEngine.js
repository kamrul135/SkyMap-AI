/**
 * ============================================================
 *  AI Decision Engine  v2.0 — Explainable & Weighted
 * ============================================================
 *
 *  WHAT CHANGED FROM v1:
 *  ---------------------
 *  1. Every decision now includes a `reasoning` array that
 *     explains *why* the AI made that recommendation.
 *     → Portfolio-ready: shows interviewers you understand
 *       explainable AI (XAI) principles.
 *
 *  2. Comfort score uses **named, documented weights** with
 *     a breakdown of each factor's contribution.
 *     → Makes the score transparent and auditable.
 *
 *  3. Confidence levels ("high" / "medium" / "low") on every
 *     recommendation show how certain the engine is.
 *
 *  4. The engine is structured so each function can be swapped
 *     with an ML model call — see mlAdapter.js for the plan.
 *
 *  EXAMPLE OUTPUT:
 *  ---------------
 *  {
 *    comfort: 78,
 *    comfortBreakdown: [
 *      { factor: "Temperature", score: 95, weight: 0.35, contribution: 33.25,
 *        reason: "22°C is in the ideal comfort range (18-26°C)" },
 *      { factor: "Humidity",    score: 70, weight: 0.20, contribution: 14.00,
 *        reason: "60% humidity is slightly above ideal (35-60%)" },
 *      ...
 *    ],
 *    goOutside: {
 *      emoji: "☀️", level: "yes",
 *      text: "Great weather! Perfect time to go outside.",
 *      confidence: "high",
 *      reasoning: [
 *        "Comfort score is 78 (good)",
 *        "Temperature 22°C is pleasant",
 *        "No precipitation expected"
 *      ]
 *    },
 *    ...
 *  }
 *
 * ============================================================
 */

// ============================================================
//  Comfort Score Weights — clearly documented
// ============================================================

/**
 * Each weight represents how much that factor matters
 * to overall human comfort. Adjust these if you want to
 * prioritise different factors.
 *
 * Evidence-based reasoning:
 *  - Temperature is the #1 factor affecting how comfortable
 *    people feel outdoors (thermal comfort research).
 *  - Humidity amplifies heat discomfort (heat index).
 *  - Wind chill makes cold worse, but also provides relief in heat.
 *  - Rain probability affects planning more than comfort itself.
 *  - Visibility rarely affects comfort unless very low.
 */
const COMFORT_WEIGHTS = {
  temperature: { weight: 0.35, label: "Temperature",     idealRange: "18–26°C"  },
  humidity:    { weight: 0.25, label: "Humidity",         idealRange: "35–60%"   },
  wind:        { weight: 0.20, label: "Wind Speed",       idealRange: "0–5 m/s"  },
  rain:        { weight: 0.12, label: "Rain Probability", idealRange: "0–20%"    },
  visibility:  { weight: 0.08, label: "Visibility",       idealRange: "> 8 km"   },
};

// ============================================================
//  Main public function
// ============================================================

/**
 * Analyse current weather data and return a full AI insights object.
 * Every recommendation is now **explainable** with reasoning.
 *
 * @param {Object} current – normalised current-weather object
 * @param {Array}  forecast – normalised 7-day forecast array
 * @returns {Object} explainable insights
 */
export function analyseWeather(current, forecast = []) {
  if (!current) return null;

  const temp       = current.temp;
  const feelsLike  = current.feelsLike;
  const humidity   = current.humidity;
  const windSpeed  = current.windSpeed;
  const rain       = current.rain || 0;
  const snow       = current.snow || 0;
  const clouds     = current.clouds;
  const visibility = current.visibility;
  const desc       = current.description.toLowerCase();

  // Today's forecast
  const todayForecast = forecast[0] || {};
  const pop = todayForecast.pop ?? estimateRainChance(desc, rain, clouds);

  // ── Individual scores with explanations ──────────────────
  const tempResult       = scoreTemperature(temp);
  const humidityResult   = scoreHumidity(humidity);
  const windResult       = scoreWind(windSpeed);
  const rainResult       = scoreRainProb(pop);
  const visibilityResult = scoreVisibility(visibility);

  // ── Comfort score with full breakdown ────────────────────
  const breakdown = [
    buildBreakdownEntry("temperature", tempResult),
    buildBreakdownEntry("humidity",    humidityResult),
    buildBreakdownEntry("wind",        windResult),
    buildBreakdownEntry("rain",        rainResult),
    buildBreakdownEntry("visibility",  visibilityResult),
  ];

  const comfort = Math.round(
    breakdown.reduce((sum, b) => sum + b.contribution, 0)
  );

  // Find the dominant factor (what matters most right now)
  const sorted = [...breakdown].sort((a, b) => {
    // Lowest score × highest weight = most impactful negatively
    return (a.score * a.weight) - (b.score * b.weight);
  });
  const dominantFactor = sorted[0];

  return {
    comfort,
    comfortBreakdown: breakdown,
    dominantFactor: {
      factor: dominantFactor.factor,
      reason: `${dominantFactor.factor} is the main factor affecting your comfort right now.`,
    },
    goOutside:       goOutsideAdvice(comfort, temp, windSpeed, rain, snow, desc),
    umbrella:        umbrellaAdvice(pop, rain, desc),
    travel:          travelAdvice(comfort, windSpeed, visibility, rain, snow, desc),
    outfit:          outfitRecommendation(temp, feelsLike, rain, snow, windSpeed, pop, desc),
    uvAdvice:        uvAdvice(todayForecast.uvi),
    rainProbability: pop,
    detailedScores: {
      temperature: tempResult.score,
      humidity:    humidityResult.score,
      wind:        windResult.score,
      visibility:  visibilityResult.score,
    },
  };
}


// ============================================================
//  Explainable scoring functions
// ============================================================

function scoreTemperature(temp) {
  const score = scoreBand(temp, -10, 0, 18, 26, 35, 50);
  let reason;
  if (temp >= 18 && temp <= 26)      reason = `${temp}°C is in the ideal comfort range (18–26°C)`;
  else if (temp > 26 && temp <= 35)  reason = `${temp}°C is warm — above the ideal range`;
  else if (temp > 35)                reason = `${temp}°C is dangerously hot — stay cool`;
  else if (temp >= 0 && temp < 18)   reason = `${temp}°C is cool — dress in layers`;
  else                               reason = `${temp}°C is very cold — risk of hypothermia`;
  return { score, reason };
}

function scoreHumidity(humidity) {
  const score = scoreBand(humidity, 0, 20, 35, 60, 80, 100);
  let reason;
  if (humidity >= 35 && humidity <= 60) reason = `${humidity}% humidity is comfortable`;
  else if (humidity > 60 && humidity <= 80) reason = `${humidity}% humidity feels muggy`;
  else if (humidity > 80) reason = `${humidity}% humidity is very high — expect sticky conditions`;
  else if (humidity >= 20) reason = `${humidity}% humidity is a bit dry — stay hydrated`;
  else reason = `${humidity}% humidity is very dry — use moisturiser`;
  return { score, reason };
}

function scoreWind(windSpeed) {
  const score = scoreBand(windSpeed, 0, 0, 0, 5, 10, 30);
  let reason;
  if (windSpeed <= 5) reason = `Wind at ${windSpeed} m/s is calm and pleasant`;
  else if (windSpeed <= 10) reason = `Wind at ${windSpeed} m/s is noticeable — light breeze`;
  else if (windSpeed <= 15) reason = `Wind at ${windSpeed} m/s is strong — hold onto your hat`;
  else reason = `Wind at ${windSpeed} m/s is dangerously high`;
  return { score, reason };
}

function scoreRainProb(pop) {
  const score = Math.max(0, 100 - pop);
  let reason;
  if (pop <= 10) reason = `Only ${pop}% rain chance — skies look clear`;
  else if (pop <= 30) reason = `${pop}% rain chance — slight possibility`;
  else if (pop <= 60) reason = `${pop}% rain chance — bring an umbrella`;
  else reason = `${pop}% rain chance — expect wet conditions`;
  return { score, reason };
}

function scoreVisibility(visibility) {
  const score = Math.min(100, (visibility / 10) * 100);
  let reason;
  if (visibility >= 8) reason = `${visibility} km visibility is excellent`;
  else if (visibility >= 4) reason = `${visibility} km visibility is moderate`;
  else if (visibility >= 1) reason = `${visibility} km visibility is poor — drive carefully`;
  else reason = `${visibility} km visibility is very low — foggy conditions`;
  return { score, reason };
}

function buildBreakdownEntry(key, result) {
  const w = COMFORT_WEIGHTS[key];
  return {
    factor: w.label,
    score: result.score,
    weight: w.weight,
    contribution: +(result.score * w.weight).toFixed(2),
    idealRange: w.idealRange,
    reason: result.reason,
  };
}


// ============================================================
//  Explainable advice generators
// ============================================================

function goOutsideAdvice(comfort, temp, wind, rain, snow, desc) {
  const reasoning = [];

  // Build reasoning chain
  if (comfort >= 70) reasoning.push(`Comfort score is ${comfort} (good)`);
  else if (comfort >= 45) reasoning.push(`Comfort score is ${comfort} (moderate)`);
  else reasoning.push(`Comfort score is ${comfort} (poor)`);

  if (temp >= 18 && temp <= 28) reasoning.push(`Temperature ${temp}°C is pleasant`);
  else if (temp > 28) reasoning.push(`Temperature ${temp}°C is hot — stay hydrated`);
  else if (temp < 5) reasoning.push(`Temperature ${temp}°C is cold — bundle up`);
  else reasoning.push(`Temperature is ${temp}°C`);

  if (rain > 0) reasoning.push(`Current rainfall: ${rain} mm`);
  if (snow > 0) reasoning.push(`Current snowfall: ${snow} mm`);
  if (wind > 10) reasoning.push(`Strong winds at ${wind} m/s`);
  if (rain === 0 && snow === 0) reasoning.push("No precipitation expected");

  // Decision logic
  if (snow > 2 || desc.includes("blizzard"))
    return { emoji: "🌨️", level: "no",    text: "Heavy snow outside — stay indoors if possible.",     confidence: "high", reasoning };
  if (rain > 5 || desc.includes("heavy rain") || desc.includes("thunderstorm"))
    return { emoji: "⛈️", level: "no",    text: "Heavy rain / storm expected. Best to stay inside.",   confidence: "high", reasoning };
  if (wind > 15)
    return { emoji: "💨", level: "no",    text: "Dangerously high winds. Avoid going outside.",       confidence: "high", reasoning };
  if (temp > 42)
    return { emoji: "🔥", level: "no",    text: "Extreme heat! Stay in air-conditioning.",             confidence: "high", reasoning };
  if (temp < -15)
    return { emoji: "🥶", level: "no",    text: "Extreme cold! Risk of frostbite — stay warm indoors.", confidence: "high", reasoning };
  if (comfort >= 70)
    return { emoji: "☀️", level: "yes",   text: "Great weather! Perfect time to go outside and enjoy.", confidence: "high", reasoning };
  if (comfort >= 45)
    return { emoji: "🙂", level: "maybe", text: "Decent weather. Going outside is fine with light preparation.", confidence: "medium", reasoning };
  return   { emoji: "😐", level: "maybe", text: "Conditions aren't ideal, but a short outing is okay.",  confidence: "low",  reasoning };
}

function umbrellaAdvice(pop, rain, desc) {
  const reasoning = [];

  reasoning.push(`Rain probability: ${pop}%`);
  if (rain > 0) reasoning.push(`Current rainfall: ${rain} mm`);
  if (desc.includes("rain")) reasoning.push(`Description mentions rain: "${desc}"`);
  if (desc.includes("thunderstorm")) reasoning.push("Thunderstorm detected in forecast");

  if (desc.includes("thunderstorm"))
    return { emoji: "⛈️", needed: true,  text: "Thunderstorms expected — definitely carry an umbrella and stay cautious.", confidence: "high", reasoning };
  if (pop >= 70 || rain > 2)
    return { emoji: "🌧️", needed: true,  text: "High chance of rain. Bring an umbrella!", confidence: "high", reasoning };
  if (pop >= 40)
    return { emoji: "🌦️", needed: true,  text: "Moderate rain chance. Better safe than sorry — pack an umbrella.", confidence: "medium", reasoning };
  if (pop >= 20)
    return { emoji: "🤔", needed: false, text: "Slight rain chance. A compact umbrella wouldn't hurt.", confidence: "low", reasoning };
  return   { emoji: "😎", needed: false, text: "Skies look clear — no umbrella needed.", confidence: "high", reasoning };
}

function travelAdvice(comfort, wind, visibility, rain, snow, desc) {
  const reasoning = [];
  const issues = [];

  if (visibility < 2) { issues.push("low visibility"); reasoning.push(`Visibility is only ${visibility} km`); }
  if (wind > 12)      { issues.push("strong winds");   reasoning.push(`Wind speed is ${wind} m/s`); }
  if (rain > 4)       { issues.push("heavy rain");     reasoning.push(`Rainfall: ${rain} mm`); }
  if (snow > 1)       { issues.push("snowfall");       reasoning.push(`Snowfall: ${snow} mm`); }
  if (desc.includes("fog")) { issues.push("fog");      reasoning.push("Foggy conditions detected"); }

  if (issues.length === 0) reasoning.push("No adverse travel conditions detected");
  reasoning.push(`Overall comfort: ${comfort}/100`);

  if (issues.length >= 2)
    return { emoji: "🚫", suitable: false, text: `Travel not recommended: ${issues.join(", ")}.`, confidence: "high", reasoning };
  if (issues.length === 1)
    return { emoji: "⚠️", suitable: false, text: `Be careful if travelling — ${issues[0]} reported.`, confidence: "medium", reasoning };
  if (comfort >= 65)
    return { emoji: "✈️", suitable: true,  text: "Great day for travel and outdoor activities!", confidence: "high", reasoning };
  return   { emoji: "👍", suitable: true,  text: "Conditions are acceptable for travel. Stay alert.", confidence: "medium", reasoning };
}

function outfitRecommendation(temp, feelsLike, rain, snow, wind, pop, desc) {
  const items = [];
  const t = feelsLike;

  // ── Base layer ──
  if (t <= 0)        items.push({ text: "🧥 Heavy winter coat / down jacket",  reason: `Feels like ${t}°C — maximum insulation needed` });
  else if (t <= 10)  items.push({ text: "🧥 Warm jacket or fleece",            reason: `Feels like ${t}°C — a warm layer is essential` });
  else if (t <= 18)  items.push({ text: "🧥 Light jacket or hoodie",           reason: `Feels like ${t}°C — a light layer keeps you comfortable` });
  else if (t <= 25)  items.push({ text: "👕 T-shirt or light top",             reason: `Feels like ${t}°C — light clothing is ideal` });
  else               items.push({ text: "👕 Light, breathable clothing",        reason: `Feels like ${t}°C — stay cool with breathable fabrics` });

  // ── Bottoms ──
  if (t <= 5)        items.push({ text: "👖 Thermal / insulated trousers",     reason: "Sub-5°C needs thermal insulation on legs" });
  else if (t <= 18)  items.push({ text: "👖 Jeans or long trousers",           reason: "Long trousers suit this temperature range" });
  else               items.push({ text: "🩳 Shorts or light trousers",         reason: "Warm enough for shorts" });

  // ── Rain gear ──
  if (pop >= 50 || rain > 1 || desc.includes("rain")) {
    items.push({ text: "☂️ Waterproof jacket or umbrella", reason: `${pop}% rain probability` });
    items.push({ text: "👟 Waterproof shoes / boots",      reason: "Keep feet dry in wet conditions" });
  }

  // ── Snow gear ──
  if (snow > 0 || desc.includes("snow")) {
    items.push({ text: "🥾 Insulated waterproof boots",    reason: "Snow on the ground requires waterproof insulation" });
    items.push({ text: "🧤 Gloves & warm hat",             reason: "Extremities lose heat fastest in snow" });
  }

  // ── Wind ──
  if (wind > 8) items.push({ text: "🧣 Windbreaker or scarf", reason: `Wind at ${wind} m/s — block the chill` });

  // ── Sun protection ──
  if (t > 25 && !desc.includes("rain") && !desc.includes("cloud")) {
    items.push({ text: "🕶️ Sunglasses",  reason: "Bright and warm — protect your eyes" });
    items.push({ text: "🧴 Sunscreen",    reason: "UV exposure risk on clear warm days" });
    items.push({ text: "🧢 Hat or cap",    reason: "Shield head from direct sunlight" });
  }

  // ── Cold accessories ──
  if (t <= 5) {
    if (!items.some((i) => i.text.includes("Gloves")))
      items.push({ text: "🧤 Gloves", reason: "Hands are vulnerable below 5°C" });
    items.push({ text: "🧣 Scarf & warm hat", reason: "Cover neck and head to retain body heat" });
  }

  return items;
}

function uvAdvice(uvi) {
  if (uvi == null) return null;
  const reasoning = [`UV index is ${uvi}`];
  if (uvi >= 11) return { level: "extreme",   text: "UV index is extreme! Avoid sun exposure.",       confidence: "high", reasoning };
  if (uvi >= 8)  return { level: "very-high",  text: "Very high UV — wear sunscreen SPF 50+.",        confidence: "high", reasoning };
  if (uvi >= 6)  return { level: "high",       text: "High UV — apply sunscreen and wear a hat.",     confidence: "high", reasoning };
  if (uvi >= 3)  return { level: "moderate",   text: "Moderate UV — sunscreen recommended.",          confidence: "medium", reasoning };
  return            { level: "low",         text: "Low UV — no special protection needed.",         confidence: "high", reasoning };
}


// ============================================================
//  Scoring helpers
// ============================================================

/**
 * Generic band-scorer:  returns 0-100 based on where `val` falls.
 * [bad-low .. ok-low .. ideal-low .. ideal-high .. ok-high .. bad-high]
 * Ideal range → 100,  falls linearly towards 0 at the extremes.
 */
function scoreBand(val, badLow, okLow, idealLow, idealHigh, okHigh, badHigh) {
  if (val >= idealLow && val <= idealHigh) return 100;
  if (val < idealLow) {
    if (val <= badLow)  return 0;
    if (val <= okLow)   return Math.round(((val - badLow) / (okLow - badLow)) * 40);
    return Math.round(40 + ((val - okLow) / (idealLow - okLow)) * 60);
  }
  // val > idealHigh
  if (val >= badHigh) return 0;
  if (val >= okHigh)  return Math.round(((badHigh - val) / (badHigh - okHigh)) * 40);
  return Math.round(40 + ((okHigh - val) / (okHigh - idealHigh)) * 60);
}

/** Estimate rain chance when we have no forecast pop value */
function estimateRainChance(desc, rain, clouds) {
  if (desc.includes("thunderstorm")) return 90;
  if (desc.includes("heavy rain"))   return 85;
  if (desc.includes("rain"))         return 70;
  if (desc.includes("drizzle"))      return 55;
  if (rain > 0)                      return 60;
  if (clouds > 80)                   return 30;
  if (clouds > 50)                   return 15;
  return 5;
}
