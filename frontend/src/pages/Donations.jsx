import { useEffect, useState } from "react";

const Donations = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/donations/my", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setDonations(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="donations-section">
      <h2>My Donations</h2>

      <div className="table-wrapper">
        <table className="donation-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Donation Type</th>
              <th>Quantity</th>
              <th>Amount (₹)</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan="6">No donations found</td>
              </tr>
            ) : (
              donations.map((donation, index) => (
                <tr key={donation.id}>
                  <td>{index + 1}</td>
                  <td>{donation.donation_type}</td>
                  <td>{donation.quantity || "—"}</td>
                  <td>{donation.amount || "—"}</td>
                  <td>{donation.description}</td>
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

export default Donations;