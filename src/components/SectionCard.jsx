export default function SectionCard({ title, children, action }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700 }}>{title}</h3>
        {action}
      </div>

      {children}
    </div>
  );
}