import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronRight } from "lucide-react";

import StatCard from "../components/StatCard";
import SectionCard from "../components/SectionCard";
import { adminService } from "../config/services/adminService";
import { activityService } from "../config/services/activityService";
import { supabase } from "../config/supabaseClient";
import "../css/UserPages.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    ngos: 0,
    donations: 0,
    completed: 0,
    pending: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadChart = async () => {
    try {
      const { data } = await supabase
        .from("donations")
        .select("created_at")
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (!data) return;

      // Group by day of week
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const grouped = {};

      days.forEach(d => (grouped[d] = 0));

      data.forEach(d => {
        const day = new Date(d.created_at).toLocaleDateString("en-US", { weekday: "short" });
        grouped[day]++;
      });

      const formatted = days.map(day => ({
        date: day,
        value: grouped[day],
      }));

      setChartData(formatted);
    } catch (err) {
      console.error("Failed to load chart data:", err);
    }
  };

  const loadActivity = async () => {
    try {
      const { logs } = await activityService.getMyActivity(null, { limit: 5 });
      // Fallback to getAllActivity if no user_id
      const allLogs = await activityService.getAllActivity({ limit: 5 });
      setActivity(allLogs.logs || []);
    } catch (err) {
      console.error("Failed to load activity:", err);
      setActivity([]);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const statsData = await adminService.getDashboardStats();
      setStats(statsData);
      await loadChart();
      await loadActivity();
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAll();

    // 🔥 Real-time updates
    const channel = supabase
      .channel("dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, () => {
        adminService.getDashboardStats().then(setStats);
        loadChart();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        adminService.getDashboardStats().then(setStats);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "ngos" }, () => {
        adminService.getDashboardStats().then(setStats);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "activity_logs" }, () => {
        loadActivity();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading dashboard...</p>
      </div>
    );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>
          Welcome back, Admin 👋
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
          Here's what's happening with ServeShare today.
        </p>
      </div>

      <div className="admin-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard icon="👥" label="Total Users" value={stats.users.toLocaleString()} sub="registered" color="#3B82F6" />
        <StatCard icon="🏛️" label="Registered NGOs" value={stats.ngos.toLocaleString()} sub="verified" color="#16A34A" />
        <StatCard icon="🎁" label="Total Donations" value={stats.donations.toLocaleString()} sub="all time" color="#8B5CF6" />
        <StatCard icon="✅" label="Completed" value={stats.completed.toLocaleString()} sub="finished" color="#F59E0B" />
        <StatCard icon="⏳" label="Pending Review" value={stats.pending.toLocaleString()} sub="need attention" color="#EF4444" />
      </div>

      <div className="admin-overview-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <SectionCard
          title="Platform Overview"
          action={
            <select
              style={{
                fontSize: 12,
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "4px 8px",
                background: "var(--surface2)",
                color: "var(--text-secondary)",
                outline: "none",
              }}
            >
              <option>Last 7 Days</option>
            </select>
          }
        >
          <ResponsiveContainer width="100%" height={220}>
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
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={{ fill: "var(--primary)", r: 4, strokeWidth: 2, stroke: "var(--surface)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Recent Activity">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {activity.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>
                No recent activity
              </p>
            ) : (
              activity.slice(0, 3).map((a) => (
                <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: "var(--surface2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    📋
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.4 }}>
                      {a.action}: {a.description}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                      {new Date(a.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      <div className="admin-management-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
        {[
          { icon: "🏢", title: "NGO Approvals", count: stats.ngos, route: "/admin/ngos", color: "#16A34A" },
          { icon: "🎁", title: "Donation Management", count: stats.donations, route: "/admin/donations", color: "#3B82F6" },
          { icon: "👥", title: "User Management", count: stats.users, route: "/admin/users", color: "#8B5CF6" },
        ].map((card) => (
          <div
            key={card.title}
            className="card card-hover"
            style={{ padding: 20, cursor: "pointer" }}
            onClick={() => navigate(card.route)}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${card.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                marginBottom: 12,
              }}
            >
              {card.icon}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>
              {card.title}
            </h3>
            <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {card.count.toLocaleString()} total {card.title.toLowerCase()}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 14,
                color: card.color,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Manage <ChevronRight size={13} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;