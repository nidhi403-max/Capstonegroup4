import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-3 my-4">
      <ul className="nav justify-content-center border-bottom pb-3 mb-3">
        <li className="nav-item">
          <Link to="/" aria-current="page" className="nav-link px-2 text-muted">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link px-2 text-muted">
            Events
          </Link>
        </li>
      
        <li className="nav-item">
          <Link to="/login" className="nav-link px-2 text-muted">
            Contact Us
          </Link>
        </li>
      </ul>
      <p className="text-center text-muted">© 2024 EventXo</p>
    </footer>
  );
}
