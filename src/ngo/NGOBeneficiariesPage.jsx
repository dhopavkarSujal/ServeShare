import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const beneficiaries = [
  { name: "Sunshine Orphanage", need: "Education, Clothes", status: "Active" },
  { name: "Care Home", need: "Food, Blankets", status: "Active" },
  { name: "Hope Foundation", need: "Books, Stationery", status: "Pending" },
];

export default function NGOBeneficiariesPage() {
  return (
    <div>
      <PageHeader
        title="Beneficiaries"
        subtitle="Track the groups and communities you serve"
      />

      <div style={{ display: "grid", gap: 14 }}>
        {beneficiaries.map((b) => (
          <div className="card" style={{ padding: 18 }} key={b.name}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{b.name}</h3>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 3 }}>{b.need}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}