"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const HISTORY = [
  {
    id: "1",
    machine: "Atlas Copco GA37",
    plan: "Monthly Inspection",
    team: "Team Alpha",
    completed: "2026-02-10",
    duration: "1h 20m",
    status: "completed",
  },
  {
    id: "2",
    machine: "Kaeser ASD 40",
    plan: "Quarterly Overhaul",
    team: "Team Beta",
    completed: "2026-02-05",
    duration: "3h 10m",
    status: "completed",
  },
  {
    id: "3",
    machine: "Quincy QSI 500",
    plan: "Monthly Inspection",
    team: "Team Alpha",
    completed: "—",
    duration: "—",
    status: "overdue",
  },
  {
    id: "4",
    machine: "Ingersoll Rand R-Series",
    plan: "Bi-Annual Service",
    team: "Team Gamma",
    completed: "2026-01-20",
    duration: "5h 45m",
    status: "completed",
  },
];

const MONTHLY = [
  { month: "Sep", completed: 4, overdue: 1 },
  { month: "Oct", completed: 6, overdue: 0 },
  { month: "Nov", completed: 5, overdue: 2 },
  { month: "Dec", completed: 7, overdue: 1 },
  { month: "Jan", completed: 8, overdue: 0 },
  { month: "Feb", completed: 5, overdue: 1 },
];

const LOCATIONS = [
  { name: "Istanbul HQ", completed: 12, overdue: 1, sla: 96 },
  { name: "Ankara Branch", completed: 8, overdue: 2, sla: 82 },
  { name: "Izmir Plant", completed: 15, overdue: 0, sla: 100 },
];

const SLA = [
  { plan: "Monthly Inspection", target: "30d", actual: "28d", met: true },
  { plan: "Quarterly Overhaul", target: "90d", actual: "94d", met: false },
  { plan: "Bi-Annual Service", target: "180d", actual: "178d", met: true },
];

type Record = (typeof HISTORY)[0];

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
    bar: isDark ? "#1e2130" : "#e8eaf0",
  };
}

const sColor = (s: string) => (s === "completed" ? "#10b981" : "#ef4444");
const Badge = ({ s }: { s: string }) => {
  const color = sColor(s);
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color,
        background: `${color}18`,
        padding: "3px 9px",
        borderRadius: 20,
        border: `1px solid ${color}30`,
        textTransform: "capitalize",
      }}
    >
      {s}
    </span>
  );
};

const Card = ({
  label,
  value,
  sub,
  color,
  c,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  c: ReturnType<typeof useColors>;
}) => (
  <div
    style={{
      background: c.card,
      border: `1px solid ${c.border}`,
      borderRadius: 12,
      padding: "16px 20px",
    }}
  >
    <div
      style={{ fontSize: 12, color: c.muted, fontWeight: 600, marginBottom: 6 }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 26,
        fontWeight: 800,
        color: color || c.heading,
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    {sub && (
      <div style={{ fontSize: 11, color: c.muted, marginTop: 4 }}>{sub}</div>
    )}
  </div>
);

export default function ReportsContent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-02-28");
  const [teamFilter, setTeamFilter] = useState("All Teams");
  const [locationFilter, setLocationFilter] = useState("All Locations");

  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : false;
  const c = useColors(isDark);
  if (!mounted) return <main style={{ flex: 1, background: "#f0f2f7" }} />;

  const inp: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 8,
    border: `1px solid ${c.border}`,
    background: c.inputBg,
    color: c.text,
    fontSize: 12,
    fontFamily: "inherit",
    outline: "none",
  };
  const maxCompleted = Math.max(...MONTHLY.map((m) => m.completed));
  const completionRate = Math.round(
    (HISTORY.filter((h) => h.status === "completed").length / HISTORY.length) *
      100,
  );

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
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
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
            Reports
          </h1>
          <div style={{ fontSize: 12, color: c.muted, marginTop: 3 }}>
            Maintenance analytics & history
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={inp}
          />
          <span style={{ color: c.muted, fontSize: 12 }}>→</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={inp}
          />
          <select
            style={inp}
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            {["All Teams", "Team Alpha", "Team Beta", "Team Gamma"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            style={inp}
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            {[
              "All Locations",
              "Istanbul HQ",
              "Ankara Branch",
              "Izmir Plant",
            ].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              style={{
                ...inp,
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ⬇ PDF
            </button>
            <button
              style={{
                ...inp,
                background: "#10b981",
                color: "#fff",
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ⬇ Excel
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <Card
          label="Total Completed"
          value={HISTORY.filter((h) => h.status === "completed").length}
          sub="All time"
          c={c}
        />
        <Card
          label="Overdue"
          value={HISTORY.filter((h) => h.status === "overdue").length}
          color="#ef4444"
          sub="Needs attention"
          c={c}
        />
        <Card
          label="Completion Rate"
          value={`${completionRate}%`}
          color="#10b981"
          sub="This month"
          c={c}
        />
        <Card label="Avg Duration" value="2h 34m" sub="Per task" c={c} />
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Completion Rate Bar Chart */}
        <div
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: c.heading,
              marginBottom: 16,
            }}
          >
            Monthly Completions
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              height: 100,
            }}
          >
            {MONTHLY.map((m) => (
              <div
                key={m.month}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div style={{ fontSize: 10, color: c.muted, fontWeight: 600 }}>
                  {m.completed}
                </div>
                <div
                  style={{
                    width: "100%",
                    borderRadius: "4px 4px 0 0",
                    background: "#3b82f6",
                    height: `${(m.completed / maxCompleted) * 80}px`,
                    transition: "height 0.3s",
                  }}
                />
                <div style={{ fontSize: 10, color: c.muted }}>{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Trend */}
        <div
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: c.heading,
              marginBottom: 16,
            }}
          >
            Overdue Trend
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              height: 100,
            }}
          >
            {MONTHLY.map((m) => (
              <div
                key={m.month}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div style={{ fontSize: 10, color: c.muted, fontWeight: 600 }}>
                  {m.overdue}
                </div>
                <div
                  style={{
                    width: "100%",
                    borderRadius: "4px 4px 0 0",
                    background:
                      m.overdue > 1
                        ? "#ef4444"
                        : m.overdue === 1
                          ? "#f59e0b"
                          : "#10b981",
                    height: `${Math.max((m.overdue / 3) * 80, 6)}px`,
                    transition: "height 0.3s",
                  }}
                />
                <div style={{ fontSize: 10, color: c.muted }}>{m.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-location Comparison */}
      <div
        style={{
          background: c.card,
          border: `1px solid ${c.border}`,
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: c.heading,
            marginBottom: 14,
          }}
        >
          Location Comparison
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 12,
          }}
        >
          {LOCATIONS.map((loc) => (
            <div
              key={loc.name}
              style={{
                background: c.th,
                border: `1px solid ${c.border}`,
                borderRadius: 10,
                padding: 14,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: c.heading,
                  marginBottom: 10,
                }}
              >
                {loc.name}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: c.muted }}>Completed</span>
                  <span style={{ fontWeight: 700, color: "#10b981" }}>
                    {loc.completed}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: c.muted }}>Overdue</span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: loc.overdue ? "#ef4444" : c.muted,
                    }}
                  >
                    {loc.overdue}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: c.muted, marginTop: 4 }}>
                  SLA
                </div>
                <div style={{ height: 6, background: c.bar, borderRadius: 99 }}>
                  <div
                    style={{
                      width: `${loc.sla}%`,
                      height: "100%",
                      borderRadius: 99,
                      background: loc.sla >= 90 ? "#10b981" : "#f59e0b",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: loc.sla >= 90 ? "#10b981" : "#f59e0b",
                    textAlign: "right",
                  }}
                >
                  {loc.sla}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SLA Tracking */}
      <div
        style={{
          background: c.card,
          border: `1px solid ${c.border}`,
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: c.heading,
            marginBottom: 14,
          }}
        >
          SLA Tracking
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            padding: "8px 14px",
            background: c.th,
            borderRadius: 8,
            marginBottom: 6,
          }}
        >
          {["Plan", "Target", "Actual", "Status"].map((h) => (
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
        {SLA.map((s) => (
          <div
            key={s.plan}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              padding: "10px 14px",
              borderBottom: `1px solid ${c.border}`,
            }}
          >
            <div style={{ fontSize: 13, color: c.heading, fontWeight: 600 }}>
              {s.plan}
            </div>
            <div style={{ fontSize: 13, color: c.text }}>{s.target}</div>
            <div
              style={{
                fontSize: 13,
                color: s.met ? c.text : "#ef4444",
                fontWeight: s.met ? 400 : 700,
              }}
            >
              {s.actual}
            </div>
            <div>
              <Badge s={s.met ? "completed" : "overdue"} />
            </div>
          </div>
        ))}
      </div>

      {/* Maintenance History Table */}
      <div
        style={{
          background: c.card,
          border: `1px solid ${c.border}`,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${c.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: c.heading }}>
            Maintenance History
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 1fr 1fr",
            padding: "10px 18px",
            background: c.th,
            borderBottom: `1px solid ${c.border}`,
          }}
        >
          {["Machine", "Plan", "Team", "Completed", "Duration", "Status"].map(
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
        {HISTORY.map((r, i) => (
          <div
            key={r.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 1fr 1fr",
              padding: "13px 18px",
              alignItems: "center",
              borderBottom:
                i < HISTORY.length - 1 ? `1px solid ${c.border}` : "none",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: c.heading }}>
              {r.machine}
            </div>
            <div style={{ fontSize: 13, color: c.text }}>{r.plan}</div>
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
                {r.team}
              </span>
            </div>
            <div style={{ fontSize: 13, color: c.text }}>{r.completed}</div>
            <div style={{ fontSize: 13, color: c.text }}>{r.duration}</div>
            <div>
              <Badge s={r.status} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
