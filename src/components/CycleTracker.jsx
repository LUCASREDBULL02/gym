// src/components/CycleTracker.jsx
import React, { useEffect, useMemo, useState } from "react";

const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();

const formatDate = (d) => d.toISOString().slice(0, 10);

export default function CycleTracker() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [checkins, setCheckins] = useState({});

  // 🔁 Läs check-ins
  useEffect(() => {
    const load = () => {
      const data = JSON.parse(
        localStorage.getItem("bebi_daily_checkins") || "{}"
      );
      setCheckins(data);
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const days = useMemo(() => {
    const count = getDaysInMonth(year, month);
    return Array.from({ length: count }, (_, i) => {
      const d = new Date(year, month, i + 1);
      const key = formatDate(d);
      return { date: key, data: checkins[key] || null };
    });
  }, [year, month, checkins]);

  const getStyle = (day) => {
    if (!day.data) return { background: "#0f172a" };

    if (day.data.energy === "high")
      return { background: "#4c1d95" };
    if (day.data.energy === "medium")
      return { background: "#1e3a8a" };
    if (day.data.energy === "low")
      return { background: "#020617" };

    return { background: "#0f172a" };
  };

  return (
    <div className="card" style={{ padding: 16 }}>
      {/* Månad */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
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

      {/* Kalender */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: 8,
        }}
      >
        {days.map((d) => (
          <div
            key={d.date}
            className="card"
            style={{
              ...getStyle(d),
              padding: 10,
              border:
                d.data?.bleeding ? "1px solid #ef4444" : "1px solid #334155",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.8 }}>{d.date}</div>

            {!d.data && (
              <div className="small">Ingen check-in</div>
            )}

            {d.data && (
              <>
                <div className="small">
                  Energi: {d.data.energy}
                </div>
                <div className="small">
                  Psyke: {d.data.mental}
                </div>
                <div className="small">
                  Styrka: {d.data.strength}
                </div>
                {d.data.bleeding && (
                  <div className="small">🩸 Blöder</div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
