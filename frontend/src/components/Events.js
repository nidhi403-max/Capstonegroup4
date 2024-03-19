import React, { useState, useEffect } from "react";
import api from "../api";
import { storage } from '../context/firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; 
function EventContainer() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    imageUrls: [],
    price: 0,
    image: null,
  });

  useEffect(() => {
    fetchEvents();

  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:4000/events');
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

  const handleInputChange = (e) => {
    if (e.target.name === "imageUrls") {
      setFormData({ ...formData, [e.target.name]: e.target.value.split(",") });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file }); 
  };

  const uploadFile = (file) => {
    if (!file) return;
    const storageRef = ref(storage, `/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          saveImageUrlToMongo(downloadURL);
        });
      }
    );
  };

  const saveImageUrlToMongo = (imageUrl) => {
    const eventData = { ...formData, imageUrls: [...formData.imageUrls, imageUrl] };
    eventData.image = null;
    api.post('/events/createevent', eventData)
      .then(response => {
        if(response.status === 201){
            setFormData({
                title: "",
                description: "",
                date: "",
                imageUrls:"",
                price: 0,
                image: null,
              });
            fetchEvents();
        }
      })
      .catch(error => console.error('Error saving event:', error));
  };

  const handleAddEvent = () => {
    if (formData.image) {
      uploadFile(formData.image);
    } else {
      console.error('No image file selected');
    }
  };



  return (
    <div className="event-container container mt-4">
      <h2>Create Event</h2>
      <form>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Event Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <button
          type="button"
          onClick={handleAddEvent}
          className="btn btn-primary"
        >
          Add Event
        </button>
      </form>

      <h2>Event List</h2>
      <ul className="list-group">
        {events.map((event) => (
          <li key={event._id} className="list-group-item">
            <div>
              <span className="event-title">{event.title}</span>
              <span className="event-info">
                Date: {new Date(event.date).toLocaleString()} | Price: $
                {event.price}
              </span>
            </div>
            <div className="event-description">{event.description}</div>
            <div className="event-images">
                  {event.fetchedImageUrls.map((url, index) => (
                    <img key={index} src={url} alt="Event" style={{ height: 'auto', float: 'right', marginLeft: '10px' }} />
                  ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventContainer;
