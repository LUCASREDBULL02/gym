import { useMemo, useState } from "react";

/**
 * LiftTools
 * Förutsätter props:
 * - logs: array av träningsloggar
 * - bodyStats: array av kroppsmått
 * - onAddManual: callback(entry)
 */
export default function LiftTools({ logs = [], bodyStats = [], onAddManual }) {
  const [exercise, setExercise] = useState("Bänkpress");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  /* =========================
     1RM & VOLYM
  ========================= */

  const oneRM = useMemo(() => {
    if (!weight || !reps) return null;
    return Math.round(weight * (1 + reps / 30));
  }, [weight, reps]);

  const totalVolume = useMemo(() => {
    if (!weight || !reps) return null;
    return Number(weight) * Number(reps);
  }, [weight, reps]);

  /* =========================
     HISTORIK (LOGS)
  ========================= */

  const exerciseLogs = useMemo(() => {
    return logs
      .filter((l) => l.exercise === exercise && l.weight)
      .slice(0, 10);
  }, [logs, exercise]);

  /* =========================
     KROPPSMÅTT
  ========================= */

  const waistData = useMemo(() => {
    return bodyStats
      .filter((b) => b.waist)
      .map((b) => ({
        date: b.date,
        value: b.waist,
      }));
  }, [bodyStats]);

  /* =========================
     SPARA MANUELLT LYFT
  ========================= */

  function saveLift() {
    if (!weight || !reps) return;

    onAddManual?.({
      type: "manual-lift",
      exercise,
      weight: Number(weight),
      reps: Number(reps),
      date: new Date().toISOString().slice(0, 10),
    });

    setWeight("");
    setReps("");
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="lifttools">
      {/* 1RM / INPUT */}
      <div className="card">
        <h3>🏋️ Lift Tools</h3>

        <div className="lifttools-grid">
          <div className="lift-input">
            <label>Övning</label>
            <select value={exercise} onChange={(e) => setExercise(e.target.value)}>
              <option>Bänkpress</option>
              <option>Knäböj</option>
              <option>Marklyft</option>
              <option>Hip Thrust</option>
              <option>Militärpress</option>
            </select>
          </div>

          <div className="lift-input">
            <label>Vikt (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="lift-input">
            <label>Reps</label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </div>
        </div>

        <button className="lift-btn" onClick={saveLift}>
          Spara lyft
        </button>

        {(oneRM || totalVolume) && (
          <div className="lift-result">
            {oneRM && (
              <div>
                <strong>Uppskattad 1RM:</strong> {oneRM} kg
              </div>
            )}
            {totalVolume && (
              <div>
                <strong>Set-volym:</strong> {totalVolume} kg
              </div>
            )}
          </div>
        )}
      </div>

      {/* HISTORIK */}
      <div className="card">
        <h4>📈 Senaste {exercise}</h4>
        {exerciseLogs.length === 0 ? (
          <div className="small">Inga loggade lyft ännu.</div>
        ) : (
          exerciseLogs.map((l, i) => (
            <div key={i} className="small">
              {l.date}: {l.weight} kg × {l.reps}
            </div>
          ))
        )}
      </div>

      {/* KROPPSMÅTT */}
      <div className="card">
        <h4>📏 Midjemått</h4>
        {waistData.length === 0 ? (
          <div className="small">Inga kroppsmått loggade.</div>
        ) : (
          waistData.map((w, i) => (
            <div key={i} className="small">
              {w.date}: {w.value} cm
            </div>
          ))
        )}
      </div>
    </div>
  );
}
