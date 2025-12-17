import React, { useEffect, useState } from "react";

const DAY_LABELS = ["M", "T", "O", "T", "F", "L", "S"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function strengthMeta(entry) {
  if (!entry) return { label: "Ingen data", color: "#1f2937", emoji: "•" };

  if (entry.energy === "high" && entry.strength === "strong") {
    return { label: "PR-läge", color: "#22c55e", emoji: "🔥" };
  }

  if (entry.energy === "low" || entry.mental === "low") {
    return { label: "Lugn dag", color: "#f97316", emoji: "🌙" };
  }

  return { label: "Normal träning", color: "#ec4899", emoji: "💪" };
}

export default function CycleTracker() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [checkins, setCheckins] = useState({});

  // 🔁 Läs daily checkins
  useEffect(() => {
    function load() {
      const stored =
        JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
      setCheckins(stored);
    }

    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Cykel & Styrka 🌸</h3>
      <p className="small">
        Kalendern uppdateras automatiskt när du sparar “Klar för dagen”.
      </p>

      {/* Veckodagar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", fontSize: 12, opacity: 0.7 }}>
        {DAY_LABELS.map((d) => (
          <div key={d} style={{ textAlign: "center" }}>{d}</div>
        ))}
      </div>

      {/* Kalender */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 6,
          marginTop: 6,
        }}
      >
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const entry = checkins[dateKey];
          const meta = strengthMeta(entry);

          return (
            <div
              key={dateKey}
              style={{
                padding: 6,
                borderRadius: 10,
                background: meta.color,
                color: "#020617",
                fontSize: 11,
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 700 }}>{day}</div>
              <div>{meta.emoji}</div>
              <div style={{ fontSize: 9 }}>{meta.label}</div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: 10, fontSize: 11, opacity: 0.8 }}>
        🔥 PR-läge • 💪 Normal • 🌙 Lugn dag
      </div>
    </div>
  );
}
