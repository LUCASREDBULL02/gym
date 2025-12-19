import React, { useEffect, useMemo, useState } from "react";

/* =========================
   KONFIG
========================= */

const DEFAULT_FEELING = {
  strength: 3,
  psyche: 3,
  energy: 3,
};

/* =========================
   HJÄLPFUNKTIONER
========================= */

function daysBetween(a, b) {
  return Math.floor((new Date(b) - new Date(a)) / 86400000);
}

function clamp(v) {
  return Math.max(1, Math.min(5, v));
}

/* =========================
   COMPONENT
========================= */

export default function CycleTracker() {
  /* -------- STATE -------- */

  const [cycleStartDate, setCycleStartDate] = useState(() =>
    localStorage.getItem("cycle_start_date") || ""
  );

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // Dagliga loggar (nyckel = datum)
  const [dailyFeelings, setDailyFeelings] = useState(() => {
    const saved = localStorage.getItem("cycle_daily_feelings");
    return saved ? JSON.parse(saved) : {};
  });

  /* -------- PERSISTENS -------- */

  useEffect(() => {
    localStorage.setItem("cycle_start_date", cycleStartDate);
  }, [cycleStartDate]);

  useEffect(() => {
    localStorage.setItem(
      "cycle_daily_feelings",
      JSON.stringify(dailyFeelings)
    );
  }, [dailyFeelings]);

  /* =========================
     LOGIK
  ========================= */

  // Hitta senaste känsla <= datum
  function getFeelingForDate(date) {
    const entries = Object.entries(dailyFeelings)
      .filter(([d]) => new Date(d) <= new Date(date))
      .sort((a, b) => new Date(b[0]) - new Date(a[0]));

    if (entries.length === 0) return DEFAULT_FEELING;
    return { ...DEFAULT_FEELING, ...entries[0][1] };
  }

  // Spara känsla för vald dag
  function updateFeeling(key, value) {
    setDailyFeelings((prev) => ({
      ...prev,
      [selectedDate]: {
        ...getFeelingForDate(selectedDate),
        [key]: clamp(value),
      },
    }));
  }

  /* =========================
     KALENDER (enkel & säker)
  ========================= */

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = -7; i <= 21; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const date = d.toISOString().slice(0, 10);
      days.push({
        date,
        feeling: getFeelingForDate(date),
      });
    }
    return days;
  }, [dailyFeelings]);

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Cykel & Daglig Status 🌙</h3>

      {/* Mens-start */}
      <label className="small" style={{ display: "block", marginBottom: 8 }}>
        Första mensdag:
        <input
          type="date"
          value={cycleStartDate}
          onChange={(e) => setCycleStartDate(e.target.value)}
          style={{ marginLeft: 6 }}
        />
      </label>

      {/* Datumval */}
      <label className="small" style={{ display: "block", marginBottom: 8 }}>
        Välj datum:
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ marginLeft: 6 }}
        />
      </label>

      {/* Daglig input */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["strength", "psyche", "energy"].map((key) => (
          <select
            key={key}
            value={getFeelingForDate(selectedDate)[key]}
            onChange={(e) => updateFeeling(key, Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((v) => (
              <option key={v} value={v}>
                {key === "strength" && "💪 "}
                {key === "psyche" && "🧠 "}
                {key === "energy" && "⚡ "}
                {v}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Kalender */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {calendarDays.map(({ date, feeling }) => (
          <div
            key={date}
            style={{
              padding: 8,
              borderRadius: 8,
              background:
                date === selectedDate
                  ? "rgba(236,72,153,0.25)"
                  : "rgba(15,23,42,0.9)",
              border: "1px solid rgba(148,163,184,0.4)",
            }}
          >
            <div className="small">{date}</div>
            <div className="small">
              💪 {feeling.strength} &nbsp; 🧠 {feeling.psyche} &nbsp; ⚡{" "}
              {feeling.energy}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
