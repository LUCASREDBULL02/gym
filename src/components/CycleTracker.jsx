import React, { useEffect, useState } from "react";

const WEEKDAYS = ["M", "T", "O", "T", "F", "L", "S"];

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getDayStyle(entry) {
  if (!entry) {
    return {
      bg: "rgba(15,23,42,0.8)",
      emoji: "•",
      label: "",
    };
  }

  // 🔥 Stark dag
  if (entry.energy === "high" && entry.strength === "high") {
    return { bg: "#22c55e", emoji: "🔥", label: "PR-läge" };
  }

  // 🌙 Lugn dag
  if (entry.energy === "low" || entry.mental === "low") {
    return { bg: "#f97316", emoji: "🌙", label: "Lugn" };
  }

  // 💗 Normal
  return { bg: "#ec4899", emoji: "💗", label: "Normal" };
}

export default function CycleTracker() {
  const today = new Date();
  const [year] = useState(today.getFullYear());
  const [month] = useState(today.getMonth());
  const [checkins, setCheckins] = useState({});

  // 🔁 Läs sparade dagar
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
    setCheckins(stored);
  }, []);

  const totalDays = daysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Cykel & Styrka 🌸</h3>
      <p className="small">
        Kalendern uppdateras när du sparar <strong>Klar för dagen</strong>.
      </p>

      {/* Veckodagar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          marginBottom: 6,
          fontSize: 12,
          opacity: 0.7,
        }}
      >
        {WEEKDAYS.map((d) => (
          <div key={d} style={{ textAlign: "center" }}>
            {d}
          </div>
        ))}
      </div>

      {/* ORIGINAL-KALENDER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
        }}
      >
        {/* tomma rutor */}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;

          const entry = checkins[key];
          const style = getDayStyle(entry);

          return (
            <div
              key={key}
              style={{
                padding: 6,
                borderRadius: 12,
                background: style.bg,
                textAlign: "center",
                fontSize: 11,
                color: "#020617",
              }}
            >
              <div style={{ fontWeight: 700 }}>{day}</div>
              <div style={{ fontSize: 14 }}>{style.emoji}</div>
              {style.label && (
                <div style={{ fontSize: 9 }}>{style.label}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: 10, fontSize: 11, opacity: 0.8 }}>
        🔥 PR-läge • 💗 Normal • 🌙 Lugn dag
      </div>
    </div>
  );
}
