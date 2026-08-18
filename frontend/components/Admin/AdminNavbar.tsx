"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const AdminNavbar: React.FC = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Sayfa mount olduğunda çalışır
  useEffect(() => {
    setMounted(true);
  }, []);

  // Henüz mount olmadıysa (sunucu tarafındaysak) içeriği saklıyoruz
  // Bu, hydration hatasını %100 çözer.
  if (!mounted) {
    return <header style={{ height: 56 }} />; // Boş bir placeholder
  }

  const isDark = resolvedTheme === "dark";

  const bg = isDark ? "#0f1117" : "#ffffff";
  const border = isDark ? "#1e2130" : "#e8eaf0";
  const muted = isDark ? "#5a6580" : "#9aa3b0";

  return (
    <header
      style={{
        height: 56,
        background: bg,
        borderBottom: `1px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        flexShrink: 0,
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Sol: Sayfa Başlığı */}
      <span className="font-bold text-[25px]">AirTech</span>

      {/* Sağ: İşlemler */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Arama Çubuğu */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: isDark ? "#161b2a" : "#f4f6f9",
            border: `1px solid ${border}`,
            borderRadius: 8,
            padding: "5px 12px",
            color: muted,
            fontSize: 13,
          }}
        >
          <span>🔍</span>
          <span>Search…</span>
        </div>

        {/* Tema Değiştirici */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          style={{
            position: "relative",
            display: "inline-flex",
            height: 32,
            width: 56,
            alignItems: "center",
            borderRadius: 9999,
            border: "none",
            cursor: "pointer",
            background: isDark ? "#374151" : "#e5e7eb",
            transition: "background 0.5s",
          }}
          aria-label="Toggle Theme"
        >
          <span
            style={{
              display: "flex",
              height: 24,
              width: 24,
              transform: isDark ? "translateX(28px)" : "translateX(4px)",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              transition: "transform 0.5s",
              fontSize: 13,
            }}
          >
            {isDark ? "🌙" : "💡"}
          </span>
        </button>

        {/* Bildirimler */}
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            color: muted,
            position: "relative",
          }}
        >
          🔔
          <span
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ef4444",
              border: `2px solid ${bg}`,
            }}
          />
        </button>

        {/* Profil Avatarı */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          JD
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
