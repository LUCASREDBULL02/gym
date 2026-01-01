import React from "react";
import BebiAvatar from "./BebiAvatar.jsx";

export default function ProfileCard({ profile }) {
  return (
    <div
      className="card"
      style={{
        padding: 14,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <BebiAvatar size={80} />

      <div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          {profile.name}
        </div>
       <div style={{ fontSize: 14, opacity: 0.8, display: "flex", flexWrap: "wrap", gap: 6 }}>
  {profile.nick && <span>✨ {profile.nick}</span>}
  {profile.gender && (
    <span>
      {profile.gender === "female"
        ? "♀ Kvinna"
        : profile.gender === "male"
        ? "♂ Man"
        : "⚧ Annat"}
    </span>
  )}
  {profile.height && <span>📏 {profile.height} cm</span>}
  {profile.weight && <span>⚖️ {profile.weight} kg</span>}
  {profile.age && <span>🎂 {profile.age} år</span>}
</div>
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            background: "#ec48991a",
            color: "#ec4899",
            padding: "4px 8px",
            borderRadius: 6,
            display: "inline-block",
          }}
        >
          Bebi-mode aktiv 💖
        </div>
      </div>
    </div>
  );
}


