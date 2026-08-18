"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import AdminNavbar from "../../../components/Admin/AdminNavbar";
import AdminSideBar from "../../../components/Admin/AdminSideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        background: isDark ? "#080b12" : "#f4f6f9",
      }}
    >
      <AdminNavbar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <AdminSideBar dark={isDark} />
        <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
      </div>
    </div>
  );
}
