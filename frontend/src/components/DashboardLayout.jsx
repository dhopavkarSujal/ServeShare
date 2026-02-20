import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({ user, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const notifications = [
    "Donation approved",
    "New NGO joined",
    "Donation request received"
  ];

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <>
      <Sidebar
        activePage=""
        setActivePage={() => {}}
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <Header
        username={user?.name}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        toggleTheme={() => setDarkMode(!darkMode)}
        darkMode={darkMode}
        openNotifications={() => setShowNotif(true)}
        notifCount={notifications.length}
      />

      <main className="dashboard-body">
        {children}
      </main>

      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default DashboardLayout;
