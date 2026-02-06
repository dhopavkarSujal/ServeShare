import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login-register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password: pass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* LEFT */}
        <div className="left-section">
          <div>
            <h1>Join ServeShare</h1>
            <p>Create your account and start helping people today!</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-section">
          <div className="form-box">
            <h2>Create Account</h2>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Creating Account..." : "Register"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?
                <span onClick={() => navigate("/login")}> Login</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
