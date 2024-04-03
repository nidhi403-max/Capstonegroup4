import React, { useState } from "react";
import EventList from "../components/Events";
import UserList from "../components/UserList";
import BookingList from "../components/BookingList";
import VenueList from "../components/VenueList";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import './admin.css'
export default function Admin() {
  const [activeTab, setActiveTab] = useState("events");
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!admin) {
      navigate("/login");
    }
  }, [admin, navigate]);
  

  const handleTabChange = (tab) => {
    setActiveTab(tab.toLowerCase()); 
  };
  const handleLogout = () => {
    logout(); // logout from Auth context
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="container">
      <header className="text-center p-5 custom">
        <h1>Admin Panel</h1>
        <button style={{backgroundColor:'#ff0000e0'}} onClick={handleLogout} className="btn btn-danger">Logout</button> {/* Logout Button */}
      </header>
      <ul className="nav nav-tabs mt-3">
        <li className="nav-item col">
          <button
            className={`nav-link w-100 ${activeTab === "events" ? "active" : ""}`}
            onClick={() => handleTabChange("events")}
          >
            Events
          </button>
        </li>
        <li className="nav-item col">
          <button
            className={`nav-link w-100 ${activeTab === "user" ? "active" : ""}`} 
            onClick={() => handleTabChange("user")}
          >
            Users
          </button>
        </li>
        <li className="nav-item col">
          <button
            className={`nav-link w-100 ${activeTab === "venue" ? "active" : ""}`}
            onClick={() => handleTabChange("venue")}
          >
            Venue
          </button>
        </li>
        <li className="nav-item col">
          <button
            className={`nav-link w-100 ${activeTab === "bookings" ? "active" : ""}`} 
            onClick={() => handleTabChange("bookings")}
          >
            Bookings
          </button>
        </li>
      </ul>
      <div className="tab-content">
        <div className={`tab-pane ${activeTab === "events" ? "active" : ""}`}>
          <EventList />
        </div>
        <div className={`tab-pane ${activeTab === "user" ? "active" : ""}`}>
          <UserList />
        </div>
        <div className={`tab-pane ${activeTab === "bookings" ? "active" : ""}`}>
          <BookingList />
        </div>
        <div className={`tab-pane ${activeTab === "venue" ? "active" : ""}`}>
          <VenueList />
        </div>
      </div>
    </div>
  );
}
