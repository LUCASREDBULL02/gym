// src/components/CycleTracker.jsx
import React, { useEffect, useState } from "react";

/* =======================
   SCORE & LOGIK
======================= */

function calculateScore(entry) {
  if (!entry) return null;

  let score = 0;

  // Energi
  if (entry.energy === "high") score += 2;
  if (entry.energy === "medium") score += 1;

  // Styrka
  if (entry.strength === "high") score += 2;
  if (entry.strength === "normal") score += 1;

  // Psykiskt
  if (entry.mental === "good") score += 1;
  if (entry.mental === "low") score -= 1;

  // Blödning
  if (entry.bleeding) score -= 2;

  return score;
}

function getDayLabel(score) {
  if (score >= 5) {
    return { emoji: "🔥", text: "Tung styrka", color: "rgba(239,68,68,0.25)" };
  }
  if (score >= 2) {
    return { emoji: "💗", text: "Lätt / volym", color: "rgba(236,72,153,0.25)" };
  }
  return { emoji: "🌙", text: "Vila", color: "rgba(59,130,246,0.25)" };
}

/* =======================
   COMPONENT
======================= */

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});

  /* 🔁 Ladda + lyssna på ändringar */
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

  /* 📅 Nuvarande månad */
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return d.toISOString().slice(0, 10);
  });

  const today = new Date().toISOString().slice(0, 10);
  const todayScore = calculateScore(checkins[today]);

  /* 🔮 Prediktion imorgon */
  function tomorrowRecommendation() {
    const recent = Object.values(checkins).slice(-3);
    let total = 0;

    recent.forEach((e) => {
      const s = calculateScore(e);
      if (typeof s === "number") total += s;
    });

    if (total >= 7) return "🔥 Tung styrka";
    if (total >= 3) return "💗 Lätt / teknik";
    return "🌙 Vila";
  }

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Cykel & Styrka 🌸</h3>

      {/* 🗓️ KALENDER */}
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
          const label = score !== null ? getDayLabel(score) : null;

          return (
            <div
              key={date}
              style={{
                padding: 8,
                borderRadius: 10,
                background: label
                  ? label.color
                  : "rgba(15,23,42,0.9)",
                border: "1px solid rgba(148,163,184,0.4)",
                textAlign: "center",
                fontSize: 11,
              }}
            >
              <div style={{ opacity: 0.7 }}>{date.slice(-2)}</div>

              {label && (
                <>
                  <div style={{ fontSize: 16 }}>{label.emoji}</div>
                  <div style={{ fontSize: 10 }}>{label.text}</div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* ⚠️ PR-VARNING */}
      {typeof todayScore === "number" && todayScore <= 1 && (
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

      {/* 🔮 IMORGON */}
      <div style={{ marginTop: 12, fontSize: 13 }}>
        <strong>Imorgon rekommenderas:</strong>{" "}
        {tomorrowRecommendation()}
      </div>

      {/* 📈 ENERGI-GRAF */}
      <div style={{ marginTop: 14 }}>
        <strong>Energi senaste 7 dagar</strong>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 6,
            marginTop: 6,
            height: 70,
          }}
        >
          {Object.entries(checkins)
            .slice(-7)
            .map(([date, e]) => {
              const height =
                e.energy === "high"
                  ? 60
                  : e.energy === "medium"
                  ? 40
                  : 20;

              return (
                <div
                  key={date}
                  title={date}
                  style={{
                    width: 14,
                    height,
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
