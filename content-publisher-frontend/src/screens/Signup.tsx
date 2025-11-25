import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import ErrorMessage from "../components/ErrorMessage";

export default function Signup() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Please fill all required fields.");
      return;
    }

    if (password !== password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await auth.signup({ name, email, password, password_confirmation });
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Signup failed.");
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
          width: "380px",
          padding: "30px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Signup</h2>

        <form onSubmit={submit}>
          {/* Name */}
          <label style={{ fontWeight: "500", marginBottom: "5px", display: "block" }}>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "15px",
            }}
          />

          {/* Email */}
          <label style={{ fontWeight: "500", marginBottom: "5px", display: "block" }}>Email</label>
          <input
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
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
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "15px",
            }}
          />

          {/* Confirm Password */}
          <label style={{ fontWeight: "500", marginBottom: "5px", display: "block" }}>
            Confirm Password
          </label>
          <input
            value={password_confirmation}
            type="password"
            onChange={(e) => setPasswordConfirmation(e.target.value)}
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
            {auth.loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        {/* Login Link */}
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "14px",
            color: "#555",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#4a69bd", textDecoration: "none", fontWeight: "600" }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
