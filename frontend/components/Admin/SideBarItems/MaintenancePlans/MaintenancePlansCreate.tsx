"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const TEAMS = ["Team Alpha", "Team Beta", "Team Gamma"];
// Statik COMPRESSORS dizisini sildik, aşağıda API'den çekeceğiz.

export type CheckItem = { id: string; label: string; required: boolean };
export type Plan = {
  id: string;
  name: string;
  frequency: string;
  team: string;
  compressors: string[]; // Bu ID listesi olarak tutulur (örn: ["1", "3"])
  status: string;
  checklist: CheckItem[];
};

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

interface CreateProps {
  plan: Plan;
  onClose: () => void;
  onSave: (p: Plan) => void;
  colors: any;
}

const MaintenancePlansCreate = ({
  plan,
  onClose,
  onSave,
  colors,
}: CreateProps) => {
  const [f, setF] = useState<Plan>({
    ...plan,
    compressors: plan.compressors || [],
  });
  const [item, setItem] = useState("");
  const [loading, setLoading] = useState(false);

  // Yeni: Gerçek kompresör listesi için state
  const [dbCompressors, setDbCompressors] = useState<any[]>([]);

  // API'den kompresörleri çek
  useEffect(() => {
    const fetchCPs = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}api/compressors/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setDbCompressors(res.data);
      } catch (error) {
        console.error("Kompresörler çekilemedi:", error);
      }
    };
    fetchCPs();
  }, []);

  const set = (k: keyof Plan, v: any) => setF((p) => ({ ...p, [k]: v }));

  const addItem = () => {
    if (!item.trim()) return;
    set("checklist", [
      ...f.checklist,
      { id: Date.now().toString(), label: item.trim(), required: false },
    ]);
    setItem("");
  };

  const toggleCP = (cpId: string) => {
    const current = f.compressors || [];
    const next = current.includes(cpId)
      ? current.filter((c) => c !== cpId)
      : [...current, cpId];
    set("compressors", next);
  };

  const handleSave = async () => {
    if (!f.name.trim() || loading) return;
    setLoading(true);

    try {
      const isEdit = !!f.id;
      const token = localStorage.getItem("access_token");
      const baseUrl = "http://127.0.0.1:8000/api/plans/";

      const payload = {
        name: f.name,
        team: f.team,
        status: f.status,
        checklist: f.checklist,
        interval_days: parseInt(f.frequency) || 30,
        compressors: f.compressors,
      };

      const url = isEdit ? `${baseUrl}${f.id}/` : baseUrl;

      const response = await axios({
        method: isEdit ? "put" : "post",
        url: url,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        onSave(response.data);
        onClose();
      }
    } catch (err: any) {
      console.error("API Hatası:", err.response?.data || err.message);
      alert("Hata: " + JSON.stringify(err.response?.data || "Sunucu hatası"));
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
            {f.id ? "Edit Plan" : "Create Plan"}
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
                <option value="custom">Custom 🔒</option>
              </select>
            </Field>
            <Field label="Team">
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

          <Field label="Status">
            <select
              style={inp}
              value={f.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {["active", "draft", "paused"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          {/* DİNAMİK KOMPRESÖR SEÇİM ALANI */}
          <Field label="Compressors">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {dbCompressors.length === 0 && (
                <span style={{ fontSize: 12, color: colors.muted }}>
                  No units found...
                </span>
              )}
              {dbCompressors.map((cp) => {
                // Backend'den gelen id tipine göre toString() gerekebilir
                const cpId = cp.id.toString();
                const on = f.compressors.includes(cpId);
                return (
                  <button
                    key={cp.id}
                    type="button"
                    onClick={() => toggleCP(cpId)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 7,
                      border: `1.5px solid ${on ? "#3b82f6" : colors.border}`,
                      background: on ? "#3b82f618" : colors.card,
                      color: on ? "#3b82f6" : colors.muted,
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                    }}
                  >
                    {cp.serial_number || cp.name}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Checklist 🔒">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginBottom: 8,
              }}
            >
              {f.checklist.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: 14,
                    fontSize: 13,
                    color: colors.muted,
                    border: `1.5px dashed ${colors.border}`,
                    borderRadius: 8,
                  }}
                >
                  No items yet
                </div>
              )}
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
                      onChange={() =>
                        set(
                          "checklist",
                          f.checklist.map((c) =>
                            c.id === ci.id
                              ? { ...c, required: !c.required }
                              : c,
                          ),
                        )
                      }
                    />{" "}
                    Required
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "checklist",
                        f.checklist.filter((c) => c.id !== ci.id),
                      )
                    }
                    style={{
                      background: "none",
                      border: `1px solid ${colors.border}`,
                      borderRadius: 7,
                      width: 28,
                      height: 28,
                      cursor: "pointer",
                      color: colors.muted,
                      fontSize: 11,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
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
                placeholder="Add item..."
              />
              <button
                type="button"
                onClick={addItem}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 13,
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
            type="button"
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: colors.card,
              color: colors.muted,
              border: `1.5px solid ${colors.border}`,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!f.name.trim() || loading}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              opacity: f.name.trim() && !loading ? 1 : 0.5,
            }}
          >
            {loading ? "Saving..." : f.id ? "Save Changes" : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePlansCreate;
