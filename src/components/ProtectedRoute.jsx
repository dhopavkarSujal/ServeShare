import { Navigate } from "react-router-dom";
import { useAuth } from "../config/context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, profile, loading } = useAuth();

  // 🔍 DEBUG LOG
  console.log("ProtectedRoute check:", { user: !!user, profile: !!profile, loading, role });

  // ⏳ Wait until auth loads - show loading state
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>⏳</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // ❌ Not logged in - no user
  if (!user || !profile) {
    console.warn("No user or profile - redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // ❌ Role mismatch
  if (role && profile.role !== role) {
    console.warn(`Role mismatch: user has "${profile.role}" but route requires "${role}"`);
    
    const redirect =
      profile.role === "admin"
        ? "/admin"
        : profile.role === "ngo"
        ? "/ngo"
        : "/user";

    return <Navigate to={redirect} replace />;
  }

  // ✅ All checks passed
  return children;
}