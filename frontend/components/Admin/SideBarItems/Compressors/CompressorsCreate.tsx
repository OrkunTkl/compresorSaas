"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "next-themes";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}api/compressors/`;

const CompressorsCreate = ({
  isOpen,
  onClose,
  refreshData,
}: {
  isOpen: boolean;
  onClose: () => void;
  refreshData: () => void;
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    serial_number: "",
    max_operating_hours: 20000,
    average_daily_hours: 8.0,
    current_hours: 0.0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const isDark = resolvedTheme === "dark";
  const modalBg = isDark ? "#0f1117" : "#ffffff";
  const textColor = isDark ? "#e2e8f0" : "#1a202c";
  const inputBg = isDark ? "#161b2a" : "#ffffff";
  const borderColor = isDark ? "#1e2130" : "#e4e8f0";
  const labelColor = isDark ? "#8a94ad" : "#64748b";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(API_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Unit created successfully!");
      refreshData();
      onClose();
    } catch (error: any) {
      console.error("Create Error:", error.response?.data || error);
      alert("Failed to create unit.");
    }
  };

  const inputStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: `1px solid ${borderColor}`,
    fontSize: "14px",
    outline: "none",
    width: "100%",
    background: inputBg,
    color: textColor,
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        style={{
          padding: 40,
          maxWidth: 600,
          width: "100%",
          fontFamily: "sans-serif",
          background: modalBg,
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          position: "relative",
          border: `1px solid ${borderColor}`,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: labelColor,
          }}
        >
          ✕
        </button>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            marginBottom: 24,
            color: textColor,
          }}
        >
          Add New Compressor Unit
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: labelColor }}>
              Unit Name
            </label>
            <input
              placeholder="e.g. Main Plant Compressor"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={inputStyle}
              required
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: labelColor }}>
              Model
            </label>
            <input
              placeholder="e.g. Atlas Copco GA37"
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              style={inputStyle}
              required
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: labelColor }}>
              Serial Number
            </label>
            <input
              placeholder="Unique Serial ID"
              onChange={(e) =>
                setFormData({ ...formData, serial_number: e.target.value })
              }
              style={inputStyle}
              required
            />
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ fontSize: 12, fontWeight: 600, color: labelColor }}
              >
                Max Hours
              </label>
              <input
                type="number"
                value={formData.max_operating_hours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_operating_hours: Number(e.target.value),
                  })
                }
                style={inputStyle}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ fontSize: 12, fontWeight: 600, color: labelColor }}
              >
                Daily Avg Hours
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.average_daily_hours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    average_daily_hours: Number(e.target.value),
                  })
                }
                style={inputStyle}
              />
            </div>
          </div>
          <button
            type="submit"
            style={{
              background: "#3b82f6",
              color: "#fff",
              padding: "14px",
              borderRadius: "8px",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              marginTop: 10,
              boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
            }}
          >
            Create Unit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompressorsCreate;
