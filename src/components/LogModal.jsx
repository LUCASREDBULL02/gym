import React, { useState, useEffect } from "react";
import { EXERCISES } from "../data/exercises";

export default function LogModal({ open, onClose, onSave, lastSet, showDailyLogPrompt = false }) {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [exerciseId, setExerciseId] = useState("bench");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState("");
  const [date, setDate] = useState(todayStr);

  const [showDailyForm, setShowDailyForm] = useState(false);
  const [physical, setPhysical] = useState("");
  const [mental, setMental] = useState("");
  const [energy, setEnergy] = useState("");

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
  }

  function handleDailySubmit() {
    const log = {
      date: todayStr,
      physical,
      mental,
      energy,
    };
    const existing = JSON.parse(localStorage.getItem("cycleFeelings") || "[]");
    const updated = [...existing.filter((e) => e.date !== todayStr), log];
    localStorage.setItem("cycleFeelings", JSON.stringify(updated));
    setShowDailyForm(false);
    alert("Tack! Dagens känsla har loggats 💖");
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Logga set ✨</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Övning</label>
            <select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
              {EXERCISES.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Datum</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
              <label>RPE (valfritt)</label>
              <input type="number" value={rpe} onChange={(e) => setRpe(e.target.value)} />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn" onClick={onClose}>Avbryt</button>
            <button type="submit" className="btn-pink">Spara set 💪</button>
          </div>
        </form>

        {showDailyLogPrompt && (
          <>
            <hr />
            <button className="btn-pink" onClick={() => setShowDailyForm(true)}>Klar för dagen</button>
          </>
        )}

        {showDailyForm && (
          <div className="daily-log-form">
            <h3>Hur kändes kroppen idag?</h3>
            <label>Styrka:</label>
            <select value={physical} onChange={(e) => setPhysical(e.target.value)}>
              <option value="">Välj</option>
              <option>Mycket stark</option>
              <option>Medel</option>
              <option>Svag</option>
            </select>
            <label>Psykiskt:</label>
            <select value={mental} onChange={(e) => setMental(e.target.value)}>
              <option value="">Välj</option>
              <option>Motiverad</option>
              <option>Neutral</option>
              <option>Nedstämd</option>
            </select>
            <label>Energi:</label>
            <select value={energy} onChange={(e) => setEnergy(e.target.value)}>
              <option value="">Välj</option>
              <option>Hög</option>
              <option>Normal</option>
              <option>Låg</option>
            </select>
            <button className="btn-pink mt-2" onClick={handleDailySubmit}>Spara känsla 🧠</button>
          </div>
        )}
      </div>
    </div>
  );
}
