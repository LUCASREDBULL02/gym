import React, { useEffect, useState } from "react";

export default function CycleTracker() {
  const [checkins, setCheckins] = useState({});

  // 🔄 Läs från localStorage
  function loadCheckins() {
    const stored =
      JSON.parse(localStorage.getItem("bebi_daily_checkins")) || {};
    setCheckins(stored);
  }

  // 🔔 Lyssna på DailyCheckin-event
  useEffect(() => {
    loadCheckins();

    function handleUpdate() {
      loadCheckins();
    }

    window.addEvent
