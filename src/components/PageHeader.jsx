export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>{title}</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            {subtitle}
          </p>
        </div>
        {action}
      </div>
    </div>
  );
}