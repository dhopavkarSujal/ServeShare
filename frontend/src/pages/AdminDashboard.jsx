import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔐 Check session & role first
    fetch("http://localhost:5000/api/auth/check", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          navigate("/login");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data.user || data.user.role !== "admin") {
          navigate("/login");
        } else {
          // ✅ Fetch pending donations only if admin
          fetch("http://localhost:5000/api/donations/pending", {
            credentials: "include",
          })
            .then((res) => res.json())
            .then((data) => setDonations(data));
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  const handleApprove = (id) => {
    fetch(`http://localhost:5000/api/donations/approve/${id}`, {
      method: "PUT",
      credentials: "include",
    }).then(() => {
      setDonations(donations.filter((d) => d.id !== id));
    });
  };

  const handleReject = (id) => {
    fetch(`http://localhost:5000/api/donations/reject/${id}`, {
      method: "PUT",
      credentials: "include",
    }).then(() => {
      setDonations(donations.filter((d) => d.id !== id));
    });
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <button onClick={handleLogout}>Logout</button>

      {donations.map((donation) => (
        <div key={donation.id}>
          <h4>{donation.title}</h4>
          <p>{donation.description}</p>
          <button onClick={() => handleApprove(donation.id)}>Approve</button>
          <button onClick={() => handleReject(donation.id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
