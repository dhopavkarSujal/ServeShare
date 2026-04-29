import { useEffect, useState } from "react";
import "../css/UserPages.css";
import { useAuth } from "../config/context/AuthContext";
import { profileService } from "../config/services/profileService";

export default function UserProfilePage() {
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    avatar_url: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      setLoading(true);
      const { profile: dbProfile, error: loadError } = await profileService.getMyProfile(user.id);

      if (loadError) {
        setError(loadError);
        console.error("Error loading profile:", loadError);
      } else if (dbProfile) {
        setForm({
          full_name: dbProfile.full_name || "",
          email: dbProfile.email || "",
          phone: dbProfile.phone || "",
          avatar_url: dbProfile.avatar_url || "",
        });
      }

      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.full_name.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    setSaving(true);

    const { profile: updatedProfile, error: saveError } = await profileService.updateMyProfile(
      user.id,
      form
    );

    setSaving(false);

    if (saveError) {
      setError(saveError);
      return;
    }

    setMessage("Profile updated successfully.");
    setEditMode(false);
  };

  const initials = (profile?.full_name || form.full_name || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (loading) {
    return (
      <div className="page-container">
        <div className="glass-card" style={{ padding: 24, textAlign: "center" }}>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>Manage your personal details and contact information</p>
        </div>

        <button className="btn-green" onClick={() => setEditMode((v) => !v)}>
          {editMode ? "Cancel Edit" : "Edit Profile"}
        </button>
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

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, marginTop: 20 }}>
        {/* Profile Summary Card */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div
            style={{
              width: 86,
              height: 86,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #16a34a, #22c55e)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            {initials}
          </div>

          <h2 style={{ marginBottom: 6, marginTop: 0 }}>{form.full_name || "User"}</h2>
          <p style={{ color: "#9ca3af", marginBottom: 12, textTransform: "capitalize" }}>
            {profile?.role || "donor"}
          </p>

          <div style={{ display: "grid", gap: 10, fontSize: 14 }}>
            <div>
              <strong>Email:</strong>
              <p style={{ margin: "4px 0 0", color: "#9ca3af" }}>{form.email}</p>
            </div>
            <div>
              <strong>Phone:</strong>
              <p style={{ margin: "4px 0 0", color: "#9ca3af" }}>{form.phone || "Not added"}</p>
            </div>
            <div>
              <strong>Status:</strong>
              <p style={{ margin: "4px 0 0", color: "#9ca3af", textTransform: "capitalize" }}>
                {profile?.status || "active"}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form Card */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h2 style={{ marginBottom: 18, marginTop: 0 }}>Edit Details</h2>

          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#ddd" }}>
                  Full Name
                </label>
                <input
                  className="search-bar"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  disabled={!editMode}
                  style={{
                    opacity: editMode ? 1 : 0.6,
                    cursor: editMode ? "text" : "default",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#ddd" }}>
                  Email Address
                </label>
                <input
                  className="search-bar"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  style={{
                    opacity: editMode ? 1 : 0.6,
                    cursor: editMode ? "text" : "default",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#ddd" }}>
                  Phone Number
                </label>
                <input
                  className="search-bar"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  disabled={!editMode}
                  style={{
                    opacity: editMode ? 1 : 0.6,
                    cursor: editMode ? "text" : "default",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#ddd" }}>
                  Avatar URL
                </label>
                <input
                  className="search-bar"
                  name="avatar_url"
                  value={form.avatar_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  disabled={!editMode}
                  style={{
                    opacity: editMode ? 1 : 0.6,
                    cursor: editMode ? "text" : "default",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setEditMode(false)}
                  disabled={!editMode}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-green"
                  disabled={!editMode || saving}
                  style={{
                    opacity: !editMode || saving ? 0.6 : 1,
                    cursor: !editMode || saving ? "not-allowed" : "pointer",
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}