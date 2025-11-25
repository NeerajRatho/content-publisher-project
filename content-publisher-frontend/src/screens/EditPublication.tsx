import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import type { Publication } from "../types/publication";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

export default function EditPublication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pub, setPub] = useState<Publication | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<Publication["status"]>("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get<Publication>(`/publications/${id}`);
        setPub(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
        setStatus(res.data.status);
      } catch (err: any) {
        setError(err?.response?.data?.error || "Failed to load publication.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      await axiosClient.patch<Publication>(`/publications/${id}`, {
        publication: { title, content, status },
      });
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f6fa",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "500px",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#2d3436",
            fontSize: "26px",
          }}
        >
          Edit Publication
        </h2>

        <ErrorMessage message={error} />

        {pub ? (
          <form onSubmit={submit}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "15px",
              }}
            />

            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "15px",
                resize: "vertical",
              }}
            />

            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
              }}
            >
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "20px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "#fff",
                fontSize: "15px",
              }}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                padding: "12px",
                background: saving ? "#888" : "#0984e3",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#636e72",
              fontSize: "16px",
            }}
          >
            Publication not found.
          </div>
        )}
      </div>
    </div>
  );
}
