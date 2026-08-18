"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "next-themes";

// Django için sonundaki "/" çok önemli!
const API_URL = "http://127.0.0.1:8000/api/teams/";

interface TeamCreateProps {
  onClose: () => void;
  onSuccess: (newTeam: any) => void;
  c: any; // Tema renkleri objesi
}

const TeamCreate = ({ onClose, onSuccess, c }: TeamCreateProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // LocalStorage'dan senin örneğindeki gibi çekiyoruz
      const token =
        localStorage.getItem("access_token") || localStorage.getItem("token");

      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Başarılı ise ana tabloyu güncelle ve kapat
      onSuccess(response.data);
      onClose();
    } catch (error: any) {
      // Hata detayını yakala
      console.error(
        "Team Create Error Details:",
        error.response?.data || error,
      );
      const errorMsg =
        error.response?.data?.detail ||
        "Ekip oluşturulamadı. Yetki hatası veya isim çakışması olabilir.";
      alert(`Hata: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: `1px solid ${c.border}`,
    background: c.inputBg,
    color: c.text,
    fontSize: "14px",
    outline: "none",
    marginBottom: "16px",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: c.muted,
    marginBottom: "6px",
    textTransform: "uppercase",
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: c.card,
          border: `1px solid ${c.border}`,
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "450px",
          width: "100%",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            color: c.muted,
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <h2
          style={{
            margin: "0 0 24px 0",
            fontSize: "22px",
            fontWeight: 800,
            color: c.heading,
          }}
        >
          Yeni Ekip Oluştur
        </h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Ekip Adı</label>
            <input
              required
              style={inputStyle}
              placeholder="Örn: Teknik Destek Ekibi"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label style={labelStyle}>Açıklama</label>
            <textarea
              style={{ ...inputStyle, minHeight: "100px", resize: "none" }}
              placeholder="Ekip hakkında kısa bilgi..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "8px",
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
                padding: "14px",
                borderRadius: "8px",
                border: "none",
                background: "#3b82f6",
                color: "#fff",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
              }}
            >
              {loading ? "İşleniyor..." : "Ekibi Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamCreate;
