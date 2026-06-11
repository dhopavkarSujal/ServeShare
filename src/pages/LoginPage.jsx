import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ShieldCheck, User, Mail } from "lucide-react";
import AuthLayout, { AuthPasswordField, AuthRoleTabs, AuthSocialButton, AuthTextField } from "../components/auth/AuthLayout";
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
  const [fieldErrors, setFieldErrors] = useState({});

  const closePopup = () => setPopup({ show: false, type: "", message: "" });

  const roleOptions = [
    { value: "user", label: "User", icon: User },
    { value: "ngo", label: "NGO", icon: Building2 },
    { value: "admin", label: "Admin", icon: ShieldCheck },
  ];

  useEffect(() => {
    if (!error) return;

    setPopup({ show: true, type: "error", message: error });
    const timer = setTimeout(() => closePopup(), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    if (!email.trim()) nextErrors.email = "Email is required.";
    if (!password.trim()) nextErrors.password = "Password is required.";

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const res = await login({ email, password, selectedRole });

    if (res.success) {
      navigate(res.redirectTo, { replace: true });
      return;
    }

    if (res.error) {
      setPopup({ show: true, type: "error", message: res.error });
    }
  };

  return (
    <>
      {popup.show && (
        <div className={`auth-popup ${popup.type}`}>
          <span>{popup.message}</span>
          <button type="button" onClick={closePopup} className="auth-popup-close">
            ×
          </button>
        </div>
      )}

      <AuthLayout variant="login" title="Welcome back" subtitle="Login to continue your journey">
        <form className="form-stack" onSubmit={handleLogin}>
          <AuthRoleTabs options={roleOptions} selected={selectedRole} onChange={setSelectedRole} />

          <AuthTextField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            icon={Mail}
            value={email}
            autoComplete="email"
            error={fieldErrors.email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: "" }));
              }
            }}
          />

          <AuthPasswordField
            label="Password"
            placeholder="Enter your password"
            showPassword={showPass}
            onToggle={() => setShowPass(!showPass)}
            value={password}
            autoComplete="current-password"
            error={fieldErrors.password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
          />

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
            <AuthSocialButton provider="Google" />
            <AuthSocialButton provider="Facebook" />
          </div>

            <p className="switch-text">
              Don't have an account?{" "}
              <button type="button" onClick={() => navigate("/register")} className="text-link-btn">
                Register
              </button>
            </p>
          </form>
      </AuthLayout>
    </>
  );
}