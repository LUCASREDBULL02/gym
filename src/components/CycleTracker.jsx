import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CycleTracker() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cycleFeelings") || "[]");
    setEntries(data);
  }, []);

  const tileClassName = ({ date }) => {
    const todayStr = date.toISOString().slice(0, 10);
    const entry = entries.find((e) => e.date === todayStr);
    if (!entry) return "";
    if (entry.physical === "Mycket stark") return "strong-day";
    if (entry.energy === "Låg") return "tired-day";
    return "neutral-day";
  };

  return (
    <div className="cycle-tracker-container">
      <h2>🩸 Cykelkalender</h2>
      <Calendar tileClassName={tileClassName} />
      <style>{`
        .strong-day abbr {
          background: pink;
          border-radius: 50%;
          padding: 0.2em;
        }
        .tired-day abbr {
          background: lightgray;
          border-radius: 50%;
          padding: 0.2em;
        }
        .neutral-day abbr {
          background: peachpuff;
          border-radius: 50%;
          padding: 0.2em;
        }
      `}</style>
    </div>
  );
}
