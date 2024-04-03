import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../context/firebaseConfig';
import "./events.css"

export default function Event() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchEvents();
    }
  }, [user, navigate]);

  const fetchEvents = async () => {
    setIsLoading(true); 
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
  
      // Setting events with image urls
      setEvents(eventsWithImages);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/bookevent/${eventId}`);
  };

  return (
    <div>
      <Navbar />
      <div className="position-relative" style={{ padding: '20px' }}>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="event-list">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="event" style={{  display: 'flex', width:"85%", margin:"auto",  alignItems: 'center',flexDirection:'row-reverse',flexWrap:'wrap' }}>
                <div style={{    flex:1, textAlign:"center" }}>
                  {event.fetchedImageUrls.map((url, index) => (
                    <img key={index} src={url} alt="Event" style={{ height: '340px'}} />
                  ))}
                </div>
                <div className="eventDesc" style={{flex:1}}>
                  <h2>{event.title}</h2>
                  <p>{event.description}</p>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <button onClick={() => handleEventClick(event._id)} style={{ cursor: 'pointer',backgroundColor:'#de3c39b8' }}>Book Now</button>
                </div>
              </div>
            ))
            ) : (
              <p>No events found.</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
