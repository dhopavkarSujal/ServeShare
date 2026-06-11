import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ShieldCheck, User, Mail } from "lucide-react";
import AuthLayout, { AuthPasswordField, AuthRoleTabs, AuthSocialButton, AuthTextField } from "../components/auth/AuthLayout";
import { useAuth } from "../config/context/AuthContext";
import "../css/auth.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, error } = useAuth();

  const [selectedRole, setSelectedRole] = useState("user");
  const [showPass, setShowPass] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const closePopup = () => setPopup({ show: false, type: "", message: "" });

  const roleOptions = [
    { value: "user", label: "User", icon: User },
    { value: "ngo", label: "NGO", icon: Building2 },
  ];

  useEffect(() => {
    if (!error) return;

    setPopup({ show: true, type: "error", message: error });
    const timer = setTimeout(() => closePopup(), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleRegister = async () => {
    const nextErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.password.trim()) nextErrors.password = "Password is required.";

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

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

    setSubmitting(false);
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

      <AuthLayout variant="register">
        <form className="form-stack" onSubmit={(e) => e.preventDefault()}>
          <AuthRoleTabs options={roleOptions} selected={selectedRole} onChange={setSelectedRole} />

          <AuthTextField
            label="Full Name"
            placeholder="Enter your full name"
            icon={User}
            value={form.fullName}
            error={fieldErrors.fullName}
            onChange={(e) => {
              setForm({ ...form, fullName: e.target.value });
              if (fieldErrors.fullName) {
                setFieldErrors((prev) => ({ ...prev, fullName: "" }));
              }
            }}
          />

          <AuthTextField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            icon={Mail}
            value={form.email}
            autoComplete="email"
            error={fieldErrors.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: "" }));
              }
            }}
          />

          <AuthPasswordField
            label="Password"
            placeholder="Create a password"
            showPassword={showPass}
            onToggle={() => setShowPass(!showPass)}
            value={form.password}
            autoComplete="new-password"
            error={fieldErrors.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
          />

          <label className="terms-label">
            <input type="checkbox" />
            <span>
              I agree to the <a href="#">Terms & Conditions</a>
            </span>
          </label>

          <button type="button" onClick={handleRegister} className="btn-primary full-btn" disabled={submitting}>
            {submitting ? "Creating account..." : "Create Account"}
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
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")} className="text-link-btn">
              Login
            </button>
          </p>
        </form>
      </AuthLayout>
    </>
  );
}