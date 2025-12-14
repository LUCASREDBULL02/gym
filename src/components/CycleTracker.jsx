import React, { useMemo } from "react";

const COLORS = {
  strong: "#f472b6",
  normal: "#c084fc",
  weak: "#64748b",
};

function getDays(count = 28) {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (count - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

export default function CycleTracker() {
  const entries =
    JSON.parse(localStorage.getItem("bebi_cycle_checkins")) || [];

  const map = useMemo(() => {
    const m = {};
    entries.forEach((e) => {
      m[e.date] = e;
    });
    return m;
  }, [entries]);

  const days = getDays(28);
const dailyCheckins = useMemo(() => {
  return JSON.parse(
    localStorage.getItem("bebi_daily_checkins")
  ) || [];
}, []);

  function getColor(day) {
    const e = map[day];
    if (!e) return "rgba(148,163,184,0.2)";
    if (e.energy === "low" || e.strength === "weak") return "#475569";
    if (e.energy === "high" && e.strength === "strong") return COLORS.strong;
    return COLORS.normal;
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>📅 Cykel & dagsform</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
          marginTop: 10,
        }}
      >
        {days.map((day) => {
          const e = map[day];
          return (
            <div
              key={day}
              title={
                e
                  ? `Styrka: ${e.strength}, Energi: ${e.energy}, Psykiskt: ${e.mental}`
                  : "Ingen data"
              }
              style={{
                height: 42,
                borderRadius: 10,
                background: getColor(day),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                color: "#020617",
                fontWeight: 600,
              }}
            >
              {day.slice(8, 10)}
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 12, marginTop: 12, color: "#9ca3af" }}>
        Färger baseras på styrka + energi. Psykiskt låg påverkar
        rekommendationer kommande dagar.
      </div>
    </div>
  );
}
