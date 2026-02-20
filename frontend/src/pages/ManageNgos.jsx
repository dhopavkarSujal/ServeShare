import { useEffect, useState } from "react";

function ManageNgos() {
  const [ngos, setNgos] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        const onlyNgos = data.filter(user => user.role === "ngo");
        setNgos(onlyNgos);
      });
  }, []);

  const addNgo = () => {
    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password: "ngo123"
      }),
    }).then(() => {
      alert("NGO Added. Now change role to NGO in Manage Users.");
    });
  };

  return (
    <div>
      <h2>Manage NGOs</h2>

      {/* Add NGO Section */}
      <div className="add-ngo-box">
        <h4>Add New NGO</h4>

        <input
          placeholder="NGO Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="NGO Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="approve-btn" onClick={addNgo}>
          Add NGO
        </button>
      </div>

      <hr />

      {/* NGO Table */}
      <h4>Existing NGOs</h4>

      <div className="table-container">
        <table className="donation-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {ngos.map((ngo) => (
              <tr key={ngo.id}>
                <td>{ngo.id}</td>
                <td>{ngo.name}</td>
                <td>{ngo.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageNgos;