import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CycleTracker.css"; // Lägg gärna denna CSS lokalt

const getColorFromMood = (data) => {
  if (!data) return "";
  if (data.strength === "Stark") return "#ff8bd3";
  if (data.strength === "Okej") return "#ffd3f4";
  if (data.strength === "Svag") return "#ffeaf6";
  return "";
};

export default function CycleTracker() {
  const [entries, setEntries] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cycleTrackerData")) || {};
    setEntries(stored);
  }, []);

  return (
    <div className="cycle-tracker">
      <h2>Cycle Tracker</h2>
      <Calendar
        tileContent={({ date }) => {
          const key = date.toISOString().split("T")[0];
          const entry = entries[key];
          if (entry) {
            return (
              <div
                style={{
                  backgroundColor: getColorFromMood(entry),
                  borderRadius: "4px",
                  padding: "2px",
                  marginTop: "2px",
                  fontSize: "0.7rem",
                  textAlign: "center",
                }}
              >
                {entry.strength}
              </div>
            );
          }
          return null;
        }}
      />
    </div>
  );
}
