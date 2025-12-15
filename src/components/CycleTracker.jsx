import React, { useEffect, useState } from "react";

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});

  // 🔹 Läs från localStorage
  function loadCheckins() {
    const stored =
      JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
    setCheckins(stored);
  }

  // 🔁 Initial load + event listeners
  useEffect(() => {
    loadCheckins();

    // Custom event (från DailyCheckinModal)
    function handleCustomUpdate() {
      loadCheckins();
    }

    // Storage fallback (andra flikar)
    function handleStorage(e) {
      if (e.key === "bebi_daily_checkins") {
        loadCheckins();
      }
    }

    window.addEventListener("bebi-checkin-updated", handleCustomUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("bebi-checkin-updated", handleCustomUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // 🔹 Generera senaste 28 dagar
  const days = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const iso = d.toISOString().slice(0, 10);
    return {
      date: iso,
      checkin: checkins[iso],
    };
  });

  function getColor(checkin) {
    if (!checkin) return "#1f2937"; // ingen data

    let score = 0;
    if (checkin.strength === "strong") score += 2;
    if (checkin.strength === "normal") score += 1;

    if (checkin.energy === "high") score += 2;
    if (checkin.energy === "medium") score += 1;

    if (checkin.mental === "good") score += 2;
    if (checkin.mental === "ok") score += 1;

    if (score >= 5) return "#ec4899"; // super dag
    if (score >= 3) return "#f9a8d4"; // bra dag
    if (score >= 1) return "#a5b4fc"; // låg dag
    return "#64748b"; // väldigt låg
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>🌸 Cycle Calendar</h3>
      <p className="small">
        Baserad på hur du faktiskt kände dig – inte blödning.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
          marginTop: 12,
        }}
      >
        {days.map((d) => (
          <div
            key={d.date}
            title={d.checkin ? JSON.stringify(d.checkin) : "Ingen data"}
            style={{
              height: 42,
              borderRadius: 10,
              background: getColor(d.checkin),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "#0f172a",
              fontWeight: 600,
            }}
          >
            {d.date.slice(8)}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: "#9ca3af" }}>
        💖 Stark/energifylld dag → rosa  
        💜 Mellan → ljusrosa/lila  
        🩶 Låg → grå
      </div>
    </div>
  );
}
