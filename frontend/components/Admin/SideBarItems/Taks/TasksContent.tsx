"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const INIT_TASKS = [
  {
    id: "1",
    machine: "Atlas Copco GA37",
    plan: "Monthly Inspection",
    assigned: "Team Alpha",
    dueDate: "2026-03-01",
    status: "upcoming",
    checklist: [
      { label: "Check oil level", done: false },
      { label: "Inspect belts", done: false },
    ],
    notes: "",
    completedAt: null as string | null,
  },
  {
    id: "2",
    machine: "Kaeser ASD 40",
    plan: "Quarterly Overhaul",
    assigned: "Team Beta",
    dueDate: "2026-02-20",
    status: "overdue",
    checklist: [{ label: "Replace filters", done: false }],
    notes: "",
    completedAt: null as string | null,
  },
  {
    id: "3",
    machine: "Quincy QSI 500",
    plan: "Monthly Inspection",
    assigned: "Team Alpha",
    dueDate: "2026-02-10",
    status: "completed",
    checklist: [
      { label: "Check oil level", done: true },
      { label: "Inspect belts", done: true },
    ],
    notes: "All nominal.",
    completedAt: "2026-02-10 09:42",
  },
];

type Task = (typeof INIT_TASKS)[0];

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

const sColor = (s: string) =>
  s === "completed" ? "#10b981" : s === "overdue" ? "#ef4444" : "#f59e0b";

const Badge = ({ s }: { s: string }) => {
  const color = sColor(s);
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
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      {s}
    </span>
  );
};

const LockedBtn = ({
  label,
  c,
}: {
  label: string;
  c: ReturnType<typeof useColors>;
}) => (
  <div
    style={{ position: "relative", display: "inline-block" }}
    className="locked-wrap"
  >
    <button
      disabled
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: `1px solid ${c.border}`,
        background: c.card,
        color: c.muted,
        fontSize: 12,
        fontWeight: 600,
        cursor: "not-allowed",
        fontFamily: "inherit",
        opacity: 0.6,
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      🔒 {label}
    </button>
    <style>{`.locked-wrap:hover .tip{opacity:1;pointer-events:auto}`}</style>
    <div
      className="tip"
      style={{
        opacity: 0,
        pointerEvents: "none",
        position: "absolute",
        top: "110%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#1e293b",
        color: "#f1f5f9",
        fontSize: 11,
        padding: "5px 10px",
        borderRadius: 7,
        whiteSpace: "nowrap",
        zIndex: 99,
        transition: "opacity 0.15s",
      }}
    >
      Available on Growth+
    </div>
  </div>
);

export default function TasksContent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(INIT_TASKS);
  const [filter, setFilter] = useState("All");
  const [detail, setDetail] = useState<Task | null>(null);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : false;
  const c = useColors(isDark);

  if (!mounted) return <main style={{ flex: 1, background: "#f0f2f7" }} />;

  const filtered =
    filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  const markComplete = (id: string) => {
    const now = new Date().toLocaleString();
    setTasks((ts) =>
      ts.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "completed",
              checklist: t.checklist.map((ci) => ({ ...ci, done: true })),
              completedAt: now,
            }
          : t,
      ),
    );
    setDetail((d) =>
      d?.id === id
        ? {
            ...d,
            status: "completed",
            checklist: d.checklist.map((ci) => ({ ...ci, done: true })),
            completedAt: now,
          }
        : d,
    );
  };

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
  const COLS = "1.5fr 1.5fr 1fr 1fr 1fr 100px";

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
            Tasks
          </h1>
          <div style={{ fontSize: 12, color: c.muted, marginTop: 3 }}>
            {tasks.filter((t) => t.status === "overdue").length} overdue ·{" "}
            {tasks.filter((t) => t.status === "upcoming").length} upcoming
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Status segments */}
          <div
            style={{
              display: "flex",
              background: c.th,
              borderRadius: 9,
              padding: 3,
              border: `1px solid ${c.border}`,
            }}
          >
            {["All", "Upcoming", "Overdue", "Completed"].map((s) => {
              const active = filter === s;
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 7,
                    border: "none",
                    background: active ? c.card : "transparent",
                    color: active ? c.heading : c.muted,
                    fontWeight: active ? 700 : 500,
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    boxShadow: active ? `0 1px 4px rgba(0,0,0,0.1)` : "none",
                    transition: "all 0.15s",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>

          <LockedBtn label="Date Range" c={c} />
          <LockedBtn label="Team" c={c} />
          <LockedBtn label="Location" c={c} />
          <LockedBtn label="Export" c={c} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {/* Table */}
        <div
          style={{
            flex: 1,
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
              background: c.th,
            }}
          >
            {[
              "Machine",
              "Plan",
              "Assigned",
              "Due Date",
              "Status",
              "Actions",
            ].map((h) => (
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

          {filtered.length === 0 && (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: c.muted,
                fontSize: 13,
              }}
            >
              No tasks found.
            </div>
          )}

          {filtered.map((t, i) => (
            <div
              key={t.id}
              onClick={() => setDetail(detail?.id === t.id ? null : t)}
              style={{
                display: "grid",
                gridTemplateColumns: COLS,
                padding: "13px 18px",
                alignItems: "center",
                borderBottom:
                  i < filtered.length - 1 ? `1px solid ${c.border}` : "none",
                background:
                  detail?.id === t.id
                    ? isDark
                      ? "#1e213088"
                      : "#f0f6ff"
                    : "transparent",
                cursor: "pointer",
                transition: "background 0.12s",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: c.heading }}>
                {t.machine}
              </div>
              <div style={{ fontSize: 13, color: c.text }}>{t.plan}</div>
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
                  {t.assigned}
                </span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: t.status === "overdue" ? "#ef4444" : c.text,
                  fontWeight: t.status === "overdue" ? 700 : 400,
                }}
              >
                {t.dueDate}
              </div>
              <div>
                <Badge s={t.status} />
              </div>
              <div
                style={{ display: "flex", gap: 5 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setDetail(detail?.id === t.id ? null : t)}
                  style={{
                    ...inp,
                    padding: "4px 9px",
                    color: "#3b82f6",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  View
                </button>
                {t.status !== "completed" && (
                  <button
                    onClick={() => markComplete(t.id)}
                    style={{
                      ...inp,
                      padding: "4px 9px",
                      color: "#10b981",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: `1px solid #10b98140`,
                    }}
                  >
                    ✔
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {detail && (
          <div
            style={{
              width: 310,
              background: c.card,
              borderRadius: 14,
              border: `1px solid ${c.border}`,
              display: "flex",
              flexDirection: "column",
              gap: 0,
              flexShrink: 0,
              alignSelf: "flex-start",
              overflow: "hidden",
            }}
          >
            {/* Detail Header */}
            <div
              style={{
                padding: "14px 16px",
                borderBottom: `1px solid ${c.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: c.th,
              }}
            >
              <div>
                <div
                  style={{ fontSize: 13, fontWeight: 800, color: c.heading }}
                >
                  {detail.machine}
                </div>
                <div style={{ fontSize: 11, color: c.muted }}>
                  {detail.plan}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {/* Export icon */}
                <div style={{ position: "relative" }} className="locked-wrap">
                  <button
                    disabled
                    style={{
                      ...inp,
                      padding: "5px 8px",
                      opacity: 0.5,
                      cursor: "not-allowed",
                      fontSize: 13,
                    }}
                  >
                    ⬇️ 🔒
                  </button>
                  <div
                    className="tip"
                    style={{
                      opacity: 0,
                      pointerEvents: "none",
                      position: "absolute",
                      top: "110%",
                      right: 0,
                      background: "#1e293b",
                      color: "#f1f5f9",
                      fontSize: 11,
                      padding: "5px 10px",
                      borderRadius: 7,
                      whiteSpace: "nowrap",
                      zIndex: 99,
                      transition: "opacity 0.15s",
                    }}
                  >
                    PDF → Growth · Excel → Scale
                  </div>
                </div>
                {/* Reassign locked */}
                <div style={{ position: "relative" }} className="locked-wrap">
                  <button
                    disabled
                    style={{
                      ...inp,
                      padding: "5px 9px",
                      opacity: 0.5,
                      cursor: "not-allowed",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    🔒 Reassign
                  </button>
                  <div
                    className="tip"
                    style={{
                      opacity: 0,
                      pointerEvents: "none",
                      position: "absolute",
                      top: "110%",
                      right: 0,
                      background: "#1e293b",
                      color: "#f1f5f9",
                      fontSize: 11,
                      padding: "5px 10px",
                      borderRadius: 7,
                      whiteSpace: "nowrap",
                      zIndex: 99,
                      transition: "opacity 0.15s",
                    }}
                  >
                    Available on Growth+
                  </div>
                </div>
                {/* Mark complete */}
                {detail.status !== "completed" && (
                  <button
                    onClick={() => markComplete(detail.id)}
                    style={{
                      ...inp,
                      padding: "5px 10px",
                      background: "#10b981",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    ✔ Done
                  </button>
                )}
                <button
                  onClick={() => setDetail(null)}
                  style={{
                    ...inp,
                    padding: "5px 8px",
                    color: c.muted,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div
              style={{
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Checklist */}
              <Section label="Checklist" c={c}>
                {detail.checklist.map((ci, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      background: c.th,
                      borderRadius: 8,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>
                      {ci.done ? "✅" : "⬜"}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: ci.done ? c.muted : c.text,
                        textDecoration: ci.done ? "line-through" : "none",
                      }}
                    >
                      {ci.label}
                    </span>
                  </div>
                ))}
              </Section>

              {/* Notes */}
              <Section label="Notes" c={c}>
                <textarea
                  value={detail.notes}
                  onChange={(e) =>
                    setDetail((d) => (d ? { ...d, notes: e.target.value } : d))
                  }
                  placeholder="Add notes..."
                  rows={3}
                  style={{
                    ...inp,
                    width: "100%",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </Section>

              {/* Photos */}
              <Section label="Uploaded Photos" c={c}>
                <div
                  style={{
                    padding: 14,
                    textAlign: "center",
                    fontSize: 12,
                    color: c.muted,
                    border: `1.5px dashed ${c.border}`,
                    borderRadius: 8,
                  }}
                >
                  📷 No photos uploaded
                </div>
              </Section>

              {/* Completion time */}
              <Section label="Completion Timestamp" c={c}>
                <div
                  style={{
                    fontSize: 13,
                    color: detail.completedAt ? "#10b981" : c.muted,
                    fontWeight: detail.completedAt ? 600 : 400,
                  }}
                >
                  {detail.completedAt ?? "Not completed yet"}
                </div>
              </Section>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const Section = ({
  label,
  children,
  c,
}: {
  label: string;
  children: React.ReactNode;
  c: ReturnType<typeof useColors>;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: c.muted,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {label}
    </div>
    {children}
  </div>
);
