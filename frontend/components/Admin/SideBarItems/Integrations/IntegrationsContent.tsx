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

const MOCK_KEYS = [
  {
    id: "1",
    name: "Production Key",
    key: "sk_live_4xK9...mN2p",
    created: "2026-01-10",
    last: "2026-02-25",
  },
  {
    id: "2",
    name: "Dev Key",
    key: "sk_test_7aB3...qR8s",
    created: "2026-02-01",
    last: "2026-02-20",
  },
];

const WEBHOOKS = [
  {
    id: "1",
    url: "https://api.example.com/hooks/tasks",
    events: ["task.completed", "task.overdue"],
    active: true,
  },
  {
    id: "2",
    url: "https://erp.company.com/webhook",
    events: ["sync.done"],
    active: false,
  },
];

const ERP_SYSTEMS = [
  { name: "SAP", logo: "🔷", status: "connected" },
  { name: "Oracle", logo: "🔴", status: "disconnected" },
  { name: "Microsoft Dynamics", logo: "🟦", status: "disconnected" },
];

const IOT_DEVICES = [
  {
    id: "IOT-001",
    name: "Pressure Sensor A",
    machine: "Atlas Copco GA37",
    status: "online",
    lastSync: "2 min ago",
  },
  {
    id: "IOT-002",
    name: "Temp Sensor B",
    machine: "Kaeser ASD 40",
    status: "online",
    lastSync: "5 min ago",
  },
  {
    id: "IOT-003",
    name: "Vibration Monitor",
    machine: "Quincy QSI 500",
    status: "offline",
    lastSync: "2h ago",
  },
];

const StatusDot = ({ on }: { on: boolean }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 14, // 12 -> 14
      fontWeight: 600,
      color: on ? "#10b981" : "#9ca3af",
    }}
  >
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: on ? "#10b981" : "#9ca3af",
        display: "inline-block",
      }}
    />
    {on ? "Active" : "Inactive"}
  </span>
);

const SectionTitle = ({
  title,
  sub,
  c,
}: {
  title: string;
  sub?: string;
  c: ReturnType<typeof useColors>;
}) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ fontSize: 18, fontWeight: 800, color: c.heading }}>
      {" "}
      {/* 14 -> 18 */}
      {title}
    </div>
    {sub && (
      <div style={{ fontSize: 14, color: c.muted, marginTop: 4 }}>{sub}</div> // 12 -> 14
    )}
  </div>
);

export default function IntegrationsContent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [keys, setKeys] = useState(MOCK_KEYS);
  const [newKeyName, setNewKeyName] = useState("");
  const [webhooks, setWebhooks] = useState(WEBHOOKS);
  const [newUrl, setNewUrl] = useState("");
  const [erp, setErp] = useState(ERP_SYSTEMS);
  const [iot] = useState(IOT_DEVICES);
  const [revealed, setRevealed] = useState<string[]>([]);

  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : false;
  const c = useColors(isDark);
  if (!mounted) return <main style={{ flex: 1, background: "#f0f2f7" }} />;

  const inp: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 8,
    border: `1px solid ${c.border}`,
    background: c.inputBg,
    color: c.text,
    fontSize: 15, // 13 -> 15
    fontFamily: "inherit",
    outline: "none",
  };
  const btn = (color = "#3b82f6"): React.CSSProperties => ({
    padding: "10px 20px",
    borderRadius: 8,
    background: color,
    color: "#fff",
    border: "none",
    fontWeight: 700,
    fontSize: 15, // 13 -> 15
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
  });

  const createKey = () => {
    if (!newKeyName.trim()) return;
    setKeys((ks) => [
      ...ks,
      {
        id: Date.now().toString(),
        name: newKeyName.trim(),
        key: `sk_live_${Math.random().toString(36).slice(2, 8)}...`,
        created: new Date().toISOString().slice(0, 10),
        last: "—",
      },
    ]);
    setNewKeyName("");
  };

  const addWebhook = () => {
    if (!newUrl.trim()) return;
    setWebhooks((ws) => [
      ...ws,
      {
        id: Date.now().toString(),
        url: newUrl.trim(),
        events: ["task.completed"],
        active: true,
      },
    ]);
    setNewUrl("");
  };

  return (
    <main
      style={{
        flex: 1,
        background: c.bg,
        padding: 32,
        minHeight: "100vh",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        overflowY: "auto",
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{ fontSize: 28, fontWeight: 800, color: c.heading, margin: 0 }} // 20 -> 28
        >
          Integrations
        </h1>
        <div style={{ fontSize: 15, color: c.muted, marginTop: 6 }}>
          {" "}
          {/* 12 -> 15 */}
          Connect your tools and external systems
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* API Keys */}
        <div
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: 12,
            padding: 24,
          }}
        >
          <SectionTitle
            title="API Keys"
            sub="Use these keys to authenticate API requests"
            c={c}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 18,
            }}
          >
            {keys.map((k) => (
              <div
                key={k.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 2.2fr 1.2fr 1.2fr 100px",
                  gap: 12,
                  alignItems: "center",
                  padding: "14px 18px",
                  background: c.th,
                  borderRadius: 9,
                  border: `1px solid ${c.border}`,
                }}
              >
                <div
                  style={{ fontSize: 15, fontWeight: 700, color: c.heading }} // 13 -> 15
                >
                  {k.name}
                </div>
                <div
                  style={{
                    fontSize: 14, // 12 -> 14
                    fontFamily: "monospace",
                    color: c.muted,
                  }}
                >
                  {revealed.includes(k.id) ? k.key : "sk_••••••••••••••••"}
                </div>
                <div style={{ fontSize: 13, color: c.muted }}>
                  {" "}
                  {/* 11 -> 13 */}
                  Created {k.created}
                </div>
                <div style={{ fontSize: 13, color: c.muted }}>
                  Last used {k.last}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() =>
                      setRevealed((r) =>
                        r.includes(k.id)
                          ? r.filter((x) => x !== k.id)
                          : [...r, k.id],
                      )
                    }
                    style={{
                      ...inp,
                      padding: "6px 12px",
                      fontSize: 13, // 11 -> 13
                      cursor: "pointer",
                    }}
                  >
                    {revealed.includes(k.id) ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() =>
                      setKeys((ks) => ks.filter((x) => x.id !== k.id))
                    }
                    style={{
                      ...inp,
                      padding: "6px 12px",
                      fontSize: 13,
                      color: "#ef4444",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              style={{ ...inp, flex: 1 }}
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createKey()}
              placeholder="Key name (e.g. Production)"
            />
            <button onClick={createKey} style={btn()}>
              + Generate Key
            </button>
          </div>
        </div>

        {/* Webhooks */}
        <div
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: 12,
            padding: 24,
          }}
        >
          <SectionTitle
            title="Webhooks"
            sub="Receive real-time POST requests on events"
            c={c}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 18,
            }}
          >
            {webhooks.map((w) => (
              <div
                key={w.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 18px",
                  background: c.th,
                  borderRadius: 9,
                  border: `1px solid ${c.border}`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14, // 12 -> 14
                      fontFamily: "monospace",
                      color: c.heading,
                      marginBottom: 5,
                    }}
                  >
                    {w.url}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {w.events.map((ev) => (
                      <span
                        key={ev}
                        style={{
                          fontSize: 12, // 10 -> 12
                          fontWeight: 700,
                          padding: "2px 10px",
                          borderRadius: 6,
                          background: "#3b82f618",
                          color: "#3b82f6",
                        }}
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
                <StatusDot on={w.active} />
                <button
                  onClick={() =>
                    setWebhooks((ws) =>
                      ws.map((x) =>
                        x.id === w.id ? { ...x, active: !x.active } : x,
                      ),
                    )
                  }
                  style={{
                    ...inp,
                    padding: "6px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {w.active ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() =>
                    setWebhooks((ws) => ws.filter((x) => x.id !== w.id))
                  }
                  style={{
                    ...inp,
                    padding: "6px 12px",
                    fontSize: 13,
                    color: "#ef4444",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              style={{ ...inp, flex: 1 }}
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addWebhook()}
              placeholder="https://your-endpoint.com/webhook"
            />
            <button onClick={addWebhook} style={btn()}>
              + Add Webhook
            </button>
          </div>
        </div>

        {/* ERP Sync */}
        <div
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: 12,
            padding: 24,
          }}
        >
          <SectionTitle
            title="ERP Sync"
            sub="Synchronize maintenance data with your ERP system"
            c={c}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
            }}
          >
            {erp.map((e) => (
              <div
                key={e.name}
                style={{
                  padding: 20,
                  background: c.th,
                  borderRadius: 10,
                  border: `1px solid ${c.border}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 26 }}>{e.logo}</span>{" "}
                  {/* 22 -> 26 */}
                  <div
                    style={{ fontSize: 16, fontWeight: 700, color: c.heading }} // 13 -> 16
                  >
                    {e.name}
                  </div>
                </div>
                <StatusDot on={e.status === "connected"} />
                <button
                  onClick={() =>
                    setErp((es) =>
                      es.map((x) =>
                        x.name === e.name
                          ? {
                              ...x,
                              status:
                                x.status === "connected"
                                  ? "disconnected"
                                  : "connected",
                            }
                          : x,
                      ),
                    )
                  }
                  style={btn(e.status === "connected" ? "#ef4444" : "#3b82f6")}
                >
                  {e.status === "connected" ? "Disconnect" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* IoT Integration */}
        <div
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: 12,
            padding: 24,
          }}
        >
          <SectionTitle
            title="IoT Integration"
            sub="Monitor connected sensors and devices"
            c={c}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr 1fr 100px",
              padding: "12px 18px",
              background: c.th,
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            {["Device", "Machine", "Status", "Last Sync", ""].map((h) => (
              <div
                key={h}
                style={{
                  fontSize: 13, // 11 -> 13
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
          {iot.map((d, i) => (
            <div
              key={d.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr 100px",
                padding: "16px 18px",
                alignItems: "center",
                borderBottom:
                  i < iot.length - 1 ? `1px solid ${c.border}` : "none",
              }}
            >
              <div>
                <div
                  style={{ fontSize: 15, fontWeight: 700, color: c.heading }} // 13 -> 15
                >
                  {d.name}
                </div>
                <div style={{ fontSize: 13, color: c.muted }}>{d.id}</div>{" "}
                {/* 11 -> 13 */}
              </div>
              <div style={{ fontSize: 14, color: c.text }}>{d.machine}</div>{" "}
              {/* 12 -> 14 */}
              <StatusDot on={d.status === "online"} />
              <div style={{ fontSize: 14, color: c.muted }}>{d.lastSync}</div>
              <button
                style={{
                  ...inp,
                  padding: "6px 14px",
                  fontSize: 13,
                  cursor: "pointer",
                  color: "#3b82f6",
                }}
              >
                Config
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
