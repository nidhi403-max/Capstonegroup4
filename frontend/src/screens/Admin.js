import React, { useState } from "react";
import EventList from "../components/Events";
import UserList from "../components/UserList";
import BookingList from "../components/BookingList";
import VenueList from "../components/VenueList";



export default function Admin() {
  const [activeTab, setActiveTab] = useState("events");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
      <header className="text-center p-5  ">
        <h1>Admin panel</h1>
      </header>
      <ul className="nav nav-tabs mt-3">
        <li className="nav-item col">
          <button
            className={`nav-link w-100 ${
              activeTab === "events" ? "active" : ""
            }`}
            onClick={() => handleTabChange("events")}
          >
            Events
          </button>
        </li>
       
        <li className="nav-item col">
          <button
            className={`nav-link w-100 ${activeTab === "User" ? "active" : ""}`}
            onClick={() => handleTabChange("user")}
          >
            Users
          </button>
        </li>
        <li className="nav-item col">
          <button
            className={`nav-link w-100 ${
              activeTab === "venue" ? "active" : ""
            }`}
            onClick={() => handleTabChange("venue")}
          >
            Venue
          </button>
        </li>
        <li className="nav-item col">
          <button
            className={`nav-link w-100 ${
              activeTab === "Bookings" ? "active" : ""
            }`}
            onClick={() => handleTabChange("bookings")}
          >
            bookings
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
        < VenueList/>
        </div>
      </div>
    </div>
  );
}
