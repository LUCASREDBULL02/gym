// src/components/CycleTracker.jsx
import React, { useEffect, useState } from "react";

/* ===========================
   Hjälpfunktioner
=========================== */

function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function loadCheckins() {
  try {
    return JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
  } catch {
    return {};
  }
}

function scoreDay(day) {
  let score = 0;
  if (day.energy === "high") score += 2;
  if (day.energy === "medium") score += 1;

  if (day.strength === "strong") score += 2;
  if (day.strength === "normal") score += 1;

  if (day.mental === "good") score += 2;
  if (day.mental === "ok") score += 1;

  if (day.bleeding) score -= 2;

  return score;
}

function recommendation(score) {
  if (score >= 4) return "🔥 Tung styrka";
  if (score >= 2) return "💪 Normal träning";
  if (score >= 0) return "🚶‍♀️ Lätt / teknik";
  return "🧘‍♀️ Vila / återhämtning";
}

/* ===========================
   Component
=========================== */

export default function CycleTracker() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [checkins, setCheckins] = useState({});

  /* Ladda från localStorage */
  useEffect(() => {
    setCheckins(loadCheckins());
  }, []);

  /* Lyssna på ändringar från Klar-för-dagen */
  useEffect(() => {
    function sync() {
      setCheckins(loadCheckins());
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const daysInMonth = getMonthDays(year, month);

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else setMonth(m => m + 1);
  }

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else setMonth(m => m - 1);
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <button className="btn" onClick={prevMonth}>‹</button>
        <strong>
          {new Date(year, month).toLocaleString("sv-SE", { month: "long", year: "numeric" })}
        </strong>
        <button className="btn" onClick={nextMonth}>›</button>
      </div>

      {/* Weekdays */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", fontSize: 11, opacity: 0.7 }}>
        {["M","T","O","T","F","L","S"].map(d => (
          <div key={d} style={{ textAlign: "center" }}>{d}</div>
        ))}
      </div>

      {/* Calendar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginTop: 6 }}>
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dateKey = formatDate(year, month, i + 1);
          const day = checkins[dateKey];
          const score = day ? scoreDay(day) : null;

          let bg = "rgba(148,163,184,0.1)";
          if (score !== null) {
            if (score >= 4) bg = "rgba(236,72,153,0.6)";
            else if (score >= 2) bg = "rgba(236,72,153,0.35)";
            else if (score >= 0) bg = "rgba(236,72,153,0.2)";
            else bg = "rgba(71,85,105,0.4)";
          }

          return (
            <div
              key={dateKey}
              style={{
                height: 78,
                borderRadius: 10,
                padding: 6,
                background: bg,
                fontSize: 11,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div style={{ fontWeight: 600 }}>{i + 1}</div>

              {day && (
                <>
                  <div style={{ fontSize: 10 }}>
                    {day.bleeding ? "🩸" : "💗"}{" "}
                    {day.energy === "high" && "⚡"}
                    {day.energy === "medium" && "✨"}
                    {day.energy === "low" && "😴"}
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.9 }}>
                    {recommendation(score)}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
