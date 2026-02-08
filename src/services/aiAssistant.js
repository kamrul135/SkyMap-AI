/**
 * ============================================================
 *  AI Weather Assistant — Conversational Interface
 * ============================================================
 *  A natural language interface that interprets user questions
 *  and responds using weather data + the explainable AI engine.
 *
 *  Example queries:
 *    "Should I go out in the evening?"
 *    "What should I wear tomorrow?"
 *    "Is it safe to travel today?"
 *    "Do I need an umbrella?"
 *    "Will it rain this weekend?"
 *
 *  This layer:
 *    • Parses user intent from natural language
 *    • Routes to the appropriate AI decision function
 *    • Returns conversational, human-like responses
 *    • Never mentions APIs or technical details
 *    • Keeps answers short, confident, and actionable
 *
 * ============================================================
 */

// ============================================================
//  Intent Detection
// ============================================================

const INTENT_PATTERNS = {
  goOutside: [
    /should.*go out/i,
    /can.*go out/i,
    /good.*outside/i,
    /safe.*outside/i,
    /weather.*outside/i,
    /outdoor activities/i,
  ],
  umbrella: [
    /umbrella/i,
    /rain.*today/i,
    /will.*rain/i,
    /bring.*rain/i,
    /wet.*today/i,
  ],
  travel: [
    /travel/i,
    /drive/i,
    /commute/i,
    /road.*trip/i,
    /safe.*drive/i,
    /traffic.*weather/i,
  ],
  outfit: [
    /what.*wear/i,
    /should.*wear/i,
    /outfit/i,
    /clothing/i,
    /dress.*today/i,
    /jacket/i,
  ],
  comfort: [
    /comfortable/i,
    /comfort/i,
    /how.*feel/i,
    /pleasant/i,
  ],
  weekend: [
    /weekend/i,
    /saturday/i,
    /sunday/i,
    /this.*weekend/i,
  ],
  tomorrow: [
    /tomorrow/i,
    /next.*day/i,
  ],
  uvSun: [
    /sun/i,
    /uv/i,
    /sunscreen/i,
    /sunburn/i,
  ],
};

function detectIntent(question) {
  const q = question.toLowerCase();
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(q))) {
      return intent;
    }
  }
  return "general"; // fallback
}

// ============================================================
//  Response Generator
// ============================================================

/**
 * Main entry point: answer a user's question conversationally.
 *
 * @param {string} question - User's natural language question
 * @param {Object} insights - AI insights from the engine
 * @param {Object} trends - Trend analysis (optional)
 * @param {Object} current - Current weather data
 * @param {Array} forecast - 7-day forecast
 * @returns {string} - Conversational response
 */
export function askAssistant(question, insights, trends, current, forecast) {
  if (!question || !insights || !current) {
    return "I need weather data to answer that. Search for a city first!";
  }

  const intent = detectIntent(question);

  switch (intent) {
    case "goOutside":
      return answerGoOutside(insights, current);

    case "umbrella":
      return answerUmbrella(insights, current);

    case "travel":
      return answerTravel(insights, current);

    case "outfit":
      return answerOutfit(insights, current);

    case "comfort":
      return answerComfort(insights, current);

    case "weekend":
      return answerWeekend(trends, forecast);

    case "tomorrow":
      return answerTomorrow(forecast, insights);

    case "uvSun":
      return answerUV(insights, current);

    case "general":
    default:
      return answerGeneral(insights, current);
  }
}

// ============================================================
//  Intent-specific response generators
// ============================================================

function answerGoOutside(insights, current) {
  const { goOutside, comfort } = insights;
  const temp = current.temp;

  let response = "";

  if (goOutside.level === "yes") {
    response = `Yes! ${goOutside.text}`;
  } else if (goOutside.level === "no") {
    response = `I'd recommend staying inside. ${goOutside.text}`;
  } else {
    response = `It's okay to go out, but be prepared. ${goOutside.text}`;
  }

  // Add comfort context
  if (comfort >= 70) {
    response += ` Comfort is ${comfort}/100 — feels great out there!`;
  } else if (comfort < 45) {
    response += ` Comfort is only ${comfort}/100, so conditions aren't ideal.`;
  }

  return response;
}

function answerUmbrella(insights, current) {
  const { umbrella, rainProbability } = insights;

  if (umbrella.needed) {
    return `Yes, bring an umbrella. ${umbrella.text} (${rainProbability}% chance of rain)`;
  }
  return `No umbrella needed. ${umbrella.text}`;
}

function answerTravel(insights, current) {
  const { travel, comfort } = insights;

  if (!travel.suitable) {
    return `I'd avoid travel today. ${travel.text}`;
  }
  if (comfort >= 70) {
    return `Great day for travel! ${travel.text}`;
  }
  return `Travel is fine, but ${travel.text.toLowerCase()}`;
}

function answerOutfit(insights, current) {
  const { outfit } = insights;
  const temp = current.feelsLike;

  const topItems = outfit.slice(0, 3); // Show top 3 items
  const items = topItems.map((item) => {
    return typeof item === "string" ? item : item.text;
  });

  return `For ${temp}°C weather, wear: ${items.join(", ")}. ${
    outfit.length > 3 ? `Plus ${outfit.length - 3} more items — check the full list below.` : ""
  }`;
}

function answerComfort(insights, current) {
  const { comfort, dominantFactor, comfortBreakdown } = insights;
  const temp = current.temp;

  let feeling = "";
  if (comfort >= 80) feeling = "really comfortable";
  else if (comfort >= 60) feeling = "comfortable";
  else if (comfort >= 40) feeling = "okay";
  else feeling = "uncomfortable";

  let response = `It's ${feeling} outside (${comfort}/100 comfort score). Currently ${temp}°C.`;

  if (dominantFactor) {
    response += ` ${dominantFactor.reason}`;
  }

  return response;
}

function answerWeekend(trends, forecast) {
  if (!trends || !trends.available) {
    return answerFallbackForecast(forecast, [0, 6]); // Sat/Sun if within 7 days
  }

  const weekendInsight = trends.insights.find((i) => i.id === "weekend");
  if (weekendInsight) {
    return `${weekendInsight.title}: ${weekendInsight.detail}`;
  }

  return answerFallbackForecast(forecast, [0, 6]);
}

function answerTomorrow(forecast, insights) {
  if (!forecast || forecast.length < 2) {
    return "I don't have tomorrow's forecast data yet.";
  }

  const tomorrow = forecast[1];
  const tempRange = `${tomorrow.tempMin}–${tomorrow.tempMax}°C`;
  const rain = tomorrow.pop;

  let response = `Tomorrow: ${tomorrow.description}, ${tempRange}.`;

  if (rain >= 60) {
    response += ` High chance of rain (${rain}%) — bring an umbrella.`;
  } else if (rain >= 30) {
    response += ` Some rain possible (${rain}%).`;
  } else {
    response += ` Mostly dry (${rain}% rain chance).`;
  }

  return response;
}

function answerUV(insights, current) {
  const { uvAdvice } = insights;

  if (!uvAdvice) {
    return "UV data isn't available for this location.";
  }

  return `${uvAdvice.text} Stay safe in the sun!`;
}

function answerGeneral(insights, current) {
  const { comfort, goOutside, umbrella } = insights;
  const temp = current.temp;
  const desc = current.description;

  let response = `Right now: ${desc}, ${temp}°C. Comfort: ${comfort}/100. `;

  if (goOutside.level === "yes") {
    response += "Great time to head outside!";
  } else if (goOutside.level === "no") {
    response += "I'd stay indoors if possible.";
  } else {
    response += "Conditions are manageable.";
  }

  if (umbrella.needed) {
    response += " Don't forget an umbrella!";
  }

  return response;
}

function answerFallbackForecast(forecast, dayIndices) {
  if (!forecast || forecast.length === 0) return "Forecast data not available.";

  const days = dayIndices
    .map((i) => forecast[i])
    .filter(Boolean)
    .map((d) => `${d.tempMin}–${d.tempMax}°C, ${d.pop}% rain`)
    .join("; ");

  return days ? `Forecast: ${days}` : "Weekend forecast not available yet.";
}

// ============================================================
//  Quick Decision API (for UI buttons/toggles)
// ============================================================

/**
 * Get a quick yes/no/maybe decision for common questions.
 * Returns { answer: string, confidence: string, reason: string }
 */
export function quickDecision(question, insights) {
  const intent = detectIntent(question);

  switch (intent) {
    case "goOutside":
      return {
        answer: insights.goOutside.level === "yes" ? "Yes" : insights.goOutside.level === "no" ? "No" : "Maybe",
        confidence: insights.goOutside.confidence,
        reason: insights.goOutside.text,
      };

    case "umbrella":
      return {
        answer: insights.umbrella.needed ? "Yes" : "No",
        confidence: insights.umbrella.confidence,
        reason: insights.umbrella.text,
      };

    case "travel":
      return {
        answer: insights.travel.suitable ? "Yes" : "No",
        confidence: insights.travel.confidence,
        reason: insights.travel.text,
      };

    default:
      return {
        answer: "Ask me",
        confidence: "medium",
        reason: "I can answer questions about going outside, umbrellas, travel, outfits, and more!",
      };
  }
}
