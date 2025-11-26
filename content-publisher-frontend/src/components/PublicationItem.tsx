import { useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import type { Publication, PublicationStatus } from "../types/publication";

export default function PublicationItem({ pub, onDeleted, onUpdated }: {
  pub: Publication;
  onDeleted: (id: number) => void;
  onUpdated: (p: Publication) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeStatus = async (newStatus: PublicationStatus) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.patch<Publication>(`/publications/${pub.id}`, {
        publication: { status: newStatus },
      });
      onUpdated(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to change status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this publication?")) return;
    setLoading(true);
    try {
      await axiosClient.delete(`/publications/${pub.id}`);
      onDeleted(pub.id);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>{pub.title}</h3>
      <div className="muted">Status: {pub.status}</div>
      <p>{pub.content?.slice(0, 200)}</p>

      <div className="row">
        <Link to={`/edit/${pub.id}`}>Edit</Link>
        <button onClick={handleDelete} disabled={loading}>Delete</button>
        <div className="status-actions">
          {["draft", "published", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => changeStatus(s as PublicationStatus)}
              disabled={loading || pub.status === s}
              className={pub.status === s ? "active" : ""}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="muted">Updating...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
