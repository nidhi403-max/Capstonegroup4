import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../context/firebaseConfig';

export default function Event() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchEvents();
    }
  }, [user, navigate]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:4000/events/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const eventsData = await response.json();

      const eventsWithImages = await Promise.all(eventsData.map(async (event) => {
        const fetchedImageUrls = await Promise.all(event.imageUrls.map(async (imagePath) => {
          const imageRef = ref(storage, imagePath);
          return await getDownloadURL(imageRef);
        }));
        
        return { ...event, fetchedImageUrls };
      }));

      setEvents(eventsWithImages);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/bookevent/${eventId}`);
  };

  return (
    <div>
      <Navbar />
      <div className="position-relative" style={{ padding: '20px' }}>
        <div className="event-list">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="event" style={{ border: '1px solid #ddd', margin: '10px', padding: '10px', display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  {event.fetchedImageUrls.map((url, index) => (
                    <img key={index} src={url} alt="Event" style={{ height: 'auto', float: 'right', marginLeft: '10px' }} />
                  ))}
                </div>
                <div style={{ flex: 2 }}>
                  <h2>{event.title}</h2>
                  <p>{event.description}</p>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <button onClick={() => handleEventClick(event._id)} style={{ cursor: 'pointer' }}>Book Now</button>
                </div>
              </div>
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
