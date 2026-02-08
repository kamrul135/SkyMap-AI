/**
 * SearchBar – city search input with submit button
 */

import React, { useState } from "react";
import { WiDaySunny } from "react-icons/wi";

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-brand">
        <WiDaySunny size={32} />
        <span>AI Weather</span>
      </div>

      <div className="search-input-group">
        <input
          type="text"
          placeholder="Search any city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="City name"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading…" : "Search"}
        </button>
      </div>
    </form>
  );
}
