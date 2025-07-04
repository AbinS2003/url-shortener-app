import React, { useEffect, useState } from "react";
import axios from "../axios/axiosConfig";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import checkAuth from "../checkAuth";
import Navbar from "../components/Navbar";

const Urls = () => {
  const [urls, setUrls] = useState([]);
  const [title, setTitle] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const token = useSelector((state) => state.auth.user?.token);

  async function fetchUrls() {
    try {
      const res = await axios.get("http://localhost:8080/api/urls", {
        params: {
          page: page - 1,
          size: pageSize,
          search: searchTerm,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setUrls(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch URLs");
    }
  }

  useEffect(() => {
    fetchUrls();
  }, [page, searchTerm, token]);

  const handleAddUrl = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(
        "http://localhost:8080/api/urls",
        { title, originalUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setOriginalUrl("");
      fetchUrls();
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Failed to add URL");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this URL?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/urls/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUrls();
    } catch (err) {
      console.error(err);
      setError("Failed to delete URL");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (

    <>
    <Navbar />
    <div className="container mt-4">
      <h2 className="mb-4">Your URLs</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAddUrl} className="mb-4 row g-2">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />0
        </div>
        <div className="col-md-5">
          <input
            type="url"
            className="form-control"
            placeholder="Original URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-primary w-100">
            Add URL
          </button>
        </div>
      </form>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title or URL"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Short URL</th>
              <th>Original URL</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No URLs found.
                </td>
              </tr>
            ) : (
              urls.map((url) => (
                <tr key={url.id}>
                  <td>{url.title}</td>
                  <td>
                    <a href={`http://localhost:8080/${url.shortUrl}`} target="_blank" rel="noopener noreferrer">
                      {url.shortUrl}
                    </a>
                  </td>
                  <td>
                    <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
                      {url.originalUrl}
                    </a>
                  </td>
                  <td>{new Date(url.createdAt).toLocaleString()}</td>
                  <td>
                  <Link to={`/edit/${url.id}`} className="btn btn-sm btn-warning mr-4">
                    Edit
                  </Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(url.id)}>
                    Delete
                  </button>
                </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <button className="btn btn-outline-secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button className="btn btn-outline-secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
    </>
  );
};
export default checkAuth(Urls);

