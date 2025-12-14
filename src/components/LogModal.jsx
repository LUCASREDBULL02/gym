// src/components/LogModal.jsx
import React, { useState, useEffect } from "react";
import { EXERCISES } from "../data/exercises";

export default function LogModal({ open, onClose, onSave, lastSet }) {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [exerciseId, setExerciseId] = useState("bench");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState("");
  const [date, setDate] = useState(todayStr);

  // 🆕 Daily check-in state
  const [strengthFeel, setStrengthFeel] = useState("");
  const [mentalFeel, setMentalFeel] = useState("");
  const [energyFeel, setEnergyFeel] = useState("");

  useEffect(() => {
    if (open) {
      setDate(todayStr);
      if (lastSet) {
        setExerciseId(lastSet.exerciseId);
        setWeight(lastSet.weight);
        setReps(lastSet.reps);
      }
    }
  }, [open, lastSet, todayStr]);

  if (!open) return null;

  function saveDailyCheckin() {
    if (!strengthFeel && !mentalFeel && !energyFeel) return;

    const saved =
      JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};

    saved[date] = {
      strength: strengthFeel,
      mental: mentalFeel,
      energy: energyFeel,
    };

    localStorage.setItem("bebi_daily_checkins", JSON.stringify(saved));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!exerciseId || !weight || !reps) return;

    onSave({
      exerciseId,
      weight: Number(weight),
      reps: Number(reps),
      rpe: rpe ? Number(rpe) : null,
      date,
    });

    saveDailyCheckin();
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Logga pass 💪</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* === SET === */}
          <div className="input-group">
            <label>Övning</label>
            <select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
              {EXERCISES.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
          </div>

          <div className="profile-grid">
            <div className="input-group">
              <label>Vikt (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>

            <div className="input-group">
              <label>Reps</label>
              <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
            </div>

            <div className="input-group">
              <label>RPE</label>
              <input type="number" value={rpe} onChange={(e) => setRpe(e.target.value)} />
            </div>
          </div>

          {/* === DAILY CHECK-IN === */}
          <div className="card" style={{ marginTop: 12 }}>
            <h4 style={{ marginTop: 0 }}>🌙 Klar för dagen</h4>

            <label>Hur kände du dig styrkemässigt?</label>
            <select value={strengthFeel} onChange={(e) => setStrengthFeel(e.target.value)}>
              <option value="">– välj –</option>
              <option value="low">Svag</option>
              <option value="normal">Normal</option>
              <option value="strong">Väldigt stark</option>
            </select>

            <label>Hur kände du dig psykiskt?</label>
            <select value={mentalFeel} onChange={(e) => setMentalFeel(e.target.value)}>
              <option value="">– välj –</option>
              <option value="low">Stressad / låg</option>
              <option value="ok">Stabil</option>
              <option value="good">Motiverad</option>
            </select>

            <label>Hur var energin?</label>
            <select value={energyFeel} onChange={(e) => setEnergyFeel(e.target.value)}>
              <option value="">– välj –</option>
              <option value="low">Trött</option>
              <option value="medium">Okej</option>
              <option value="high">Hög energi</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn-pink">
              Spara & klar för dagen ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
