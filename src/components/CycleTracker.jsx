import React, { useEffect, useState } from "react";

export default function CycleTracker() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [checkins, setCheckins] = useState({});

  // 🔄 Läs check-ins från localStorage
 useEffect(() => {
  function loadCheckins() {
    const saved =
      JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
    setCheckins(saved);
  }

  loadCheckins();

  // 🔄 Uppdatera när localStorage ändras
  window.addEventListener("storage", loadCheckins);

  // 🔄 Uppdatera när användaren går tillbaka till fliken
  window.addEventListener("focus", loadCheckins);

  return () => {
    window.removeEventListener("storage", loadCheckins);
    window.removeEventListener("focus", loadCheckins);
  };
}, []);

  // 🔢 Hur många dagar i vald månad
  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  // 📅 Bygg alla dagar
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentYear, currentMonth, i + 1)
      .toISOString()
      .slice(0, 10);

    return {
      date,
      checkin: checkins[date] || null,
    };
  });

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  function energyLabel(e) {
    if (e === "low") return "🌙 Låg energi";
    if (e === "medium") return "🙂 Okej energi";
    if (e === "high") return "🔥 Hög energi";
    return "Ingen data";
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <button className="btn" onClick={prevMonth}>
          ◀
        </button>
        <h2 style={{ margin: 0 }}>
          📆{" "}
          {new Date(currentYear, currentMonth).toLocaleString("sv-SE", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button className="btn" onClick={nextMonth}>
          ▶
        </button>
      </div>

      {/* INFO */}
      <p className="small" style={{ marginBottom: 12 }}>
        Kalendern baseras på hur hon <b>känner sig</b> – inte mens/blödning 💗
      </p>

      {/* KALENDER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 8,
        }}
      >
        {days.map((d) => (
          <div
            key={d.date}
            style={{
              padding: 10,
              borderRadius: 12,
              background: d.checkin
                ? d.checkin.energy === "high"
                  ? "rgba(236,72,153,0.25)"
                  : d.checkin.energy === "medium"
                  ? "rgba(99,102,241,0.25)"
                  : "rgba(148,163,184,0.25)"
                : "rgba(15,23,42,0.8)",
              border: "1px solid rgba(148,163,184,0.3)",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.8 }}>{d.date}</div>

            {d.checkin ? (
              <>
                <div style={{ marginTop: 6 }}>
                  {energyLabel(d.checkin.energy)}
                </div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>
                  💪 {d.checkin.strength || "–"} <br />
                  🧠 {d.checkin.mental || "–"}
                </div>
              </>
            ) : (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  opacity: 0.6,
                }}
              >
                Ingen check-in
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
