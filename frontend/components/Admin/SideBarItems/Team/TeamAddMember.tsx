"use client";
import React, { useState } from "react";
import axios from "axios";

interface TeamAddMemberProps {
  onClose: () => void;
  onSuccess: (newMember: any) => void;
  c: any;
  isDark: boolean;
  teams: any[];
}

const TeamAddMember = ({
  onClose,
  onSuccess,
  c,
  isDark,
  teams,
}: TeamAddMemberProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    role: "technician",
    team_id: teams.length > 0 ? teams[0].id : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.team_id) {
      alert("Lütfen bir ekip seçin!");
      return;
    }
    setLoading(true);
    try {
      // TOKEN ALIMI (Senin örneğindeki gibi)
      const token =
        localStorage.getItem("access_token") || localStorage.getItem("token");

      // URL'nin sonundaki "/" Django için kritiktir
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/register/",
        {
          email: formData.email,
          password: formData.password,
          username: formData.email,
          role: formData.role.toLowerCase(),
          team_id: formData.team_id,
          first_name: formData.full_name.split(" ")[0],
          last_name: formData.full_name.split(" ").slice(1).join(" "),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Yetki eklendi
          },
        },
      );

      onSuccess(response.data);
      onClose();
    } catch (error: any) {
      console.error("Hata:", error.response?.data || error.message);
      alert(
        error.response?.data?.detail ||
          "Üye eklenemedi. Yetkiniz yok veya e-posta kullanımda.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --- UI VE CSS KISMI (DOKUNULMADI) ---
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    paddingRight: "40px",
    borderRadius: 8,
    border: `1px solid ${c.border}`,
    background: c.inputBg,
    color: c.text,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    marginBottom: 16,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: c.muted,
    marginBottom: 6,
    textTransform: "uppercase",
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.4)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
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
          borderRadius: 16,
          padding: 32,
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: c.heading,
            }}
          >
            Yeni Üye Davet Et
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: c.muted,
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Ad Soyad</label>
          <input
            required
            style={inputStyle}
            placeholder="Ahmet Yılmaz"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />

          <label style={labelStyle}>E-posta</label>
          <input
            required
            type="email"
            style={inputStyle}
            placeholder="ahmet@sirket.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <label style={labelStyle}>Giriş Şifresi</label>
          <div style={{ position: "relative" }}>
            <input
              required
              type={showPassword ? "text" : "password"}
              style={inputStyle}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "10px",
                background: "none",
                border: "none",
                color: c.muted,
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Rol</label>
              <select
                style={inputStyle}
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="technician">Technician</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Ekip Seçimi</label>
              <select
                required
                style={inputStyle}
                value={formData.team_id}
                onChange={(e) =>
                  setFormData({ ...formData, team_id: e.target.value })
                }
              >
                <option value="">Seçiniz...</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                border: `1px solid ${c.border}`,
                background: "transparent",
                color: c.text,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 8,
                border: "none",
                background: "#3b82f6",
                color: "#fff",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Ekleniyor..." : "Üyeyi Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamAddMember;
