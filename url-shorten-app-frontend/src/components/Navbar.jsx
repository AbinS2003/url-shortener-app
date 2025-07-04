import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../store/authSlice";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignout = () => {
    dispatch(removeUser());
    navigate("/login");
  };

  return (
   <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
  <div className="container">
    <Link className="navbar-brand" to="/urls">URL Shortener</Link>

    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav mr-auto">
        {!user && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">Signup</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>

      {user && (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button className="btn btn-outline-light" onClick={handleSignout}>
              Signout
            </button>
          </li>
        </ul>
      )}
    </div>
  </div>
</nav>

  );
};

export default Navbar;
