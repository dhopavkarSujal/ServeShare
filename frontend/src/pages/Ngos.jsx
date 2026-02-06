const Ngos = () => {
  return (
    <main className="dashboard-body">
      <h1>Registered NGOs</h1>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>NGO Name</th>
              <th>Donation Type</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Summary</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Shree Sai Seva Sanstha</td>
              <td>Food / Education</td>
              <td>Bhiwandi</td>
              <td>08511-406126</td>
              <td>Women & children welfare</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Ngos;
