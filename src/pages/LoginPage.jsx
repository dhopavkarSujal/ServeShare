import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../config/context/AuthContext";
import "../css/auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error, loading } = useAuth();

  const [selectedRole, setSelectedRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  const closePopup = () => setPopup({ show: false, type: "", message: "" });

  useEffect(() => {
    if (!error) return;

    setPopup({ show: true, type: "error", message: error });
    const timer = setTimeout(() => closePopup(), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await login({ email, password, selectedRole });

    console.log("Login response:", res);

    if (res.success) {
      // Navigate directly using redirectTo from login response
      navigate(res.redirectTo, { replace: true });
      return;
    }

    if (res.error) {
      setPopup({
        show: true,
        type: "error",
        message: res.error,
      });
    }
  };

  return (
    <div className="auth-page">
      {popup.show && (
        <div className={`auth-popup ${popup.type}`}>
          <span>{popup.message}</span>
          <button type="button" onClick={closePopup} className="auth-popup-close">
            ×
          </button>
        </div>
      )}

      <div className="card page-enter auth-card">
        <div className="auth-left">
          <div className="auth-orb auth-orb-top" />
          <div className="auth-orb auth-orb-bottom" />

          <div className="auth-left-content">
            <div className="auth-icon-wrap">
              <Heart size={24} fill="white" />
            </div>

            <h2 className="auth-left-title">
              Together, we can make a difference
            </h2>

            <p className="auth-left-desc">
              ServeShare connects generous hearts with those who need support.
            </p>

            <div className="auth-emoji">🤝</div>
          </div>
        </div>

        <div className="auth-right">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Login to continue your journey</p>

          <div className="role-switcher">
            {["user", "ngo", "admin"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`role-btn ${selectedRole === role ? "active" : ""}`}
              >
                {role === "ngo" ? "NGO" : role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          <form className="form-stack" onSubmit={handleLogin}>
            <div>
              <label className="field-label">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field"
                value={email}
                autoComplete="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="password-wrap">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input-field"
                  value={password}
                  autoComplete="current-password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="password-toggle"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="remember-row">
              <label className="remember-label">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="btn-primary full-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In to ServeShare"}
            </button>

            {error && <p className="auth-inline-error">{error}</p>}

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or continue with</span>
            </div>

            <div className="social-grid">
              <button type="button" className="btn-ghost social-btn">G Google</button>
              <button type="button" className="btn-ghost social-btn">f Facebook</button>
            </div>

            <p className="switch-text">
              Don't have an account?{" "}
              <button type="button" onClick={() => navigate("/register")} className="text-link-btn">
                Register
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}