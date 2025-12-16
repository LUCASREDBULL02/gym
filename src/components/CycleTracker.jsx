// src/components/CycleTracker.jsx
import React, { useEffect, useMemo, useState } from "react";

// Hjälpfunktioner
const energyScore = {
  low: 1,
  medium: 2,
  high: 3,
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getStatus(checkin) {
  if (!checkin) {
    return {
      label: "Ingen data",
      emoji: "⚪",
      color: "#334155",
      advice: "Ingen check-in",
      score: 0,
    };
  }

  const score =
    (energyScore[checkin.energy] || 0) +
    (checkin.strength === "strong" ? 2 : checkin.strength === "normal" ? 1 : 0);

  if (score <= 2) {
    return {
      label: "Låg energi",
      emoji: "🌙",
      color: "#64748b",
      advice: "Vila / teknik / låg volym",
      score,
    };
  }

  if (score >= 4) {
    return {
      label: "Peak",
      emoji: "🔥",
      color: "#7c3aed",
      advice: "PR-läge & tunga lyft",
      score,
    };
  }

  return {
    label: "Stabil",
    emoji: "💪",
    color: "#2563eb",
    advice: "Normal träning",
    score,
  };
}

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});
  const [viewDate, setViewDate] = useState(new Date());

 useEffect(() => {
  function load() {
    const saved =
      JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
    setCheckins(saved);
  }

  load(); // första laddningen

  window.addEventListener("storage", load);
  window.addEventListener("bebi-checkin-updated", load);

  return () => {
    window.removeEventListener("storage", load);
    window.removeEventListener("bebi-checkin-updated", load);
  };
}, []);

  // 🔮 Prediktion (senaste 3 dagarna)
  const prediction = useMemo(() => {
    const sorted = Object.entries(checkins)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-3);

    if (sorted.length < 2) return "Ingen tillräcklig data";

    const trend =
      getStatus(sorted.at(-1)[1]).score -
      getStatus(sorted[0][1]).score;

    if (trend > 0) return "🔮 Energin ser ut att stiga imorgon";
    if (trend < 0) return "🔮 Återhämtning rekommenderas imorgon";
    return "🔮 Stabil trend imorgon";
  }, [checkins]);

  // 📊 Energi-graf (7 dagar)
  const last7 = useMemo(() => {
    return Object.entries(checkins)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7);
  }, [checkins]);

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>📅 Cycle & Energi</h2>

      {/* Månadsväljare */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          className="btn"
          onClick={() =>
            setViewDate(new Date(year, month - 1, 1))
          }
        >
          ◀
        </button>
        <strong>
          {viewDate.toLocaleString("sv-SE", {
            month: "long",
            year: "numeric",
          })}
        </strong>
        <button
          className="btn"
          onClick={() =>
            setViewDate(new Date(year, month + 1, 1))
          }
        >
          ▶
        </button>
      </div>

      {/* 🔮 Prediktion */}
      <div className="card" style={{ marginBottom: 12 }}>
        <strong>{prediction}</strong>
      </div>

      {/* 📊 Energi-graf */}
      <div className="card" style={{ marginBottom: 12 }}>
        <strong>📊 Energi senaste 7 dagar</strong>
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          {last7.map(([date, data]) => {
            const s = getStatus(data);
            return (
              <div
                key={date}
                title={date}
                style={{
                  width: 20,
                  height: 20 + s.score * 10,
                  background: s.color,
                  borderRadius: 4,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* 📅 Kalender */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 10,
        }}
      >
        {days.map((date) => {
          const status = getStatus(checkins[date]);

          return (
            <div
              key={date}
              style={{
                background: status.color,
                padding: 12,
                borderRadius: 12,
                color: "white",
              }}
            >
              <div style={{ fontSize: 12 }}>{date}</div>
              <div style={{ fontWeight: 600 }}>
                {status.emoji} {status.label}
              </div>
              <div style={{ fontSize: 12 }}>{status.advice}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
