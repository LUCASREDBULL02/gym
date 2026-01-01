import React from "react";
import { MUSCLES } from "../data/muscles";

const LEVEL_COLORS = {
  Beginner: "#4b5563",
  Novice: "#2563eb",
  Intermediate: "#10b981",
  Advanced: "#f59e0b",
  Elite: "#e11d48",
  "World Class": "#7c3aed",
};

export default function MuscleMap({ muscleStats = {} }) {
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
      className={`level-badge level-${s.levelKey
        .toLowerCase()
        .replace(" ", "-")}`}
    >
      {s.levelKey}
    </span>
  </div>

  {/* RAD 2: PROGRESS BAR */}
  <div className="progress-wrap">
    <div
      className="progress-fill"
      style={{
        width: `${s.percent}%`,
        background: color,
        transition: "width 0.3s ease",
      }}
    />
  </div>

  {/* RAD 3: PROCENT */}
  <div className="muscle-card-percent">
    {s.percent}% av World Class
  </div>
</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
