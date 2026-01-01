import React, { useState } from "react";

export default function ProfileView({
  profile,
  setProfile,
  bodyStats,
  onAddMeasurement,
  onDeleteMeasurement,
}) {
  /* =========================
     FORM STATE
  ========================= */
  const [form, setForm] = useState({
    name: profile.name || "",
    age: profile.age || "",
    height: profile.height || "",
    weight: profile.weight || "",
    gender: profile.gender || "female",
  });

  /* =========================
     SAVE PROFILE (ENDA)
  ========================= */
const handleSave = () => {
  const updatedProfile = {
    ...profile,
    name: form.name,
    age: Number(form.age),
    height: Number(form.height),
    weight: Number(form.weight),
    gender: form.gender,
  };

  setProfile(updatedProfile);

  // håll form korrekt synkad
  setForm({
    name: updatedProfile.name,
    age: updatedProfile.age,
    height: updatedProfile.height,
    weight: updatedProfile.weight,
    gender: updatedProfile.gender,
  });
};

  /* =========================
     BODY MEASUREMENTS
  ========================= */
  const todayStr = new Date().toISOString().slice(0, 10);

  const [newMeasurement, setNewMeasurement] = useState({
    key: "waist",
    value: "",
    date: todayStr,
  });

  const measurementLabels = {
    waist: "Midja",
    hips: "Höfter",
    thigh: "Lår",
    glutes: "Glutes",
    chest: "Bröst",
    arm: "Arm",
  };

  function handleAddMeasurement() {
    if (!newMeasurement.value) return;

    const entry = {
      id: crypto.randomUUID(),
      date: newMeasurement.date || todayStr,
      value: Number(newMeasurement.value),
    };

    onAddMeasurement(newMeasurement.key, entry);
    setNewMeasurement((p) => ({ ...p, value: "" }));
  }

  /* =========================
     SPARKLINE
  ========================= */
  function MeasurementSparkline({ list }) {
    if (!list || list.length < 2) return null;

    const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date));
    const values = sorted.map((m) => m.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;

    const width = 120;
    const height = 36;

    const points = sorted
      .map((m, i) => {
        const x = (i / (sorted.length - 1)) * width;
        const y = height - ((m.value - min) / span) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg className="measure-sparkline" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke="#ec4899"
          strokeWidth="2"
          points={points}
        />
      </svg>
    );
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="profile-page">
      <h2 className="page-title">👤 Din profil & kroppsmått</h2>

      <div className="card">
        <h3>🏅 Grundinfo</h3>

        <div className="profile-grid">
          <Field label="Namn">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>

          <Field label="Ålder">
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
          </Field>

          <Field label="Längd (cm)">
            <input
              type="number"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
            />
          </Field>

          <Field label="Kön">
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="female">Kvinna</option>
              <option value="male">Man</option>
            </select>
          </Field>

          <Field label="Vikt (kg)">
            <input
              type="number"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
          </Field>
        </div>

        <button className="primary-btn" onClick={handleSave}>
          💾 Spara profil
        </button>
      </div>

      <div className="card">
        <h3>📏 Kroppsmått & utveckling</h3>

        <div className="measure-input-row">
          <select
            value={newMeasurement.key}
            onChange={(e) =>
              setNewMeasurement({ ...newMeasurement, key: e.target.value })
            }
          >
            {Object.entries(measurementLabels).map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="cm"
            value={newMeasurement.value}
            onChange={(e) =>
              setNewMeasurement({ ...newMeasurement, value: e.target.value })
            }
          />

          <input
            type="date"
            value={newMeasurement.date}
            onChange={(e) =>
              setNewMeasurement({ ...newMeasurement, date: e.target.value })
            }
          />

          <button onClick={handleAddMeasurement}>＋</button>
        </div>

        {Object.entries(measurementLabels).map(([key, label]) => {
          const list = bodyStats[key] || [];
          return (
            <div key={key} className="measurement-card">
              <div className="measurement-header">
                <strong>{label}</strong>
                <MeasurementSparkline list={list} />
              </div>

              {list.map((m) => (
                <div key={m.id} className="measurement-row">
                  <span>
                    {m.value} cm · {m.date}
                  </span>
                  <button onClick={() => onDeleteMeasurement(key, m.id)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================
   SMALL HELPER
========================= */
function Field({ label, children }) {
  return (
    <div>
      <label>{label}</label>
      {children}
    </div>
  );
}
