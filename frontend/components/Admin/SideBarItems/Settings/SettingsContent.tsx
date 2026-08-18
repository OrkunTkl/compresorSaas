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
      background: on ? "#3b82f6" : "#9ca3af",
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
  children,
  c,
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
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
    {children}
  </div>
);

const Section = ({
  title,
  children,
  c,
}: {
  title: string;
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
    <div
      style={{
        fontSize: 14,
        fontWeight: 800,
        color: c.heading,
        marginBottom: 4,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const Field = ({
  label,
  children,
  c,
}: {
  label: string;
  children: React.ReactNode;
  c: ReturnType<typeof useColors>;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 5,
      marginBottom: 14,
    }}
  >
    <span style={{ fontSize: 12, fontWeight: 600, color: c.muted }}>
      {label}
    </span>
    {children}
  </div>
);

export default function SettingsContent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [company, setCompany] = useState({
    name: "Acme Industries",
    address: "Istanbul, Turkey",
  });
  const [prefs, setPrefs] = useState({
    timezone: "Europe/Istanbul",
    dateFormat: "DD/MM/YYYY",
    frequency: "30",
  });
  const [security, setSecurity] = useState({
    twoFA: false,
    sessionTimeout: "30",
    auditLogs: true,
  });

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
      }}
    >
      <div style={{ marginBottom: 22 }}>
        <h1
          style={{ fontSize: 20, fontWeight: 800, color: c.heading, margin: 0 }}
        >
          Settings
        </h1>
        <div style={{ fontSize: 12, color: c.muted, marginTop: 3 }}>
          Manage your company, preferences and security
        </div>
      </div>

      <div style={{ maxWidth: 640 }}>
        {/* Company Info */}
        <Section title="Company Info" c={c}>
          <div
            style={{
              padding: "14px 0",
              borderBottom: `1px solid ${c.border}`,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: c.muted,
                marginBottom: 10,
              }}
            >
              Company Logo
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  background: c.th,
                  border: `1.5px dashed ${c.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                }}
              >
                🏭
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button
                  style={{
                    padding: "7px 14px",
                    borderRadius: 8,
                    border: `1px solid ${c.border}`,
                    background: c.th,
                    color: c.text,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Upload Logo
                </button>
                <span style={{ fontSize: 11, color: c.muted }}>
                  PNG, JPG up to 2MB
                </span>
              </div>
            </div>
          </div>
          <Field label="Company Name" c={c}>
            <input
              style={inp}
              value={company.name}
              onChange={(e) =>
                setCompany((p) => ({ ...p, name: e.target.value }))
              }
            />
          </Field>
          <Field label="Address" c={c}>
            <input
              style={inp}
              value={company.address}
              onChange={(e) =>
                setCompany((p) => ({ ...p, address: e.target.value }))
              }
            />
          </Field>
          <div style={{ paddingBottom: 14 }}>
            <button
              style={{
                padding: "9px 20px",
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
              Save Changes
            </button>
          </div>
        </Section>

        {/* Preferences */}
        <Section title="Preferences" c={c}>
          <Field label="Timezone" c={c}>
            <select
              style={inp}
              value={prefs.timezone}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, timezone: e.target.value }))
              }
            >
              {[
                "Europe/Istanbul",
                "Europe/London",
                "America/New_York",
                "Asia/Tokyo",
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Date Format" c={c}>
            <select
              style={inp}
              value={prefs.dateFormat}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, dateFormat: e.target.value }))
              }
            >
              {["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </Field>
          <Field label="Default Maintenance Frequency" c={c}>
            <select
              style={inp}
              value={prefs.frequency}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, frequency: e.target.value }))
              }
            >
              <option value="30">Every 30 Days</option>
              <option value="60">Every 60 Days</option>
              <option value="90">Every 90 Days</option>
            </select>
          </Field>
          <div style={{ paddingBottom: 14 }}>
            <button
              style={{
                padding: "9px 20px",
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
              Save Preferences
            </button>
          </div>
        </Section>

        {/* Security */}
        <Section title="Security" c={c}>
          <Row
            label="Two-Factor Authentication"
            sub="Require 2FA for all team members"
            c={c}
          >
            <Toggle
              on={security.twoFA}
              onChange={() => setSecurity((s) => ({ ...s, twoFA: !s.twoFA }))}
            />
          </Row>
          <Row
            label="Session Timeout"
            sub="Automatically log out inactive users"
            c={c}
          >
            <select
              style={{ ...inp, width: "auto" }}
              value={security.sessionTimeout}
              onChange={(e) =>
                setSecurity((s) => ({ ...s, sessionTimeout: e.target.value }))
              }
            >
              {["15", "30", "60", "120"].map((v) => (
                <option key={v} value={v}>
                  {v} minutes
                </option>
              ))}
            </select>
          </Row>
          <Row
            label="Audit Logs"
            sub="Track all admin actions and changes"
            c={c}
          >
            <Toggle
              on={security.auditLogs}
              onChange={() =>
                setSecurity((s) => ({ ...s, auditLogs: !s.auditLogs }))
              }
            />
          </Row>
          <div style={{ padding: "14px 0" }}>
            <button
              style={{
                padding: "9px 20px",
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
              Save Security Settings
            </button>
          </div>
        </Section>
      </div>
    </main>
  );
}
