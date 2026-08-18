"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "next-themes";
import TeamCreate from "./TeamCreate";
import TeamAddMember from "./TeamAddMember";
import TeamMemberList from "./TeamMemberList";
import TeamList from "./TeamList";

// ---- Colors ----
function useColors(isDark: boolean) {
  return {
    bg: isDark ? "#080b12" : "#f0f2f7",
    card: isDark ? "#0f1117" : "#ffffff",
    border: isDark ? "#1e2130" : "#e4e8f0",
    text: isDark ? "#c9d1e0" : "#4a5568",
    heading: isDark ? "#e2e8f0" : "#1a202c",
    muted: isDark ? "#5a6580" : "#9aa3b0",
    th: isDark ? "#161b2a" : "#f8fafc",
    inputBg: isDark ? "#161b2a" : "#ffffff",
  };
}

// ---- Limit Modal ----
function LimitModal({ onClose, c }: { onClose: () => void; c: any }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: c.card,
          border: `1px solid ${c.border}`,
          borderRadius: 16,
          padding: 28,
          maxWidth: 380,
          width: "90%",
          textAlign: "center",
          boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: 16,
            fontWeight: 800,
            color: c.heading,
          }}
        >
          Team Limit Reached
        </h3>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: c.muted }}>
          Upgrade your plan to add more members.
        </p>
        <button
          onClick={onClose}
          style={{
            padding: "9px 20px",
            borderRadius: 8,
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

// ---- Main ----
export default function TeamContent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"members" | "teams">("members");

  const [members, setMembers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  const [limitModal, setLimitModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [addMemberModal, setAddMemberModal] = useState(false);

  const TEAM_LIMIT = 20;

  const fetchData = async () => {
    try {
      const token =
        localStorage.getItem("access_token") || localStorage.getItem("token");
      const teamsRes = await axios.get("http://127.0.0.1:8000/api/teams/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const teamsData = teamsRes.data;
      setTeams(teamsData);

      const allMembers: any[] = [];
      teamsData.forEach((team: any) => {
        if (team.members_detail && Array.isArray(team.members_detail)) {
          team.members_detail.forEach((member: any) => {
            allMembers.push({ ...member, team_name: team.name });
          });
        }
      });
      setMembers(
        Array.from(new Map(allMembers.map((m) => [m.id, m])).values()),
      );
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;
  const c = useColors(isDark);

  if (!mounted) return <main style={{ flex: 1, background: "#f0f2f7" }} />;

  const deactivate = async (id: string, currentStatus: boolean) => {
    try {
      const token =
        localStorage.getItem("access_token") || localStorage.getItem("token");
      await axios.patch(
        `http://127.0.0.1:8000/api/users/${id}/`,
        { is_active: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchData();
    } catch {
      alert("Durum güncellenemedi. Admin yetkisi gerekebilir.");
    }
  };

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
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
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
            Team Management
          </h1>
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            {["members", "teams"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0 0 4px 0",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "capitalize",
                  color: activeTab === tab ? "#3b82f6" : c.muted,
                  borderBottom:
                    activeTab === tab
                      ? "2px solid #3b82f6"
                      : "2px solid transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() =>
            activeTab === "members"
              ? members.length >= TEAM_LIMIT
                ? setLimitModal(true)
                : setAddMemberModal(true)
              : setCreateModal(true)
          }
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
          {activeTab === "members" ? "+ Add Member" : "+ Create Team"}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "members" && (
        <TeamMemberList
          members={members}
          c={c}
          isDark={isDark}
          onDeactivate={deactivate}
          onRefresh={fetchData}
        />
      )}
      {activeTab === "teams" && (
        <TeamList teams={teams} c={c} isDark={isDark} onRefresh={fetchData} />
      )}

      {/* Modals */}
      {addMemberModal && (
        <TeamAddMember
          onClose={() => setAddMemberModal(false)}
          onSuccess={() => {
            setAddMemberModal(false);
            fetchData();
          }}
          c={c}
          isDark={isDark}
          teams={teams}
        />
      )}
      {createModal && (
        <TeamCreate
          onClose={() => setCreateModal(false)}
          onSuccess={() => {
            setCreateModal(false);
            fetchData();
          }}
          c={c}
        />
      )}
      {limitModal && <LimitModal onClose={() => setLimitModal(false)} c={c} />}
    </main>
  );
}
