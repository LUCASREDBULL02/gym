import React, { useState, useMemo, useEffect } from "react";

/* ---------- COMPONENTS ---------- */
import ProfileView from "./components/ProfileView.jsx";
import LogModal from "./components/LogModal.jsx";
import DailyCheckinModal from "./components/DailyCheckinModal.jsx";
import Toast from "./components/Toast.jsx";
import MuscleMap from "./components/MuscleMap.jsx";
import BossArena from "./components/BossArena.jsx";
import Achievements from "./components/Achievements.jsx";
import BattlePass from "./components/BattlePass.jsx";
import ProgramRunner from "./components/ProgramRunner.jsx";
import PRList from "./components/PRList.jsx";
import MuscleComparison from "./components/MuscleComparison.jsx";
import LiftTools from "./components/LiftTools.jsx";
import CycleTracker from "./components/CycleTracker.jsx";

/* ---------- DATA ---------- */
import { EXERCISES } from "./data/exercises";
import { MUSCLES } from "./data/muscles";
import { STRENGTH_STANDARDS } from "./data/strengthStandards";
import { PROGRAMS } from "./data/programs";
import { initialBosses } from "./data/bosses";

/* ---------- UTILS ---------- */
import { buildComparisonChartData } from "./utils/comparisonData";
import { useBebiMood } from "./hooks/useBebiMood";

/* ---------- HELPERS ---------- */
function calc1RM(weight, reps) {
  if (!weight || !reps) return 0;
  return Math.round(weight * (1 + reps / 30));
}

/* =============================== */
/* ========== APP ================ */
/* =============================== */

export default function App() {
  /* ---------- VIEW ---------- */
  const [view, setView] = useState("dashboard");

  /* ---------- MODALS ---------- */
  const [showLogModal, setShowLogModal] = useState(false);
  const [showDailyCheckin, setShowDailyCheckin] = useState(false);

  /* ---------- DATA ---------- */
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("bebi_logs");
    return saved ? JSON.parse(saved) : [];
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("bebi_profile");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Bebi",
          age: 21,
          height: 170,
          weight: 68,
        };
  });

  const [bodyStats, setBodyStats] = useState(() => {
    const saved = localStorage.getItem("bebi_bodyStats");
    return saved
      ? JSON.parse(saved)
      : {
          waist: [],
          hips: [],
          thigh: [],
          glutes: [],
          chest: [],
          arm: [],
        };
  });

  /* ---------- SIDE EFFECTS ---------- */
  useEffect(() => {
    localStorage.setItem("bebi_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem("bebi_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("bebi_bodyStats", JSON.stringify(bodyStats));
  }, [bodyStats]);

  /* ---------- MOOD ---------- */
  const { mood, bumpMood } = useBebiMood();

  /* ---------- SAVE SET ---------- */
  function handleSaveSet(entry) {
    const finalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: entry.date || new Date().toISOString().slice(0, 10),
    };

    setLogs(prev => [finalEntry, ...prev]);
    bumpMood("train");
    setShowLogModal(false);
  }

  /* ---------- DAILY CHECK-IN ---------- */
  function handleDailyCheckin(data) {
    const saved =
      JSON.parse(localStorage.getItem("bebi_daily_checkins")) || [];

    const updated = [
      ...saved.filter(d => d.date !== data.date),
      data,
    ];

    localStorage.setItem(
      "bebi_daily_checkins",
      JSON.stringify(updated)
    );

    setShowDailyCheckin(false);
  }

  /* ---------- DERIVED DATA ---------- */
  const muscleStats = useMemo(() => {
    const stats = {};
    MUSCLES.forEach(m => {
      stats[m.id] = { score: 0 };
    });

    logs.forEach(l => {
      const oneRm = calc1RM(l.weight, l.reps);
      const std = STRENGTH_STANDARDS[l.exerciseId];
      if (!std) return;

      std.muscles.forEach(mId => {
        stats[mId].score += oneRm;
      });
    });

    return stats;
  }, [logs]);

  const comparisonData = useMemo(
    () => buildComparisonChartData(muscleStats),
    [muscleStats]
  );

  /* =============================== */
  /* ========== RENDER ============= */
  /* =============================== */

  return (
    <div className="app-shell">
      <Toast mood={mood} />

      {/* ---------- SIDEBAR ---------- */}
      <aside className="sidebar">
        <button onClick={() => setView("dashboard")}>🏠 Dashboard</button>
        <button onClick={() => setView("log")}>📓 Logga pass</button>
        <button onClick={() => setView("program")}>📅 Program</button>
        <button onClick={() => setView("boss")}>🐲 Boss</button>
        <button onClick={() => setView("ach")}>🏅 Achievements</button>
        <button onClick={() => setView("pr")}>🏆 PR</button>
        <button onClick={() => setView("profile")}>👤 Profil</button>
        <button onClick={() => setView("lift")}>📈 LiftTools</button>
        <button onClick={() => setView("cycle")}>📅 Cycle</button>
      </aside>

      {/* ---------- MAIN ---------- */}
      <main className="main">
        {/* DASHBOARD */}
        {view === "dashboard" && (
          <>
            <button
              className="btn-pink"
              onClick={() => setShowLogModal(true)}
            >
              + Logga set
            </button>

            <MuscleMap muscleStats={muscleStats} />
            <MuscleComparison data={comparisonData} />
            <BossArena bosses={initialBosses()} />
            <BattlePass />
          </>
        )}

        {/* LOG */}
        {view === "log" && (
          <div className="card">
            <button
              className="btn-pink"
              onClick={() => setShowLogModal(true)}
            >
              + Logga set
            </button>

            <button
              className="btn-secondary"
              style={{ marginLeft: 8 }}
              onClick={() => setShowDailyCheckin(true)}
            >
              🌙 Klar för dagen
            </button>

            <PRList logs={logs} />
          </div>
        )}

        {view === "program" && (
          <ProgramRunner programs={PROGRAMS} logs={logs} />
        )}

        {view === "boss" && <BossArena bosses={initialBosses()} />}

        {view === "ach" && <Achievements logs={logs} />}

        {view === "pr" && <PRList logs={logs} />}

        {view === "profile" && (
          <ProfileView
            profile={profile}
            setProfile={setProfile}
            bodyStats={bodyStats}
            setBodyStats={setBodyStats}
          />
        )}

        {view === "lift" && (
          <LiftTools
            logs={logs}
            bodyStats={bodyStats}
            onAddManual={entry =>
              setLogs(prev => [entry, ...prev])
            }
          />
        )}

        {view === "cycle" && <CycleTracker />}
      </main>

      {/* ---------- MODALS ---------- */}
      <LogModal
        open={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSave={handleSaveSet}
      />

      <DailyCheckinModal
        open={showDailyCheckin}
        onClose={() => setShowDailyCheckin(false)}
        onSubmit={handleDailyCheckin}
      />
    </div>
  );
}
