import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
        <Link class="navbar-brand fs-1 fst-italic" to="/">
            <img src="/logo.png" className="logo"/>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {!user && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup">
                      Signup
                    </Link>
                  </li>
                </>
              )}
              {user && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" aria-current="page" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/events">
                      Events
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/eventform">
                      Event Form
                    </Link>
                  </li>
                 
                  <li className="nav-item">
                    <Link className="nav-link" to="/contact">
                      Contact Us
                    </Link>
                  </li>
                  <li className="nav-item">
                    <span className="nav-link">Welcome, {user.username}</span>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline-danger" onClick={logout}>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
