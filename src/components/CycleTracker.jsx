import React, { useEffect, useState } from "react";

export default function CycleTracker() {
  const today = new Date();
  const [year] = useState(today.getFullYear());
  const [month] = useState(today.getMonth());
  const [checkins, setCheckins] = useState({});

      {/* ORIGINAL-KALENDER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
        }}
      >
        {/* tomma rutor */}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;

          const entry = checkins[key];
          const style = getDayStyle(entry);

          return (
            <div
              key={key}
              style={{
                padding: 6,
                borderRadius: 12,
                background: style.bg,
                textAlign: "center",
                fontSize: 11,
                color: "#020617",
              }}
            >
              <div style={{ fontWeight: 700 }}>{day}</div>
              <div style={{ fontSize: 14 }}>{style.emoji}</div>
              {style.label && (
                <div style={{ fontSize: 9 }}>{style.label}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: 10, fontSize: 11, opacity: 0.8 }}>
        🔥 PR-läge • 💗 Normal • 🌙 Lugn dag
      </div>
    </div>
  );
}
