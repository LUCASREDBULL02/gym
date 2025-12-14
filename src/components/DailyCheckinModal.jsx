import React, { useState } from "react";

const ACCENT = "#ec4899";

export default function DailyCheckinModal({ open, onClose, onSave }) {
  const today = new Date().toISOString().slice(0, 10);

  const [strength, setStrength] = useState("");
  const [energy, setEnergy] = useState("");
  const [mental, setMental] = useState("");

  if (!open) return null;

  function handleSave() {
    if (!strength || !energy || !mental) return;

    const entry = {
      date: today,
      strength,
      energy,
      mental,
    };

    const existing =
      JSON.parse(localStorage.getItem("bebi_cycle_checkins")) || [];

    const filtered = existing.filter((e) => e.date !== today);
    const updated = [...filtered, entry];

    localStorage.setItem(
      "bebi_cycle_checkins",
      JSON.stringify(updated)
    );

    onSave?.(entry);
    onClose();
  }

  function Option({ label, value, active, onClick }) {
    return (
      <button
        onClick={() => onClick(value)}
        style={{
          padding: "8px 12px",
          borderRadius: 10,
          border: `1px solid ${active ? ACCENT : "rgba(148,163,184,0.4)"}`,
          background: active ? ACCENT : "rgba(15,23,42,0.9)",
          color: active ? "#020617" : "#e5e7eb",
          fontSize: 13,
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: 420,
          background: "#020617",
          borderRadius: 16,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <h3 style={{ margin: 0 }}>🌙 Klar för dagen</h3>

        {/* STYRKA */}
        <div>
          <div style={{ fontSize: 13, marginBottom: 6 }}>💪 Styrka</div>
          <div style={{ display: "flex", gap: 6 }}>
            <Option label="Stark" value="strong" active={strength === "strong"} onClick={setStrength} />
            <Option label="Normal" value="normal" active={strength === "normal"} onClick={setStrength} />
            <Option label="Svag" value="weak" active={strength === "weak"} onClick={setStrength} />
          </div>
        </div>

        {/* ENERGI */}
        <div>
          <div style={{ fontSize: 13, marginBottom: 6 }}>⚡ Energi</div>
          <div style={{ display: "flex", gap: 6 }}>
            <Option label="Hög" value="high" active={energy === "high"} onClick={setEnergy} />
            <Option label="Okej" value="medium" active={energy === "medium"} onClick={setEnergy} />
            <Option label="Låg" value="low" active={energy === "low"} onClick={setEnergy} />
          </div>
        </div>

        {/* PSYKISKT */}
        <div>
          <div style={{ fontSize: 13, marginBottom: 6 }}>🧠 Psykiskt</div>
          <div style={{ display: "flex", gap: 6 }}>
            <Option label="Bra" value="good" active={mental === "good"} onClick={setMental} />
            <Option label="Neutral" value="neutral" active={mental === "neutral"} onClick={setMental} />
            <Option label="Låg" value="low" active={mental === "low"} onClick={setMental} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          <button onClick={onClose} className="btn">Avbryt</button>
          <button onClick={handleSave} className="btn-pink">Spara 🌸</button>
        </div>
      </div>
    </div>
  );
}
