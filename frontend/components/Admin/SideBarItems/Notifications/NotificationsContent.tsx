"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

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

const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <div
    onClick={onChange}
    style={{
      width: 40,
      height: 22,
      borderRadius: 99,
      background: on ? "#3b82f6" : "#e2e8f0",
      cursor: "pointer",
      position: "relative",
      transition: "background 0.2s",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 3,
        left: on ? 21 : 3,
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        transition: "left 0.2s",
      }}
    />
  </div>
);

const Row = ({
  label,
  sub,
  on,
  onChange,
  c,
}: {
  label: string;
  sub?: string;
  on: boolean;
  onChange: () => void;
  c: ReturnType<typeof useColors>;
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 0",
      borderBottom: `1px solid ${c.border}`,
    }}
  >
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: c.heading }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{sub}</div>
      )}
    </div>
    <Toggle on={on} onChange={onChange} />
  </div>
);

const Section = ({
  title,
  sub,
  children,
  c,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
  c: ReturnType<typeof useColors>;
}) => (
  <div
    style={{
      background: c.card,
      border: `1px solid ${c.border}`,
      borderRadius: 12,
      padding: "20px 20px 6px",
      marginBottom: 16,
    }}
  >
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: c.heading }}>
        {title}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{sub}</div>
      )}
    </div>
    {children}
  </div>
);

export default function NotificationsContent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState({
    upcoming: true,
    overdue: true,
    completion: false,
  });
  const [inApp, setInApp] = useState({
    upcoming: true,
    overdue: true,
    completion: true,
    digest: false,
  });
  const [webhook, setWebhook] = useState({
    taskComplete: false,
    overdue: true,
    newAssignment: false,
  });
  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : false;
  const c = useColors(isDark);
  if (!mounted) return <main style={{ flex: 1, background: "#f0f2f7" }} />;

  const inp: React.CSSProperties = {
    padding: "9px 12px",
    borderRadius: 8,
    border: `1px solid ${c.border}`,
    background: c.inputBg,
    color: c.text,
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
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
        maxWidth: 680,
      }}
    >
      <div style={{ marginBottom: 22 }}>
        <h1
          style={{ fontSize: 20, fontWeight: 800, color: c.heading, margin: 0 }}
        >
          Notifications
        </h1>
        <div style={{ fontSize: 12, color: c.muted, marginTop: 3 }}>
          Manage how and when you receive alerts
        </div>
      </div>

      {/* Email */}
      <Section
        title="Email Notifications"
        sub="Sent to your account email address"
        c={c}
      >
        <Row
          label="Upcoming Reminder"
          sub="Notify before a task is due"
          on={email.upcoming}
          onChange={() => setEmail((e) => ({ ...e, upcoming: !e.upcoming }))}
          c={c}
        />
        <Row
          label="Overdue Alert"
          sub="Notify when a task becomes overdue"
          on={email.overdue}
          onChange={() => setEmail((e) => ({ ...e, overdue: !e.overdue }))}
          c={c}
        />
        <Row
          label="Completion Notice"
          sub="Notify when a task is marked complete"
          on={email.completion}
          onChange={() =>
            setEmail((e) => ({ ...e, completion: !e.completion }))
          }
          c={c}
        />
        <div style={{ padding: "14px 0" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: c.muted,
              marginBottom: 6,
            }}
          >
            Reminder Lead Time
          </div>
          <select style={{ ...inp, width: "auto" }}>
            {[
              "1 day before",
              "2 days before",
              "3 days before",
              "1 week before",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </Section>

      {/* In-App */}
      <Section
        title="In-App Notifications"
        sub="Shown inside the dashboard"
        c={c}
      >
        <Row
          label="Upcoming Tasks"
          sub="Banner alert for tasks due soon"
          on={inApp.upcoming}
          onChange={() => setInApp((e) => ({ ...e, upcoming: !e.upcoming }))}
          c={c}
        />
        <Row
          label="Overdue Alert"
          sub="Red badge on task list"
          on={inApp.overdue}
          onChange={() => setInApp((e) => ({ ...e, overdue: !e.overdue }))}
          c={c}
        />
        <Row
          label="Completion Notice"
          sub="Confirmation pop-up on complete"
          on={inApp.completion}
          onChange={() =>
            setInApp((e) => ({ ...e, completion: !e.completion }))
          }
          c={c}
        />
        <Row
          label="Daily Digest"
          sub="Summary notification each morning"
          on={inApp.digest}
          onChange={() => setInApp((e) => ({ ...e, digest: !e.digest }))}
          c={c}
        />
        <div style={{ padding: "14px 0" }} />
      </Section>

      {/* Webhooks */}
      <Section
        title="Webhooks"
        sub="Send POST requests to external endpoints"
        c={c}
      >
        <Row
          label="Task Completed"
          sub="Fires when any task is marked complete"
          on={webhook.taskComplete}
          onChange={() =>
            setWebhook((w) => ({ ...w, taskComplete: !w.taskComplete }))
          }
          c={c}
        />
        <Row
          label="Overdue Triggered"
          sub="Fires when a task passes its due date"
          on={webhook.overdue}
          onChange={() => setWebhook((w) => ({ ...w, overdue: !w.overdue }))}
          c={c}
        />
        <Row
          label="New Assignment"
          sub="Fires when a task is assigned to a team"
          on={webhook.newAssignment}
          onChange={() =>
            setWebhook((w) => ({ ...w, newAssignment: !w.newAssignment }))
          }
          c={c}
        />
        <div
          style={{
            padding: "14px 0",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: c.muted }}>
            Webhook URL
          </div>
          <input
            style={inp}
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-endpoint.com/webhook"
          />
          <button
            style={{
              alignSelf: "flex-end",
              padding: "8px 16px",
              borderRadius: 8,
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Save Webhook
          </button>
        </div>
      </Section>
    </main>
  );
}
