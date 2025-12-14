import React, { useEffect, useState } from "react";

const ACCENT = "#ec4899";

export default function CycleTracker() {
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bebi_cycle_checkins") || "[]");
    setCheckins(data);
  }, []);

  const today = new Date();

  function getColor(day) {
    const entry = checkins.find((c) => c.date === day);
    if (!entry) return "#020617";

    if (entry.energy === "high" && entry.strength === "high") return "#f472b6";
    if (entry.energy === "low") return "#7c3aed";
    return "#334155";
  }

  const days = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (27 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div style={{ padding: 12 }}>
      <h3>Cycle Tracker 🌸</h3>

      <div style={grid}>
        {days.map((d) => (
          <div
            key={d}
            style={{
              ...cell,
              background: getColor(d),
              border: d === today.toISOString().slice(0, 10)
                ? `2px solid ${ACCENT}`
                : "1px solid #1f2933",
            }}
          >
            {d.slice(8, 10)}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, marginTop: 10, color: "#9ca3af" }}>
        Rosa = stark dag • Lila = låg energi • Grå = neutral
      </p>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: 6,
};

const cell = {
  height: 38,
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  color: "#fff",
};
