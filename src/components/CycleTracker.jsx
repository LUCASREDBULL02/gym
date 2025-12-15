// src/components/CycleTracker.jsx
import React, { useEffect, useState } from "react";

const FEEL_COLORS = {
  strong: "#ec4899",
  normal: "#f9a8d4",
  low: "#94a3b8",
};

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});

  // 🔄 Ladda från localStorage
  function loadCheckins() {
    const saved =
      JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
    setCheckins(saved);
  }

  // 🟢 Init + lyssna på event
  useEffect(() => {
    loadCheckins();

    function handleUpdate() {
      loadCheckins();
    }

    window.addEventListener("bebi-checkin-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("bebi-checkin-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // 📅 Visa senaste 14 dagar
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>📅 Cycle & Återhämtning</h3>

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
          const color = entry
            ? FEEL_COLORS[entry.strength] || "#e5e7eb"
            : "#020617";

          return (
            <div
              key={date}
              style={{
                padding: 8,
                borderRadius: 10,
                background: color,
                color: "#020617",
                fontSize: 11,
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {date.slice(8, 10)}
              </div>
              {entry && (
                <div style={{ fontSize: 10 }}>
                  ⚡ {entry.energy}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="small" style={{ marginTop: 10, opacity: 0.8 }}>
        Färg baseras på hur stark hon kände sig den dagen.
      </p>
    </div>
  );
}
