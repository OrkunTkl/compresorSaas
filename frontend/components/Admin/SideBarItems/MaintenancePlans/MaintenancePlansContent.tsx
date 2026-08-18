"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "next-themes";
import MaintenancePlansCreate, { Plan } from "./MaintenancePlansCreate";
import MaintenancePlansEdit from "./MaintenancePlansEdit";

const TEAMS = ["Team Alpha", "Team Beta", "Team Gamma"];
const API_URL = "http://127.0.0.1:8000/api/plans/";
const COMPRESSORS_API_URL = "http://127.0.0.1:8000/api/compressors/";

const EMPTY: Plan = {
  id: "",
  name: "",
  frequency: "30",
  team: TEAMS[0],
  compressors: [],
  status: "draft",
  checklist: [],
};

const statusColor = (s: string) =>
  s === "active" ? "#10b981" : s === "draft" ? "#f59e0b" : "#9ca3af";

const StatusBadge = ({ s }: { s: string }) => {
  const color = statusColor(s);
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color,
        background: `${color}18`,
        padding: "4px 10px",
        borderRadius: 20,
        border: `1px solid ${color}30`,
        whiteSpace: "nowrap",
        textTransform: "capitalize",
      }}
    >
      {s}
    </span>
  );
};

function useColors(isDark: boolean) {
  return {
    bg: isDark ? "#080b12" : "#f0f2f7",
    card: isDark ? "#0f1117" : "#ffffff",
    border: isDark ? "#1e2130" : "#e4e8f0",
    text: isDark ? "#c9d1e0" : "#4a5568",
    heading: isDark ? "#e2e8f0" : "#1a202c",
    muted: isDark ? "#5a6580" : "#9aa3b0",
    tableHeader: isDark ? "#161b2a" : "#f8fafc",
    inputBg: isDark ? "#161b2a" : "#ffffff",
  };
}

export default function MaintenancePlansContent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [modal, setModal] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  // Kompresör isimlerini ID bazlı tutmak için sözlük (Lookup Table)
  const [compLookup, setCompLookup] = useState<{ [key: string]: string }>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Önce kompresörleri çekip ID -> İsim haritası oluşturuyoruz
      const compRes = await axios.get(COMPRESSORS_API_URL, { headers });
      const lookup: { [key: string]: string } = {};
      compRes.data.forEach((c: any) => {
        lookup[String(c.id)] = c.name || c.serial_number;
      });
      setCompLookup(lookup);

      // 2. Sonra bakım planlarını çekiyoruz
      const planRes = await axios.get(API_URL, { headers });
      const formattedPlans = planRes.data.map((p: any) => ({
        ...p,
        frequency: String(p.interval_days || "30"),
        compressors: Array.isArray(p.compressors) ? p.compressors : [],
      }));

      setPlans(formattedPlans);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const del = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData(); // Listeyi yenile
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Failed to delete the plan.");
    }
  };

  const save = (updatedPlan: Plan) => {
    fetchData();
    setModal(null);
  };

  const isDark = mounted ? resolvedTheme === "dark" : false;
  const c = useColors(isDark);

  if (!mounted) return <main style={{ flex: 1, background: "#f0f2f7" }} />;

  const COLS = "2fr 1fr 1.2fr 1fr 1fr 80px";
  const HEADERS = [
    "Plan Name",
    "Frequency",
    "Team",
    "Compressors",
    "Status",
    "Actions",
  ];

  return (
    <main
      style={{
        flex: 1,
        background: c.bg,
        padding: 24,
        minHeight: "100vh",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: c.heading,
              margin: 0,
            }}
          >
            Maintenance Plans
          </h1>
          <div style={{ fontSize: 12, color: c.muted, marginTop: 4 }}>
            {plans.length} plans ·{" "}
            {plans.filter((p) => p.status === "active").length} active
          </div>
        </div>
        <button
          onClick={() => setModal({ ...EMPTY })}
          style={{
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(59,130,246,0.25)",
          }}
        >
          + Create Plan
        </button>
      </div>

      <div
        style={{
          background: c.card,
          borderRadius: 14,
          border: `1px solid ${c.border}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: COLS,
            padding: "12px 18px",
            borderBottom: `1px solid ${c.border}`,
            background: c.tableHeader,
          }}
        >
          {HEADERS.map((h) => (
            <div
              key={h}
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: c.muted,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: c.muted }}>
            Loading plans...
          </div>
        ) : plans.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: c.muted }}>
            No plans found.
          </div>
        ) : (
          plans.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: "grid",
                gridTemplateColumns: COLS,
                padding: "14px 18px",
                alignItems: "center",
                borderBottom:
                  i < plans.length - 1 ? `1px solid ${c.border}` : "none",
              }}
            >
              <div>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: c.heading }}
                >
                  {p.name}
                </div>
                <div style={{ fontSize: 12, color: c.muted }}>
                  {p.checklist?.length || 0} items
                </div>
              </div>

              <div style={{ fontSize: 13, color: c.text }}>
                {p.frequency === "custom" ? "Custom" : `${p.frequency} days`}
              </div>

              <div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "3px 9px",
                    borderRadius: 6,
                    background: "#3b82f618",
                    color: "#3b82f6",
                  }}
                >
                  {p.team}
                </span>
              </div>

              {/* KOMPRESÖR İSİMLERİNİN GÖSTERİLDİĞİ KRİTİK ALAN */}
              <div style={{ fontSize: 12, color: c.muted }}>
                {p.compressors && p.compressors.length > 0
                  ? p.compressors
                      .slice(0, 2)
                      .map((comp: any) => {
                        // Eğer comp bir objeyse name'i al, değilse lookup'tan ismi çek
                        if (typeof comp === "object" && comp !== null)
                          return comp.name;
                        return compLookup[String(comp)] || `ID: ${comp}`;
                      })
                      .join(", ") +
                    (p.compressors.length > 2
                      ? ` +${p.compressors.length - 2}`
                      : "")
                  : "—"}
              </div>

              <div>
                <StatusBadge s={p.status} />
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setModal(p)}
                  style={{
                    background: "none",
                    border: `1px solid ${c.border}`,
                    borderRadius: 7,
                    width: 28,
                    height: 28,
                    cursor: "pointer",
                    color: "#3b82f6",
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => del(String(p.id))}
                  style={{
                    background: "none",
                    border: `1px solid ${c.border}`,
                    borderRadius: 7,
                    width: 28,
                    height: 28,
                    cursor: "pointer",
                    color: c.muted,
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modal &&
        (modal.id === "" ? (
          <MaintenancePlansCreate
            plan={modal}
            onClose={() => setModal(null)}
            onSave={save}
            colors={c}
          />
        ) : (
          <MaintenancePlansEdit
            plan={modal}
            onClose={() => setModal(null)}
            onSave={save}
            colors={c}
          />
        ))}
    </main>
  );
}
