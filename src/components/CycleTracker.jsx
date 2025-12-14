// src/components/CycleTracker.jsx
import React, { useMemo } from "react";

function getScoreFromCheckin(checkin) {
  if (!checkin) return 50;

  let score = 50;

  if (checkin.strength === "strong") score += 20;
  if (checkin.strength === "low") score -= 15;

  if (checkin.energy === "high") score += 15;
  if (checkin.energy === "low") score -= 15;

  if (checkin.mental === "good") score += 10;
  if (checkin.mental === "low") score -= 10;

  return Math.max(10, Math.min(100, score));
}

export default function CycleTracker() {
  const todayStr = new Date().toISOString().slice(0, 10);

  const checkins =
    JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};

  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = -7; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const ds = d.toISOString().slice(0, 10);

      const score = getScoreFromCheckin(checkins[ds]);

      let color = "#e5e7eb";
      if (score >= 75) color = "#86efac";
      else if (score >= 55) color = "#fde68a";
      else color = "#fca5a5";

      days.push({
        date: ds,
        label: ds.slice(5),
        score,
        color,
      });
    }
    return days;
  }, [checkins]);

  const todayScore = getScoreFromCheckin(checkins[todayStr]);

  return (
    <div className="cycle-root">
      <div className="card">
        <h3>Dagens status</h3>
        <p>
          Rekommenderad styrkenivå:{" "}
          <strong>{todayScore}/100</strong>
        </p>
        <p style={{ fontSize: 13 }}>
          {todayScore >= 75 && "🔥 Bra dag för tunga set / PR"}
          {todayScore >= 55 && todayScore < 75 && "🙂 Normal träningsdag"}
          {todayScore < 55 && "🧘 Ta det lugnt, fokus på teknik"}
        </p>
      </div>

      <div className="card">
        <h3>Din kalender</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 8,
          }}
        >
          {calendarDays.map((d) => (
            <div
              key={d.date}
              style={{
                padding: 8,
                borderRadius: 10,
                background: d.color,
                textAlign: "center",
                fontSize: 12,
              }}
            >
              <div>{d.label}</div>
              <div style={{ fontWeight: 600 }}>{d.score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
