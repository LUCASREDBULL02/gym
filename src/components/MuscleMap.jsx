import React from "react";
import { MUSCLES } from "../data/muscles";

const LEVEL_COLORS = {
  Beginner: "#4b5563",       // grå
  Novice: "#2563eb",         // blå
  Intermediate: "#10b981",   // grön
  Advanced: "#f59e0b",       // orange
  Elite: "#e11d48",          // röd
  "World Class": "#8b5cf6",  // lila
};

export default function MuscleMap({ muscleStats = {} }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0, marginBottom: 8 }}>Muskelkarta 💪</h3>

      <div className="small" style={{ marginBottom: 12 }}>
        Färger och procent baseras på dina bästa lyft jämfört med StrengthLevel-standarder.
        <br />
        <strong>100% = World Class (max)</strong>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
        }}
      >
        {MUSCLES.map((m) => {
          const s = muscleStats[m.id] || {
            percent: 0,
            levelKey: "Beginner",
          };

          const percent = Math.min(100, Math.round(s.percent || 0));
          const levelKey = s.levelKey || "Beginner";
          const color = LEVEL_COLORS[levelKey] || LEVEL_COLORS.Beginner;

          return (
            <div
              key={m.id}
              className="muscle-card"
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                background: "rgba(15,23,42,0.9)",
                border: `1px solid ${color}88`,
              }}
            >
              {/* RAD 1: NAMN + LEVEL */}
              <div className="muscle-card-header">
                <span style={{ fontWeight: 600 }}>{m.name}</span>

                <span
                  className={`level-badge level-${levelKey
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {levelKey}
                </span>
              </div>

              {/* RAD 2: PROGRESS */}
              <div className="progress-wrap">
                <div
                  className="progress-fill"
                  style={{
                    width: `${percent}%`,
                    background: color,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              {/* RAD 3: PROCENT */}
              <div className="muscle-card-percent">
                {percent}% av World Class
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
