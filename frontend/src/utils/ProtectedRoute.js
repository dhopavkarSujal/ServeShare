import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/check", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user?.role === allowedRole) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setAuthorized(false);
        setLoading(false);
      });
  }, [allowedRole]);

  if (loading) return <p>Loading...</p>;

  if (!authorized) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;
