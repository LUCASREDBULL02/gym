import React, { useState } from "react";

export default function LogModal({ open, onClose, onSave }) {
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState({
    strength: "",
    mood: "",
    energy: "",
  });

  if (!open) return null;

  function handleSaveReflection() {
    const today = new Date().toISOString().slice(0, 10);
    const stored =
      JSON.parse(localStorage.getItem("cycle_reflections")) || {};

    stored[today] = reflection;
    localStorage.setItem("cycle_reflections", JSON.stringify(stored));

    setShowReflection(false);
    setReflection({ strength: "", mood: "", energy: "" });
    alert("Dagens känsla sparad 💗");
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {/* ⬇⬇⬇ HÄR LIGGER DIN BEFINTLIGA LOGGA-SET UI ⬇⬇⬇ */}
        {/* onSave ska fungera exakt som innan */}
        <button onClick={onSave}>Spara set</button>

        <hr style={{ margin: "16px 0" }} />

        {!showReflection && (
          <button
            style={{
              background: "#ec4899",
              color: "white",
              padding: "8px 14px",
              borderRadius: 10,
              border: "none",
            }}
            onClick={() => setShowReflection(true)}
          >
            Klar för dagen
          </button>
        )}

        {showReflection && (
          <div style={{ marginTop: 12 }}>
            <label>
              💪 Styrka
              <select
                value={reflection.strength}
                onChange={(e) =>
                  setReflection({ ...reflection, strength: e.target.value })
                }
              >
                <option value="">Välj</option>
                <option value="strong">Stark</option>
                <option value="ok">Okej</option>
                <option value="weak">Svag</option>
              </select>
            </label>

            <label>
              🧠 Psyke
              <select
                value={reflection.mood}
                onChange={(e) =>
                  setReflection({ ...reflection, mood: e.target.value })
                }
              >
                <option value="">Välj</option>
                <option value="good">Bra</option>
                <option value="neutral">Neutral</option>
                <option value="low">Låg</option>
              </select>
            </label>

            <label>
              ⚡ Energi
              <select
                value={reflection.energy}
                onChange={(e) =>
                  setReflection({ ...reflection, energy: e.target.value })
                }
              >
                <option value="">Välj</option>
                <option value="high">Hög</option>
                <option value="medium">Medel</option>
                <option value="low">Låg</option>
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
