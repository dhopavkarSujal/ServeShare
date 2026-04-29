import { useEffect, useState } from "react";
import "../css/UserPages.css";
import { useAuth } from "../config/context/AuthContext";
import { settingsService } from "../config/services/settingsService";

export default function UserSettingsPage() {
  const { user, profile, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [settings, setSettings] = useState({
    email_notifications: true,
    donation_updates: true,
    ngo_messages: true,
    privacy_profile_public: false,
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      setLoading(true);
      const { settings: dbSettings, error: loadError } = await settingsService.getMySettings(user.id);

      if (loadError) {
        console.error("Error loading settings:", loadError);
      }

      if (dbSettings) {
        setSettings({
          email_notifications: dbSettings.email_notifications ?? true,
          donation_updates: dbSettings.donation_updates ?? true,
          ngo_messages: dbSettings.ngo_messages ?? true,
          privacy_profile_public: dbSettings.privacy_profile_public ?? false,
        });
      }

      setLoading(false);
    };

    loadSettings();
  }, [user]);

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setError("");
    setMessage("");
    setSaving(true);

    const { error: saveError } = await settingsService.upsertMySettings(user.id, settings);

    setSaving(false);

    if (saveError) {
      setError(saveError);
      return;
    }

    setMessage("Settings saved successfully.");
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="glass-card" style={{ padding: 24, textAlign: "center" }}>
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your preferences, notifications, and privacy</p>
        </div>
      </div>

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 12,
            background: "rgba(239,68,68,0.12)",
            color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 12,
            background: "rgba(34,197,94,0.12)",
            color: "#22c55e",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          {message}
        </div>
      )}

      <div style={{ display: "grid", gap: 20, marginTop: 20 }}>
        {/* Account Section */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h2 style={{ marginBottom: 18, marginTop: 0 }}>Account</h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div>
              <strong>Change Password</strong>
              <p style={{ color: "#9ca3af", marginTop: 4, margin: 0 }}>
                Reset your login password securely
              </p>
            </div>
            <button
              className="btn-ghost"
              onClick={() => alert("Password reset functionality to be implemented")}
              style={{ padding: "8px 16px", fontSize: 14 }}
            >
              Reset
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
            }}
          >
            <div>
              <strong>Sign Out</strong>
              <p style={{ color: "#9ca3af", marginTop: 4, margin: 0 }}>
                End your current session
              </p>
            </div>
            <button className="btn-ghost" onClick={logout} style={{ padding: "8px 16px", fontSize: 14 }}>
              Logout
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h2 style={{ marginBottom: 18, marginTop: 0 }}>Notifications</h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div>
              <strong>Email Notifications</strong>
              <p style={{ color: "#9ca3af", marginTop: 4, margin: 0 }}>
                Receive donation updates via email
              </p>
            </div>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={settings.email_notifications}
                onChange={() => toggle("email_notifications")}
                style={{ display: "none" }}
              />
              <div
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: settings.email_notifications ? "#10b981" : "#4b5563",
                  position: "relative",
                  transition: "background 0.3s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: settings.email_notifications ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "white",
                    transition: "left 0.3s",
                  }}
                />
              </div>
            </label>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div>
              <strong>Donation Status Updates</strong>
              <p style={{ color: "#9ca3af", marginTop: 4, margin: 0 }}>
                Get alerts when NGO updates donation status
              </p>
            </div>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={settings.donation_updates}
                onChange={() => toggle("donation_updates")}
                style={{ display: "none" }}
              />
              <div
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: settings.donation_updates ? "#10b981" : "#4b5563",
                  position: "relative",
                  transition: "background 0.3s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: settings.donation_updates ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "white",
                    transition: "left 0.3s",
                  }}
                />
              </div>
            </label>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
            }}
          >
            <div>
              <strong>NGO Messages</strong>
              <p style={{ color: "#9ca3af", marginTop: 4, margin: 0 }}>
                Get notified when an NGO sends you a message
              </p>
            </div>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={settings.ngo_messages}
                onChange={() => toggle("ngo_messages")}
                style={{ display: "none" }}
              />
              <div
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: settings.ngo_messages ? "#10b981" : "#4b5563",
                  position: "relative",
                  transition: "background 0.3s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: settings.ngo_messages ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "white",
                    transition: "left 0.3s",
                  }}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h2 style={{ marginBottom: 18, marginTop: 0 }}>Privacy</h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
            }}
          >
            <div>
              <strong>Public Profile Visibility</strong>
              <p style={{ color: "#9ca3af", marginTop: 4, margin: 0 }}>
                Allow NGOs to see your name on donations
              </p>
            </div>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={settings.privacy_profile_public}
                onChange={() => toggle("privacy_profile_public")}
                style={{ display: "none" }}
              />
              <div
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: settings.privacy_profile_public ? "#10b981" : "#4b5563",
                  position: "relative",
                  transition: "background 0.3s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: settings.privacy_profile_public ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "white",
                    transition: "left 0.3s",
                  }}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            className="btn-ghost"
            onClick={() =>
              setSettings({
                email_notifications: true,
                donation_updates: true,
                ngo_messages: true,
                privacy_profile_public: false,
              })
            }
            style={{ padding: "10px 18px" }}
          >
            Reset to Default
          </button>

          <button
            className="btn-green"
            onClick={handleSave}
            disabled={saving}
            style={{
              opacity: saving ? 0.6 : 1,
              cursor: saving ? "not-allowed" : "pointer",
              padding: "10px 18px",
            }}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}