import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/check", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data.user.role === allowedRole) {
          setAuthorized(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [allowedRole]);

  if (loading) return <p>Checking authentication...</p>;

  if (!authorized) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
