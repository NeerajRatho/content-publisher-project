import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import type { Publication } from "../types/publication";
import { Link, useNavigate } from "react-router-dom";

export default function PublicationsList() {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const navigate = useNavigate();

  const truncate = (text: string, limit: number) =>
    text.length > limit ? text.substring(0, limit) + "..." : text;

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/publications");
      setItems(res.data.publications);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to fetch publications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const deletePub = async (id: number) => {
    const ok = window.confirm("Are you sure you want to delete this publication?");
    if (!ok) return;

    try {
      await axiosClient.delete(`/publications/${id}`);
      setItems((s) => s.filter((p) => p.id !== id));
    } catch (err: any) {
      alert("Delete failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <Loader />;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "20px",
        background: "#f1f2f6",
        fontFamily: "Arial, sans-serif",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          background: "white",
          padding: "15px 20px",
          borderRadius: "10px",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#2d3436",
            wordBreak: "break-word",
            maxWidth: "70%",
          }}
        >
          Content Publisher
        </h1>

        <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
          <Link
            to="/add"
            style={{
              padding: "10px 16px",
              background: "#0984e3",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "14px",
              whiteSpace: "nowrap",
            }}
          >
            + Add Publication
          </Link>

          <button
            onClick={logout}
            style={{
              padding: "10px 16px",
              background: "#d63031",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              whiteSpace: "nowrap",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <ErrorMessage message={error} />

      {/* LIST */}
      {items.map((p) => {
        const isExpanded = expandedId === p.id;

        return (
          <div
            key={p.id}
            style={{
              width: "100%",
              maxWidth: "100%",
              background: "white",
              padding: "20px 22px",
              borderRadius: "12px",
              marginBottom: "20px",
              boxShadow: "0px 3px 10px rgba(0,0,0,0.08)",
              borderLeft: "6px solid #0984e3",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              boxSizing: "border-box",
            }}
          >
            {/* TITLE */}
            <div style={{ marginBottom: "8px" }}>
              <strong style={{ color: "#2d3436", fontSize: "16px" }}>
                Title:{" "}
              </strong>
              <span style={{ fontSize: "16px", color: "#2d3436" }}>
                {truncate(p.title, 120)}
              </span>
            </div>

            {/* CONTENT */}
            <div style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#2d3436", fontSize: "15px" }}>
                Content:{" "}
              </strong>
              <span
                style={{
                  color: "#555",
                  fontSize: "14px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  lineHeight: "1.5",
                }}
              >
                {isExpanded ? p.content : truncate(p.content, 200)}
              </span>
            </div>

            {p.content.length > 200 && (
              <button
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#0984e3",
                  cursor: "pointer",
                  fontWeight: 600,
                  padding: 0,
                  marginBottom: "10px",
                }}
              >
                {isExpanded ? "Show Less" : "Read More"}
              </button>
            )}

            {/* STATUS */}
            <div style={{ marginBottom: "10px" }}>
              <strong style={{ color: "#2d3436", fontSize: "15px" }}>
                Status:{" "}
              </strong>
              <span style={{ fontSize: "14px", color: "#636e72" }}>
                {p.status}
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <Link
                to={`/edit/${p.id}`}
                style={{
                  padding: "8px 12px",
                  background: "#00b894",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              >
                Edit
              </Link>

              <button
                onClick={() => deletePub(p.id)}
                style={{
                  padding: "8px 12px",
                  background: "#d63031",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}

      {items.length === 0 && (
        <p style={{ textAlign: "center", color: "#777" }}>
          No publications yet. Add one using the button above.
        </p>
      )}
    </div>
  );
}
