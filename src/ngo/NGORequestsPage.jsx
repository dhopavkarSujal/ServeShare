import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const requests = [
  { img: "🍚", item: "Food Items", detail: "Rice, Dal, Oil, Spices", status: "Pending", dist: "2.1 km", area: "Banjara Hills", requester: "Arjun Kumar", time: "1 hour ago" },
  { img: "🧣", item: "Blankets", detail: "Winter Blankets", status: "Pending", dist: "3.4 km", area: "Jubilee Hills", requester: "Neha Patil", time: "3 hours ago" },
  { img: "👕", item: "Clothes", detail: "Men, Women, Kids", status: "Accepted", dist: "4.7 km", area: "Madhapur", requester: "Ramesh Singh", time: "Yesterday" },
  { img: "📚", item: "Books", detail: "Educational Books", status: "Completed", dist: "5.2 km", area: "Kondapur", requester: "Sneha Reddy", time: "2 days ago" },
];

export default function NGORequestsPage() {
  return (
    <div>
      <PageHeader
        title="Donation Requests"
        subtitle="Review and manage all incoming donation requests"
      />

      <div style={{ display: "grid", gap: 14 }}>
        {requests.map((r) => (
          <div className="card" style={{ padding: 18 }} key={r.item}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  {r.img}
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{r.item}</h3>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{r.detail}</p>
                </div>
              </div>

              <StatusBadge status={r.status} />
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12, fontSize: 12, color: "var(--text-muted)" }}>
              <span>{r.area}</span>
              <span>{r.dist}</span>
              <span>{r.requester}</span>
              <span>{r.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}