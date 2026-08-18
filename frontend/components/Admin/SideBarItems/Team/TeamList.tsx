import React, { useState, useEffect } from "react";
import axios from "axios";
import { Colors, Badge, roleColor } from "./TeamMemberList";

// ---- Team Manage Panel ----
function TeamManagePanel({
  team,
  c,
  onClose,
  onRefresh,
}: {
  team: any;
  c: Colors;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [teamStatus, setTeamStatus] = useState<boolean>(
    team.is_active !== false,
  );
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    setTeamStatus(team.is_active !== false);
  }, [team]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token") || localStorage.getItem("token")
      : "";

  const toggleStatus = async () => {
    setLoadingStatus(true);
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/teams/${team.id}/`,
        { is_active: !teamStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTeamStatus(!teamStatus);
      onRefresh();
    } catch {
      alert("Durum güncellenemedi.");
    } finally {
      setLoadingStatus(false);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm("Bu üyeyi gruptan çıkarmak istiyor musunuz?")) return;
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/teams/${team.id}/remove_member/`,
        { user_id: memberId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onRefresh();
    } catch {
      alert("Üye çıkarılamadı.");
    }
  };

  // --- TAKIM SİLME İŞLEMİ (YENİ) ---
  const deleteTeam = async () => {
    if (
      !confirm(
        `"${team.name}" takımını tamamen silmek istediğinize emin misiniz? Üyeler silinmez, sadece boşa çıkar.`,
      )
    )
      return;
    setLoadingStatus(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/teams/${team.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onClose();
      onRefresh();
    } catch {
      alert("Takım silinemedi.");
    } finally {
      setLoadingStatus(false);
    }
  };

  const members: any[] = team.members_detail || [];

  return (
    <div
      style={{
        width: 290,
        minWidth: 290,
        background: c.card,
        borderRadius: 14,
        border: `1px solid ${c.border}`,
        overflow: "hidden",
        alignSelf: "flex-start",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          background: c.th,
          padding: "14px 16px",
          borderBottom: `1px solid ${c.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: c.muted,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Manage Team
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: c.muted,
            fontSize: 20,
            lineHeight: 1,
            padding: 0,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: "18px 16px" }}>
        {/* Team Info */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: c.heading,
              marginBottom: 3,
            }}
          >
            {team.name}
          </div>
          <div style={{ fontSize: 12, color: c.muted }}>
            {team.description || "No description"}
          </div>
        </div>

        {/* Status Block */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: c.th,
            borderRadius: 10,
            border: `1px solid ${c.border}`,
            padding: "11px 13px",
            marginBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: c.muted,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 4,
              }}
            >
              Status
            </div>
            <Badge
              label={teamStatus ? "active" : "inactive"}
              color={teamStatus ? "#10b981" : "#9ca3af"}
            />
          </div>
          <button
            onClick={toggleStatus}
            disabled={loadingStatus}
            style={{
              padding: "8px 13px",
              borderRadius: 8,
              border: `1px solid ${teamStatus ? "#ef444440" : "#10b98140"}`,
              background: "transparent",
              color: teamStatus ? "#ef4444" : "#10b981",
              fontSize: 12,
              fontWeight: 700,
              cursor: loadingStatus ? "not-allowed" : "pointer",
              opacity: loadingStatus ? 0.6 : 1,
              transition: "background 0.15s",
            }}
          >
            {loadingStatus ? "..." : teamStatus ? "Deactivate" : "Activate"}
          </button>
        </div>

        {/* Members */}
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: c.muted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            Members ({members.length})
          </div>
          {members.length === 0 ? (
            <div
              style={{
                background: c.th,
                borderRadius: 8,
                border: `1px solid ${c.border}`,
                padding: "12px",
                fontSize: 12,
                color: c.muted,
                textAlign: "center",
              }}
            >
              No members in this team
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {members.map((m: any) => {
                const rc = roleColor(m.role);
                return (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: c.th,
                      borderRadius: 9,
                      border: `1px solid ${c.border}`,
                      padding: "8px 11px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: 27,
                          height: 27,
                          borderRadius: "50%",
                          background: rc + "22",
                          border: `1.5px solid ${rc}40`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 800,
                          color: rc,
                          flexShrink: 0,
                        }}
                      >
                        {(m.email || "U").charAt(0).toUpperCase()}
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: c.heading,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 148,
                          }}
                        >
                          {m.email}
                        </div>
                        <div style={{ fontSize: 10, color: c.muted }}>
                          {m.role || "Technician"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeMember(m.id)}
                      title="Remove from team"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#ef4444",
                        fontSize: 17,
                        padding: "2px 5px",
                        borderRadius: 5,
                        lineHeight: 1,
                        flexShrink: 0,
                        transition: "background 0.15s",
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* TEAM DELETE SECTION (YENİ EKLEME) */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: `1px solid ${c.border}`,
          }}
        >
          <button
            onClick={deleteTeam}
            disabled={loadingStatus}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              background: "#ef444410",
              color: "#ef4444",
              border: "1px solid #ef444440",
              fontSize: 12,
              fontWeight: 700,
              cursor: loadingStatus ? "not-allowed" : "pointer",
            }}
          >
            {loadingStatus ? "Deleting..." : "🗑 Delete Team Entirely"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- TeamList ----
const COLS = "1.5fr 2fr 1fr 0.8fr 100px";

export default function TeamList({
  teams,
  c,
  isDark,
  onRefresh,
}: {
  teams: any[];
  c: Colors;
  isDark: boolean;
  onRefresh: () => void;
}) {
  const [selected, setSelected] = useState<any | null>(null);

  const inp: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 7,
    border: `1px solid ${c.border}`,
    background: c.inputBg,
    color: c.text,
    fontSize: 12,
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      {/* Table */}
      <div
        style={{
          flex: 1,
          background: c.card,
          borderRadius: 14,
          border: `1px solid ${c.border}`,
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: COLS,
            padding: "12px 18px",
            borderBottom: `1px solid ${c.border}`,
            background: c.th,
          }}
        >
          {["Team Name", "Description", "Members", "Status", "Actions"].map(
            (h) => (
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
            ),
          )}
        </div>

        {/* Rows */}
        {teams.map((t, i) => (
          <div
            key={t.id}
            style={{
              display: "grid",
              gridTemplateColumns: COLS,
              padding: "13px 18px",
              alignItems: "center",
              borderBottom:
                i < teams.length - 1 ? `1px solid ${c.border}` : "none",
              background:
                selected?.id === t.id
                  ? isDark
                    ? "#1e213088"
                    : "#f0f6ff"
                  : "transparent",
              transition: "background 0.1s",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: c.heading }}>
              {t.name}
            </div>
            <div style={{ fontSize: 12, color: c.text, paddingRight: 10 }}>
              {t.description || "No description"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: c.heading }}>
              {t.members_count || 0} Members
            </div>
            <div>
              <Badge
                label={t.is_active === false ? "inactive" : "active"}
                color={t.is_active === false ? "#9ca3af" : "#10b981"}
              />
            </div>
            <button
              onClick={() => setSelected(selected?.id === t.id ? null : t)}
              style={{
                ...inp,
                background: selected?.id === t.id ? "#3b82f615" : c.inputBg,
                color: selected?.id === t.id ? "#3b82f6" : c.text,
                borderColor: selected?.id === t.id ? "#3b82f640" : c.border,
                fontWeight: selected?.id === t.id ? 700 : 400,
              }}
            >
              Manage Team
            </button>
          </div>
        ))}
      </div>

      {/* Team Manage Panel */}
      {selected && (
        <TeamManagePanel
          team={selected}
          c={c}
          onClose={() => setSelected(null)}
          onRefresh={() => {
            onRefresh();
          }}
        />
      )}
    </div>
  );
}
