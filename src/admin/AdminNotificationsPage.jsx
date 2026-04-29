import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { notificationService } from "../config/services/notificationService";
import { supabase } from "../config/supabaseClient";

const badgeStyle = {
  new: "badge badge-blue",
  success: "badge badge-green",
  alert: "badge badge-yellow",
  info: "badge",
};

const formatTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString();
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const { notifications: data } = await notificationService.getAllNotifications();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // 🔥 Real-time updates
    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => {
        loadData();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const markAll = async () => {
    setActionLoading("all");
    await notificationService.markAllSystemRead();
    loadData();
    setActionLoading(null);
  };

  const markOne = async (id) => {
    setActionLoading(id);
    await notificationService.markAsRead(id);
    loadData();
    setActionLoading(null);
  };

  const deleteOne = async (id) => {
    setActionLoading(id);
    await notificationService.deleteNotification(id);
    loadData();
    setActionLoading(null);
  };

  if (loading)
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Loading notifications...</p>
      </div>
    );

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Monitor system alerts and activities"
        action={
          <button
            className="btn-ghost"
            onClick={markAll}
            disabled={actionLoading === "all"}
            style={{ opacity: actionLoading === "all" ? 0.6 : 1 }}
          >
            {actionLoading === "all" ? "..." : "Mark all as read"}
          </button>
        }
      />

      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {notifications.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 20 }}>
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && markOne(n.id)}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: n.is_read ? "var(--surface)" : "#eef6ff",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  cursor: !n.is_read ? "pointer" : "default",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "var(--primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  🔔
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                      {n.title}
                    </h3>
                    <span className={badgeStyle[n.type] || "badge"}>
                      {n.type}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {formatTime(n.created_at)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteOne(n.id);
                      }}
                      disabled={actionLoading === n.id}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: actionLoading === n.id ? "not-allowed" : "pointer",
                        fontSize: 12,
                        textDecoration: "underline",
                        opacity: actionLoading === n.id ? 0.5 : 1,
                      }}
                    >
                      {actionLoading === n.id ? "..." : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}