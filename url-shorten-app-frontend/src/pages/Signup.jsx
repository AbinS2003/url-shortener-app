import React, { useState } from "react";
import axios from "../axios/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
     if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/auth/signup", { email, password });
      navigate("/login");
    } catch (error) {
      if (error.response?.data?.errors) {
    
        setErrorMessage(Object.values(error.response.data.errors).join(' '));
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Signup failed. Please contact support.');
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <form onSubmit={handleSubmit} className="border p-4 shadow rounded bg-light">
        <h2 className="mb-4 text-center">Signup</h2>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Email address</label>
          <input
            id="emailInput"
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="passwordInput" className="form-label">Password</label>
          <input
            id="passwordInput"
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
          <div className="mb-4">
          <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password</label>
          <input
            id="confirmPasswordInput"
            type="password"
            className="form-control"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          Signup
        </button>
      </form>
      <div className="text-center mt-2">
        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
