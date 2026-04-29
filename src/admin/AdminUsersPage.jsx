import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Eye, UserPlus, Shield, UserCheck, UserX } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { adminService } from "../config/services/adminService";
import { useAuth } from "../config/context/AuthContext";
import { supabase } from "../config/supabaseClient";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    full_name: "",
    email: "",
    role: "admin",
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const loadUsers = async () => {
    setLoading(true);

    const { data, count } = await adminService.getAllUsers(
      page,
      PAGE_SIZE,
      search,
      roleFilter,
      statusFilter
    );

    setUsers(data || []);
    setTotal(count || 0);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [page, search, roleFilter, statusFilter]);

  const activeCount = useMemo(
    () => users.filter((u) => u.status === "active").length,
    [users]
  );

  const suspendedCount = useMemo(
    () => users.filter((u) => u.status === "suspended").length,
    [users]
  );

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change this user's role to ${newRole}?`)) return;

    setActionLoading(true);
    const { error } = await adminService.updateUserRole(userId, newRole);
    setActionLoading(false);

    if (error) {
      alert(error);
      return;
    }

    await loadUsers();
  };

  const handleSuspend = async (userId) => {
    if (!window.confirm("Suspend this user?")) return;

    setActionLoading(true);
    const { error } = await adminService.suspendUser(userId);
    setActionLoading(false);

    if (error) {
      alert(error);
      return;
    }

    await loadUsers();
  };

  const handleActivate = async (userId) => {
    setActionLoading(true);
    const { error } = await adminService.activateUser(userId);
    setActionLoading(false);

    if (error) {
      alert(error);
      return;
    }

    await loadUsers();
  };

  const handleInviteAdmin = async (e) => {
    e.preventDefault();

    if (!inviteForm.email.trim() || !inviteForm.full_name.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      // Get current session token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        alert("You must be logged in");
        return;
      }

      // Call Edge Function
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            email: inviteForm.email,
            full_name: inviteForm.full_name,
            role: inviteForm.role,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create admin");
      }

      alert("✅ Admin created successfully!");
      setInviteForm({ full_name: "", email: "", role: "admin" });
      setShowInviteModal(false);
      await loadUsers();
    } catch (err) {
      console.error("Invite error:", err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Manage all registered users"
        action={
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="btn-ghost"
              style={{ display: "flex", alignItems: "center", gap: 8, height: 38 }}
              onClick={() => setShowInviteModal(true)}
            >
              <UserPlus size={14} /> Add Admin
            </button>

            <div style={{ position: "relative" }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                placeholder="Search users…"
                className="input-field"
                style={{ paddingLeft: 36, width: 220, height: 38 }}
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />
            </div>

            <select
              className="input-field"
              style={{ width: 140, height: 38 }}
              value={roleFilter}
              onChange={(e) => {
                setPage(1);
                setRoleFilter(e.target.value);
              }}
            >
              <option value="all">All Roles</option>
              <option value="donor">Donor</option>
              <option value="ngo">NGO</option>
              <option value="admin">Admin</option>
            </select>

            <select
              className="input-field"
              style={{ width: 140, height: 38 }}
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14, marginBottom: 18 }}>
        <div className="card" style={{ padding: 18 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Total Users</p>
          <h3 style={{ fontSize: 28, marginTop: 6, color: "var(--text)" }}>{total}</h3>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Active Users</p>
          <h3 style={{ fontSize: 28, marginTop: 6, color: "var(--text)" }}>{activeCount}</h3>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Suspended Users</p>
          <h3 style={{ fontSize: 28, marginTop: 6, color: "var(--text)" }}>{suspendedCount}</h3>
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "var(--surface2)" }}>
              <tr>
                {["User", "Role", "Joined", "Email", "Status", "Actions"].map((h) => (
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
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: 20, textAlign: "center", color: "var(--text-muted)" }}>
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: 20, textAlign: "center", color: "var(--text-muted)" }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="table-row" style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: "var(--primary-light)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 13,
                            color: "var(--primary)",
                          }}
                        >
                          {u.full_name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                            {u.full_name || "Unnamed"}
                          </p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "14px 20px" }}>
                      <select
                        className="input-field"
                        style={{ height: 34, width: 110, textTransform: "capitalize" }}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={actionLoading || u.id === currentUser?.id}
                        title={u.id === currentUser?.id ? "You cannot change your own role here" : "Change role"}
                      >
                        <option value="donor">Donor</option>
                        <option value="ngo">NGO</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-muted)" }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}
                    </td>

                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-muted)" }}>
                      {u.email}
                    </td>

                    <td style={{ padding: "14px 20px" }}>
                      <StatusBadge status={u.status} />
                    </td>

                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: "var(--surface2)",
                            border: "1px solid var(--border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                          title="View user details"
                        >
                          <Eye size={13} style={{ color: "var(--text-muted)" }} />
                        </button>

                        {u.status === "active" ? (
                          <button
                            onClick={() => handleSuspend(u.id)}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              background: "#FEE2E2",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                            title="Suspend user"
                            disabled={u.id === currentUser?.id}
                          >
                            <UserX size={13} style={{ color: "#DC2626" }} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(u.id)}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              background: "var(--primary-light)",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                            title="Activate user"
                            disabled={u.id === currentUser?.id}
                          >
                            <UserCheck size={13} style={{ color: "var(--primary)" }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16 }}>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Page {page} of {totalPages}
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Prev
            </button>
            <button
              className="btn-ghost"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 20,
          }}
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="card"
            style={{ width: "100%", maxWidth: 520, padding: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>Invite New Admin</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
              Create an admin account invitation and assign admin role.
            </p>

            <form onSubmit={handleInviteAdmin} style={{ display: "grid", gap: 14, marginTop: 18 }}>
              <div>
                <label className="field-label">Full Name</label>
                <input
                  className="input-field"
                  value={inviteForm.full_name}
                  onChange={(e) => setInviteForm((p) => ({ ...p, full_name: e.target.value }))}
                  placeholder="Admin name"
                />
              </div>

              <div>
                <label className="field-label">Email</label>
                <input
                  className="input-field"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="field-label">Role</label>
                <select
                  className="input-field"
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm((p) => ({ ...p, role: e.target.value }))}
                >
                  <option value="admin">Admin</option>
                  <option value="ngo">NGO</option>
                  <option value="donor">Donor</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
                <button type="button" className="btn-ghost" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}