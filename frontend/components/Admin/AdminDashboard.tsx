"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import DashboardGraph from "./Dashboard/DashboardGraph";

// ── Helpers ───────────────────────────────────────────────────────────────────
function urgencyColor(daysLeft: number): string {
  if (daysLeft > 14) return "#10b981";
  if (daysLeft > 7) return "#f59e0b";
  if (daysLeft > 3) return "#f97316";
  return "#ef4444";
}
function urgencyLabel(daysLeft: number): string {
  if (daysLeft < 0) return "Overdue";
  if (daysLeft === 0) return "Today";
  return `${daysLeft}d left`;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const kpiData = [
  {
    label: "Active Compressors",
    value: 24,
    sub: "Total assets",
    icon: "⚙️",
    daysLeft: 99,
  },
  {
    label: "Overdue Maintenance",
    value: 3,
    sub: "Immediate action",
    icon: "🔴",
    daysLeft: -1,
  },
  {
    label: "Upcoming (7 Days)",
    value: 8,
    sub: "Scheduled soon",
    icon: "📅",
    daysLeft: 5,
  },
  {
    label: "Avg MTTR",
    value: "4.2h",
    sub: "Mean time to repair",
    icon: "⏱️",
    daysLeft: 99,
  },
];

const upcomingTasks = [
  {
    machine: "Compressor A1",
    location: "Plant 1",
    due: "Feb 27",
    daysLeft: 2,
    assigned: "Ali K.",
  },
  {
    machine: "Compressor B3",
    location: "Plant 2",
    due: "Feb 28",
    daysLeft: 3,
    assigned: "Mehmet Y.",
  },
  {
    machine: "Compressor C2",
    location: "Plant 1",
    due: "Mar 5",
    daysLeft: 8,
    assigned: "Sara D.",
  },
  {
    machine: "Compressor D5",
    location: "Plant 3",
    due: "Feb 20",
    daysLeft: -5,
    assigned: "John P.",
  },
];

const failureData = [
  { name: "Pressure Leak", value: 8, color: "#ef4444" },
  { name: "Belt Wear", value: 5, color: "#f97316" },
  { name: "Oil Change", value: 12, color: "#f59e0b" },
  { name: "Filter Clog", value: 6, color: "#10b981" },
  { name: "Electrical", value: 3, color: "#3b82f6" },
];

const trendData = [
  { day: "Jan 1", Completed: 4, Overdue: 1, Scheduled: 6 },
  { day: "Jan 7", Completed: 6, Overdue: 2, Scheduled: 5 },
  { day: "Jan 14", Completed: 8, Overdue: 1, Scheduled: 7 },
  { day: "Jan 21", Completed: 5, Overdue: 3, Scheduled: 8 },
  { day: "Jan 28", Completed: 9, Overdue: 1, Scheduled: 6 },
  { day: "Feb 4", Completed: 11, Overdue: 2, Scheduled: 9 },
];

const healthData = [
  { name: "Healthy", value: 65, color: "#10b981" },
  { name: "Due Soon", value: 22, color: "#f59e0b" },
  { name: "Overdue", value: 13, color: "#ef4444" },
];

const activityLog = [
  {
    icon: "✅",
    text: "Maintenance completed – Unit 7",
    time: "14m ago",
    color: "#10b981",
  },
  {
    icon: "🔴",
    text: "Overdue alert – Compressor D5",
    time: "1h ago",
    color: "#ef4444",
  },
  { icon: "⚙️", text: "Compressor A4 added", time: "2h ago", color: "#3b82f6" },
  {
    icon: "⚠️",
    text: "Filter due in 2 days – Unit 4",
    time: "3h ago",
    color: "#f97316",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────
const Badge = ({ label, color }: { label: string; color: string }) => (
  <span
    style={{
      fontSize: 11,
      fontWeight: 700,
      color,
      background: `${color}18`,
      padding: "3px 9px",
      borderRadius: 20,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

const Card = ({ children, card, border, style = {} }: any) => (
  <div
    style={{
      background: card,
      borderRadius: 14,
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: border,
      padding: 20,
      ...style,
    }}
  >
    {children}
  </div>
);

const Title = ({ children, color }: any) => (
  <div
    style={{
      fontSize: 13,
      fontWeight: 700,
      color,
      marginBottom: 14,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    }}
  >
    {children}
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [location, setLocation] = useState("All Locations");
  const [limitModal, setLimitModal] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const bg = isDark ? "#080b12" : "#f0f2f7";
  const card = isDark ? "#0f1117" : "#ffffff";
  const border = isDark ? "#1e2130" : "#e4e8f0";
  const text = isDark ? "#c9d1e0" : "#4a5568";
  const heading = isDark ? "#e2e8f0" : "#1a202c";
  const muted = isDark ? "#5a6580" : "#9aa3b0";

  if (!mounted) return <main style={{ flex: 1, background: "#f0f2f7" }} />;

  return (
    <main
      style={{
        flex: 1,
        background: bg,
        padding: 24,
        overflowY: "auto",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: heading }}>
            Dashboard
          </div>
          <div style={{ fontSize: 12, color: muted }}>
            Real-time compressor operations
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              background: card,
              border: `1px solid ${border}`,
              borderRadius: 8,
              padding: "7px 12px",
              fontSize: 12,
              color: text,
              cursor: "pointer",
            }}
          >
            {["All Locations", "Plant 1", "Plant 2", "Plant 3"].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <button
            style={{
              background: card,
              border: `1px solid ${border}`,
              borderRadius: 8,
              padding: "7px 14px",
              fontSize: 12,
              color: text,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            📤 Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(4,1fr)",
          marginBottom: 20,
        }}
      >
        {kpiData.map((k) => {
          const c = urgencyColor(k.daysLeft);
          const isOverdue = k.daysLeft < 0;
          return (
            <div
              key={k.label}
              style={{
                background: card,
                borderRadius: 14,
                padding: "18px 20px",
                borderTopWidth: "1px",
                borderTopStyle: "solid",
                borderTopColor: isOverdue ? "#ef444440" : border,
                borderRightWidth: "1px",
                borderRightStyle: "solid",
                borderRightColor: isOverdue ? "#ef444440" : border,
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
                borderBottomColor: isOverdue ? "#ef444440" : border,
                borderLeftWidth: "4px",
                borderLeftStyle: "solid",
                borderLeftColor: c,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 24 }}>{k.icon}</span>
                {k.daysLeft < 99 && (
                  <Badge label={urgencyLabel(k.daysLeft)} color={c} />
                )}
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: isOverdue ? "#ef4444" : heading,
                }}
              >
                {k.value}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: heading,
                  marginTop: 2,
                }}
              >
                {k.label}
              </div>
              <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
                {k.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Tasks */}
      <Card card={card} border={border} style={{ marginBottom: 20 }}>
        <Title color={muted}>Upcoming Maintenance</Title>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Machine", "Location", "Due Date", "Urgency", "Assigned"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: muted,
                      textAlign: "left",
                      paddingBottom: 10,
                      paddingRight: 16,
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {upcomingTasks
              .sort((a, b) => a.daysLeft - b.daysLeft)
              .map((t, i) => {
                const c = urgencyColor(t.daysLeft);
                return (
                  <tr key={i} style={{ borderTop: `1px solid ${border}` }}>
                    <td
                      style={{
                        padding: "11px 16px 11px 0",
                        fontSize: 13,
                        fontWeight: 600,
                        color: heading,
                      }}
                    >
                      {t.machine}
                    </td>
                    <td
                      style={{
                        padding: "11px 16px 11px 0",
                        fontSize: 13,
                        color: text,
                      }}
                    >
                      {t.location}
                    </td>
                    <td
                      style={{
                        padding: "11px 16px 11px 0",
                        fontSize: 13,
                        color: text,
                      }}
                    >
                      {t.due}
                    </td>
                    <td style={{ padding: "11px 16px 11px 0" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 80,
                            height: 6,
                            borderRadius: 99,
                            background: isDark ? "#1e2130" : "#e8eaf0",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              borderRadius: 99,
                              background: c,
                              width:
                                t.daysLeft < 0
                                  ? "100%"
                                  : `${Math.max(5, 100 - (t.daysLeft / 21) * 100)}%`,
                              transition: "width 0.6s ease",
                            }}
                          />
                        </div>
                        <Badge label={urgencyLabel(t.daysLeft)} color={c} />
                      </div>
                    </td>
                    <td
                      style={{ padding: "11px 0", fontSize: 13, color: text }}
                    >
                      {t.assigned}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Card>

      {/* Charts — recharts with 3D VIEW buttons */}
      <Card card={card} border={border} style={{ marginBottom: 20 }}>
        <Title color={muted}>Analytics</Title>
        <DashboardGraph
          isDark={isDark}
          failureData={failureData}
          trendData={trendData}
          healthData={healthData}
          card={card}
          border={border}
          muted={muted}
          text={text}
        />
      </Card>

      {/* Bottom row */}
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "1fr 1fr 1fr",
          marginBottom: 8,
        }}
      >
        {/* Recent Activity */}
        <Card card={card} border={border}>
          <Title color={muted}>Recent Activity</Title>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {activityLog.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  padding: "6px 0",
                  borderBottom:
                    i < activityLog.length - 1 ? `1px solid ${border}` : "none",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${a.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {a.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: text, lineHeight: 1.4 }}>
                    {a.text}
                  </div>
                  <div style={{ fontSize: 11, color: muted }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Score */}
        <Card card={card} border={border}>
          <Title color={muted}>Performance Score</Title>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: `conic-gradient(#10b981 ${87 * 3.6}deg, ${isDark ? "#1e2130" : "#e8eaf0"} 0deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  background: card,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#10b981",
                }}
              >
                87%
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: heading }}>
                System SLA
              </div>
              <div style={{ fontSize: 11, color: muted, margin: "4px 0 10px" }}>
                Based on uptime & MTTR
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Badge label="Uptime 94%" color="#3b82f6" />
                <Badge label="SLA Met 87%" color="#10b981" />
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card card={card} border={border}>
          <Title color={muted}>Quick Actions</Title>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "➕ Add Compressor", color: "#3b82f6" },
              { label: "📋 Create Maintenance Plan", color: "#10b981" },
              { label: "👤 Add Team Member", color: "#8b5cf6" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => setLimitModal(true)}
                style={{
                  background: `${btn.color}12`,
                  border: `1px solid ${btn.color}35`,
                  color: btn.color,
                  borderRadius: 9,
                  padding: "10px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Limit Modal */}
      {limitModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
          onClick={() => setLimitModal(false)}
        >
          <div
            style={{
              background: card,
              borderRadius: 16,
              padding: 32,
              maxWidth: 360,
              textAlign: "center",
              border: `1px solid ${border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🚧</div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: heading,
                marginBottom: 8,
              }}
            >
              Limit Reached
            </div>
            <div style={{ fontSize: 13, color: muted, marginBottom: 20 }}>
              Upgrade your plan to continue.
            </div>
            <button
              onClick={() => setLimitModal(false)}
              style={{
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 28px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminDashboard;
