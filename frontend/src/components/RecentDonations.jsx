import { useEffect, useState } from "react";

const RecentDonations = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/donations");
      const data = await res.json();
      setDonations(data);
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
            {donations.map((donation, index) => (
              <tr key={donation.id}>
                <td>{index + 1}</td>
                <td>{donation.donation_type}</td>
                <td>{donation.quantity || "—"}</td>
                <td>{donation.amount || "—"}</td>
                <td>
                  <span className={`status ${donation.status.toLowerCase()}`}>
                    {donation.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default RecentDonations;