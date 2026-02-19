import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NgoDashboard() {
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
        if (!data.user || data.user.role !== "ngo") {
          navigate("/login");
        } else {
          // ✅ Fetch approved donations for NGO
          fetch("http://localhost:5000/api/donations/approved", {
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

  const handleClaim = (id) => {
    fetch(`http://localhost:5000/api/donations/claim/${id}`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      alert("Donation claimed");
    });
  };

  return (
    <div>
      <h2>NGO Dashboard</h2>

      <button onClick={handleLogout}>Logout</button>

      {donations.map((donation) => (
        <div key={donation.id}>
          <h4>{donation.title}</h4>
          <p>{donation.description}</p>
          <button onClick={() => handleClaim(donation.id)}>Claim</button>
        </div>
      ))}
    </div>
  );
}

export default NgoDashboard;
