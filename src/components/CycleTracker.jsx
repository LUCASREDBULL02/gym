import React, { useEffect, useState } from "react";

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});

  function load() {
    const data =
      JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
    setCheckins(data);
  }

  useEffect(() => {
    load();

    const handler = () => load();
    window.addEventListener("bebi-checkin-updated", handler);

    return () =>
      window.removeEventListener("bebi-checkin-updated", handler);
  }, []);

  const days = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const iso = d.toISOString().slice(0, 10);
    return { date: iso, data: checkins[iso] };
  });

  function color(d) {
    if (!d) return "#1f2937";
    let s = 0;
    if (d.strength === "strong") s++;
    if (d.energy === "high") s++;
    if (d.mental === "good") s++;
    return s >= 2 ? "#ec4899" : s === 1 ? "#f9a8d4" : "#64748b";
  }

  return (
    <div className="card">
      <h3>🌸 Cycle</h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7,1fr)",
        gap: 6
      }}>
        {days.map(d => (
          <div
            key={d.date}
            style={{
              height: 42,
              borderRadius: 10,
              background: color(d.data),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11
            }}
          >
            {d.date.slice(8)}
          </div>
        ))}
      </div>
    </div>
  );
}
