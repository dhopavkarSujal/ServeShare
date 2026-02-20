import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

function NgoDashboard() {
  const [donations, setDonations] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
          setUser(data.user);

          fetch("http://localhost:5000/api/donations/approved", {
            credentials: "include",
          })
            .then((res) => res.json())
            .then((data) => setDonations(data));
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleClaim = (id) => {
    fetch(`http://localhost:5000/api/donations/claim/${id}`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      alert("Donation claimed");
    });
  };

  return (
    <DashboardLayout user={user}>
      <h2>NGO Dashboard</h2>

      {donations.map((donation) => (
        <div key={donation.id} className="donation-card">
          <h4>{donation.title}</h4>
          <p>{donation.description}</p>
          <button onClick={() => handleClaim(donation.id)}>
            Claim
          </button>
        </div>
      ))}
    </DashboardLayout>
  );
}

export default NgoDashboard;
