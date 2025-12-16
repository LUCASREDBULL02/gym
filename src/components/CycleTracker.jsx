// src/components/CycleTracker.jsx
import React, { useEffect, useState } from "react";

function getDayStatus(checkin) {
  if (!checkin) {
    return {
      color: "#334155",
      title: "Ingen data",
      emoji: "⚪",
      advice: "Ingen check-in gjord",
    };
  }

  // Enkel logik – lätt att justera senare
  if (checkin.energy === "low" || checkin.strength === "low") {
    return {
      color: "#64748b",
      title: "Låg energi",
      emoji: "🌙",
      advice: "Sänk volym, teknik eller vila",
    };
  }

  if (checkin.energy === "high" && checkin.strength === "strong") {
    return {
      color: "#7c3aed",
      title: "Peak / Starkast",
      emoji: "🔥",
      advice: "Perfekt för PR & tunga lyft",
    };
  }

  return {
    color: "#2563eb",
    title: "Stabil dag",
    emoji: "💪",
    advice: "Bra dag för normal träning",
  };
}

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
    setCheckins(saved);
  }, []);

  // Renderar 14 dagar från idag
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>📆 Cycle & Energi</h2>
      <p className="small">
        Kalendern uppdateras automatiskt baserat på hur du känt dig.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 10,
          marginTop: 12,
        }}
      >
        {days.map((date) => {
          const status = getDayStatus(checkins[date]);

          return (
            <div
              key={date}
              style={{
                background: status.color,
                padding: 12,
                borderRadius: 12,
                color: "white",
                boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.9 }}>{date}</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {status.emoji} {status.title}
              </div>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                {status.advice}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
