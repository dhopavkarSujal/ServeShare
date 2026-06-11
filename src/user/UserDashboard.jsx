import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserPages.css";
import { useAuth } from "../config/context/AuthContext";
import { donationService } from "../config/services/donationService";
import { ngoService } from "../config/services/ngoService";
import { supabase } from "../config/supabaseClient";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });

  const [recentDonations, setRecentDonations] = useState([]);
  const [nearbyNGOs, setNearbyNGOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const quickActions = [
    {
      icon: "🎁",
      title: "Donate Items",
      subtitle: "Create a new donation request",
      onClick: () => navigate("/user/create-donation"),
    },
    {
      icon: "📍",
      title: "Find NGOs",
      subtitle: "Browse nearby verified organizations",
      onClick: () => navigate("/user/ngos"),
    },
    {
      icon: "📊",
      title: "Track Donations",
      subtitle: "Review status and impact",
      onClick: () => navigate("/user/donations"),
    },
    {
      icon: "❓",
      title: "Help",
      subtitle: "Open support and contact options",
      onClick: () => navigate("/user/help"),
    },
  ];

  const loadDashboard = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // 📊 Fetch donation stats
      const statsRes = await donationService.getDonorStats(user.id);
      if (statsRes.stats) setStats(statsRes.stats);

      // 📦 Fetch recent donations
      const donationsRes = await donationService.getMyDonations(user.id, {
        pageSize: 5,
      });
      if (donationsRes.donations) setRecentDonations(donationsRes.donations);

      // 🏢 Fetch nearby NGOs
      const ngosRes = await ngoService.getApprovedNGOs({
        city: profile?.city || "Hyderabad",
        limit: 5,
      });
      if (ngosRes.ngos) setNearbyNGOs(ngosRes.ngos);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError("Failed to load dashboard data");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    loadDashboard();

    // 🔥 Real-time updates
    const channel = supabase
      .channel("user_dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donations", filter: `donor_id=eq.${user.id}` },
        () => {
          loadDashboard();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, profile]);

  if (loading)
    return (
      <div className="dashboard-container">
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Welcome back, {profile?.full_name?.split(" ")[0] || "Donor"} 👋</h1>
        <p>Together, we can make a difference.</p>
      </div>

      {error && (
        <div
          style={{
            padding: 12,
            marginBottom: 16,
            borderRadius: 8,
            background: "#fee2e2",
            color: "#991b1b",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="stats-row">

        <div className="premium-card stat-box">
          <div className="stat-icon" style={{ background: "#065f46" }}>🎁</div>
          <div className="stat-text">
            <h4>Total Donations</h4>
            <h2>{stats.total}</h2>
          </div>
        </div>

        <div className="premium-card stat-box">
          <div className="stat-icon" style={{ background: "#1e3a8a" }}>⏱</div>
          <div className="stat-text">
            <h4>Pending</h4>
            <h2>{stats.pending}</h2>
          </div>
        </div>

        <div className="premium-card stat-box">
          <div className="stat-icon" style={{ background: "#14532d" }}>✅</div>
          <div className="stat-text">
            <h4>Completed</h4>
            <h2>{stats.completed}</h2>
          </div>
        </div>

        <div className="premium-card stat-box">
          <div className="stat-icon" style={{ background: "#581c87" }}>💜</div>
          <div className="stat-text">
            <h4>Lives Impacted</h4>
            <h2>{stats.completed * 30}+</h2>
          </div>
        </div>

      </div>

      {/* GRID */}
      <div className="dashboard-grid">

        {/* ACTIVITY */}
        <div className="premium-card">
          <h3>Recent Activity</h3>

          {recentDonations.length === 0 ? (
            <p style={{ color: "#9ca3af" }}>No recent donations</p>
          ) : (
            recentDonations.map((d) => (
              <div key={d.id} className="activity-item">
                <div className="activity-left">
                  🎁
                  <div>
                    <div>{d.item_name}</div>
                    <small>{d.ngo?.name || "Not assigned"}</small>
                  </div>
                </div>

                <span className={`status-badge ${d.status}`}>
                  {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* NGOs */}
        <div className="premium-card">
          <h3>Nearby NGOs</h3>

          <div style={{
            height: 120,
            borderRadius: 12,
            background: "rgba(16,185,129,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10
          }}>
            Map View - {profile?.city || "Hyderabad"}
          </div>

          {nearbyNGOs.length === 0 ? (
            <p style={{ color: "#9ca3af", marginTop: 12 }}>No NGOs found in your area</p>
          ) : (
            nearbyNGOs.slice(0, 1).map((ngo) => (
              <div key={ngo.id} style={{ marginTop: 12 }}>
                <strong>{ngo.name}</strong>
                <p style={{ color: "#9ca3af" }}>
                  {ngo.location}
                </p>
              </div>
            ))
          )}
        </div>

        {/* QUICK ACTION */}
        <div className="premium-card">
          <h3>Quick Actions</h3>

          <div className="quick-action-list">
            {quickActions.map((action) => (
              <button key={action.title} type="button" className="quick-action" onClick={action.onClick}>
                <span className="quick-action-icon" aria-hidden="true">
                  {action.icon}
                </span>
                <span className="quick-action-copy">
                  <strong>{action.title}</strong>
                  <small>{action.subtitle}</small>
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}