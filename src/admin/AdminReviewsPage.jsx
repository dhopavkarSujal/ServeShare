import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { reviewService } from "../config/services/reviewService";
import { supabase } from "../config/supabaseClient";

const stars = (n) => "★".repeat(n);

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const reviewData = await reviewService.getAllReviews(filter === "all" ? null : filter);
      const statsData = await reviewService.getStats();

      setReviews(reviewData);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
    setLoading(false);
  };

  const handleAction = async (id, status) => {
    setActionLoading(id);
    const res = await reviewService.updateStatus(id, status);
    if (!res.error) {
      loadData();
    }
    setActionLoading(null);
  };

  useEffect(() => {
    loadData();

    // 🔥 Real-time updates
    const channel = supabase
      .channel("reviews")
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, () => {
        loadData();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [filter]);

  if (loading || !stats)
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Loading reviews...</p>
      </div>
    );

  return (
    <div>
      <PageHeader
        title="Reviews & Feedback"
        subtitle="Check user and NGO feedback"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
        <div className="card" style={{ padding: 18 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Average Rating</p>
          <h3 style={{ fontSize: 28, marginTop: 6, color: "var(--text)" }}>{stats.avg}/5</h3>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Total Reviews</p>
          <h3 style={{ fontSize: 28, marginTop: 6, color: "var(--text)" }}>{stats.total}</h3>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Positive Feedback</p>
          <h3 style={{ fontSize: 28, marginTop: 6, color: "var(--text)" }}>{stats.positivePercent}%</h3>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Needs Attention</p>
          <h3 style={{ fontSize: 28, marginTop: 6, color: "var(--text)" }}>{stats.pending}</h3>
        </div>
      </div>

      {/* 🔹 Filter Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {["all", "approved", "pending", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: "8px 16px",
              border: "1px solid var(--border)",
              borderRadius: 6,
              background: filter === tab ? "var(--primary)" : "transparent",
              color: filter === tab ? "white" : "var(--text)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔹 Reviews */}
      <div style={{ display: "grid", gap: 14 }}>
        {reviews.length === 0 ? (
          <div className="card" style={{ padding: 20, textAlign: "center", color: "var(--text-muted)" }}>
            No reviews to display
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
                    {r.user?.full_name || "Unknown User"}
                  </h3>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>
                    {r.user?.role || "User"}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div style={{ color: "#F59E0B", fontSize: 14, letterSpacing: "1px", marginBottom: 10 }}>
                {stars(r.rating)}
              </div>

              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 14 }}>
                {r.comment}
              </p>

              {/* 🔥 ADMIN ACTIONS */}
              {r.status === "pending" && (
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button
                    onClick={() => handleAction(r.id, "approved")}
                    disabled={actionLoading === r.id}
                    style={{
                      padding: "8px 16px",
                      background: "#16A34A",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: actionLoading === r.id ? "not-allowed" : "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      opacity: actionLoading === r.id ? 0.6 : 1,
                    }}
                  >
                    {actionLoading === r.id ? "..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleAction(r.id, "rejected")}
                    disabled={actionLoading === r.id}
                    style={{
                      padding: "8px 16px",
                      background: "#DC2626",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: actionLoading === r.id ? "not-allowed" : "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      opacity: actionLoading === r.id ? 0.6 : 1,
                    }}
                  >
                    {actionLoading === r.id ? "..." : "Reject"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}