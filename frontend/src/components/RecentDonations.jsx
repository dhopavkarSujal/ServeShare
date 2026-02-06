const RecentDonations = () => {
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
              <td><span className="status pending">Pending</span></td>
            </tr>

            <tr>
              <td>2</td>
              <td>Clothes</td>
              <td>Jackets</td>
              <td>5</td>
              <td>—</td>
              <td>Pune</td>
              <td><span className="status approved">Approved</span></td>
            </tr>

            <tr>
              <td>3</td>
              <td>Books</td>
              <td>School Books</td>
              <td>20</td>
              <td>—</td>
              <td>Nagpur</td>
              <td><span className="status pending">Pending</span></td>
            </tr>

            <tr>
              <td>4</td>
              <td>Funds</td>
              <td>—</td>
              <td>—</td>
              <td>5,000</td>
              <td>Mumbai</td>
              <td><span className="status approved">Approved</span></td>
            </tr>

            <tr>
              <td>5</td>
              <td>Food</td>
              <td>Vegetables</td>
              <td>15 kg</td>
              <td>—</td>
              <td>Thane</td>
              <td><span className="status pending">Pending</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default RecentDonations;
