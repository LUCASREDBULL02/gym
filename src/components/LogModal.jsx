import React, { useState } from "react";

export default function LogModal({ isOpen, onClose }) {
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState({
    strength: "",
    mood: "",
    energy: "",
  });

  const handleSaveReflection = () => {
    const today = new Date().toISOString().split("T")[0];
    const stored = JSON.parse(localStorage.getItem("cycleTrackerData")) || {};
    stored[today] = reflection;
    localStorage.setItem("cycleTrackerData", JSON.stringify(stored));
    setShowReflection(false);
    setReflection({ strength: "", mood: "", energy: "" });
    alert("Dagens känsla sparad!");
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Logga Pass</h2>
        {/* Din vanliga logik för att logga övningar här */}

        {!showReflection && (
          <button className="klar-btn" onClick={() => setShowReflection(true)}>
            Klar för dagen
          </button>
        )}

        {showReflection && (
          <div className="reflection-form">
            <label>
              Styrkenivå:
              <select
                value={reflection.strength}
                onChange={(e) =>
                  setReflection({ ...reflection, strength: e.target.value })
                }
              >
                <option value="">Välj</option>
                <option value="Stark">Stark</option>
                <option value="Okej">Okej</option>
                <option value="Svag">Svag</option>
              </select>
            </label>
            <label>
              Psykiskt:
              <select
                value={reflection.mood}
                onChange={(e) =>
                  setReflection({ ...reflection, mood: e.target.value })
                }
              >
                <option value="">Välj</option>
                <option value="Motiverad">Motiverad</option>
                <option value="Neutral">Neutral</option>
                <option value="Omotiverad">Omotiverad</option>
              </select>
            </label>
            <label>
              Energinivå:
              <select
                value={reflection.energy}
                onChange={(e) =>
                  setReflection({ ...reflection, energy: e.target.value })
                }
              >
                <option value="">Välj</option>
                <option value="Mycket">Mycket</option>
                <option value="Medel">Medel</option>
                <option value="Lite">Lite</option>
              </select>
            </label>
            <button onClick={handleSaveReflection}>Spara känsla</button>
          </div>
        )}

        <button onClick={onClose}>Stäng</button>
      </div>
    </div>
  );
}
