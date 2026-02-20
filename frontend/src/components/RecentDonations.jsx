import { useEffect, useState } from "react";

const RecentDonations = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchRecentDonations();
  }, []);

  const fetchRecentDonations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/donations/my", {
        credentials: "include", // 🔥 Important
      });

      const data = await res.json();

      // Sort newest first (if not already sorted)
      const sorted = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      // Take only first 5
      setDonations(sorted.slice(0, 5));

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="donations-section">
      <h2>Recent Donations</h2>

      <div className="table-wrapper">
        <table className="donation-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Donation Type</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan="5">No recent donations</td>
              </tr>
            ) : (
              donations.map((donation, index) => (
                <tr key={donation.id}>
                  <td>{index + 1}</td>
                  <td>{donation.donation_type}</td>
                  <td>{donation.quantity || "—"}</td>
                  <td>{donation.amount || "—"}</td>
                  <td>
                    <span className={`status ${donation.status}`}>
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default RecentDonations;