import { useEffect, useState } from "react";
import { useTheme } from "../config/context/ThemeContext";
import PageHeader from "../components/PageHeader";
import { settingsService } from "../config/services/settingsService";
import { supabase } from "../config/supabaseClient";

const Toggle = ({ label, sub, checked, onChange }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      padding: "14px 0",
      borderBottom: "1px solid var(--border)",
    }}
  >
    <div>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{label}</p>
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{sub}</p>
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      style={{ width: 20, height: 20, cursor: "pointer" }}
    />
  </div>
);

export default function AdminSettingsPage() {
  const { theme, toggleTheme } = useTheme();

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getAppSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
      setMessage("Failed to load settings");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();

    // 🔥 Real-time updates
    const channel = supabase
      .channel("app_settings")
      .on("postgres_changes", { event: "*", schema: "public", table: "app_settings" }, () => {
        loadSettings();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveSettings = async () => {
    setSaveLoading(true);
    const res = await settingsService.updateAppSettings(settings.id, settings);
    setSaveLoading(false);

    if (res.error) {
      setMessage("❌ Failed to save settings");
    } else {
      setMessage("✅ Settings updated successfully");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.newPassword) {
      setMessage("❌ Please enter a new password");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    const res = await settingsService.updatePassword(passwordForm.newPassword);
    setPasswordLoading(false);

    if (res.error) {
      setMessage(`❌ ${res.error}`);
    } else {
      setMessage("✅ Password updated successfully");
      setPasswordForm({ newPassword: "", confirmPassword: "" });
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading)
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Loading settings...</p>
      </div>
    );

  if (!settings)
    return (
      <div style={{ padding: 20, textAlign: "center", color: "red" }}>
        <p>No settings found. Please create app_settings table first.</p>
      </div>
    );

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage platform preferences and account settings"
      />

      {message && (
        <div
          style={{
            padding: 12,
            marginBottom: 16,
            borderRadius: 8,
            background: message.includes("✅") ? "#d4edda" : "#f8d7da",
            color: message.includes("✅") ? "#155724" : "#721c24",
            fontSize: 14,
          }}
        >
          {message}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* GENERAL SETTINGS */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>
            General Settings
          </h3>

          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
                Platform Name
              </label>
              <input
                className="input-field"
                value={settings.platform_name || ""}
                onChange={(e) => handleChange("platform_name", e.target.value)}
                placeholder="Platform Name"
                style={{ marginTop: 6 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
                Support Email
              </label>
              <input
                className="input-field"
                value={settings.support_email || ""}
                onChange={(e) => handleChange("support_email", e.target.value)}
                placeholder="Support Email"
                style={{ marginTop: 6 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
                Default Location
              </label>
              <input
                className="input-field"
                value={settings.default_location || ""}
                onChange={(e) => handleChange("default_location", e.target.value)}
                placeholder="Location"
                style={{ marginTop: 6 }}
              />
            </div>
          </div>
        </div>

        {/* PREFERENCES */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>
            Appearance & Privacy
          </h3>

          <Toggle
            label="Dark Mode"
            sub="Switch theme for the admin panel"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />

          <Toggle
            label="Email Notifications"
            sub="Receive admin alerts by email"
            checked={settings.email_notifications || false}
            onChange={(e) => handleChange("email_notifications", e.target.checked)}
          />

          <Toggle
            label="Public NGO Listings"
            sub="Show approved NGOs on the public directory"
            checked={settings.public_ngo || false}
            onChange={(e) => handleChange("public_ngo", e.target.checked)}
          />
        </div>
      </div>

      {/* SAVE BUTTON */}
      <button
        className="btn-primary"
        onClick={saveSettings}
        disabled={saveLoading}
        style={{ marginTop: 16, opacity: saveLoading ? 0.6 : 1 }}
      >
        {saveLoading ? "Saving..." : "Save Changes"}
      </button>

      {/* SECURITY */}
      <div className="card" style={{ padding: 20, marginTop: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>
          Security
        </h3>
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
              New Password
            </label>
            <input
              className="input-field"
              type="password"
              placeholder="Enter new password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
              }
              style={{ marginTop: 6 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
              Confirm Password
            </label>
            <input
              className="input-field"
              type="password"
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
              style={{ marginTop: 6 }}
            />
          </div>

          <button
            className="btn-primary"
            onClick={handlePasswordChange}
            disabled={passwordLoading}
            style={{ opacity: passwordLoading ? 0.6 : 1 }}
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}