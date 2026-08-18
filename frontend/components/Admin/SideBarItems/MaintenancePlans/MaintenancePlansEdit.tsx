"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plan } from "./MaintenancePlansCreate";

const TEAMS = ["Team Alpha", "Team Beta", "Team Gamma"];
const COMP_API_URL = "http://127.0.0.1:8000/api/compressors/";

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.8 }}>{label}</span>
    {children}
  </div>
);

interface EditProps {
  plan: Plan;
  onClose: () => void;
  onSave: (p: Plan) => void;
  colors: any;
}

const MaintenancePlansEdit = ({ plan, onClose, onSave, colors }: EditProps) => {
  const [f, setF] = useState<Plan>({ ...plan });
  const [item, setItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [allCompressors, setAllCompressors] = useState<any[]>([]); // Statik liste yerine dinamik liste

  // Kompresörleri backend'den çek
  useEffect(() => {
    const fetchComps = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(COMP_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllCompressors(res.data);
      } catch (err) {
        console.error("Kompresör listesi çekilemedi:", err);
      }
    };
    fetchComps();
  }, []);

  const set = (k: keyof Plan, v: any) => setF((p) => ({ ...p, [k]: v }));

  const addItem = () => {
    if (!item.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      label: item.trim(),
      required: false,
    };
    set("checklist", [...f.checklist, newItem]);
    setItem("");
  };

  const removeItem = (id: string) => {
    set(
      "checklist",
      f.checklist.filter((c) => c.id !== id),
    );
  };

  const toggleRequired = (id: string) => {
    set(
      "checklist",
      f.checklist.map((c) =>
        c.id === id ? { ...c, required: !c.required } : c,
      ),
    );
  };

  // Kompresör ID'sini ekle/çıkar (Artık ID üzerinden işlem yapıyor)
  const toggleCP = (id: any) => {
    const current = Array.isArray(f.compressors) ? f.compressors : [];
    // Gelen veri hem string hem number olabileceği için kontrolü sıkı tutuyoruz
    const isSelected = current.some((c) => String(c) === String(id));

    set(
      "compressors",
      isSelected
        ? current.filter((c) => String(c) !== String(id))
        : [...current, id],
    );
  };

  const handleUpdate = async () => {
    if (!f.name.trim() || loading) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const url = `http://127.0.0.1:8000/api/plans/${f.id}/`;

      const payload = {
        name: f.name,
        team: f.team,
        status: f.status,
        checklist: f.checklist,
        interval_days: parseInt(f.frequency?.toString() || "30"),
        compressors: f.compressors.map((c) =>
          typeof c === "object" ? c.id : c,
        ), // Sadece ID'leri gönder
      };

      const response = await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      onSave(response.data);
      onClose();
    } catch (err: any) {
      console.error("Güncelleme Hatası:", err.response?.data || err.message);
      alert(
        "Hata: " +
          (err.response?.data
            ? JSON.stringify(err.response.data)
            : "Sunucu hatası"),
      );
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    padding: "9px 12px",
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    background: colors.inputBg,
    color: colors.text,
    fontSize: 13,
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: 16,
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 20px",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: colors.heading,
            }}
          >
            Edit Maintenance Plan
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: `1px solid ${colors.border}`,
              borderRadius: 7,
              width: 28,
              height: 28,
              cursor: "pointer",
              color: colors.muted,
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <Field label="Plan Name">
            <input
              style={inp}
              value={f.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Monthly Inspection"
            />
          </Field>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field label="Frequency">
              <select
                style={inp}
                value={f.frequency}
                onChange={(e) => set("frequency", e.target.value)}
              >
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="180">180 Days</option>
                <option value="365">Yearly</option>
              </select>
            </Field>
            <Field label="Responsible Team">
              <select
                style={inp}
                value={f.team}
                onChange={(e) => set("team", e.target.value)}
              >
                {TEAMS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Assigned Compressors">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {allCompressors.map((cp) => {
                const on = f.compressors?.some(
                  (id) => String(id) === String(cp.id),
                );
                return (
                  <button
                    key={cp.id}
                    type="button"
                    onClick={() => toggleCP(cp.id)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 7,
                      border: `1.5px solid ${on ? "#3b82f6" : colors.border}`,
                      background: on ? "#3b82f618" : colors.card,
                      color: on ? "#3b82f6" : colors.muted,
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {cp.name || cp.serial_number}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Checklist Tasks">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginBottom: 8,
              }}
            >
              {f.checklist.map((ci) => (
                <div
                  key={ci.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    background: colors.tableHeader,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                  }}
                >
                  <span style={{ flex: 1, fontSize: 13, color: colors.text }}>
                    {ci.label}
                  </span>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: colors.muted,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={ci.required}
                      onChange={() => toggleRequired(ci.id)}
                    />
                    Req.
                  </label>
                  <button
                    onClick={() => removeItem(ci.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#ef4444",
                      fontSize: 14,
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{ ...inp, flex: 1 }}
                value={item}
                onChange={(e) => setItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                placeholder="Add new task..."
              />
              <button
                onClick={addItem}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + Add
              </button>
            </div>
          </Field>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            padding: "14px 20px",
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: colors.card,
              color: colors.muted,
              border: `1.5px solid ${colors.border}`,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading || !f.name.trim()}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              opacity: f.name.trim() && !loading ? 1 : 0.5,
              minWidth: 120,
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePlansEdit;
