import React, { useEffect, useState } from "react";

const COLORS = {
  strong: "#86efac",
  normal: "#fde68a",
  low: "#fecaca",
};

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});

  function loadCheckins() {
    const saved =
      JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
    setCheckins(saved);
  }

  useEffect(() => {
    loadCheckins();

    const onStorage = () => loadCheckins();
    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>🌸 Cycle overview</h3>
      <p className="small">
        Baserat på hur du känt dig efter varje träningsdag
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {days.map((date) => {
          const entry = checkins[date];
          const bg = entry?.strength
            ? COLORS[entry.strength]
            : "#1f2937";

          return (
            <div
              key={date}
              style={{
                width: 70,
                padding: 6,
                borderRadius: 10,
                background: bg,
                color: "#020617",
                fontSize: 11,
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {date.slice(5)}
              </div>
              {entry ? (
                <div>
                  {entry.strength}  
                  <br />
                  {entry.energy}
                </div>
              ) : (
                <div style={{ opacity: 0.6 }}>—</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="small" style={{ marginTop: 10 }}>
        🟢 Stark dag • 🟡 Normal • 🔴 Låg återhämtning
      </div>
    </div>
  );
}
