import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../config/context/AuthContext";
import "../css/auth.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, error } = useAuth();

  const [selectedRole, setSelectedRole] = useState("user");
  const [showPass, setShowPass] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const closePopup = () => setPopup({ show: false, type: "", message: "" });

  useEffect(() => {
    if (!error) return;

    setPopup({ show: true, type: "error", message: error });
    const timer = setTimeout(() => closePopup(), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleRegister = async () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      setPopup({
        show: true,
        type: "error",
        message: "Please fill all required fields.",
      });
      return;
    }

    const res = await register({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      role: selectedRole === "user" ? "donor" : "ngo",
    });

    if (res.success) {
      setPopup({
        show: true,
        type: "success",
        message: "Registration successful! Please login.",
      });

      setTimeout(() => {
        closePopup();
        navigate("/login");
      }, 1400);
    } else {
      setPopup({
        show: true,
        type: "error",
        message: res.error || "Registration failed.",
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

          <div className="auth-left-content">
            <h2 className="auth-left-title">
              Together, we can make a difference
            </h2>

            <p className="auth-left-desc">
              Create an account and start making a difference today.
            </p>

            <div className="auth-emoji">🌱</div>
          </div>
        </div>

        <div className="auth-right auth-right-scroll">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join ServeShare</p>

          <div className="form-stack">
            <div className="role-switcher">
              {["user", "ngo"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`role-btn ${selectedRole === role ? "active" : ""}`}
                >
                  {role === "ngo" ? "NGO" : "User"}
                </button>
              ))}
            </div>

            <div>
              <label className="field-label">Full Name</label>
              <input
                className="input-field"
                placeholder="Enter your name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="field-label">Email</label>
              <input
                className="input-field"
                type="email"
                placeholder="Enter email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="password-wrap">
                <input
                  type={showPass ? "text" : "password"}
                  className="input-field"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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

            <label className="terms-label">
              <input type="checkbox" /> I agree to terms
            </label>

            <button type="button" onClick={handleRegister} className="btn-primary full-btn">
              Create Account
            </button>

            {error && <p className="auth-inline-error">{error}</p>}

            <p className="switch-text">
              Already have an account?{" "}
              <button type="button" onClick={() => navigate("/login")} className="text-link-btn">
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}