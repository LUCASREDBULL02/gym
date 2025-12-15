import React, { useEffect, useState } from "react";

export default function CycleTracker() {
  const [data, setData] = useState({});

  useEffect(() => {
    const read = () => {
      const raw = localStorage.getItem("bebi_daily_checkins");
      console.log("READ LS", raw);
      setData(raw ? JSON.parse(raw) : {});
    };

    read();

    window.addEventListener("bebi-checkin-updated", read);
    return () =>
      window.removeEventListener("bebi-checkin-updated", read);
  }, []);

  return (
    <div className="card">
      <h3>Cycle debug</h3>
      <pre style={{ fontSize: 11 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
