import React, { useState } from "react";

export default function DailyCheckinModal({ open, onClose, onSubmit }) {
  if (!open) return null;

  const today = new Date().toISOString().slice(0, 10);

  const [strength, setStrength] = useState("");
  const [mental, setMental] = useState("");
  const [energy, setEnergy] = useState("");

  function handleSave() {
    if (!strength && !mental && !energy) {
      onClose();
      return;
    }

    onSubmit({
      date: today,
      strength,
      mental,
      energy,
    });

    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">🌙 Klar för dagen</div>
          <button className="modal-close" onClick={onClose}>×</button>
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

        <div className="modal-footer">
          <button className="btn-pink" onClick={handleSave}>
            Spara dag 💖
          </button>
        </div>
      </div>
    </div>
  );
}
