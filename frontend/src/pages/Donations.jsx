const Donations = () => {
  return (
    <main className="donations-section">
      <h2>Recent Donations</h2>

      <div className="table-wrapper">
        <table className="donation-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Donation Type</th>
              <th>Item Type</th>
              <th>Quantity</th>
              <th>Amount (₹)</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>Food</td>
              <td>Rice</td>
              <td>10 kg</td>
              <td>—</td>
              <td>Mumbai</td>
              <td>
                <span className="status pending">Pending</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </main>
  );
};

export default Donations;
