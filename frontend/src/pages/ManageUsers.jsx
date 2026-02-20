import { useEffect, useState } from "react";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const changeRole = (id, role) => {
    fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role }),
    }).then(() => {
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, role } : user
        )
      );
    });
  };

  return (
    <div>
      <h2>Manage Users</h2>

      <div className="table-container">
        <table className="donation-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Change Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <select
                    className="role-select"
                    value={user.role}
                    onChange={(e) =>
                      changeRole(user.id, e.target.value)
                    }
                  >
                    <option value="user">User</option>
                    <option value="ngo">NGO</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;