import React, { useState } from "react";
import axios from "axios";

// ---- Types ----
export type Colors = {
  card: string;
  border: string;
  text: string;
  heading: string;
  muted: string;
  th: string;
  inputBg: string;
};

// ---- Shared Helpers ----
export const roleColor = (r: string) => {
  const role = r?.toLowerCase();
  return role === "admin"
    ? "#8b5cf6"
    : role === "technician"
      ? "#3b82f6"
      : "#9ca3af";
};

export const Badge = ({ label, color }: { label: string; color: string }) => (
  <span
    style={{
      fontSize: 11,
      fontWeight: 700,
      color,
      background: `${color}18`,
      padding: "3px 9px",
      borderRadius: 20,
      border: `1px solid ${color}30`,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

// ---- Member Detail Panel ----
function MemberPanel({
  member,
  c,
  onClose,
  onDeleted,
  onDeactivate,
}: {
  member: any;
  c: Colors;
  onClose: () => void;
  onDeleted: () => void;
  onDeactivate: (id: string, current: boolean) => void;
}) {
  const rc = roleColor(member.role);

  const handleDelete = async () => {
    if (
      !confirm(
        `"${member.email}" adlı üyeyi SİSTEMDEN KALICI OLARAK silmek istiyor musunuz? Bu işlem geri alınamaz.`,
      )
    )
      return;
    try {
      const token =
        localStorage.getItem("access_token") || localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/users/${member.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleted();
    } catch {
      alert("Silme işlemi başarısız. Admin yetkisi gerekebilir.");
    }
  };

  return (
    <div
      style={{
        width: 290,
        minWidth: 290,
        background: c.card,
        borderRadius: 14,
        border: `1px solid ${c.border}`,
        overflow: "hidden",
        alignSelf: "flex-start",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          background: c.th,
          padding: "14px 16px",
          borderBottom: `1px solid ${c.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: c.muted,
            textTransform: "uppercase",
          }}
        >
          Member Detail
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: c.muted,
            fontSize: 20,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: "18px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: rc + "22",
              border: `2px solid ${rc}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              fontWeight: 800,
              color: rc,
            }}
          >
            {(member.email || "U").charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: c.heading,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {member.email}
            </div>
            <div style={{ marginTop: 4 }}>
              <Badge label={member.role || "Technician"} color={rc} />
            </div>
          </div>
        </div>

        {[
          {
            label: "Status",
            node: (
              <Badge
                label={member.is_active ? "Active" : "Inactive"}
                color={member.is_active ? "#10b981" : "#9ca3af"}
              />
            ),
          },
          {
            label: "Team",
            node: (
              <span style={{ fontSize: 13, color: c.text }}>
                {member.team_name || "—"}
              </span>
            ),
          },
          {
            label: "First Name",
            node: (
              <span style={{ fontSize: 13, color: c.text }}>
                {member.first_name || "—"}
              </span>
            ),
          },
          {
            label: "Last Name",
            node: (
              <span style={{ fontSize: 13, color: c.text }}>
                {member.last_name || "—"}
              </span>
            ),
          },
          {
            label: "User ID",
            node: (
              <span
                style={{
                  fontSize: 11,
                  color: c.muted,
                  fontFamily: "monospace",
                }}
              >
                {member.id || "—"}
              </span>
            ),
          },
        ].map(({ label, node }) => (
          <div key={label} style={{ marginBottom: 11 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: c.muted,
                textTransform: "uppercase",
                marginBottom: 3,
              }}
            >
              {label}
            </div>
            {node}
          </div>
        ))}

        <div style={{ borderTop: `1px solid ${c.border}`, margin: "14px 0" }} />

        <button
          onClick={() => onDeactivate(member.id, member.is_active)}
          style={{
            width: "100%",
            padding: "9px",
            borderRadius: 8,
            background: "transparent",
            border: `1px solid ${member.is_active ? "#ef444440" : "#10b98140"}`,
            color: member.is_active ? "#ef4444" : "#10b981",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 8,
          }}
        >
          {member.is_active ? "Deactivate Member" : "Activate Member"}
        </button>

        <button
          onClick={handleDelete}
          style={{
            width: "100%",
            padding: "9px",
            borderRadius: 8,
            background: "transparent",
            border: "1px solid #ef444440",
            color: "#ef4444",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          🗑 Delete Member
        </button>
      </div>
    </div>
  );
}

const COLS = "1.5fr 1fr 1.2fr 0.6fr 0.8fr 100px";

// ... (Diğer helperlar aynı)

export default function TeamMemberList({
  members,
  c,
  isDark,
  onDeactivate,
  onRefresh,
}: {
  members: any[];
  c: Colors;
  isDark: boolean;
  onDeactivate: (id: string, current: boolean) => void;
  onRefresh: () => void;
}) {
  const [selected, setSelected] = useState<any | null>(null);

  // KRİTİK: Sadece rolü 'technician' olanları filtrele (Küçük/Büyük harf duyarsız)
  const techniciansOnly = members.filter(
    (m) => m.role?.toLowerCase() === "technician",
  );

  const inp: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 7,
    border: `1px solid ${c.border}`,
    background: c.inputBg,
    color: c.text,
    fontSize: 12,
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div
        style={{
          flex: 1,
          background: c.card,
          borderRadius: 14,
          border: `1px solid ${c.border}`,
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Table Header aynı kalabilir */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: COLS,
            padding: "12px 18px",
            borderBottom: `1px solid ${c.border}`,
            background: c.th,
          }}
        >
          {["Name", "Role", "Team", "Tasks", "Status", "Actions"].map((h) => (
            <div
              key={h}
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: c.muted,
                textTransform: "uppercase",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* members yerine techniciansOnly map'liyoruz */}
        {techniciansOnly.map((m, i) => (
          <div
            key={m.id}
            onClick={() => setSelected(selected?.id === m.id ? null : m)}
            style={{
              display: "grid",
              gridTemplateColumns: COLS,
              padding: "13px 18px",
              alignItems: "center",
              borderBottom:
                i < techniciansOnly.length - 1
                  ? `1px solid ${c.border}`
                  : "none",
              background:
                selected?.id === m.id
                  ? isDark
                    ? "#1e213088"
                    : "#f0f6ff"
                  : "transparent",
              cursor: "pointer",
            }}
          >
            {/* ... (Hücre içerikleri aynı) */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: roleColor(m.role) + "33",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 800,
                  color: roleColor(m.role),
                }}
              >
                {(m.email || "U").charAt(0).toUpperCase()}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.heading }}>
                {m.email}
              </div>
            </div>
            <div>
              <Badge label={m.role} color={roleColor(m.role)} />
            </div>
            <div style={{ fontSize: 12, color: c.text }}>
              {m.team_name || "—"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: c.heading }}>
              0
            </div>
            <div>
              <Badge
                label={m.is_active ? "active" : "inactive"}
                color={m.is_active ? "#10b981" : "#9ca3af"}
              />
            </div>

            <div
              style={{ display: "flex", gap: 5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelected(m)} style={inp}>
                View
              </button>
              {/* Buradaki buton artık "Remove" işlevi görüyor */}
              <button
                onClick={() => {
                  if (
                    confirm("Bu teknisyeni takımdan çıkarmak istiyor musunuz?")
                  ) {
                    // Backend'de perform_destroy çalıştığında user silinmez, sadece takımı null olur
                    axios
                      .delete(`http://127.0.0.1:8000/api/users/${m.id}/`, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                      })
                      .then(() => onRefresh());
                  }
                }}
                style={{ ...inp, color: "#ef4444", borderColor: "#ef444440" }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <MemberPanel
          member={selected}
          c={c}
          onClose={() => setSelected(null)}
          onDeleted={() => {
            setSelected(null);
            onRefresh();
          }}
          onDeactivate={(id, cur) => {
            onDeactivate(id, cur);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}
