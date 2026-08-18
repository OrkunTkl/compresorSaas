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
    bar: isDark ? "#1e2130" : "#e8eaf0",
  };
}

const INVOICES = [
  { id: "INV-2026-02", date: "2026-02-01", amount: "$49.00", status: "paid" },
  { id: "INV-2026-01", date: "2026-01-01", amount: "$49.00", status: "paid" },
  { id: "INV-2025-12", date: "2025-12-01", amount: "$49.00", status: "paid" },
];

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    features: ["5 Compressors", "3 Users", "Basic Reports", "Email Support"],
  },
  {
    name: "Growth",
    price: "$49",
    features: [
      "20 Compressors",
      "10 Users",
      "Advanced Reports",
      "PDF Export",
      "Priority Support",
    ],
  },
  {
    name: "Scale",
    price: "$129",
    features: [
      "Unlimited Compressors",
      "Unlimited Users",
      "Full Analytics",
      "Excel Export",
      "SLA Tracking",
    ],
  },
];

const UsageBar = ({
  label,
  used,
  total,
  c,
}: {
  label: string;
  used: number;
  total: number;
  c: any;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <div
      style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}
    >
      <span style={{ fontWeight: 600, color: c.text }}>{label}</span>
      <span style={{ color: c.muted }}>
        {used}/{total}
      </span>
    </div>
    <div style={{ height: 8, background: c.bar, borderRadius: 99 }}>
      <div
        style={{
          width: `${(used / total) * 100}%`,
          height: "100%",
          borderRadius: 99,
          background: used / total > 0.8 ? "#ef4444" : "#3b82f6",
          transition: "width 0.3s",
        }}
      />
    </div>
  </div>
);

export default function BillingContent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Growth");

  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : false;
  const c = useColors(isDark);

  if (!mounted) return <main style={{ flex: 1, background: "#f0f2f7" }} />;

  const inp: React.CSSProperties = {
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${c.border}`,
    background: c.inputBg,
    color: c.text,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
  };

  return (
    <main
      style={{
        flex: 1,
        background: c.bg,
        padding: 40,
        minHeight: "100vh",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{ fontSize: 28, fontWeight: 800, color: c.heading, margin: 0 }}
        >
          Billing
        </h1>
        <p style={{ fontSize: 14, color: c.muted, marginTop: 6 }}>
          Manage your plan, invoices and payment method
        </p>
      </div>

      {/* Ana Grid Yapısı: Sağlı Sollu Yerleşim */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 24,
          maxWidth: 1200,
        }}
      >
        {/* SOL TARAF */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Current Plan Card */}
          <div
            style={{
              background: c.card,
              border: `1px solid ${c.border}`,
              borderRadius: 16,
              padding: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: c.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 6,
                  }}
                >
                  Current Plan
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{ fontSize: 32, fontWeight: 900, color: c.heading }}
                  >
                    Starter
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 20,
                      background: "#3b82f618",
                      color: "#3b82f6",
                      border: "1px solid #3b82f630",
                    }}
                  >
                    Free
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowUpgrade(true)}
                style={{
                  padding: "12px 24px",
                  borderRadius: 10,
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(59,130,246,0.25)",
                }}
              >
                Upgrade Plan
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                paddingTop: 20,
                borderTop: `1px solid ${c.border}`,
              }}
            >
              <UsageBar label="Compressors" used={3} total={5} c={c} />
              <UsageBar label="Users" used={2} total={3} c={c} />
            </div>
          </div>

          {/* Invoices Card */}
          <div
            style={{
              background: c.card,
              border: `1px solid ${c.border}`,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 28px",
                borderBottom: `1px solid ${c.border}`,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, color: c.heading }}>
                Invoices
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 100px",
                padding: "14px 28px",
                background: c.th,
                borderBottom: `1px solid ${c.border}`,
              }}
            >
              {["Invoice", "Date", "Amount", ""].map((h) => (
                <div
                  key={h}
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: c.muted,
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>
            {INVOICES.map((inv, i) => (
              <div
                key={inv.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 100px",
                  padding: "18px 28px",
                  alignItems: "center",
                  borderBottom:
                    i < INVOICES.length - 1 ? `1px solid ${c.border}` : "none",
                }}
              >
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: c.heading }}
                >
                  {inv.id}
                </div>
                <div style={{ fontSize: 14, color: c.text }}>{inv.date}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{ fontSize: 14, fontWeight: 600, color: c.heading }}
                  >
                    {inv.amount}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#10b981",
                      background: "#10b98118",
                      padding: "2px 8px",
                      borderRadius: 20,
                    }}
                  >
                    Paid
                  </span>
                </div>
                <button
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: `1px solid ${c.border}`,
                    background: "none",
                    color: "#3b82f6",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ⬇ PDF
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SAĞ TARAF */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Payment Method Card */}
          <div
            style={{
              background: c.card,
              border: `1px solid ${c.border}`,
              borderRadius: 16,
              padding: 28,
              height: "fit-content",
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: c.heading,
                marginBottom: 20,
              }}
            >
              Payment Method
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px",
                background: c.th,
                borderRadius: 12,
                border: `1px solid ${c.border}`,
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: 32 }}>💳</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 15, fontWeight: 700, color: c.heading }}
                >
                  Visa ending in 4242
                </div>
                <div style={{ fontSize: 13, color: c.muted }}>
                  Expires 09/2027
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 20,
                  background: "#10b98118",
                  color: "#10b981",
                }}
              >
                Default
              </span>
            </div>

            <div
              style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}
            >
              {["Card Number", "Expiry Date", "CVC", "Name on Card"].map(
                (label) => (
                  <div
                    key={label}
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <span
                      style={{ fontSize: 13, fontWeight: 600, color: c.muted }}
                    >
                      {label}
                    </span>
                    <input
                      style={{ ...inp, width: "100%", boxSizing: "border-box" }}
                      placeholder={
                        label === "Card Number"
                          ? "•••• •••• •••• ••••"
                          : label === "Expiry Date"
                            ? "MM/YY"
                            : label === "CVC"
                              ? "•••"
                              : "John Doe"
                      }
                    />
                  </div>
                ),
              )}
            </div>
            <button
              style={{
                marginTop: 24,
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                background: c.th,
                color: c.text,
                border: `1px solid ${c.border}`,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Update Payment Method
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal (Daha Geniş) */}
      {showUpgrade && (
        <div
          onClick={(e) => e.target === e.currentTarget && setShowUpgrade(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: c.card,
              border: `1px solid ${c.border}`,
              borderRadius: 24,
              width: "100%",
              maxWidth: 800,
              boxShadow: "0 32px 100px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "24px 32px",
                borderBottom: `1px solid ${c.border}`,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 800,
                  color: c.heading,
                }}
              >
                Choose a Plan
              </h2>
              <button
                onClick={() => setShowUpgrade(false)}
                style={{
                  background: "none",
                  border: `1px solid ${c.border}`,
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  color: c.muted,
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 16,
                padding: 32,
              }}
            >
              {PLANS.map((p) => {
                const active = selectedPlan === p.name;
                return (
                  <div
                    key={p.name}
                    onClick={() => setSelectedPlan(p.name)}
                    style={{
                      padding: 24,
                      borderRadius: 16,
                      border: `2px solid ${active ? "#3b82f6" : c.border}`,
                      background: active ? "#3b82f608" : c.th,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: active ? "#3b82f6" : c.heading,
                        marginBottom: 8,
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 900,
                        color: c.heading,
                        marginBottom: 16,
                      }}
                    >
                      {p.price}
                      <span style={{ fontSize: 14, color: c.muted }}>/mo</span>
                    </div>
                    {p.features.map((f) => (
                      <div
                        key={f}
                        style={{
                          fontSize: 12,
                          color: c.text,
                          marginBottom: 6,
                          display: "flex",
                          gap: 6,
                        }}
                      >
                        <span>✔</span> {f}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                padding: "20px 32px",
                borderTop: `1px solid ${c.border}`,
              }}
            >
              <button
                onClick={() => setShowUpgrade(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  background: "transparent",
                  color: c.muted,
                  border: `1px solid ${c.border}`,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUpgrade(false)}
                style={{
                  padding: "10px 24px",
                  borderRadius: 10,
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Upgrade to {selectedPlan}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
