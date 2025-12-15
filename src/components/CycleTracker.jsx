import React, { useEffect, useState } from "react";

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});

  // 🔁 Läs localStorage
  function loadCheckins() {
    const raw = localStorage.getItem("bebi_daily_checkins");
    const parsed = raw ? JSON.parse(raw) : {};
    setCheckins(parsed);
  }

 useEffect(() => {
  console.log("CycleTracker mounted");

  const handler = () => {
    console.log("CycleTracker heard event");
    loadCheckins();
  };

  window.addEventListener("bebi-checkin-updated", handler);

  return () => {
    window.removeEventListener("bebi-checkin-updated", handler);
  };
}, []);


  const dates = Object.keys(checkins).sort();

  return (
    <div className="card">
      <h3>🌸 Cycle Calendar</h3>

      {dates.length === 0 && (
        <p className="small">Inga dagar sparade ännu.</p>
      )}

      <div style={{ display: "grid", gap: 8 }}>
        {dates.map((date) => {
          const d = checkins[date];
          return (
            <div
              key={date}
              style={{
                padding: 10,
                borderRadius: 10,
                background: "#fff1f2",
                fontSize: 13,
              }}
            >
              <strong>{date}</strong>
              <div>💪 Styrka: {d.strength}</div>
              <div>🧠 Psyke: {d.mental}</div>
              <div>⚡ Energi: {d.energy}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
