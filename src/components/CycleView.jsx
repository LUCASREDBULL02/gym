import React, { useEffect, useMemo, useState } from "react";

/* =======================
   KONFIGURATION
======================= */

const CYCLE_LENGTH = 28;

const PHASES = [
  { name: "Menstruation", from: 1, to: 5, base: { strength: 2, psyche: 2, energy: 2 } },
  { name: "Follikulär", from: 6, to: 12, base: { strength: 3, psyche: 4, energy: 4 } },
  { name: "Ovulation", from: 13, to: 16, base: { strength: 5, psyche: 5, energy: 5 } },
  { name: "Luteal", from: 17, to: 28, base: { strength: 3, psyche: 3, energy: 2 } },
];

/* =======================
   HJÄLPFUNKTIONER
======================= */

function daysBetween(a, b) {
  return Math.floor((new Date(b) - new Date(a)) / 86400000);
}

function clamp(v) {
  return Math.max(1, Math.min(5, v));
}

function getCycleDay(cycleStart, date) {
  const diff = daysBetween(cycleStart, date);
  return ((diff % CYCLE_LENGTH) + CYCLE_LENGTH) % CYCLE_LENGTH + 1;
}

function getPhase(day) {
  return PHASES.find(p => day >= p.from && day <= p.to);
}

/* =======================
   COMPONENT
======================= */

export default function CycleView() {
  /* ----- STATE ----- */

  const [cycleStartDate, setCycleStartDate] = useState(() =>
    localStorage.getItem("cycle_start") || ""
  );

  const [dailyLogs, setDailyLogs] = useState(() => {
    const saved = localStorage.getItem("cycle_logs");
    return saved ? JSON.parse(saved) : [];
  });

  /* ----- PERSISTENS ----- */

  useEffect(() => {
    localStorage.setItem("cycle_start", cycleStartDate);
  }, [cycleStartDate]);

  useEffect(() => {
    localStorage.setItem("cycle_logs", JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  /* =======================
     BERÄKNING
  ======================= */

  function getBaseline(date) {
    if (!cycleStartDate) {
      return {
        cycleDay: null,
        phase: "Okänd",
        strength: 3,
        psyche: 3,
        energy: 3,
      };
    }

    const cycleDay = getCycleDay(cycleStartDate, date);
    const phase = getPhase(cycleDay);

    return {
      cycleDay,
      phase: phase.name,
      ...phase.base,
    };
  }

  function getAdjustedState(date) {
    const baseline = getBaseline(date);

    const pastLogs = dailyLogs.filter(
      l => new Date(l.date) <= new Date(date)
    );

    if (pastLogs.length === 0) return baseline;

    let delta = { strength: 0, psyche: 0, energy: 0 };

    pastLogs.forEach(log => {
      const base = getBaseline(log.date);
      delta.strength += log.strength - base.strength;
      delta.psyche += log.psyche - base.psyche;
      delta.energy += log.energy - base.energy;
    });

    const factor = Math.min(1, pastLogs.length / 5);

    return {
      ...baseline,
      strength: clamp(Math.round(baseline.strength + delta.strength / pastLogs.length * factor)),
      psyche: clamp(Math.round(baseline.psyche + delta.psyche / pastLogs.length * factor)),
      energy: clamp(Math.round(baseline.energy + delta.energy / pastLogs.length * factor)),
    };
  }

  /* =======================
     UI – DAGAR
  ======================= */

  const today = new Date().toISOString().slice(0, 10);

  const calendar = useMemo(() => {
    const days = [];
    for (let i = -7; i <= 21; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const date = d.toISOString().slice(0, 10);
      days.push({ date, state: getAdjustedState(date) });
    }
    return days;
  }, [cycleStartDate, dailyLogs]);

  /* =======================
     HANDLERS
  ======================= */

  function saveDailyLog(date, values) {
    setDailyLogs(prev => {
      const filtered = prev.filter(l => l.date !== date);
      return [...filtered, { date, ...values }];
    });
  }

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Cykel & Daglig Status 🌙</h3>

      <label className="small">
        Första mensdag:
        <input
          type="date"
          value={cycleStartDate}
          onChange={e => setCycleStartDate(e.target.value)}
        />
      </label>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        {calendar.map(({ date, state }) => {
          const log = dailyLogs.find(l => l.date === date);

          return (
            <div
              key={date}
              style={{
                padding: 10,
                borderRadius: 10,
                background: date === today ? "rgba(236,72,153,0.2)" : "rgba(15,23,42,0.9)",
                border: "1px solid rgba(148,163,184,0.4)",
              }}
            >
              <div className="small">
                {date} – Dag {state.cycleDay ?? "?"} ({state.phase})
              </div>

              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                {["strength", "psyche", "energy"].map(k => (
                  <select
                    key={k}
                    value={log?.[k] ?? state[k]}
                    onChange={e =>
                      saveDailyLog(date, {
                        ...(log || {}),
                        [k]: Number(e.target.value),
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5].map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
