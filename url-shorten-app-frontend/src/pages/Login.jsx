import React, { useState } from "react";
import axios from "../axios/axiosConfig";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function attemptLogin(e) {
    e.preventDefault();

    axios.post("http://localhost:8080/api/auth/login",
       { email, 
        password
       }).then(response => {
        setErrorMessage('');
        const token = response.data;
        console.log("token fetched from backend " + token);
        const user = {
          email: email,
          token: token
        };
        localStorage.setItem("token", token);
        dispatch(setUser(user));
        navigate("/urls");
       }).catch(error => {
            if(error.response?.data?.errors){
                setErrorMessage(Object.values(error.response.data.errors).join(' '));
            } else if(error.response?.data?.message){
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Failed to login user. Please contact admin');
            }
        });
  };

  return (

    <>
    {/* <Navbar /> */}
    
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <form onSubmit={attemptLogin} className="border p-4 shadow rounded bg-light">
        <h2 className="mb-4 text-center">Login</h2>
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
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
      <div className="text-center mt-2">
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>

    </div>
    </>
  );
};

export default Login;
