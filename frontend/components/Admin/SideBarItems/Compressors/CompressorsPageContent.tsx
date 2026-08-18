"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import axios from "axios";
import CompressorsCreate from "./CompressorsCreate";
import CompressorAnimation, { Compressor } from "./CompressorAnimation";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}api/compressors/`;

const statusColor = (s: string) =>
  s === "Running" ? "#10b981" : s === "Warning" ? "#f59e0b" : "#ef4444";

const healthColor = (h: number) =>
  h > 80 ? "#10b981" : h > 40 ? "#f97316" : "#ef4444";

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span
    style={{
      fontSize: 11,
      fontWeight: 700,
      color,
      background: `${color}18`,
      padding: "4px 10px",
      borderRadius: 20,
      whiteSpace: "nowrap",
      border: `1px solid ${color}30`,
    }}
  >
    {label}
  </span>
);

export default function CompressorsPageContent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [compressors, setCompressors] = useState<Compressor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  // ← replaces expandedId: opens the 3D modal instead
  const [activeUnit, setActiveUnit] = useState<Compressor | null>(null);

  const fetchCompressors = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompressors(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCompressors();
    } catch (e) {
      console.error(e);
      alert("Failed to delete the unit.");
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchCompressors();
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;
  const bg = isDark ? "#080b12" : "#f0f2f7";
  const card = isDark ? "#0f1117" : "#ffffff";
  const border = isDark ? "#1e2130" : "#e4e8f0";
  const text = isDark ? "#c9d1e0" : "#4a5568";
  const heading = isDark ? "#e2e8f0" : "#1a202c";
  const muted = isDark ? "#5a6580" : "#9aa3b0";
  const tableHead = isDark ? "#161b2a" : "#f8fafc";
  const inputBg = isDark ? "#161b2a" : "#ffffff";

  if (!mounted) return <main style={{ flex: 1, background: "#f0f2f7" }} />;

  const filtered = compressors.filter((c) => {
    const matchSearch =
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.serial_number?.includes(searchTerm);
    const matchStatus =
      statusFilter === "All Statuses" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <main
      style={{
        flex: 1,
        background: bg,
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
          alignItems: "center",
          marginBottom: 22,
        }}
      >
        <div>
          <h1
            style={{ fontSize: 20, fontWeight: 800, color: heading, margin: 0 }}
          >
            Compressor Fleet
          </h1>
          <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>
            Manage and monitor all units in real-time
          </div>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
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
          + Add New Unit
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          background: card,
          padding: 16,
          borderRadius: 14,
          marginBottom: 20,
          display: "flex",
          gap: 12,
          border: `1px solid ${border}`,
        }}
      >
        <input
          type="text"
          placeholder="Search by Serial or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 8,
            border: `1px solid ${border}`,
            background: inputBg,
            color: text,
            fontSize: 13,
            outline: "none",
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: `1px solid ${border}`,
            background: inputBg,
            color: text,
            fontSize: 13,
            outline: "none",
            cursor: "pointer",
          }}
        >
          {["All Statuses", "Running", "Warning", "Stopped"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          background: card,
          borderRadius: 14,
          border: `1px solid ${border}`,
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                background: tableHead,
                borderBottom: `1px solid ${border}`,
              }}
            >
              {[
                "Serial No",
                "Model Name",
                "Status",
                "Health",
                "Pressure",
                "Temp",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: 16,
                    fontSize: 11,
                    fontWeight: 700,
                    color: muted,
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ padding: 32, textAlign: "center", color: muted }}
                >
                  Loading...
                </td>
              </tr>
            ) : (
              filtered.map((c, idx) => (
                <tr
                  key={c.id}
                  style={{
                    borderBottom:
                      idx < filtered.length - 1
                        ? `1px solid ${border}`
                        : "none",
                  }}
                >
                  <td
                    style={{
                      padding: 16,
                      fontWeight: 700,
                      fontSize: 13,
                      color: heading,
                    }}
                  >
                    {c.serial_number}
                  </td>
                  <td style={{ padding: 16, fontSize: 13, color: text }}>
                    {c.name}
                  </td>
                  <td style={{ padding: 16 }}>
                    <Badge
                      label={c.status || "Running"}
                      color={statusColor(c.status || "Running")}
                    />
                  </td>
                  <td style={{ padding: 16 }}>
                    <div
                      style={{
                        width: 100,
                        height: 6,
                        background: isDark ? "#1e2130" : "#e8eaf0",
                        borderRadius: 99,
                        marginBottom: 5,
                      }}
                    >
                      <div
                        style={{
                          width: `${c.health || 100}%`,
                          height: "100%",
                          borderRadius: 99,
                          background: healthColor(c.health || 100),
                        }}
                      />
                    </div>
                  </td>
                  <td
                    style={{
                      padding: 16,
                      fontSize: 13,
                      color: heading,
                      fontWeight: 600,
                    }}
                  >
                    {c.current_pressure || "0.0"} bar
                  </td>
                  <td
                    style={{
                      padding: 16,
                      fontSize: 13,
                      color: heading,
                      fontWeight: 600,
                    }}
                  >
                    {c.current_temp || "0"}°C
                  </td>
                  <td style={{ padding: 16 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      {/* ← DETAILS button: opens 3D modal */}
                      <button
                        onClick={() => setActiveUnit(c)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#3b82f6",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        DETAILS →
                      </button>

                      <button
                        onClick={() => handleDelete(c.id)}
                        title="Delete Unit"
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontSize: 16,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 4,
                          borderRadius: 4,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = isDark
                            ? "#ef444415"
                            : "#fee2e2")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "none")
                        }
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create modal */}
      <CompressorsCreate
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        refreshData={fetchCompressors}
      />

      {/* 3D Viewer modal — mounts only when a unit is selected */}
      {activeUnit && (
        <CompressorAnimation
          compressor={activeUnit}
          onClose={() => setActiveUnit(null)}
          isDark={isDark}
        />
      )}
    </main>
  );
}
