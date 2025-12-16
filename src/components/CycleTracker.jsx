import React, { useEffect, useState } from "react";

/*
  CycleTracker
  - Läser endast från localStorage
  - Key: "bebi_daily_checkins"
  - Format:
    {
      "YYYY-MM-DD": {
        strength: "low|normal|strong",
        mental: "low|ok|good",
        energy: "low|medium|high"
      }
    }
*/

function analyzeDay(entry) {
  if (!entry) return null;

  const { strength, mental, energy } = entry;

  // 🔥 Peak day
  if (energy === "high" && strength === "strong") {
    return {
      label: "Peak day",
      emoji: "🔥",
      color: "#f472b6",
      advice: "Perfekt dag för tunga set, PR eller hög volym",
    };
  }

  // 🌙 Low day
  if (energy === "low" || strength === "low") {
    return {
      label: "Low energy",
      emoji: "🌙",
      color: "#94a3b8",
      advice: "Sänk volym, kör teknik eller vila",
    };
  }

  // 🌸 Balanced
  return {
    label: "Balanced",
    emoji: "🌸",
    color: "#f9a8d4",
    advice: "Stabil dag – normal träning",
  };
}

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});

  // 🔁 Läs ALLTID från localStorage
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
    setCheckins(stored);
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayAnalysis = analyzeDay(checkins[today]);

  const entries = Object.entries(checkins).sort(
    ([a], [b]) => b.localeCompare(a)
  );

  const stats = {
    highEnergy: Object.values(checkins).filter(
      (d) => d.energy === "high"
    ).length,
    lowEnergy: Object.values(checkins).filter(
      (d) => d.energy === "low"
    ).length,
  };

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 8 }}>📅 Cycle</h2>
      <p style={{ fontSize: 13, opacity: 0.7 }}>
        Baserat på hur du känt dig – inte mens/blödning 💗
      </p>

      {/* 🔮 TODAY */}
      {todayAnalysis && (
        <div
          style={{
            background: todayAnalysis.color,
            padding: 14,
            borderRadius: 14,
            marginTop: 12,
            color: "#0f172a",
          }}
        >
          <strong>Idag</strong> {todayAnalysis.emoji}
          <div style={{ fontSize: 13 }}>
            {todayAnalysis.advice}
          </div>
        </div>
      )}

      {/* 📊 STATS */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          borderRadius: 14,
          background: "#020617",
          border: "1px solid rgba(148,163,184,0.3)",
        }}
      >
        <h4 style={{ marginTop: 0 }}>📊 Mönster</h4>
        <div style={{ fontSize: 13 }}>
          🔋 Hög energi-dagar: {stats.highEnergy}
        </div>
        <div style={{ fontSize: 13 }}>
          🌙 Låg energi-dagar: {stats.lowEnergy}
        </div>
      </div>

      {/* 📅 DAYS */}
      <div style={{ marginTop: 16 }}>
        {entries.length === 0 && (
          <p style={{ fontSize: 13, opacity: 0.6 }}>
            Inga dagar loggade ännu.
          </p>
        )}

        {entries.map(([date, entry]) => {
          const analysis = analyzeDay(entry);
          if (!analysis) return null;

          return (
            <div
              key={date}
              style={{
                marginBottom: 8,
                padding: 12,
                borderRadius: 14,
                background: analysis.color,
                color: "#0f172a",
              }}
            >
              <strong>{date}</strong> {analysis.emoji}
              <div style={{ fontSize: 12 }}>
                {analysis.label}
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {analysis.advice}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
