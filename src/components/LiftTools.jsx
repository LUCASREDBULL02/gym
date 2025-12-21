function LiftTools() {
  /* =====================
     STATE
  ===================== */
  const [tool, setTool] = React.useState("1rm");

  const [exercise, setExercise] = React.useState("Bänkpress");
  const [weight, setWeight] = React.useState("");
  const [reps, setReps] = React.useState("");
  const [oneRM, setOneRM] = React.useState(null);
  const [percent, setPercent] = React.useState(70);

  /* =====================
     1RM LOGIK
  ===================== */
  function calc1RM(w, r) {
    if (!w || !r) return null;
    return Math.round(w * (1 + r / 30));
  }

  function handle1RM() {
    const rm = calc1RM(Number(weight), Number(reps));
    setOneRM(rm);
  }

  /* =====================
     PROCENT
  ===================== */
  const percentWeight =
    oneRM ? Math.round(oneRM * (percent / 100)) : null;

  /* =====================
     VOLYM
  ===================== */
  const totalVolume =
    weight && reps
      ? Number(weight) * Number(reps)
      : null;

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="card lifttools">
      <h3>🛠 Lift Tools</h3>

      {/* TOOL SELECT */}
      <div className="lifttools-tabs">
        {[
          { id: "1rm", label: "🏋️ 1RM" },
          { id: "percent", label: "📊 %" },
          { id: "volume", label: "🔁 Volym" },
        ].map(t => (
          <button
            key={t.id}
            className={`lifttools-tab ${tool === t.id ? "active" : ""}`}
            onClick={() => setTool(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* COMMON INPUTS */}
      <div className="lifttools-grid">
        <div className="lift-input">
          <label>Övning</label>
          <input
            value={exercise}
            onChange={e => setExercise(e.target.value)}
          />
        </div>

        <div className="lift-input">
          <label>Vikt (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
          />
        </div>

        <div className="lift-input">
          <label>Reps</label>
          <input
            type="number"
            value={reps}
            onChange={e => setReps(e.target.value)}
          />
        </div>
      </div>

      {/* TOOL CONTENT */}
      {tool === "1rm" && (
        <div className="lift-card">
          <button className="primary-btn" onClick={handle1RM}>
            Beräkna 1RM
          </button>

          {oneRM && (
            <div className="lift-result">
              <strong>Uppskattad 1RM</strong>
              <div className="lift-big">{oneRM} kg</div>
              <div className="lift-sub">
                Bra riktlinje för tunga dagar & progression
              </div>
            </div>
          )}
        </div>
      )}

      {tool === "percent" && (
        <div className="lift-card">
          <label>{percent}% av 1RM</label>
          <input
            type="range"
            min="50"
            max="95"
            value={percent}
            onChange={e => setPercent(e.target.value)}
          />

          {percentWeight && (
            <div className="lift-result">
              <div className="lift-big">{percentWeight} kg</div>
              <div className="lift-sub">
                {percent >= 85
                  ? "Tung dag"
                  : percent >= 70
                  ? "Volym"
                  : "Teknik / tempo"}
              </div>
            </div>
          )}
        </div>
      )}

      {tool === "volume" && (
        <div className="lift-card">
          {totalVolume && (
            <div className="lift-result">
              <strong>Total volym</strong>
              <div className="lift-big">{totalVolume} kg</div>
              <div className="lift-sub">
                {totalVolume > 3000
                  ? "Hög belastning"
                  : "Måttlig belastning"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
