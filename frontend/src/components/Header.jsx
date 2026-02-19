const Header = ({
  username,
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
          Welcome, <span className="username-highlight">
            {username || "User"}
          </span>
        </h1>
      </div>

      <div className="right-section">
        <button className="theme-btn btns" onClick={toggleTheme}>
          <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </button>

        <button
          className="notif-btn btns"
          onClick={openNotifications}
        >
          <i className="fas fa-bell"></i>
          {notifCount > 0 && (
            <span className="notif-count">{notifCount}</span>
          )}
        </button>

        <button className="add-btn btns" onClick={onAddDonation}>
          <i className="fas fa-plus"></i> Add Donation
        </button>
      </div>
    </header>
  );
};

export default Header;
