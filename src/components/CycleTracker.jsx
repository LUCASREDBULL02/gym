// src/components/CycleTracker.jsx
import React, { useEffect, useMemo, useState } from "react";

// ---------- helpers ----------
const energyValue = (e) =>
  e === "low" ? 1 : e === "medium" ? 2 : e === "high" ? 3 : null;

const energyLabel = (e) =>
  e === "low" ? "Låg energi 🌙" : e === "medium" ? "Okej energi 🙂" : "Hög energi 🔥";

const recommendationFor = (e) => {
  if (e === "high") return "Tunga set · PR-försök ok · Fokus baslyft";
  if (e === "medium") return "Volym & teknik · RPE 6–8";
  if (e === "low") return "Vila · rörlighet · lätt teknik";
  return "Ingen data";
};

const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();

const formatDate = (d) => d.toISOString().slice(0, 10);

// ---------- component ----------
export default function CycleTracker() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [mode, setMode] = useState(
    localStorage.getItem("bebi_cycle_mode") || "spiral"
  );
  const [checkins, setCheckins] = useState({});

  // ---- load daily checkins ----
  useEffect(() => {
    const load = () => {
      const raw = JSON.parse(
        localStorage.getItem("bebi_daily_checkins") || "{}"
      );
      setCheckins(raw);
    };

    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  // ---- persist mode ----
  useEffect(() => {
    localStorage.setItem("bebi_cycle_mode", mode);
  }, [mode]);

  // ---- build month days ----
  const days = useMemo(() => {
    const count = getDaysInMonth(year, month);
    return Array.from({ length: count }, (_, i) => {
      const d = new Date(year, month, i + 1);
      const key = formatDate(d);
      return { date: key, checkin: checkins[key] || null };
    });
  }, [year, month, checkins]);

  // ---- energy trend (last 7 days) ----
  const last7 = useMemo(() => {
    return days
      .filter((d) => d.checkin?.energy)
      .slice(-7)
      .map((d) => ({
        date: d.date,
        value: energyValue(d.checkin.energy),
      }));
  }, [days]);

  // ---- prediction ----
  const predictedTomorrow = useMemo(() => {
    if (last7.length < 3) return null;
    const avg =
      last7.reduce((a, b) => a + b.value, 0) / last7.length;
    if (avg >= 2.4) return "high";
    if (avg >= 1.6) return "medium";
    return "low";
  }, [last7]);

  return (
    <div className="card" style={{ padding: 20 }}>
      {/* HEADER */}
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2>📅 Cycle & Energi</h2>
        <div>
          <button
            className="btn"
            onClick={() => setMode(mode === "mens" ? "spiral" : "mens")}
          >
            🧠 Läge: {mode === "mens" ? "Mens" : "Spiral"}
          </button>
        </div>
      </div>

      {/* MONTH NAV */}
      <div className="row" style={{ margin: "12px 0", gap: 8 }}>
        <button
          className="btn"
          onClick={() =>
            month === 0
              ? (setMonth(11), setYear(year - 1))
              : setMonth(month - 1)
          }
        >
          ◀
        </button>
        <strong>
          {new Date(year, month).toLocaleString("sv-SE", {
            month: "long",
            year: "numeric",
          })}
        </strong>
        <button
          className="btn"
          onClick={() =>
            month === 11
              ? (setMonth(0), setYear(year + 1))
              : setMonth(month + 1)
          }
        >
          ▶
        </button>
      </div>

      {/* ENERGY GRAPH */}
      <div className="card" style={{ marginBottom: 12 }}>
        <h4>📈 Energi senaste 7 dagar</h4>
        {!last7.length ? (
          <p className="small">Ingen tillräcklig data</p>
        ) : (
          <svg width="100%" height="80">
            {last7.map((p, i) => (
              <circle
                key={p.date}
                cx={`${(i / (last7.length - 1)) * 100}%`}
                cy={80 - p.value * 20}
                r="5"
                fill="#ec4899"
              />
            ))}
          </svg>
        )}
      </div>

      {/* PREDICTION */}
      <div className="card" style={{ marginBottom: 12 }}>
        <h4>🔮 Morgondagens prediktion</h4>
        <p>
          {predictedTomorrow
            ? energyLabel(predictedTomorrow)
            : "Inte tillräckligt med data"}
        </p>
        <p className="small">
          {predictedTomorrow
            ? recommendationFor(predictedTomorrow)
            : ""}
        </p>
      </div>

      {/* CALENDAR */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 8,
        }}
      >
        {days.map((d) => (
          <div
            key={d.date}
            className="card"
            style={{
              background: d.checkin
                ? d.checkin.energy === "high"
                  ? "#4c1d95"
                  : d.checkin.energy === "medium"
                  ? "#1e3a8a"
                  : "#334155"
                : "#0f172a",
            }}
          >
            <strong>{d.date}</strong>
            <div className="small">
              {d.checkin
                ? energyLabel(d.checkin.energy)
                : "Ingen check-in"}
            </div>
            <div className="small">
              {d.checkin
                ? recommendationFor(d.checkin.energy)
                : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
