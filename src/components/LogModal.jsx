import React, { useState } from "react";
import { EXERCISES } from "../data/exercises";

const ACCENT = "#ec4899";

export default function LogModal({ open, onClose, onSave }) {
  const today = new Date().toISOString().slice(0, 10);

  // --- Logga set ---
  const [exerciseId, setExerciseId] = useState("bench");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [date, setDate] = useState(today);

  // --- Klar för dagen ---
  const [showCheckin, setShowCheckin] = useState(false);
  const [strength, setStrength] = useState("neutral");
  const [energy, setEnergy] = useState("neutral");
  const [mental, setMental] = useState("neutral");

  if (!open) return null;

  function handleSaveSet() {
    if (!exerciseId || !weight || !reps) return;

    onSave({
      exerciseId,
      weight: Number(weight),
      reps: Number(reps),
      date,
    });

    setWeight("");
    setReps("");
  }

  function handleSaveCheckin() {
    const entry = {
      date,
      strength,
      energy,
      mental,
    };

    const key = "bebi_cycle_checkins";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify([...prev, entry]));

    setShowCheckin(false);
    onClose();
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={{ marginTop: 0 }}>Logga set 💗</h3>

        {/* === LOGGA SET === */}
        <div style={grid}>
          <select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
            {EXERCISES.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Vikt (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />

          <input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />

          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <button style={primaryBtn} onClick={handleSaveSet}>
          Spara set
        </button>

        {/* === KLAR FÖR DAGEN === */}
        {!showCheckin && (
          <button
            style={{ ...primaryBtn, marginTop: 12, background: "#f472b6" }}
            onClick={() => setShowCheckin(true)}
          >
            Klar för dagen 🌙
          </button>
        )}

        {showCheckin && (
          <div style={{ marginTop: 16 }}>
            <h4>Hur kände du dig idag?</h4>

            <Section title="Styrka">
              <Choice value={strength} setValue={setStrength} />
            </Section>

            <Section title="Energi">
              <Choice value={energy} setValue={setEnergy} />
            </Section>

            <Section title="Psykiskt">
              <Choice value={mental} setValue={setMental} />
            </Section>

            <button style={primaryBtn} onClick={handleSaveCheckin}>
              Spara dagskänsla
            </button>
          </div>
        )}

        <button style={ghostBtn} onClick={onClose}>Stäng</button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <strong>{title}</strong>
      {children}
    </div>
  );
}

function Choice({ value, setValue }) {
  const opts = [
    ["low", "Låg"],
    ["neutral", "Neutral"],
    ["high", "Hög"],
  ];

  return (
    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
      {opts.map(([v, label]) => (
        <button
          key={v}
          onClick={() => setValue(v)}
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            border: value === v ? `2px solid ${ACCENT}` : "1px solid #444",
            background: "#020617",
            color: "#fff",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 50,
};

const modal = {
  width: 360,
  background: "#020617",
  borderRadius: 16,
  padding: 16,
  color: "#fff",
};

const grid = {
  display: "grid",
  gap: 8,
};

const primaryBtn = {
  marginTop: 8,
  padding: "10px",
  borderRadius: 12,
  border: "none",
  background: ACCENT,
  color: "#020617",
  fontWeight: 600,
};

const ghostBtn = {
  marginTop: 8,
  background: "transparent",
  color: "#aaa",
  border: "none",
};
