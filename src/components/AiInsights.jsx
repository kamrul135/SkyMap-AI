/**
 * AiInsights – displays AI-generated weather suggestions
 *
 * v2.0 Changes:
 *  - Shows comfort score breakdown with weight & contribution
 *  - Displays reasoning behind each suggestion
 *  - Confidence badges on every recommendation
 *  - Dominant factor indicator
 */

import React, { useState } from "react";
import { comfortColor } from "../utils/helpers";

export default function AiInsights({ insights }) {
  if (!insights) return null;

  const {
    comfort,
    comfortBreakdown,
    dominantFactor,
    goOutside,
    umbrella,
    travel,
    uvAdvice,
    rainProbability,
    detailedScores,
  } = insights;

  return (
    <div className="card ai-insights">
      <h3 className="section-title">🤖 AI Weather Insights</h3>

      {/* ── comfort gauge ── */}
      <div className="ai-comfort">
        <div
          className="comfort-ring"
          style={{
            "--score": comfort,
            "--color": comfortColor(comfort),
          }}
        >
          <span>{comfort}</span>
        </div>
        <p className="comfort-label">Comfort Score</p>
        {dominantFactor && (
          <p className="dominant-factor">
            ⚡ {dominantFactor.reason}
          </p>
        )}
      </div>

      {/* ── score breakdown (explainable) ── */}
      {comfortBreakdown && (
        <div className="ai-breakdown">
          <p className="breakdown-title">Score Breakdown</p>
          {comfortBreakdown.map((entry) => (
            <BreakdownRow key={entry.factor} entry={entry} />
          ))}
        </div>
      )}

      {/* ── legacy score bars (simple view) ── */}
      <div className="ai-scores">
        <ScoreBar label="Temperature" value={detailedScores.temperature} />
        <ScoreBar label="Humidity" value={detailedScores.humidity} />
        <ScoreBar label="Wind" value={detailedScores.wind} />
        <ScoreBar label="Visibility" value={detailedScores.visibility} />
      </div>

      {/* ── suggestion cards ── */}
      <div className="ai-suggestions">
        <Suggestion
          title="Should I go outside?"
          emoji={goOutside.emoji}
          text={goOutside.text}
          level={goOutside.level}
          confidence={goOutside.confidence}
          reasoning={goOutside.reasoning}
        />
        <Suggestion
          title="Do I need an umbrella?"
          emoji={umbrella.emoji}
          text={umbrella.text}
          level={umbrella.needed ? "warn" : "ok"}
          confidence={umbrella.confidence}
          reasoning={umbrella.reasoning}
        />
        <Suggestion
          title="Is it good for travel?"
          emoji={travel.emoji}
          text={travel.text}
          level={travel.suitable ? "ok" : "warn"}
          confidence={travel.confidence}
          reasoning={travel.reasoning}
        />
        {uvAdvice && (
          <Suggestion
            title="UV Protection"
            emoji="☀️"
            text={uvAdvice.text}
            level={uvAdvice.level === "low" ? "ok" : "warn"}
            confidence={uvAdvice.confidence}
            reasoning={uvAdvice.reasoning}
          />
        )}
      </div>

      <p className="ai-rain-note">
        🌧️ Rain probability today: <strong>{rainProbability}%</strong>
      </p>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────

function Suggestion({ title, emoji, text, level, confidence, reasoning }) {
  const [showReasoning, setShowReasoning] = useState(false);

  const cls =
    level === "yes" || level === "ok"
      ? "sug-good"
      : level === "no" || level === "warn"
      ? "sug-bad"
      : "sug-neutral";

  return (
    <div className={`ai-sug ${cls}`}>
      <span className="sug-emoji">{emoji}</span>
      <div className="sug-body">
        <div className="sug-header">
          <p className="sug-title">{title}</p>
          {confidence && (
            <span className={`conf-badge conf-${confidence}`}>
              {confidence}
            </span>
          )}
        </div>
        <p className="sug-text">{text}</p>
        {reasoning && reasoning.length > 0 && (
          <button
            className="reasoning-toggle"
            onClick={() => setShowReasoning(!showReasoning)}
          >
            {showReasoning ? "Hide reasoning ▲" : "Why? ▼"}
          </button>
        )}
        {showReasoning && reasoning && (
          <ul className="reasoning-list">
            {reasoning.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function BreakdownRow({ entry }) {
  return (
    <div className="breakdown-row">
      <div className="bd-header">
        <span className="bd-factor">{entry.factor}</span>
        <span className="bd-ideal">ideal: {entry.idealRange}</span>
      </div>
      <div className="bd-bar-row">
        <div className="sb-track">
          <div
            className="sb-fill"
            style={{
              width: `${entry.score}%`,
              backgroundColor: comfortColor(entry.score),
            }}
          />
        </div>
        <span className="bd-contribution">
          +{entry.contribution.toFixed(1)}
        </span>
      </div>
      <p className="bd-reason">{entry.reason}</p>
    </div>
  );
}

function ScoreBar({ label, value }) {
  return (
    <div className="score-bar-row">
      <span className="sb-label">{label}</span>
      <div className="sb-track">
        <div
          className="sb-fill"
          style={{
            width: `${value}%`,
            backgroundColor: comfortColor(value),
          }}
        />
      </div>
      <span className="sb-val">{value}</span>
    </div>
  );
}
