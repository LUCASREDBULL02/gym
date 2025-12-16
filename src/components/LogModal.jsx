import React, { useState, useEffect } from "react";
import { EXERCISES } from "../data/exercises";

export default function LogModal({ open, onClose, onSave, lastSet }) {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [exerciseId, setExerciseId] = useState("bench");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState("");
  const [date, setDate] = useState(todayStr);

  useEffect(() => {
    if (open) {
      setDate(todayStr);
      if (lastSet) {
        setExerciseId(lastSet.exerciseId);
        setWeight(lastSet.weight);
        setReps(lastSet.reps);
        setRpe(lastSet.rpe || "");
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

    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <div className="modal-title">💪 Logga set</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* DATUM */}
          <div className="input-group">
            <label>Datum</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* ÖVNING */}
          <div className="input-group">
            <label>Övning</label>
            <select
              value={exerciseId}
              onChange={(e) => setExerciseId(e.target.value)}
            >
              {EXERCISES.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>

          {/* === VIKT / REPS / RPE (SAMMA FRAME) === */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
              marginTop: 8,
            }}
          >
           {/* === SET INPUTS === */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 10,
    marginTop: 8,
  }}
>
  <div className="input-group">
    <label>Vikt (kg)</label>
    <input
      type="number"
      placeholder="t.ex. 60"
      value={weight}
      onChange={(e) => setWeight(e.target.value)}
    />
  </div>

  <div className="input-group">
    <label>Reps</label>
    <input
      type="number"
      placeholder="t.ex. 8"
      value={reps}
      onChange={(e) => setReps(e.target.value)}
    />
  </div>

  <div className="input-group">
    <label>RPE (valfritt)</label>
    <input
      type="number"
      placeholder="8–10"
      value={rpe}
      onChange={(e) => setRpe(e.target.value)}
    />
  </div>
</div>

          {/* FOOTER */}
          <div className="modal-footer" style={{ marginTop: 14 }}>
            <button type="submit" className="btn-pink" style={{ width: "100%" }}>
              💾 Spara set
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
