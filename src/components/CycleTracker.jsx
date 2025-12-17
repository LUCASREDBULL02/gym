// src/components/CycleTracker.jsx
import React, { useEffect, useState } from "react";

function calculateScore(entry) {
  if (!entry) return 0;

  let score = 0;

  if (entry.energy === "high") score += 2;
  if (entry.energy === "medium") score += 1;

  if (entry.strength === "high") score += 2;
  if (entry.strength === "normal") score += 1;

  if (entry.mental === "good") score += 1;
  if (entry.mental === "low") score -= 1;

  if (entry.bleeding) score -= 2;

  return score;
}

function getLabel(score) {
  if (score >= 5) return { emoji: "🔥", text: "Tung dag" };
  if (score >= 2) return { emoji: "💗", text: "Lätt / volym" };
  return { emoji: "🌙", text: "Vila" };
}

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});

  useEffect(() => {
    const load = () => {
      const data =
        JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
      setCheckins(data);
    };

    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month, day)
      .toISOString()
      .slice(0, 10);
    return date;
  });

  const today = new Date().toISOString().slice(0, 10);
  const todayScore = calculateScore(checkins[today]);

  function tomorrowRecommendation() {
    const recent = Object.values(checkins).slice(-3);
    let total = 0;
    recent.forEach((e) => (total += calculateScore(e)));

    if (total >= 7) return "🔥 Tung styrka";
    if (total >= 3) return "💗 Lätt / teknik";
    return "🌙 Vila";
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Cykel & Styrka 🌸</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
        }}
      >
        {days.map((date) => {
          const entry = checkins[date];
          const score = calculateScore(entry);
          const label = entry ? getLabel(score) : null;

          return (
            <div
              key={date}
              style={{
                padding: 6,
                borderRadius: 10,
                background: label
                  ? "rgba(236,72,153,0.15)"
                  : "rgba(15,23,42,0.9)",
                border: "1px solid rgba(148,163,184,0.4)",
                textAlign: "center",
                fontSize: 11,
              }}
            >
              <div>{date.slice(-2)}</div>
              {label && (
                <div style={{ fontSize: 14 }}>{label.emoji}</div>
              )}
            </div>
          );
        })}
      </div>

      {todayScore <= 1 && (
        <div
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 10,
            background: "rgba(239,68,68,0.15)",
            fontSize: 13,
          }}
        >
          ⚠️ Rekommendation: kör <strong>INTE PR</strong> idag
        </div>
      )}

      <div style={{ marginTop: 12, fontSize: 13 }}>
        <strong>Imorgon:</strong> {tomorrowRecommendation()}
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Energi senaste dagarna</strong>
        <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
          {Object.entries(checkins)
            .slice(-7)
            .map(([date, e]) => {
              const h =
                e.energy === "high" ? 60 :
                e.energy === "medium" ? 40 : 20;
              return (
                <div
                  key={date}
                  title={date}
                  style={{
                    width: 12,
                    height: h,
                    background: "#ec4899",
                    borderRadius: 6,
                  }}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
