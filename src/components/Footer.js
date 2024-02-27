import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer class="py-3 my-4">
      <ul class="nav justify-content-center border-bottom pb-3 mb-3">
        <li class="nav-item">
          <Link to="/" aria-current="page" class="nav-link px-2 text-muted">
            Home
          </Link>
        </li>
        <li class="nav-item">
          <Link to="/" class="nav-link px-2 text-muted">
            Events
          </Link>
        </li>
        <li class="nav-item">
          <Link to="/" class="nav-link px-2 text-muted">
            Services
          </Link>
        </li>
        <li class="nav-item">
          <Link to="/login" class="nav-link px-2 text-muted">
            Contact Us
          </Link>
        </li>
      </ul>
      <p class="text-center text-muted">© 2024 EventXo</p>
    </footer>
  );
}
