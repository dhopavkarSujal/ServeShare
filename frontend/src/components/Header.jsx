const Header = ({
  onAddDonation,
  toggleSidebar,
  toggleTheme,
  darkMode,
  openNotifications,
  notifCount = 0
}) => {
  return (
    <header className="dashboard-header">
      <div className="left-section">
        <button className="menu-btn btns" onClick={toggleSidebar}>
          <i className="fa fa-bars"></i>
        </button>

        <h1 className="welcome-text">
          Welcome, <span className="username-highlight">User</span>
        </h1>
      </div>

      <div className="right-section">
        {/* Theme toggle */}
        <button className="theme-btn btns" onClick={toggleTheme}>
          <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </button>

        {/* Notifications */}
        <button
          className="notif-btn btns"
          onClick={openNotifications}
          title="Notifications"
        >
          <i className="fas fa-bell"></i>
          {notifCount > 0 && (
            <span className="notif-count">{notifCount}</span>
          )}
        </button>

        {/* Add Donation */}
        <button className="add-btn btns" onClick={onAddDonation}>
          <i className="fas fa-plus"></i> Add Donation
        </button>
      </div>
    </header>
  );
};

export default Header;
