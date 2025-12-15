// src/components/CycleTracker.jsx
import React, { useEffect, useState } from "react";

const FEEL_COLORS = {
  strong: "#ec4899",
  normal: "#f472b6",
  low: "#64748b",

  good: "#22c55e",
  ok: "#facc15",
  bad: "#ef4444",

  high: "#fb7185",
  medium: "#a855f7",
  lowEnergy: "#64748b",
};

function getStoredCheckins() {
  try {
    return JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
  } catch {
    return {};
  }
}

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});

  // 🔄 Ladda från localStorage
  useEffect(() => {
    setCheckins(getStoredCheckins());

    const onStorageUpdate = () => {
      setCheckins(getStoredCheckins());
    };

    // 🔁 custom event (från Klar för dagen)
    window.addEventListener("bebi-checkin-updated", onStorageUpdate);

    return () => {
      window.removeEventListener("bebi-checkin-updated", onStorageUpdate);
    };
  }, []);

  const days = Object.entries(checkins).sort(
    ([a], [b]) => new Date(b) - new Date(a)
  );

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>🌸 Cycle & energi</h3>

      {days.length === 0 && (
        <p className="small">Ingen data ännu. Använd “Klar för dagen”.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {days.map(([date, d]) => (
          <div
            key={date}
            style={{
              padding: 10,
              borderRadius: 12,
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(148,163,184,0.3)",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.7 }}>{date}</div>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 6,
                flexWrap: "wrap",
              }}
            >
              {d.strength && (
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: 999,
                    background: FEEL_COLORS[d.strength],
                    fontSize: 11,
                    color: "#0b1120",
                  }}
                >
                  💪 {d.strength}
                </span>
              )}

              {d.mental && (
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: 999,
                    background: FEEL_COLORS[d.mental],
                    fontSize: 11,
                    color: "#0b1120",
                  }}
                >
                  🧠 {d.mental}
                </span>
              )}

              {d.energy && (
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: 999,
                    background:
                      FEEL_COLORS[
                        d.energy === "low" ? "lowEnergy" : d.energy
                      ],
                    fontSize: 11,
                    color: "#0b1120",
                  }}
                >
                  ⚡ {d.energy}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
