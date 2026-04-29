import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { activityService } from "../config/services/activityService";
import { supabase } from "../config/supabaseClient";

const formatTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString();
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await activityService.getLogs(100);
      setLogs(data);
    } catch (err) {
      console.error("Failed to load logs:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();

    // 🔥 Real-time updates
    const channel = supabase
      .channel("activity_logs")
      .on("postgres_changes", { event: "*", schema: "public", table: "activity_logs" }, () => {
        loadLogs();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  if (loading)
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Loading logs...</p>
      </div>
    );

  return (
    <div>
      <PageHeader
        title="Activity Logs"
        subtitle="View recent administrative actions"
      />

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "var(--surface2)" }}>
              <tr>
                {["Action", "Details", "Time", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
                    No activity logs found
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="table-row" style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                      {l.action}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-secondary)" }}>
                      {l.description}
                      {l.user?.full_name && (
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                          by {l.user.full_name}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-muted)" }}>
                      {formatTime(l.created_at)}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <StatusBadge status={l.status || "pending"} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}