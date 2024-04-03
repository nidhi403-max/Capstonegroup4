import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51OnawZDcbKyFGB2GkDiDHbAABf3MnTu76AMGsue4sw5o7ewbW9YTq0ArbhJmTQaznAUU2bCZTrmbS98ZKrwAi8y600ABbouZro"
);

export default function Event() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchBookings();
    }
  }, [user, navigate]);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:4000/booking/${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookingDetails(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (bookingData) => {
    const {
      userId,
      bookingId,
      eventId,
      venueId,
      eventName,
      decorationPackage,
      totalPrice,
    } = bookingData;
    const stripe = await stripePromise;

    try {
      const paymentDetails = {
        userId: userId,
        bookingId: bookingId,
        eventId: eventId,
        venueId: venueId,
        eventName: eventName,
        decorationPackage: decorationPackage,
        totalPrice: totalPrice,
      };

      const response = await fetch(
        "http://localhost:4000/booking/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to initiate payment");
      }

      const { id: sessionId } = await response.json();

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        setError(result.error.message);
      }
    } catch (error) {
      setError(error.message);
      console.error("Payment initiation error:", error);
    }
  };
  const renderBookingDetails = (booking) => (
    <>
      <p>
        <strong>Event Name:</strong> {booking.eventName}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(booking.eventDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Decoration Package:</strong> {booking.decorationPackage}
      </p>
      <p>
        <strong>Special Requests:</strong> {booking.specialRequests}
      </p>
      <p>
        <strong>Total Price:</strong> ${booking.totalPrice}
      </p>
      <p>
        <strong>Status:</strong> {booking.status}
      </p>
      <p>
        <strong>Comments:</strong> {booking.comment || "N/A"}
      </p>
      <p>
        <strong>Payment Status:</strong> {booking.paymentStatus}
      </p>

      {booking.accommodations && (
        <p>
          <strong>Accommodations:</strong> {booking.accommodations.join(", ")}
        </p>
      )}
      {booking.status === "Approved" && (
        <button
          onClick={() =>
            handlePayment({
              bookingId: booking.bookingId,
              eventId: booking.eventId,
              venueId: booking.venueId,
              eventName: booking.eventName,
              decorationPackage: booking.decorationPackage,
              totalPrice: booking.totalPrice,
            })
          }
        >
          Make Payment
        </button>
      )}
    </>
  );

  return (
    <div>
      <Navbar />
      <div className="position-relative" style={{ padding: "20px" }}>
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <div className="loader"></div>
          </div>
        ) : bookingDetails && bookingDetails.length > 0 ? (
          bookingDetails.map((booking) => (
            <div key={booking.bookingId}>
              <div className="booking-card">
                <h3>Booking Details</h3>

                {renderBookingDetails(booking)}
              </div>
            </div>
          ))
        ) : (
          <p>No booking found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
