import { useNavigate } from "react-router-dom";

const Sidebar = ({ activePage, setActivePage, sidebarOpen, closeSidebar }) => {
  const navigate = useNavigate();

  const handleClick = (page) => {
    setActivePage(page);
    closeSidebar();
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    navigate("/login");
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <h2>ServeShare</h2>

      <ul>
        <li>
          <button
            className={`sidebar-link ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => handleClick("dashboard")}
          >
            <i className="fas fa-home"></i>
            Dashboard
          </button>
        </li>

        <li>
          <button
            className={`sidebar-link ${activePage === "donations" ? "active" : ""}`}
            onClick={() => handleClick("donations")}
          >
            <i className="fas fa-hand-holding-heart"></i>
            Donations
          </button>
        </li>

        <li>
          <button
            className={`sidebar-link ${activePage === "ngos" ? "active" : ""}`}
            onClick={() => handleClick("ngos")}
          >
            <i className="fas fa-building"></i>
            NGOs
          </button>
        </li>

        <li>
          <button
            className={`sidebar-link ${activePage === "profile" ? "active" : ""}`}
            onClick={() => handleClick("profile")}
          >
            <i className="fas fa-user"></i>
            Profile
          </button>
        </li>
      </ul>

      <button className="logout sidebar-link" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
