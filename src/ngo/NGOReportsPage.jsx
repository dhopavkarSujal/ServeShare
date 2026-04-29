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

const reportData = [
  { date: "Mon", value: 18 },
  { date: "Tue", value: 22 },
  { date: "Wed", value: 20 },
  { date: "Thu", value: 26 },
  { date: "Fri", value: 30 },
  { date: "Sat", value: 28 },
  { date: "Sun", value: 34 },
];

export default function NGOReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="View your NGO performance and impact"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon="📈" label="Requests Handled" value="124" change={11.2} sub="vs last month" color="#16A34A" />
        <StatCard icon="🚚" label="Pickups Done" value="78" change={9.5} sub="vs last month" color="#3B82F6" />
        <StatCard icon="🎁" label="Donations Closed" value="96" change={14.1} sub="vs last month" color="#8B5CF6" />
        <StatCard icon="👥" label="Beneficiaries Served" value="1,240" change={7.8} sub="vs last month" color="#F59E0B" />
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>Weekly Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={reportData}>
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
    </div>
  );
}