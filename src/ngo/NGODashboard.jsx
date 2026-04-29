import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

const ngoOverviewData = [
  { date: "Mon", value: 12 },
  { date: "Tue", value: 18 },
  { date: "Wed", value: 14 },
  { date: "Thu", value: 22 },
  { date: "Fri", value: 28 },
  { date: "Sat", value: 24 },
  { date: "Sun", value: 31 },
];

const quickStats = [
  { icon: "📥", label: "Pending Requests", value: "12", change: 8.4, sub: "vs last week", color: "#3B82F6" },
  { icon: "✅", label: "Accepted Today", value: "8", change: 12.1, sub: "vs yesterday", color: "#16A34A" },
  { icon: "🚚", label: "Scheduled Pickups", value: "5", change: 4.3, sub: "this week", color: "#8B5CF6" },
  { icon: "🎁", label: "Donations Completed", value: "74", change: 15.8, sub: "this month", color: "#F59E0B" },
];

const recentRequests = [
  { item: "Food Items", detail: "Rice, Dal, Oil, Spices", status: "Pending", requester: "Arjun Kumar", time: "1 hour ago" },
  { item: "Blankets", detail: "Winter Blankets", status: "Pending", requester: "Neha Patil", time: "3 hours ago" },
  { item: "Clothes", detail: "Men, Women, Kids", status: "Accepted", requester: "Ramesh Singh", time: "Yesterday" },
  { item: "Books", detail: "Educational Books", status: "Completed", requester: "Sneha Reddy", time: "2 days ago" },
];

const NGODashboard = () => {
  return (
    <div>
      <PageHeader
        title="NGO Dashboard"
        subtitle="Manage incoming requests, pickups, and impact"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
        {quickStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Weekly Activity</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 3 }}>Request activity over the last 7 days</p>
            </div>
            <StatusBadge status="Active" />
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={ngoOverviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  boxShadow: "var(--shadow-md)",
                }}
              />
              <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>Recent Requests</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {recentRequests.map((r) => (
              <div key={r.item} style={{ paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{r.item}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{r.detail}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                  {r.requester} · {r.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;