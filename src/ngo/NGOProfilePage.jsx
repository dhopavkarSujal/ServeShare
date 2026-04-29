import PageHeader from "../components/PageHeader";

export default function NGOProfilePage() {
  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Update NGO details and public information"
      />

      <div className="card" style={{ padding: 20, display: "grid", gap: 14 }}>
        <input className="input-field" defaultValue="Helping Hands NGO" />
        <input className="input-field" defaultValue="helpinghands@example.com" />
        <input className="input-field" defaultValue="Hyderabad, TS" />
        <textarea className="input-field" rows={4} defaultValue="We help communities with food, clothes, books and essentials." />
        <button className="btn-primary">Save Profile</button>
      </div>
    </div>
  );
}