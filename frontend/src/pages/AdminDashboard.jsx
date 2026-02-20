import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import ManageUsers from "./ManageUsers";
import ManageNgos from "./ManageNgos";
function AdminDashboard() {
  const [donations, setDonations] = useState([]);
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("donations");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/check", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) navigate("/login");
        return res.json();
      })
      .then((data) => {
        if (!data.user || data.user.role !== "admin") {
          navigate("/login");
        } else {
          setUser(data.user);

          fetch("http://localhost:5000/api/donations/pending", {
            credentials: "include",
          })
            .then((res) => res.json())
            .then((data) => setDonations(data));
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleApprove = async (id) => {
    await fetch(`http://localhost:5000/api/donations/approve/${id}`, {
      method: "PUT",
      credentials: "include",
    });

    setDonations(donations.filter((d) => d.id !== id));
  };

  const handleReject = async (id) => {
    await fetch(`http://localhost:5000/api/donations/reject/${id}`, {
      method: "PUT",
      credentials: "include",
    });

    setDonations(donations.filter((d) => d.id !== id));
  };
  return (
      <div className="dashboard-container">

        <AdminSidebar
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <div className="main-content">
          <AdminHeader user={user} />

          <div className="dashboard-body">

            {activePage === "donations" && (
              <>
                <h2>Pending Donations</h2>

    {donations.length === 0 ? (
      <p>No pending donations.</p>
    ) : (
      <div className="table-container">
        <table className="donation-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.id}</td>
                <td>{donation.description}</td>
                <td>{donation.donation_type}</td>
                <td>{donation.quantity || "-"}</td>
                <td>
                  {donation.amount ? `₹${donation.amount}` : "-"}
                </td>
                <td>{donation.expiry_date || "-"}</td>

                <td>
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(donation.id)}
                  >
                    Accept
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleReject(donation.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </>
)}

            {activePage === "users" && <ManageUsers />}
            {activePage === "ngos" && <ManageNgos />}

          </div>
        </div>

      </div>
    );
    }

export default AdminDashboard;