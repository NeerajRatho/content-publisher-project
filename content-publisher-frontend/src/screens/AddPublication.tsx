import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import ErrorMessage from "../components/ErrorMessage";

export default function AddPublication() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft"|"published"|"archived">("draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post("/publications", { publication: { title, content, status } });
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Create failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        background: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Add Publication</h2>

      <form onSubmit={submit}>

        <label style={{ fontWeight: "bold", marginTop: "10px", display: "block" }}>
          Title
        </label>
        <input
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

        <label style={{ fontWeight: "bold", marginTop: "15px", display: "block" }}>
          Content
        </label>
        <textarea
          value={content}
          onChange={(e)=>setContent(e.target.value)}
          rows={8}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

        <label style={{ fontWeight: "bold", marginTop: "15px", display: "block" }}>
          Status
        </label>
        <select
          value={status}
          onChange={(e)=>setStatus(e.target.value as any)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "15px",
            background: "#f9f9f9",
          }}
        >
          <option value="draft">draft</option>
          <option value="published">published</option>
          <option value="archived">archived</option>
        </select>

        <div style={{ marginTop: "10px" }}>
          <ErrorMessage message={error} />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: loading ? "#999" : "#007bff",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
