"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: "⊞", label: "Dashboard", id: "dashboard" }, // id'yi dashboard yaptık
  { icon: "⚙", label: "Compressors", id: "compressors" },
  { icon: "📋", label: "Maintenance Plans", id: "maintenance" },
  { icon: "✓", label: "Tasks", id: "tasks" },
  { icon: "👥", label: "Team", id: "team" },
  { icon: "📊", label: "Reports", id: "reports" },
  { icon: "🔔", label: "Notifications", id: "notifications" },
  { icon: "🔗", label: "Integrations", id: "integrations" },
  { icon: "💳", label: "Billing", id: "billing" },
  { icon: "⚙", label: "Settings", id: "settings" },
];

const bottomItems = [
  { icon: "?", label: "Support", id: "support" },
  { icon: "→", label: "Logout", id: "logout" },
];

interface AdminSideBarProps {
  dark?: boolean;
  companyName?: string;
  plan?: "Starter" | "Growth" | "Scale";
  activeItem?: string; // AdminPage'den gelen state
  onItemClick?: (id: string) => void; // AdminPage'deki state'i güncelleyen fonks.
}

const AdminSideBar: React.FC<AdminSideBarProps> = ({
  dark = false,
  companyName = "AirTech Co.",
  plan = "Growth",
  activeItem,
  onItemClick,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const bg = dark ? "#0f1117" : "#ffffff";
  const border = dark ? "#1e2130" : "#e8eaf0";
  const text = dark ? "#c9d1e0" : "#4a5568";
  const textMuted = dark ? "#5a6580" : "#9aa3b0";
  const activeBg = dark ? "#1a2a4a" : "#eff6ff";
  const activeText = "#3b82f6";
  const hoverBg = dark ? "#161b2a" : "#f7f9fc";

  const planColors: Record<string, string> = {
    Starter: "#10b981",
    Growth: "#3b82f6",
    Scale: "#8b5cf6",
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        width: collapsed ? 64 : 220,
        minHeight: "100vh",
        background: bg,
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: border,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: "18px 14px 12px",
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: activeText,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
                color: "#fff",
                fontWeight: 700,
              }}
            >
              A
            </div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: dark ? "#e2e8f0" : "#1a202c",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {companyName}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: planColors[plan],
                    background: `${planColors[plan]}18`,
                    borderRadius: 4,
                    padding: "1px 6px",
                    display: "inline-block",
                  }}
                >
                  {plan}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: textMuted,
              fontSize: 16,
            }}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>
      </div>

      <nav
        style={{
          flex: 1,
          padding: "10px 8px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {menuItems.map((item) => {
          // Dashboard için root /admin, diğerleri için /admin/id
          const href =
            item.id === "dashboard" ? "/dashboard" : `/dashboard/${item.id}`;
          // State veya URL bazlı aktiflik kontrolü
          const isActive = activeItem === item.id;

          return (
            <MenuItem
              key={item.id}
              href={href}
              icon={item.icon}
              label={item.label}
              active={isActive}
              collapsed={collapsed}
              activeBg={activeBg}
              activeText={activeText}
              hoverBg={hoverBg}
              text={text}
              onClick={() => onItemClick?.(item.id)} // Tıklanınca state'i güncelle
            />
          );
        })}
      </nav>

      <div
        style={{ padding: "8px 8px 16px", borderTop: `1px solid ${border}` }}
      >
        {bottomItems.map((item) => (
          <MenuItem
            key={item.id}
            href={`/dashboard/${item.id}`}
            icon={item.icon}
            label={item.label}
            active={activeItem === item.id}
            collapsed={collapsed}
            activeBg={activeBg}
            activeText={activeText}
            hoverBg={hoverBg}
            text={textMuted}
            onClick={() => onItemClick?.(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

const MenuItem: React.FC<any> = ({
  href,
  icon,
  label,
  active,
  collapsed,
  activeBg,
  activeText,
  hoverBg,
  text,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      style={{ textDecoration: "none" }}
      onClick={(e) => {
        // Eğer aynı sayfadaysak sayfa yenilenmesin diye preventDefault ekleyebilirsin ama state yönetimi için onClick çalışmalı
        onClick?.();
      }}
    >
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: collapsed ? "12px 0" : "9px 10px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          background: active ? activeBg : hovered ? hoverBg : "transparent",
          color: active ? activeText : text,
          fontSize: 13,
          fontWeight: active ? 600 : 400,
          transition: "all 0.15s",
          marginBottom: 2,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
        {!collapsed && <span>{label}</span>}
      </button>
    </Link>
  );
};

export default AdminSideBar;
