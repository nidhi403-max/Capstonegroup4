import React, { useState, useEffect } from 'react';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:4000/booking/');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        console.log(data)
        setBookings(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="bookingsContainer">
      <h2>Bookings</h2>
      <div className="bookingsGrid">
        {bookings.map((booking, index) => (
          <div className="bookingCard" key={index}>
            <h3>{`${booking.userFirstName} ${booking.userLastName}`}'s Booking</h3>
            <p><strong>Event Name :</strong> {booking.eventName}</p>
            <p><strong>Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
            <p><strong>Venue Location:</strong> {booking.venueLocation}</p>
            <p><strong>Venue Capacity:</strong> {booking.venueCapacity}</p>
            <p><strong>Decoration Package:</strong> {booking.decorationPackage}</p>
            <p><strong>Special Requests:</strong> {booking.specialRequests}</p>
            <p><strong>Accommodation:</strong> {booking.accommodations ? booking.accommodations.join(', ') : 'None'}</p>
            <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
            <p><strong>User Email:</strong> {booking.userEmail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingList;
