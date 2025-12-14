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
  const [moodStep, setMoodStep] = useState(0);
  const [moodAnswers, setMoodAnswers] = useState({
    strength: "",
    mood: "",
    energy: "",
  });

  useEffect(() => {
    if (open) {
      setDate(todayStr);
      if (lastSet) {
        setExerciseId(lastSet.exerciseId);
        setWeight(lastSet.weight);
        setReps(lastSet.reps);
      }
      setMoodStep(0);
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

  function handleMoodSave() {
    const saved = JSON.parse(localStorage.getItem("cycle_responses") || "{}");
    saved[date] = moodAnswers;
    localStorage.setItem("cycle_responses", JSON.stringify(saved));
    setMoodStep(0);
    alert("Dagens känsla sparad! 💗");
  }

  const moods = {
    strength: ["Stark", "Normal", "Svag"],
    mood: ["Glad", "Orolig", "Nedstämd"],
    energy: ["Mycket energi", "Okej", "Trött"],
  };

  const moodKeys = Object.keys(moods);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {moodStep > 0 ? "Hur kändes dagen?" : "Logga set ✨"}
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {moodStep === 0 ? (
          <>
            <form onSubmit={handleSubmit}>
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

              <div className="input-group">
                <label>Datum</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="profile-grid">
                <div className="input-group">
                  <label>Vikt (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Reps</label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>RPE (valfritt)</label>
                  <input
                    type="number"
                    value={rpe}
                    onChange={(e) => setRpe(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn" onClick={onClose}>
                  Avbryt
                </button>
                <button type="submit" className="btn-pink">
                  Spara set 💪
                </button>
              </div>
            </form>

            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button
                className="btn-secondary"
                onClick={() => setMoodStep(1)}
              >
                Klar för dagen 🌙
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: "1rem" }}>
            <div className="input-group">
              <label>
                {moodStep === 1 && "Hur kände du dig styrkemässigt?"}
                {moodStep === 2 && "Hur kände du dig psykiskt?"}
                {moodStep === 3 && "Hur var energinivån?"}
              </label>
              {moods[moodKeys[moodStep - 1]].map((opt) => (
                <button
                  key={opt}
                  className={`btn ${
                    moodAnswers[moodKeys[moodStep - 1]] === opt
                      ? "btn-pink"
                      : "btn-secondary"
                  }`}
                  onClick={() => {
                    setMoodAnswers((prev) => ({
                      ...prev,
                      [moodKeys[moodStep - 1]]: opt,
                    }));
                    setMoodStep((s) => s + 1);
                  }}
                  style={{ marginBottom: 6 }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {moodStep > 3 && (
              <div style={{ marginTop: 12 }}>
                <button onClick={handleMoodSave} className="btn-pink">
                  Spara dagbok 💖
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
