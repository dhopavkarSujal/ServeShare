import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const messages = [
  { name: "Arjun Kumar", text: "Thank you for accepting our request...", time: "10 min ago", unread: true },
  { name: "Neha Patil", text: "When can we schedule the pickup?", time: "1 hour ago", unread: true },
  { name: "Ramesh Singh", text: "We appreciate your support!", time: "3 hours ago", unread: false },
];

export default function NGOMessagesPage() {
  return (
    <div>
      <PageHeader
        title="Messages"
        subtitle="Chat with donors and coordinators"
      />

      <div className="card" style={{ padding: 18, display: "grid", gap: 12 }}>
        {messages.map((m) => (
          <div key={m.name} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{m.name}</h3>
                {m.unread ? <StatusBadge status="Pending" /> : <StatusBadge status="Completed" />}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{m.text}</p>
            </div>
            <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{m.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}