import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const pickups = [
  { day: "21", month: "May", item: "Food Items", area: "Banjara Hills, Hyderabad", time: "10:00 AM", status: "Pending" },
  { day: "22", month: "May", item: "Clothes", area: "Madhapur, Hyderabad", time: "11:30 AM", status: "Accepted" },
  { day: "23", month: "May", item: "Blankets", area: "Kondapur, Hyderabad", time: "02:00 PM", status: "Completed" },
];

export default function NGOPickupsPage() {
  return (
    <div>
      <PageHeader
        title="Pickups & Deliveries"
        subtitle="Manage schedules and delivery status"
      />

      <div style={{ display: "grid", gap: 14 }}>
        {pickups.map((p) => (
          <div className="card" style={{ padding: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }} key={`${p.day}-${p.item}`}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--primary-light)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{p.day}</div>
                <div style={{ fontSize: 10, fontWeight: 700 }}>{p.month}</div>
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{p.item}</h3>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{p.area}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{p.time}</p>
              </div>
            </div>
            <StatusBadge status={p.status} />
          </div>
        ))}
      </div>
    </div>
  );
}