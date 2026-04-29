import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const donations = [
  { id: "DN201", item: "Food Packets", qty: "20 items", donor: "Arjun Kumar", date: "May 23", status: "Completed" },
  { id: "DN202", item: "Blankets", qty: "12 items", donor: "Neha Patil", date: "May 24", status: "Pending" },
  { id: "DN203", item: "Books", qty: "18 items", donor: "Sneha Reddy", date: "May 18", status: "Completed" },
  { id: "DN204", item: "Clothes", qty: "10 items", donor: "Ramesh Singh", date: "May 17", status: "Accepted" },
];

export default function NGODonationsPage() {
  return (
    <div>
      <PageHeader
        title="My Donations"
        subtitle="Track all donations handled by your NGO"
      />

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "var(--surface2)" }}>
              <tr>
                {["ID", "Item", "Donor", "Date", "Status"].map((h) => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="table-row" style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>{d.id}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text)" }}>{d.item}<div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{d.qty}</div></td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-secondary)" }}>{d.donor}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-muted)" }}>{d.date}</td>
                  <td style={{ padding: "14px 20px" }}><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}