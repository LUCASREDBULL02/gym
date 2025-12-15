// src/App.jsx
import React, { useState, useMemo, useEffect } from "react";
import ProfileView from "./components/ProfileView.jsx";
import Toast from "./components/Toast.jsx";
import DailyCheckinModal from "./components/DailyCheckinModal.jsx";
import LogModal from "./components/LogModal.jsx";
import MuscleMap from "./components/MuscleMap.jsx";
import BossArena from "./components/BossArena.jsx";
import Achievements from "./components/Achievements.jsx";
import BattlePass from "./components/BattlePass.jsx";
import ProgramRunner from "./components/ProgramRunner.jsx";
import PRList from "./components/PRList.jsx";
import MuscleComparison from "./components/MuscleComparison.jsx";
import LiftTools from "./components/LiftTools.jsx";
import { buildComparisonChartData } from "./utils/comparisonData.js";
import { useBebiMood } from "./hooks/useBebiMood.js";
import { EXERCISES } from "./data/exercises";
import { MUSCLES } from "./data/muscles";
import { STRENGTH_STANDARDS } from "./data/strengthStandards";
import { PROGRAMS } from "./data/programs";
import { initialBosses } from "./data/bosses";

/* ------------------ KONSTANTER ------------------ */

const BATTLE_REWARDS = [
  { id: "r_50xp", xpRequired: 50, label: "Warmup Queen", desc: "Första 50 XP", emoji: "💖" },
  { id: "r_200xp", xpRequired: 200, label: "Tier 2 Gift", desc: "Tier 2", emoji: "🎁" },
  { id: "r_500xp", xpRequired: 500, label: "Boss Slayer", desc: "Mycket XP", emoji: "🐲" },
  { id: "r_1000xp", xpRequired: 1000, label: "Legendary Bebi", desc: "1000+ XP", emoji: "🌟" },
];

function calc1RM(weight, reps) {
  if (!weight || !reps) return 0;
  return Math.round(weight * (1 + reps / 30));
}

/* ------------------ APP ------------------ */

export default function App() {
  const [view, setView] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [showDailyCheckin, setShowDailyCheckin] = useState(false);
  const [toast, setToast] = useState(null);

  /* ---------- DATA ---------- */

  const [logs, setLogs] = useState(() =>
    JSON.parse(localStorage.getItem("bebi_logs")) || []
  );
  useEffect(() => {
    localStorage.setItem("bebi_logs", JSON.stringify(logs));
  }, [logs]);

  const [profile, setProfile] = useState(() =>
    JSON.parse(localStorage.getItem("bebi_profile")) || {
      name: "Maria Kristina",
      nick: "Bebi",
      age: 21,
      height: 170,
      weight: 68,
    }
  );

  const [bodyStats, setBodyStats] = useState(() =>
    JSON.parse(localStorage.getItem("bebi_bodyStats")) || {
      waist: [],
      hips: [],
      thigh: [],
      glutes: [],
      chest: [],
      arm: [],
    }
  );

  /* ---------- DAILY CHECKIN ---------- */

  function handleDailyCheckin(data) {
    const today = new Date().toISOString().slice(0, 10);
    const saved = JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};

    saved[today] = { ...data, date: today };
    localStorage.setItem("bebi_daily_checkins", JSON.stringify(saved));

    setShowDailyCheckin(false);
    showToastMsg("🌙 Klar för dagen", "Din dagsform är sparad 💗");
  }

  /* ---------- TOAST ---------- */

  function showToastMsg(title, subtitle) {
    setToast({ title, subtitle });
    setTimeout(() => setToast(null), 2500);
  }

  /* ---------- RENDER ---------- */

  return (
    <div className="app-shell">
      {toast && <Toast title={toast.title} subtitle={toast.subtitle} />}

      {/* SIDEBAR */}
      <aside className="sidebar">
        {[
          ["dashboard", "🏠 Dashboard"],
          ["log", "📓 Log"],
          ["program", "📅 Program"],
          ["boss", "🐲 Boss"],
          ["ach", "🏅 Achievements"],
          ["pr", "🏆 PR"],
          ["profile", "👤 Profil"],
          ["lift", "📈 LiftTools"],
        ].map(([id, label]) => (
          <button
            key={id}
            className={`sidebar-link ${view === id ? "active" : ""}`}
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="main-header">
          <div>
            <div className="main-title">Hej {profile.nick}! 💖</div>
            <div className="main-sub">Redo att bli starkare idag?</div>
          </div>
          <button className="btn-pink" onClick={() => setShowModal(true)}>
            + Logga set
          </button>
        </div>

        {/* LOG VIEW */}
        {view === "log" && (
          <div className="card">
            <button
              className="btn-pink"
              style={{ marginBottom: 12 }}
              onClick={() => setShowDailyCheckin(true)}
            >
              🌙 Klar för dagen
            </button>

            <h3>Loggade set</h3>
            <ul>
              {logs.map((l) => (
                <li key={l.id}>
                  {l.date} • {l.exerciseId} • {l.weight}kg × {l.reps}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <LogModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={(entry) => setLogs((prev) => [entry, ...prev])}
      />

      <DailyCheckinModal
        open={showDailyCheckin}
        onClose={() => setShowDailyCheckin(false)}
        onSubmit={handleDailyCheckin}
      />
    </div>
  );
}
