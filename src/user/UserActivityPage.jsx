import { useEffect, useState } from "react";
import "../css/UserPages.css";
import { useAuth } from "../config/context/AuthContext";
import { activityService } from "../config/services/activityService";

export default function UserActivityPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadActivity = async () => {
      setLoading(true);
      const { logs } = await activityService.getMyActivity(user.id);
      setLogs(logs || []);
      setLoading(false);
    };

    loadActivity();
  }, [user]);

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1>My Activity</h1>
        <p>Your recent actions and updates</p>
      </div>

      <div className="card-premium">
        {loading ? (
          <p>Loading activity...</p>
        ) : logs.length === 0 ? (
          <p>No recent activity</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="activity-item">
              <div>
                <strong>{log.action}</strong>
                <p style={{ color: "#9ca3af", fontSize: "0.9em" }}>
                  {log.description}
                </p>
                <small style={{ color: "#6b7280" }}>
                  {new Date(log.created_at).toLocaleString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}