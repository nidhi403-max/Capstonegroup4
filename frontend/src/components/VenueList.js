import React, { useState, useEffect } from "react";
import api from "../api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
function VenueContainer() {
  const [venues, setVenues] = useState([]);
  const [openVenues, setOpenVenues] = useState([]);
  const [bookedVenues, setBookedVenues] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    capacity: 0,
    location: "",
    date: "", // Added date field
  });
  const [formErrors, setFormErrors] = useState({});
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  useEffect(() => {
    api
      .get("/venues/")
      .then((response) => {
        const allVenues = response.data;
        const open = allVenues.filter((venue) => venue.status === "Open");
        const booked = allVenues.filter((venue) => venue.status === "Booked");
        setVenues(allVenues);
        setOpenVenues(open);
        setBookedVenues(booked);
      })
      .catch((error) => console.error("Error fetching venues:", error));
  }, []);
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.capacity) errors.capacity = "Capacity is required";
    if (!formData.location) errors.location = "Location is required";
    if (!formData.date) errors.date = "Date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleAddVenue = () => {
    if (!validateForm()) return;
    api
      .post("/venues", formData)
      .then((response) => {
        const newVenue = response.data;
        setVenues((prev) => [...prev, newVenue]);
        setFormData({ name: "", capacity: 0, location: "", date: "" }); // Clear form
        setFormErrors({}); // Clearing form errors
        if (newVenue.status.toLowerCase() === "open") {
          setOpenVenues((prev) => [...prev, newVenue]);
        } else if (newVenue.status.toLowerCase() === "booked") {
          setBookedVenues((prev) => [...prev, newVenue]);
        }

        setFormData({ name: "", capacity: 0, location: "", date: "" });
      })
      .catch((error) => console.error("Error adding venue:", error));
  };

  const handleNewVenue = () => {
    setFormData({ name: "", capacity: 0, location: "", date: "" });
    setSelectedVenueId(null);
    setFormErrors({});
  };

  const handleUpdateVenue = () => {
    if (selectedVenueId) {
      api
        .put(`/venues/${selectedVenueId}`, formData)
        .then((response) => {
          const updatedVenue = response.data;
          setVenues((prev) =>
            prev.map((venue) =>
              venue._id === selectedVenueId ? updatedVenue : venue
            )
          );

          // Updating openVenues and bookedVenues accordingly
          if (updatedVenue.status.toLowerCase() === "open") {
            setOpenVenues((prev) =>
              prev.map((venue) =>
                venue._id === selectedVenueId ? updatedVenue : venue
              )
            );
            setBookedVenues((prev) =>
              prev.filter((venue) => venue._id !== selectedVenueId)
            );
          } else if (updatedVenue.status.toLowerCase() === "booked") {
            setBookedVenues((prev) =>
              prev.map((venue) =>
                venue._id === selectedVenueId ? updatedVenue : venue
              )
            );
            setOpenVenues((prev) =>
              prev.filter((venue) => venue._id !== selectedVenueId)
            );
          }

          setFormData({ name: "", capacity: 0, location: "", date: "" });
          setSelectedVenueId(null);
        })
        .catch((error) => console.error("Error updating venue:", error));
    }
  };

  // Deleting a venue
  const handleDeleteVenue = (venueId) => {
    api
      .delete(`/venues/${venueId}`)
      .then(() => {
        const updatedVenues = venues.filter((venue) => venue._id !== venueId);
        setVenues(updatedVenues);

        const updatedOpenVenues = openVenues.filter(
          (venue) => venue._id !== venueId
        );
        setOpenVenues(updatedOpenVenues);

        const updatedBookedVenues = bookedVenues.filter(
          (venue) => venue._id !== venueId
        );
        setBookedVenues(updatedBookedVenues);

        setFormData({ name: "", capacity: 0, location: "", date: "" });
        setSelectedVenueId(null);
      })
      .catch((error) => console.error("Error deleting venue:", error));
  };

  const handleEditVenue = (venue) => {
    if (venue.status === "Open") {
      setFormData({
        name: venue.name,
        capacity: venue.capacity,
        location: venue.location,
        date: venue.date,
      });
      setSelectedVenueId(venue._id);
    } else {
      console.error("Booked venues cannot be edited");
    }
  };

  return (
    <div className="venue-container container mt-4">
      <h2>Venue Form</h2>

      <form>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-control"
          />
          {formErrors.name && (
            <div style={{ color: "red" }}>{formErrors.name}</div>
          )}
        </div>
        <div className="form-group">
          <label>Capacity:</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            className="form-control"
          />
          {formErrors.capacity && (
            <div style={{ color: "red" }}>{formErrors.capacity}</div>
          )}
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="form-control"
          />
          {formErrors.location && (
            <div style={{ color: "red" }}>{formErrors.location}</div>
          )}
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="form-control"
          />
          {formErrors.date && (
            <div style={{ color: "red" }}>{formErrors.date}</div>
          )}
        </div>
        <div className="form-control button-box">
          {selectedVenueId ? (
            <button
              type="button"
              onClick={handleNewVenue}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddVenue}
              className="btn btn-primary"
            >
              Add Venue
            </button>
          )}
          {selectedVenueId && (
            <button
              type="button"
              onClick={handleUpdateVenue}
              className="btn btn-success ml-2"
            >
              Update Venue
            </button>
          )}
        </div>
      </form>

      <div className="venue-container container mt-4">
        <h2>Open Venues</h2>
        <ul className="list-group">
          {openVenues.map((venue) => (
            <li key={venue._id} className="list-group-item venueList remaining">
              <div>
                <span className="venue-name">{venue.name}</span> -
                <span className="venue-info">
                  Capacity: {venue.capacity} | Location: {venue.location} |
                  Venue Date: {venue.schedule}
                </span>
                <div className="user-actions">
                  <button
                    onClick={() => handleEditVenue(venue)}
                    className="btn btn-warning btn-sm custom-edit"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDeleteVenue(venue._id)}
                    className="btn btn-danger btn-sm ml-2 custom-delete"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <h2>Booked Venues</h2>
        <ul className="list-group">
          {bookedVenues.map((venue) => (
            <li
              key={venue._id}
              className="list-group-item list-group-item-danger finish"
            >
              <div>
                <span className="venue-name">{venue.name}</span> -
                <span className="venue-info">
                  Capacity: {venue.capacity} | Location: {venue.location}
                </span>{" "}
                -
                <span className="booking-date">
                  Booked for: {new Date(venue.schedule).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default VenueContainer;
