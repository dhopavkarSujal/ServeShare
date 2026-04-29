import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserPages.css";
import { useAuth } from "../config/context/AuthContext";
import { donationService } from "../config/services/donationService";
import { supabase } from "../config/supabaseClient";

export default function UserDonationsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDonations = async () => {
    setLoading(true);
    setError(null);

    const { donations, error: fetchError } = await donationService.getMyDonations(user.id);

    if (fetchError) {
      setError(fetchError);
    } else {
      setDonations(donations || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user?.id) {
      setLoading(false);
      return;
    }

    loadDonations();

    // 🔥 Real-time updates
    const channel = supabase
      .channel("user_donations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "donations", filter: `donor_id=eq.${user.id}` },
        () => {
          loadDonations();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user?.id, authLoading]);

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
          <h1>My Donations</h1>
          <p>Track all your donations</p>
        </div>

        <button 
          className="btn-green"
          onClick={() => navigate("/user/donations/new")}
        >
          + New Donation
        </button>
      </div>

      <div className="glass-card" style={{ marginTop: 20 }}>
        <table className="table">
          <thead>
            <tr>
              <th>ITEM</th>
              <th>CATEGORY</th>
              <th>QTY</th>
              <th>NGO</th>
              <th>PICKUP DATE</th>
              <th>DATE</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {error && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", color: "#ef4444", padding: "20px" }}>
                  ⚠️ Error: {error}
                </td>
              </tr>
            )}

            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  Loading...
                </td>
              </tr>
            ) : donations.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No donations found
                </td>
              </tr>
            ) : (
              donations.map((d) => (
                <tr key={d.id}>
                  <td>{d.item_name}</td>
                  <td>{d.category}</td>
                  <td>{d.quantity}</td>
                  <td>{d.ngo?.name || "Not Assigned"}</td>
                  <td>
                    {d.pickup_date ? new Date(d.pickup_date).toLocaleDateString() : "-"}
                  </td>
                  <td>
                    {new Date(d.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`badge ${d.status}`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}