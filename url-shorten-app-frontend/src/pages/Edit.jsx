import React, { useEffect, useState } from "react";
import axios from "../axios/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";

const Edit = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.user?.token); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/urls/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched URL data:", res.data);
        setTitle(res.data.title);
        setOriginalUrl(res.data.originalUrl);

      } catch (err) {
        console.error(err);
        setError("Failed to load URL.");
      } finally {
        setLoading(false);
      }
    };
    fetchUrl();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/urls/${id}`,
        { title, originalUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/urls");
    } catch (err) {
      console.error(err);
      setError("Failed to update URL.");
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (

    <>
    <Navbar />
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Edit URL</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Original URL</label>
          <input
            type="url"
            className="form-control"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">
          Update
        </button>
      </form>
    </div>
    </>
  );
};

export default Edit;
