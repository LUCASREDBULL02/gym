import React, { useEffect, useState } from "react";

const WEEKDAYS = ["M", "T", "O", "T", "F", "L", "S"];

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function dayMeta(entry) {
  if (!entry) {
    return { bg: "#020617", text: "#9ca3af", label: "" };
  }

  if (entry.energy === "high" && entry.strength === "high") {
    return { bg: "#22c55e", text: "#022c22", label: "PR-dag 🔥" };
  }

  if (entry.energy === "low" || entry.mental === "low") {
    return { bg: "#f97316", text: "#3b1d05", label: "Lugn dag 🌙" };
  }

  return { bg: "#ec4899", text: "#3b021c", label: "Normal 💪" };
}

export default function CycleTracker() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [checkins, setCheckins] = useState({});

  // 🔁 Ladda dagskänslor
  useEffect(() => {
    const load = () => {
      const saved =
        JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
      setCheckins(saved);
    };

    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const totalDays = daysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Cykel & Styrka 🌸</h3>
      <p className="small">
        Kalendern uppdateras automatiskt när du sparar “Klar för dagen”.
      </p>

      {/* Veckodagar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          fontSize: 12,
          opacity: 0.7,
          marginBottom: 4,
        }}
      >
        {WEEKDAYS.map((d) => (
          <div key={d} style={{ textAlign: "center" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Kalender */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
        }}
      >
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;

          const meta = dayMeta(checkins[key]);

          return (
            <div
              key={key}
              style={{
                padding: 8,
                borderRadius: 12,
                background: meta.bg,
                color: meta.text,
                textAlign: "center",
                fontSize: 12,
                minHeight: 56,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ fontWeight: 700 }}>{day}</div>
              <div style={{ fontSize: 10 }}>{meta.label}</div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: 10, fontSize: 11, opacity: 0.75 }}>
        🔥 PR-dag • 💪 Normal • 🌙 Lugn
      </div>
    </div>
  );
}
