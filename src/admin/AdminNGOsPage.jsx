import { useEffect, useState } from "react";
import { Search, Filter, Check, X, Eye } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { adminService } from "../config/services/adminService";

const AdminNGOsPage = () => {
  const [ngos, setNgos] = useState([]);
  const [filteredNgos, setFilteredNgos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNgos = async () => {
      const { data } = await adminService.getAllNGOs();
      setNgos(data || []);
      setLoading(false);
    };

    loadNgos();
  }, []);

  useEffect(() => {
    let filtered = ngos;

    if (search) {
      filtered = filtered.filter(
        (n) =>
          n.name?.toLowerCase().includes(search.toLowerCase()) ||
          n.location?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredNgos(filtered);
  }, [ngos, search]);

  const handleStatusUpdate = async (id, status) => {
    await adminService.updateNGOStatus(id, status);
    const { data } = await adminService.getAllNGOs();
    setNgos(data || []);
  };

  return (
    <div>
      <PageHeader
        title="NGO Management"
        subtitle="Manage all registered NGOs"
        action={
          <div style={{ display: "flex", gap: 10 }}>
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
                placeholder="Search NGOs…"
                className="input-field"
                style={{ paddingLeft: 36, width: 220, height: 38 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 8, height: 38 }}>
              <Filter size={14} /> Filter
            </button>
          </div>
        }
      />

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "var(--surface2)" }}>
              <tr>
                {["NGO Name", "Location", "Registered On", "Status", "Actions"].map((h) => (
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
                  <td colSpan="5" style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
                    Loading NGOs...
                  </td>
                </tr>
              ) : filteredNgos.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
                    No NGOs found
                  </td>
                </tr>
              ) : (
                filteredNgos.map((n) => (
                  <tr key={n.id} className="table-row" style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: "var(--primary-light)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16,
                          }}
                        >
                          🏢
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{n.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-secondary)" }}>
                      {n.location}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-muted)" }}>
                      {new Date(n.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <StatusBadge status={n.status} />
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {n.status === "pending" ? (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(n.id, "approved")}
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
                              title="Approve NGO"
                            >
                              <Check size={13} style={{ color: "var(--primary)" }} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(n.id, "rejected")}
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
                              title="Reject NGO"
                            >
                              <X size={13} style={{ color: "#DC2626" }} />
                            </button>
                          </>
                        ) : (
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
                          >
                            <Eye size={13} style={{ color: "var(--text-muted)" }} />
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
      </div>
    </div>
  );
};

export default AdminNGOsPage;