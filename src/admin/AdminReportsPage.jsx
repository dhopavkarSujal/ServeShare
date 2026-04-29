import { useEffect, useState } from "react";
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
import { adminAnalyticsService } from "../config/services/adminAnalyticsService";
import { supabase } from "../config/supabaseClient";

export default function AdminReportsPage() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await adminAnalyticsService.getDashboardStats();
      const chartRes = await adminAnalyticsService.getWeeklyChart();
      const reportsRes = await adminAnalyticsService.getMonthlyReports();

      setStats(statsRes);
      setChartData(chartRes);
      setMonthlyReports(reportsRes);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // 🔥 Real-time updates
    const channel = supabase
      .channel("analytics")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, () => {
        loadData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        loadData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "ngos" }, () => {
        loadData();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  if (loading || !stats)
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Loading analytics...</p>
      </div>
    );

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Track platform performance and growth"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon="📈" label="Donations This Week" value={stats.donationsCount} change={12.3} sub="vs last week" color="#16A34A" />
        <StatCard icon="👥" label="New Users" value={stats.usersCount} change={8.9} sub="vs last week" color="#3B82F6" />
        <StatCard icon="🏢" label="NGO Approvals" value={stats.ngosApproved} change={5.4} sub="vs last week" color="#8B5CF6" />
        <StatCard icon="✅" label="Completion Rate" value={`${stats.completionRate}%`} change={3.1} sub="vs last week" color="#F59E0B" />
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Weekly Growth</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 3 }}>Donation and user growth over 7 days</p>
          </div>
          <select className="input-field" style={{ width: 160, height: 38 }}>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
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
            <Line type="monotone" dataKey="donations" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: 20, borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Monthly Summary</h3>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "var(--surface2)" }}>
              <tr>
                {["Report", "Value", "Status"].map((h) => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyReports.map((r) => (
                <tr key={r.name} className="table-row" style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{r.name}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-secondary)" }}>{r.value}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-muted)" }}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}