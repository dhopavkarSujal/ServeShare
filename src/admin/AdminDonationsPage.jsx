import { useEffect, useState } from "react";
import { Search, Check, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { adminService } from "../config/services/adminService";

const AdminDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [tab, setTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadDonations = async () => {
      const { data } = await adminService.getAllDonations();
      setDonations(data || []);
      setLoading(false);
    };

    loadDonations();
  }, []);

  useEffect(() => {
    let filtered = donations;

    if (tab !== "All") {
      const statusMap = {
        Pending: "pending",
        Accepted: "accepted",
        Completed: "completed",
        Rejected: "rejected",
      };
      filtered = filtered.filter((d) => d.status === statusMap[tab]);
    }

    if (search) {
      filtered = filtered.filter(
        (d) =>
          d.item_name?.toLowerCase().includes(search.toLowerCase()) ||
          d.donor?.full_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredDonations(filtered);
  }, [donations, tab, search]);

  const handleStatusUpdate = async (id, status) => {
    await adminService.updateDonationStatus(id, status);
    const { data } = await adminService.getAllDonations();
    setDonations(data || []);
  };

  return (
    <div>
      <PageHeader
        title="Donations Management"
        subtitle="Track and manage all donations"
        action={
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
              placeholder="Search donations…"
              className="input-field"
              style={{ paddingLeft: 36, width: 240, height: 38 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["All", "Pending", "Accepted", "Completed", "Rejected"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.15s",
              background: tab === t ? "var(--primary)" : "var(--surface)",
              color: tab === t ? "#fff" : "var(--text-secondary)",
              border: tab === t ? "none" : "1px solid var(--border)",
              boxShadow: tab === t ? "0 2px 8px rgba(22,163,74,0.3)" : "var(--shadow)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "var(--surface2)" }}>
              <tr>
                {["ID", "Item", "Donor", "NGO", "Date", "Status", "Actions"].map((h) => (
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
                  <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
                    Loading donations...
                  </td>
                </tr>
              ) : filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
                    No donations found
                  </td>
                </tr>
              ) : (
                filteredDonations.map((d) => (
                  <tr key={d.id} className="table-row" style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "14px 20px", fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>
                      {d.id?.slice(0, 8)}...
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18 }}>🎁</span>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{d.item_name}</p>
                          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Qty: {d.quantity}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-secondary)" }}>
                      {d.donor?.full_name || "Unknown"}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-muted)" }}>
                      {d.ngo?.name || "Unassigned"}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-muted)" }}>
                      {new Date(d.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <StatusBadge status={d.status} />
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => handleStatusUpdate(d.id, "accepted")}
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
                            transition: "all 0.2s",
                          }}
                          title="Accept donation"
                        >
                          <Check size={13} style={{ color: "var(--primary)" }} />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(d.id, "rejected")}
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
                            transition: "all 0.2s",
                          }}
                          title="Reject donation"
                        >
                          <X size={13} style={{ color: "#DC2626" }} />
                        </button>
                      </div>
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
};

export default AdminDonationsPage;