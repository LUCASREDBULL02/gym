import React, { useEffect, useState } from "react";

const COLORS = {
  strong: "#ec4899",
  normal: "#f9a8d4",
  low: "#fbcfe8",
};

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});

  // 🔄 Läs från localStorage
  const loadCheckins = () => {
    try {
      const data =
        JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
      setCheckins(data);
    } catch {
      setCheckins({});
    }
  };

  // 🔔 Lyssna på sparad dag
  useEffect(() => {
    loadCheckins();

    const handler = () => loadCheckins();
    window.addEventListener("bebi-checkin-updated", handler);

    return () =>
      window.removeEventListener("bebi-checkin-updated", handler);
  }, []);

  // 📆 Bygg enkel kalender (30 dagar)
  const today = new Date();
  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    return {
      date: key,
      checkin: checkins[key],
    };
  });

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>🌸 Cycle Calendar</h3>
      <p className="small">
        Kalendern uppdateras automatiskt när du klickar “Klar för dagen”.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
          marginTop: 12,
        }}
      >
        {days.map((d) => {
          const strength = d.checkin?.strength;
          const bg = strength ? COLORS[strength] : "#020617";

          return (
            <div
              key={d.date}
              style={{
                height: 48,
                borderRadius: 10,
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                color: strength ? "#0b1120" : "#9ca3af",
                border: "1px solid rgba(148,163,184,0.4)",
              }}
              title={
                d.checkin
                  ? `Styrka: ${d.checkin.strength}
Mental: ${d.checkin.mental}
Energi: ${d.checkin.energy}`
                  : "Ingen data"
              }
            >
              {d.date.slice(8)}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12, fontSize: 12 }}>
        <strong>Legend:</strong>{" "}
        <span style={{ color: COLORS.strong }}>Stark</span> •{" "}
        <span style={{ color: COLORS.normal }}>Normal</span> •{" "}
        <span style={{ color: COLORS.low }}>Låg</span>
      </div>
    </div>
  );
}
