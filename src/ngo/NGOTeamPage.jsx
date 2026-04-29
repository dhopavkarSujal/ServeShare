import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const team = [
  { name: "Amit Shah", role: "Coordinator", status: "Active" },
  { name: "Priya Desai", role: "Volunteer Lead", status: "Active" },
  { name: "Neha Joshi", role: "Logistics", status: "Pending" },
];

export default function NGOTeamPage() {
  return (
    <div>
      <PageHeader
        title="Manage Team"
        subtitle="Track your team members and roles"
      />

      <div style={{ display: "grid", gap: 14 }}>
        {team.map((t) => (
          <div className="card" style={{ padding: 18, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }} key={t.name}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{t.name}</h3>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 3 }}>{t.role}</p>
            </div>
            <StatusBadge status={t.status} />
          </div>
        ))}
      </div>
    </div>
  );
}