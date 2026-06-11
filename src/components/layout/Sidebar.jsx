import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../config/context/AuthContext";
import {
  Home,
  Gift,
  MapPin,
  Activity,
  User,
  Bell,
  Settings,
  LogOut,
  HelpCircle,
  ClipboardList,
  Truck,
  UserCheck,
  BarChart2,
  MessageSquare,
  Users,
  Building2,
  Star,
  ChevronLeft,
} from "lucide-react";

import ServeShareLogo from "../ServeShareLogo";
import "../../css/Sidebar.css";

const sidebarMenus = {
  user: [
    { icon: Home, label: "Dashboard", route: "/user" },
    { icon: Gift, label: "Donations", route: "/user/donations" },
    { icon: MapPin, label: "Nearby NGOs", route: "/user/ngos" },
    { icon: Activity, label: "My Activity", route: "/user/activity" },
    { icon: Bell, label: "Notifications", route: "/user/notifications", badge: 3 },
    { icon: Settings, label: "Settings", route: "/user/settings" },
    { icon: HelpCircle, label: "Help & Support", route: "/user/help" },
  ],
  ngo: [
    { icon: Home, label: "Dashboard", route: "/ngo" },
    { icon: ClipboardList, label: "Donation Requests", route: "/ngo/requests", badge: 12 },
    { icon: Gift, label: "My Donations", route: "/ngo/donations" },
    { icon: Truck, label: "Pickups & Deliveries", route: "/ngo/pickups" },
    { icon: UserCheck, label: "Beneficiaries", route: "/ngo/beneficiaries" },
    { icon: BarChart2, label: "Reports & Analytics", route: "/ngo/reports" },
    { icon: MessageSquare, label: "Messages", route: "/ngo/messages", badge: 5 },
    { icon: Users, label: "Manage Team", route: "/ngo/team" },
    { icon: Settings, label: "Settings", route: "/ngo/settings" },
  ],
  admin: [
    { icon: Home, label: "Dashboard", route: "/admin" },
    { icon: Building2, label: "Registered NGOs", route: "/admin/ngos" },
    { icon: Gift, label: "Donations", route: "/admin/donations" },
    { icon: Users, label: "Users", route: "/admin/users" },
    { icon: BarChart2, label: "Reports & Analytics", route: "/admin/reports" },
    { icon: Star, label: "Reviews & Feedback", route: "/admin/reviews" },
    { icon: Bell, label: "Notifications", route: "/admin/notifications" },
    { icon: Settings, label: "Settings", route: "/admin/settings" },
    { icon: Activity, label: "Activity Logs", route: "/admin/logs" },
  ],
};

export default function Sidebar({
  role = "user",
  collapsed = false,
  setCollapsed = () => {},
  mobileOpen = false,
  setMobileOpen = () => {},
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const menus = sidebarMenus[role] || [];
  const isAdmin = role === "admin";

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    setMobileOpen(false);
    navigate(role === "admin" ? "/admin" : role === "ngo" ? "/ngo/profile" : "/user/profile");
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside
        className={[
          "sidebar",
          isAdmin ? "sidebar-admin" : "",
          collapsed ? "collapsed" : "",
          mobileOpen ? "mobile-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="sidebar-header">
          {!collapsed ? (
            <ServeShareLogo size="sm" />
          ) : (
            <div className="sidebar-logo-mini" aria-hidden="true">
              S
            </div>
          )}

          <button
            className="collapse-btn"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
            type="button"
          >
            <ChevronLeft size={18} className={collapsed ? "rotate-180" : ""} />
          </button>
        </div>

        {isAdmin && !collapsed && (
          <div className="sidebar-admin-badge">
            <span className="pulse-dot" />
            Admin Panel
          </div>
        )}

        <nav className="sidebar-menu">
          {menus.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.route}
                to={item.route}
                end
                className={({ isActive }) =>
                  [
                    "nav-item",
                    isAdmin ? "nav-item-admin" : "",
                    isActive ? "active" : "",
                    collapsed ? "collapsed-item" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} className="nav-icon" />
                {!collapsed && <span className="nav-text">{item.label}</span>}

                {!collapsed && item.badge ? <span className="badge badge-green">{item.badge}</span> : null}
              </NavLink>
            );
          })}

          <div className="sidebar-divider" />

          <button
            onClick={handleLogout}
            className={`nav-item logout ${isAdmin ? "nav-item-admin" : ""} ${collapsed ? "collapsed-item" : ""}`}
            type="button"
          >
            <LogOut size={18} className="nav-icon" />
            {!collapsed && <span className="nav-text">Logout</span>}
          </button>
        </nav>

        {!isAdmin && !collapsed && (
          <div className="sidebar-impact">
            <div className="sidebar-impact-icon">💚</div>
            <p>Every donation makes a difference.</p>
            <button className="btn-primary sidebar-impact-btn" type="button" onClick={handleProfile}>
              View Impact
            </button>
          </div>
        )}

        {isAdmin && !collapsed && (
          <div className="sidebar-admin-footer">
            <div className="sidebar-admin-avatar">A</div>
            <div className="sidebar-admin-meta">
              <p className="sidebar-admin-name">Admin User</p>
              <p className="sidebar-admin-sub">
                <span className="pulse-dot small" />
                Super Admin
              </p>
            </div>
          </div>
        )}

        {!collapsed && !isAdmin && (
          <div className="sidebar-user-footer">
            <button className="sidebar-profile-btn" type="button" onClick={handleProfile}>
              <User size={16} />
              My Profile
            </button>
          </div>
        )}
      </aside>
    </>
  );
}