// src/components/CycleTracker.jsx
import React, { useEffect, useState } from "react";

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});

  // 🔄 Läs in vid start
  useEffect(() => {
    loadCheckins();
  }, []);

  // 🔔 Lyssna på uppdateringar
  useEffect(() => {
    function handleUpdate() {
      loadCheckins();
    }

    window.addEventListener("bebi-checkin-updated", handleUpdate);
    return () =>
      window.removeEventListener("bebi-checkin-updated", handleUpdate);
  }, []);

  function loadCheckins() {
    const saved =
      JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
    setCheckins(saved);
  }

  function getColor(entry) {
    if (!entry) return "#1f2937"; // tom dag

    if (
      entry.energy === "high" &&
      entry.strength === "strong"
    )
      return "#22c55e"; // grön

    if (
      entry.energy === "low" ||
      entry.mental === "low"
    )
      return "#ef4444"; // röd

    return "#f59e0b"; // gul
  }

  // Visa senaste 30 dagarna
  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="card">
      <h3>📅 Cycle & dagsform</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
          marginTop: 12,
        }}
      >
        {days.map((date) => {
          const entry = checkins[date];
          return (
            <div
              key={date}
              title={
                entry
                  ? `Styrka: ${entry.strength}, Mental: ${entry.mental}, Energi: ${entry.energy}`
                  : "Ingen data"
              }
              style={{
                height: 36,
                borderRadius: 8,
                background: getColor(entry),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                color: "#fff",
                opacity: entry ? 1 : 0.4,
              }}
            >
              {date.slice(8, 10)}
            </div>
          );
        })}
      </div>

      <p className="small" style={{ marginTop: 10 }}>
        🟢 Stark dag &nbsp; 🟡 Neutral &nbsp; 🔴 Låg kapacitet
      </p>
    </div>
  );
}
