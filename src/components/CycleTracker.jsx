import React, { useEffect, useMemo, useState } from "react";

/* =========================
   HELPERS
========================= */

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function loadCheckins() {
  return JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
}

function energyToValue(e) {
  if (e === "high") return 3;
  if (e === "medium") return 2;
  if (e === "low") return 1;
  return 0;
}

function predictTomorrow(checkins) {
  const dates = Object.keys(checkins).sort().slice(-5);
  if (!dates.length) return null;

  const score = dates.reduce((sum, d) => {
    return sum + energyToValue(checkins[d]?.energy) - 2;
  }, 0);

  if (score >= 2) return "high";
  if (score <= -2) return "low";
  return "medium";
}

/* =========================
   COMPONENT
========================= */

export default function CycleTracker() {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [checkins, setCheckins] = useState({});

  /* 🔁 reload when localStorage changes */
  useEffect(() => {
    const load = () => setCheckins(loadCheckins());
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  /* 📅 build month days */
  const daysInMonth = useMemo(() => {
    const total = getDaysInMonth(year, month);
    return Array.from({ length: total }, (_, i) => {
      const d = new Date(year, month, i + 1);
      const key = formatDate(d);
      return { date: key, data: checkins[key] };
    });
  }, [year, month, checkins]);

  /* 📊 last 7 days */
  const last7 = useMemo(() => {
    return Object.keys(checkins)
      .sort()
      .slice(-7)
      .map((d) => ({
        date: d,
        value: energyToValue(checkins[d]?.energy),
      }));
  }, [checkins]);

  /* 🔮 prediction */
  const prediction = predictTomorrow(checkins);

  /* ⬅️➡️ month nav */
  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="btn" onClick={prevMonth}>◀</button>
        <h2 style={{ margin: 0 }}>
          📅 {new Date(year, month).toLocaleString("sv-SE", { month: "long", year: "numeric" })}
        </h2>
        <button className="btn" onClick={nextMonth}>▶</button>
      </div>

      {/* 🔮 Prediction */}
      {prediction && (
        <div className="card soft" style={{ marginTop: 12 }}>
          🔮 <b>Imorgon:</b>{" "}
          {prediction === "high" && "🔥 Hög energi – perfekt för tunga pass"}
          {prediction === "medium" && "🙂 Okej energi – normal träning"}
          {prediction === "low" && "🌙 Låg energi – vila eller teknik"}
        </div>
      )}

      {/* 📊 ENERGY GRAPH */}
      <div className="card" style={{ marginTop: 12 }}>
        <h4>📊 Energi – senaste 7 dagar</h4>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60 }}>
          {last7.map((d) => (
            <div
              key={d.date}
              title={d.date}
              style={{
                width: 16,
                height: d.value * 18,
                borderRadius: 6,
                background:
                  d.value === 3
                    ? "#f97316"
                    : d.value === 2
                    ? "#a855f7"
                    : "#475569",
              }}
            />
          ))}
        </div>
      </div>

      {/* 🗓️ CALENDAR */}
      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
        }}
      >
        {daysInMonth.map((d) => {
          const energy = d.data?.energy;
          return (
            <div
              key={d.date}
              className="card"
              style={{
                padding: 8,
                background:
                  energy === "high"
                    ? "rgba(249,115,22,0.25)"
                    : energy === "medium"
                    ? "rgba(168,85,247,0.25)"
                    : energy === "low"
                    ? "rgba(71,85,105,0.4)"
                    : "rgba(15,23,42,0.6)",
              }}
            >
              <div style={{ fontSize: 12 }}>{d.date.slice(8)}</div>
              <div style={{ fontSize: 18 }}>
                {energy === "high" && "🔥"}
                {energy === "medium" && "🙂"}
                {energy === "low" && "🌙"}
                {!energy && "○"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
