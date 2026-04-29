import { useEffect, useState } from "react";
import "../css/UserPages.css";
import { useAuth } from "../config/context/AuthContext";
import { notificationService } from "../config/services/notificationService";
import { supabase } from "../config/supabaseClient";

export default function UserNotificationsPage() {
  const { user, loading: authLoading } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotifications = async () => {
    if (!user?.id) {
      console.log("No user ID available");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    console.log("Loading notifications for user:", user.id);
    const { notifications: data, error: fetchError } =
      await notificationService.getMyNotifications(user.id);

    if (fetchError) {
      setError(fetchError);
      console.error("Error loading notifications:", fetchError);
    } else {
      setNotifications(data || []);
      console.log("Notifications loaded:", data?.length || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user?.id) {
      setLoading(false);
      return;
    }

    loadNotifications();

    // 🔥 Real-time updates
    const channel = supabase
      .channel("user_notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user?.id, authLoading]);

  const markAsRead = async (id) => {
    console.log("Marking notification as read:", id);
    const { error } = await notificationService.markAsRead(id);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id || notifications.every((n) => n.is_read)) return;

    console.log("Marking all notifications as read");
    const { error } = await notificationService.markAllAsRead(user.id);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    }
  };

  const deleteNotification = async (id) => {
    console.log("Deleting notification:", id);
    const { error } = await notificationService.deleteNotification(id);

    if (!error) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const hasUnread = unreadCount > 0;

  if (authLoading) {
    return (
      <div className="page-container">
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          <p>Loading user...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with your donations and activities</p>
          {hasUnread && (
            <span
              style={{
                display: "inline-block",
                marginTop: 8,
                background: "rgba(239, 68, 68, 0.15)",
                color: "#ef4444",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {unreadCount} unread
            </span>
          )}
        </div>

        {hasUnread && (
          <button className="btn-green" onClick={markAllAsRead}>
            Mark All as Read
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 12,
            background: "rgba(239, 68, 68, 0.12)",
            color: "#ef4444",
            border: "1px solid rgba(239, 68, 68, 0.25)",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <div className="glass-card" style={{ marginTop: 20 }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: "center", color: "#888" }}>
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#888" }}>
            <p style={{ marginBottom: 12 }}>No notifications yet</p>
            <p style={{ fontSize: 14, color: "#6b7280" }}>
              You'll see updates about your donations here
            </p>
          </div>
        ) : (
          <div>
            {notifications.map((n, idx) => (
              <div
                key={n.id}
                style={{
                  padding: 16,
                  borderBottom:
                    idx < notifications.length - 1
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                  background: n.is_read ? "transparent" : "rgba(34,197,94,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                  transition: "background 0.2s",
                }}
              >
                {/* Notification Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <strong>{n.title}</strong>
                    {!n.is_read && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#10b981",
                        }}
                      />
                    )}
                  </div>
                  <p
                    style={{
                      color: "#9ca3af",
                      marginTop: 6,
                      marginBottom: 8,
                      lineHeight: 1.5,
                    }}
                  >
                    {n.message}
                  </p>
                  <small style={{ color: "#6b7280" }}>
                    {new Date(n.created_at).toLocaleString()}
                  </small>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  {!n.is_read && (
                    <button
                      className="btn-ghost"
                      onClick={() => markAsRead(n.id)}
                      style={{
                        padding: "6px 12px",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      ✓ Read
                    </button>
                  )}
                  <button
                    className="btn-ghost"
                    onClick={() => deleteNotification(n.id)}
                    style={{
                      padding: "6px 12px",
                      fontSize: 12,
                      color: "#9ca3af",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ✕ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}