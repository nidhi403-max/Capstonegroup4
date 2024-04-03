import React, { useState, useEffect } from 'react';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminComment, setAdminComment] = useState("");

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

 // Handling status change for a booking through function
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:4000/booking/updateStatus/${bookingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, comment: adminComment, bookingId:bookingId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      const updatedBookings = bookings.map(booking => {
        if (booking.bookingId === bookingId) {
          return { ...booking, status: newStatus };
        }
        return booking;
      });

      setBookings(updatedBookings);
      setAdminComment(""); 
    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Displaying list of bookings
  return (
    <div className="bookingsContainer">
      
      <div className="bookingsGrid">
        {bookings.map((booking, index) => (
          <div className="booking-card-admin" key={booking.id}>
            <h2 style={{marginBottom: "40px"}}>Booking Details</h2>
            <h3>{`${booking.userFirstName} ${booking.userLastName}`}'s Booking</h3>
            <p><strong>Event Name :</strong> {booking.eventName}</p>
            <p><strong>Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</p>
            <p><strong>Venue Location:</strong> {booking.venueLocation}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Accommodation:</strong> {booking.accommodations.join(", ")}</p>
            {booking.status === 'Review' && (
              <div>
                   <textarea
                   className="form-control"
                  placeholder="Add Comments..."
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                ></textarea>
                <div className='admin-booking-button'>
                <button onClick={() => handleStatusChange(booking.bookingId, 'Approved')}>Approve</button>
             
             <button className='reject' onClick={() => handleStatusChange(booking.bookingId, 'Rejected')}>Reject</button>
          
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingList;
