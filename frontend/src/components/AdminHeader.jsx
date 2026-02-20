import { useNavigate } from "react-router-dom";

const AdminHeader = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    navigate("/login");
  };

  return (
    <header className="dashboard-header">
      <div>
        <h3>Welcome, {user?.name}</h3>
        <p>Admin Panel</p>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;