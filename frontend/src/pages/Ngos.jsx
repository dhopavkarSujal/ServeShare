import { useEffect, useState } from "react";

const Ngos = () => {
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/ngos")
      .then(res => res.json())
      .then(data => setNgos(data));
  }, []);

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
            {ngos.length === 0 ? (
              <tr>
                <td colSpan="5">No NGOs Registered</td>
              </tr>
            ) : (
              ngos.map((ngo) => (
                <tr key={ngo.id}>
                  <td>{ngo.ngo_name}</td>
                  <td>{ngo.donation_type}</td>
                  <td>{ngo.location}</td>
                  <td>{ngo.contact}</td>
                  <td>{ngo.summary}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Ngos;