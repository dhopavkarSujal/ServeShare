import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../../css/Layout.css";

export default function DashboardLayout({ role = "user" }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="layout-root">
      <Sidebar
        role={role}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className={[
          "layout-main",
          collapsed ? "collapsed" : "",
          mobileOpen ? "mobile-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Navbar
          role={role}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
        />

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}