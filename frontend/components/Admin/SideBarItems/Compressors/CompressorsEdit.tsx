"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}api/compressors/`;

const CompressorsEdit = ({ id }: { id: string }) => {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const res = await axios.get(`${API_URL}${id}/`);
        setFormData(res.data);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUnit();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}${id}/`, formData);
      alert("Unit updated successfully!");
      window.location.href = "/compressors";
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update unit.");
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading unit data...</div>;
  if (!formData) return <div style={{ padding: 40 }}>Unit not found.</div>;

  const inputStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e4e8f0",
    fontSize: "14px",
    outline: "none",
    width: "100%",
  };

  return (
    <div style={{ padding: 40, maxWidth: 600, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
        Edit Compressor
      </h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>
        Updating: {formData.serial_number}
      </p>

      <form
        onSubmit={handleUpdate}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
            Unit Name
          </label>
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
            Current Working Hours
          </label>
          <input
            type="number"
            value={formData.current_hours}
            onChange={(e) =>
              setFormData({
                ...formData,
                current_hours: Number(e.target.value),
              })
            }
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            style={inputStyle as any}
          >
            <option value="Running">Running</option>
            <option value="Warning">Warning</option>
            <option value="Stopped">Stopped</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
          <button
            type="submit"
            style={{
              flex: 1,
              background: "#10b981",
              color: "#fff",
              padding: "14px",
              borderRadius: "8px",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Update Changes
          </button>
          <button
            type="button"
            onClick={() => (window.location.href = "/compressors")}
            style={{
              flex: 1,
              background: "#f1f5f9",
              color: "#64748b",
              padding: "14px",
              borderRadius: "8px",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompressorsEdit;
