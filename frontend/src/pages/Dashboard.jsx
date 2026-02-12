import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import DonationsPage from "../pages/Donations";
import RecentDonations from "../components/RecentDonations";
import NotificationModal from "../components/NotificationModal";
import Ngos from "./Ngos";
import AddDonationModal from "../components/AddDonationModal";
import Profile from "./Profile";

import "../css/dashboard.css";
import "../css/profile.css";

const DashboardHome = () => (
  <>
    <StatsCards />
    <RecentDonations />
  </>
);

const Dashboard = () => {
  const navigate = useNavigate(); 
  const [activePage, setActivePage] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications] = useState([
    "Donation approved",
    "New NGO joined",
    "Donation request received"
  ]);
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/check", {
      credentials: "include",
    }).then((res) => {
      if (!res.ok) {
        navigate("/login");
      }
    });
  }, [navigate]);

  /* ----------- Dark Mode ----------- */
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  /* ----------- Sidebar Open Class ----------- */
  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
    return () => {
      document.body.classList.remove("sidebar-open");
    };
  }, [sidebarOpen]);

  /* ----------- Swipe to Open Sidebar ----------- */
  useEffect(() => {
    let startX = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      if (startX < 50 && endX > 120) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  /* ----------- Page Renderer ----------- */
  const renderPage = () => {
    switch (activePage) {
      case "donations":
        return <DonationsPage />;
      case "ngos":
        return <Ngos />;
      case "profile":
        return <Profile />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <Header
        onAddDonation={() => setShowModal(true)}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        toggleTheme={() => setDarkMode(!darkMode)}
        darkMode={darkMode}
        openNotifications={() => setShowNotif(true)}
        notifCount={notifications.length}
      />
      <main className="dashboard-body">
        {renderPage()}
      </main>

      {showModal && (
        <AddDonationModal onClose={() => setShowModal(false)} />
      )}

      {showNotif && (
        <NotificationModal
          onClose={() => setShowNotif(false)}
          notifications={notifications}
        />
      )}

      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Dashboard;
