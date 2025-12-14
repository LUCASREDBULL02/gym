import React, { useEffect, useState } from "react";

export default function CycleTracker() {
  const [data, setData] = useState({});

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("cycle_reflections")) || {};
    setData(stored);
  }, []);

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  }).reverse();

  function getColor(entry) {
    if (!entry) return "#1f2937";
    if (entry.strength === "strong") return "#f472b6";
    if (entry.strength === "ok") return "#f9a8d4";
    return "#fecdd3";
  }

  return (
    <div>
      <h3>Cycle Tracker 🌸</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
        }}
      >
        {days.map((d) => (
          <div
            key={d}
            style={{
              padding: 8,
              borderRadius: 8,
              background: getColor(data[d]),
              fontSize: 11,
              textAlign: "center",
            }}
          >
            {d.slice(8, 10)}
          </div>
        ))}
      </div>
    </div>
  );
}
