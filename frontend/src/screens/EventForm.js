import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
export default function EventForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const id = useParams();

  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");

  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [decorationPackage, setDecorationPackage] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [totalPrice, setTotalPrice] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accommodations, setAccommodations] = useState({
    Villa: false,
    Suite: false,
    Hotel: false,
  });
  var Filter = require('bad-words'),
  filter = new Filter({ list: ['bad', 'word'] });

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    fetchEvents();
    fetchVenues();
    setUserId(user.id);
  }, [id]);

  const fetchVenues = async () => {
    try {
      const response = await axios.get("http://localhost:4000/venues/");
      setVenues(response.data);
      if (response.data.length > 0) {
        setSelectedVenue(response.data[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch venues:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:4000/events/");
      setEvents(response.data);
      if (response.data.length > 0) {
        const eventToSelect =
          response.data.find((event) => event._id === id.id) ||
          response.data[0];

        if (eventToSelect) {
          setSelectedEvent(eventToSelect._id);
          setBasePrice(eventToSelect.price);
          setTotalPrice(
            eventToSelect.price + calculateDecorationPrice(decorationPackage)
          );
          setDecorationPackage("Silver");
        } else {
          console.log("No event matches the given ID.");
        }
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    const event = events.find((event) => event._id === eventId);
    setSelectedEvent(eventId);
    const newBasePrice = event.price;
    setBasePrice(newBasePrice);
    setTotalPrice(newBasePrice + calculateDecorationPrice(decorationPackage));
  };

  const handleDecorationPackageChange = (e) => {
    const newPackage = e.target.value;
    setDecorationPackage(newPackage);

    setTotalPrice(basePrice + calculateDecorationPrice(newPackage));
  };

  const calculateDecorationPrice = (packageSelected) => {
    switch (packageSelected) {
      case "Premium":
        return 50;
      case "Gold":
        return 20;
      case "Silver":
        return 0;
      default:
        return 0;
    }
  };
  const handleAccommodationChange = (e) => {
    const { name, checked } = e.target;
    const newAccommodations = { ...accommodations, [name]: checked };
    setAccommodations(newAccommodations);
    calculateTotalPrice(basePrice, decorationPackage, newAccommodations);
  };

  const calculateAccommodationPrice = (accommodations) => {
    let price = 0;
    if (accommodations.Villa) price += 5000;
    if (accommodations.Suite) price += 4500;
    if (accommodations.Hotel) price += 3000;
    return price;
  };
  const calculateTotalPrice = (
    basePrice,
    decorationPackage,
    accommodations
  ) => {
    const decorationPrice = calculateDecorationPrice(decorationPackage);
    const accommodationPrice = calculateAccommodationPrice(accommodations);
    setTotalPrice(basePrice + decorationPrice + accommodationPrice);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    var request = filter.clean(specialRequests);
    console.log(request);
    const selectedAccommodations = Object.entries(accommodations)
      .filter(([key, value]) => value)
      .map(([key]) => key);

    const bookingData = {
      eventId: selectedEvent,
      venueId: selectedVenue,
      userId,
      firstname,
      lastname,
      email,
      phone,
      eventDate,
      decorationPackage,
      specialRequests:request,
      totalPrice,
      accommodations: selectedAccommodations,
    };

    try {
      await axios.post("http://localhost:4000/booking/bookevent", bookingData);
      alert("Booking submitted successfully");
      navigate("/");
    } catch (error) {
      console.error("Failed to submit booking:", error);
      alert("Failed to submit booking");
    }
  };
  return (
    <>
      <Navbar />
      <div className="event-page-container">
        <div className="event-form-container">
          <h2>Book Your Event</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="event-dropdown">Select Event:</label>
              <select
                id="event-dropdown"
                value={selectedEvent}
                onChange={handleEventChange}
              >
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="firstname">First Name:</label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Last Name:</label>
              <input
                type="text"
                id="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="eventDate">Event Date:</label>
              <input
                type="date"
                id="eventDate"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="venue-dropdown">Select Venue:</label>
              <select
                id="venue-dropdown"
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
              >
                {venues.map((venue) => (
                  <option key={venue._id} value={venue._id}>
                    {venue.name} - {venue.location} (Capacity: {venue.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="decorationPackage">Decoration Package:</label>
              <select
                id="decorationPackage"
                value={decorationPackage}
                onChange={handleDecorationPackageChange}
              >
                <option value="Premium">Premium</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
              </select>
            </div>
            <div className="form-group">
              <label>Accommodation for 10 - 50 guests:</label>
              <div>
                <input
                  type="checkbox"
                  id="villa"
                  name="Villa"
                  checked={accommodations.Villa}
                  onChange={handleAccommodationChange}
                />
                <label htmlFor="villa">Villa ($5,000)</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="suite"
                  name="Suite"
                  checked={accommodations.Suite}
                  onChange={handleAccommodationChange}
                />
                <label htmlFor="suite">Suite ($4,500)</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="hotel"
                  name="Hotel"
                  checked={accommodations.Hotel}
                  onChange={handleAccommodationChange}
                />
                <label htmlFor="hotel">Hotel ($3,000)</label>
              </div>
            </div>

            <div className="form-group">
              <input
                placeholder="Special Requests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>

            <div className="form-group">
              <p>
                Total Price: $ <span>{totalPrice}</span>
              </p>
            </div>
            <button type="submit">Submit Booking</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
