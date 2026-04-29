import PageHeader from "../components/PageHeader";

export default function NGOSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure NGO preferences and account settings"
      />

      <div className="card" style={{ padding: 20, display: "grid", gap: 14 }}>
        <input className="input-field" defaultValue="Helping Hands NGO" />
        <input className="input-field" defaultValue="support@helpinghands.org" />
        <input className="input-field" defaultValue="+91 98765 43210" />
        <button className="btn-primary">Save Settings</button>
      </div>
    </div>
  );
}