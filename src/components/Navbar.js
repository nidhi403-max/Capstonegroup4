import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav
        class="navbar navbar-expand-lg navbar-light"
        style={{ "background-color": "#E8AC41" }}
      >
        <div class="container-fluid">
          <Link class="navbar-brand fs-1 fst-italic" to="/">
            EventXo
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <Link class="nav-link" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/">
                  Events
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/">
                  Services
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/">
                  Contact Us
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/login">
                  Login
                </Link>
                {/* <button type="button" class="btn btn-dark" to="/login">
                  Login
                </button> */}
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/signup">
                  Signup
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
