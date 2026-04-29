export default function StatCard({ icon, label, value, change, sub, color }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18
          }}
        >
          {icon}
        </div>

        <div>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</p>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{value}</h3>
        </div>
      </div>

      {change && (
        <p style={{ fontSize: 12, marginTop: 8, color: "var(--primary)" }}>
          ↑ {change}% {sub}
        </p>
      )}
    </div>
  );
}