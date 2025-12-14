import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/cycletracker.css"; // Du kan lägga extra styles här

export default function CycleTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [responses, setResponses] = useState({});
  const [selectedInfo, setSelectedInfo] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cycle_responses") || "{}");
    setResponses(saved);
  }, []);

  function tileClassName({ date, view }) {
    if (view !== "month") return;

    const key = date.toISOString().slice(0, 10);
    const res = responses[key];
    if (!res) return;

    if (res.strength === "Stark") return "tile-strong";
    if (res.strength === "Svag") return "tile-weak";
    if (res.energy === "Trött") return "tile-tired";

    return "tile-neutral";
  }

  function handleClick(date) {
    const key = date.toISOString().slice(0, 10);
    setSelectedDate(date);
    setSelectedInfo(responses[key] || null);
  }

  return (
    <div className="cycle-page">
      <h2 className="section-title">💗 Cykel & dagsform</h2>

      <div className="calendar-wrapper">
        <Calendar
          onClickDay={handleClick}
          value={selectedDate}
          tileClassName={tileClassName}
        />
      </div>

      {selectedInfo ? (
        <div className="cycle-info">
          <h3>{selectedDate.toLocaleDateString("sv-SE")}</h3>
          <p><strong>Styrka:</strong> {selectedInfo.strength}</p>
          <p><strong>Psykiskt:</strong> {selectedInfo.mood}</p>
          <p><strong>Energi:</strong> {selectedInfo.energy}</p>
        </div>
      ) : (
        <p style={{ marginTop: 12 }}>Ingen registrering för vald dag.</p>
      )}
    </div>
  );
}
