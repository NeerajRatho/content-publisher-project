import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import ErrorMessage from "../components/ErrorMessage";

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as unknown as { state?: { from?: { pathname: string } } };
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Enter email and password.");
      return;
    }
    try {
      await auth.login({ email, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login failed. Check credentials.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f6fa",
      }}
    >
      <div
        style={{
          width: "360px",
          padding: "30px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Login</h2>

        <form onSubmit={submit}>
          {/* Email */}
          <label style={{ fontWeight: "500", marginBottom: "5px", display: "block" }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "15px",
            }}
          />

          {/* Password */}
          <label style={{ fontWeight: "500", marginBottom: "5px", display: "block" }}>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "15px",
            }}
          />

          <div style={{ marginBottom: "15px" }}>
            <ErrorMessage message={error} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={auth.loading}
            style={{
              width: "100%",
              padding: "12px",
              background: auth.loading ? "#888" : "#4a69bd",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {auth.loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup Link */}
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "14px",
            color: "#555",
          }}
        >
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#4a69bd", textDecoration: "none", fontWeight: "600" }}>
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
