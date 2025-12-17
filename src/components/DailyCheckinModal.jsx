import React, { useState } from "react";

export default function DailyCheckinModal({ open, onClose }) {
  if (!open) return null;

  const today = new Date().toISOString().slice(0, 10);

  const [strength, setStrength] = useState("");
  const [mental, setMental] = useState("");
  const [energy, setEnergy] = useState("");
  const [bleeding, setBleeding] = useState(false);

  function handleSave() {
    // Läs befintliga checkins
    const existing =
      JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};

    // Skriv/uppdatera dagens data
    existing[today] = {
      strength,
      mental,
      energy,
      bleeding,
    };

    localStorage.setItem(
      "bebi_daily_checkins",
      JSON.stringify(existing)
    );

    // 🔁 Trigga uppdatering i CycleTracker
    window.dispatchEvent(new Event("storage"));

    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">🌙 Klar för dagen</div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="input-group">
          <label>Hur kände du dig styrkemässigt?</label>
          <select value={strength} onChange={(e) => setStrength(e.target.value)}>
            <option value="">– välj –</option>
            <option value="low">Svag</option>
            <option value="normal">Normal</option>
            <option value="strong">Väldigt stark</option>
          </select>
        </div>

        <div className="input-group">
          <label>Hur kände du dig psykiskt?</label>
          <select value={mental} onChange={(e) => setMental(e.target.value)}>
            <option value="">– välj –</option>
            <option value="low">Stressad / låg</option>
            <option value="ok">Stabil</option>
            <option value="good">Motiverad</option>
          </select>
        </div>

        <div className="input-group">
          <label>Hur var energin?</label>
          <select value={energy} onChange={(e) => setEnergy(e.target.value)}>
            <option value="">– välj –</option>
            <option value="low">Trött</option>
            <option value="medium">Okej</option>
            <option value="high">Hög energi</option>
          </select>
        </div>

        <div className="input-group" style={{ marginTop: 8 }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={bleeding}
              onChange={(e) => setBleeding(e.target.checked)}
            />
            Jag blöder idag
          </label>
        </div>

        <div className="modal-footer">
          <button className="btn-pink" onClick={handleSave}>
            Spara dagen 💖
          </button>
        </div>
      </div>
    </div>
  );
}
