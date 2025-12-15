// src/components/CycleTracker.jsx
import React, { useEffect, useState } from "react";

function getCheckins() {
  try {
    return JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
  } catch {
    return {};
  }
}

function getDayColor(checkin) {
  if (!checkin) return "#1f2937"; // grå

  // Enkel analys
  if (
    checkin.energy === "high" &&
    checkin.strength === "strong"
  ) {
    return "#22c55e"; // grön = stark dag
  }

  if (
    checkin.energy === "low" ||
    checkin.mental === "low"
  ) {
    return "#ef4444"; // röd = låg dag
  }

  return "#ec4899"; // rosa = normal
}

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});

  // Läs vid mount
  useEffect(() => {
    setCheckins(getCheckins());
  }, []);

  // 🔔 Lyssna på uppdateringar
  useEffect(() => {
    function handleUpdate() {
      console.log("🔄 CycleTracker updated");
      setCheckins(getCheckins());
    }

    window.addEventListener("bebi-checkin-updated", handleUpdate);
    return () =>
      window.removeEventListener(
        "bebi-checkin-updated",
        handleUpdate
      );
  }, []);

  // Visa senaste 14 dagar
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      key,
      date: d.toLocaleDateString("sv-SE", {
        weekday: "short",
        day: "numeric",
      }),
      checkin: checkins[key],
    });
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>🌸 Cycle Tracker</h3>
      <p className="small">
        Färgerna baseras på hur hon känt sig dag för dag.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
          marginTop: 12,
        }}
      >
        {days.map((d) => (
          <div
            key={d.key}
            style={{
              background: getDayColor(d.checkin),
              borderRadius: 12,
              padding: 8,
              textAlign: "center",
              color: "#fff",
              fontSize: 11,
              minHeight: 60,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div>{d.date}</div>
            {d.checkin && (
              <div style={{ fontSize: 9, opacity: 0.85 }}>
                ⚡ {d.checkin.energy || "–"}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="small" style={{ marginTop: 10 }}>
        🟢 Stark dag &nbsp; 💖 Normal &nbsp; 🔴 Låg energi
      </div>
    </div>
  );
}
