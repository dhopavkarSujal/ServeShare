import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login-register.css";

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        password: pass,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    alert("Login successful");
    navigate("/dashboard");

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
            <h1>Welcome Back!</h1>
            <p>Login to continue donating and helping those in need.</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-section">
          <div className="form-box">
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
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
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?
                <span onClick={() => navigate("/register")}>
                  {" "}Register here
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
