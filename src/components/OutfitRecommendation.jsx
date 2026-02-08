/**
 * OutfitRecommendation – shows the AI-generated clothing list
 *
 * v2.0: Each item now includes a `reason` explaining WHY
 * that item is recommended (explainable AI).
 */

import React from "react";

export default function OutfitRecommendation({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="card outfit-card">
      <h3 className="section-title">👗 Outfit Recommendation</h3>
      <ul className="outfit-list">
        {items.map((item, i) => (
          <li key={i} className="outfit-item" title={item.reason || ""}>
            <span className="outfit-text">
              {typeof item === "string" ? item : item.text}
            </span>
            {item.reason && (
              <span className="outfit-reason">{item.reason}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
