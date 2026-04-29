import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, Bell, MapPin, Search, ChevronDown } from "lucide-react";
import { useTheme } from "../../config/context/ThemeContext";
import "../../css/Navbar.css";

export default function Navbar({
  role = "user",
  collapsed = false,
  setCollapsed = () => {},
  setMobileOpen = () => {},
}) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleMenuClick = () => {
    setNotifOpen(false);
    setProfileOpen(false);

    if (isMobile) {
      setMobileOpen(true);
      return;
    }

    setCollapsed((prev) => !prev);
  };

  const roleInfo = {
    user: {
      name: "Arjun Kumar",
      sub: "User",
      profilePath: "/user/profile",
      settingsPath: "/user/settings",
    },
    ngo: {
      name: "Helping Hands NGO",
      sub: "NGO Admin",
      profilePath: "/ngo/profile",
      settingsPath: "/ngo/settings",
    },
    admin: {
      name: "Admin User",
      sub: "Super Admin",
      profilePath: "/admin",
      settingsPath: "/admin/settings",
    },
  };

  const info = roleInfo[role] || roleInfo.user;
  const navbarLeft = isMobile ? "0px" : collapsed ? "70px" : "var(--sidebar-w)";

  const goTo = (path) => {
    setNotifOpen(false);
    setProfileOpen(false);
    navigate(path);
  };

  return (
    <header
      className="navbar"
      style={{
        left: navbarLeft,
      }}
    >
      <div className="nav-left">
        <button className="icon-btn" onClick={handleMenuClick} aria-label="Toggle sidebar" type="button">
          <Menu size={18} />
        </button>

        {role === "admin" && (
          <div className="search-box">
            <Search size={14} className="search-icon" />
            <input placeholder="Search..." />
            <kbd className="search-kbd">⌘K</kbd>
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      <div className="nav-right">
        {role !== "admin" && (
          <button className="location-btn" type="button">
            <MapPin size={14} />
            <span>Hyderabad</span>
            <ChevronDown size={12} className="chev" />
          </button>
        )}

        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme" type="button">
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="dropdown-wrap" ref={notifRef}>
          <button
            className="icon-btn bell-btn"
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            type="button"
          >
            <Bell size={16} />
            <span className="dot" />
          </button>

          {notifOpen && (
            <div className="dropdown notif-dropdown">
              <div className="dropdown-head">
                <strong>Notifications</strong>
                <span className="badge-mini">3 new</span>
              </div>

              <div className="notif-item">
                <div className="notif-dot" />
                <div>
                  <p>Donation accepted</p>
                  <span>10 min ago</span>
                </div>
              </div>

              <div className="notif-item">
                <div className="notif-dot" />
                <div>
                  <p>Pickup scheduled</p>
                  <span>1 hour ago</span>
                </div>
              </div>

              <div className="notif-item">
                <div className="notif-dot" />
                <div>
                  <p>New NGO nearby</p>
                  <span>Today</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dropdown-wrap" ref={profileRef}>
          <button
            className="profile-btn"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
            aria-label="Profile menu"
            type="button"
          >
            <div className="avatar">{info.name[0]}</div>

            <div className="profile-meta">
              <span className="profile-name">{info.name}</span>
              <span className="profile-sub">{info.sub}</span>
            </div>

            <ChevronDown size={13} className="chev" />
          </button>

          {profileOpen && (
            <div className="dropdown profile-dropdown">
              <button onClick={() => goTo(info.profilePath)} className="menu-btn" type="button">
                Profile
              </button>
              <button onClick={() => goTo(info.settingsPath)} className="menu-btn" type="button">
                Settings
              </button>
              <button onClick={() => goTo("/login")} className="menu-btn danger" type="button">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}