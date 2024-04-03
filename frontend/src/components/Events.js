import React, { useState, useEffect } from "react";
import api from "../api";
import { storage } from "../context/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "../screens/events.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function EventContainer() {
  const [events, setEvents] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      const response = await fetch("http://localhost:4000/events");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const eventsData = await response.json();
      console.log(eventsData);
      const eventsWithImages = await Promise.all(
        eventsData.map(async (event) => {
          const fetchedImageUrls = await Promise.all(
            event.imageUrls.map(async (imagePath) => {
              const imageRef = ref(storage, imagePath);
              return await getDownloadURL(imageRef);
            })
          );

          return { ...event, fetchedImageUrls };
        })
      );

      setEvents(eventsWithImages);
    } catch (error) {
      console.error("Failed to fetch events:", error);
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
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          saveImageUrlToMongo(downloadURL);
        });
      }
    );
  };

  const saveImageUrlToMongo = (imageUrl) => {
    const eventData = {
      ...formData,
      imageUrls: [...formData.imageUrls, imageUrl],
    };
    eventData.image = null;
    api
      .post("/events/createevent", eventData)
      .then((response) => {
        if (response.status === 201) {
          setSuccessMessage("Event added successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);

          setFormData({
            title: "",
            description: "",
            date: "",
            imageUrls: "",
            price: 0,
            image: null,
          });
          fetchEvents();
        }
      })

      .catch((error) => {
        setErrorMessage("Error saving event. Please try again.");
        setTimeout(() => setErrorMessage(""), 3000);
      });
  };

  const handleAddEvent = () => {
    if (formData.image) {
      uploadFile(formData.image);
    } else {
      console.error("No image file selected");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await api.delete(`/events/deleteevent/${eventId}`);
      if (response.status === 200) {
        setSuccessMessage("Event deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);

        fetchEvents(); // Refresh list after deletion
      } else {
        throw new Error("Failed to delete the event.");
      }
    } catch (error) {
      setErrorMessage("Error deleting event. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);

      console.error("Error deleting event:", error);
    }
  };

  const handleEditEvent = (event) => {
    setEditMode(true);
    setEditingEventId(event._id); 
    // Editing event form
    const formattedDate = event.date.split("T")[0];

    //Resource:https://pixabay.com/photos/marriage-couple-wedding-love-4226896/ -Wedding
    //Resource:https://pixabay.com/photos/happy-birthday-birthday-cake-cake-4904779/ - Birthday
    //Resource:https://unsplash.com/photos/unknown-persons-sitting-indoors-wn7dOzUh3Rs - Corporate Event
    const imageUrlsAsString = event.fetchedImageUrls
      ? event.fetchedImageUrls.join(",")
      : "";
    setFormData({
      ...event,
      date: formattedDate,
      imageUrls: imageUrlsAsString,
      image: null,
    });
  };

  const handleUpdateEvent = () => {
    // Checking for a new image to upload
    if (formData.image) {
      const file = formData.image;
      const storageRef = ref(storage, `events/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handling unsuccessful uploads
          console.error("Error during file upload:", error);
        },
        () => {
          // Handling successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            // Once the file is uploaded, update the event with the new image URL
            updateEventOnServer(downloadURL);
          });
        }
      );
    } else {
      // If there is no new image, update the event with the existing data
      updateEventOnServer(formData.imageUrls);
    }
  };

  // Sending update request to the server
  const updateEventOnServer = (imageUrl) => {
    const updateData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      imageUrls: imageUrl, 
      price: formData.price,
    };

    api
      .put(`/events/updateevent/${editingEventId}`, updateData)
      .then((response) => {
        if (response.status === 200) {
          console.log("Event updated successfully");
          // Refreshing the event list 
          setSuccessMessage("Event updated successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);

          setEditMode(false);
          setEditingEventId(null);
          setFormData({
            title: "",
            description: "",
            date: "",
            imageUrls: [],
            price: 0,
            image: null,
          });
          fetchEvents();
        }
      })
      .catch((error) => {
        setErrorMessage("Error Updating event. Please try again.");
        setTimeout(() => setErrorMessage(""), 3000);

        console.error("Error updating event:", error);
      });
  };
  return (
    <div className="main-container">
      <div className="event-container container mt-4">
        <h2>Create Event</h2>
        <div className="main-container">
          {successMessage && (
            <div className="alert alert-success">
              <h3>{successMessage}</h3>
            </div>
          )}

          {errorMessage && (
            <div className="alert alert-danger">
              <h3>{errorMessage}</h3>
            </div>
          )}
        </div>

        <form>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Event Image:</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="form-control"
              required
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
              required
            />
          </div>
          <div className="form-control button-box">
            <button
              type="button"
              onClick={handleAddEvent}
              disabled={editMode}
              className="btn btn-success btn-custom-success ml-2"
            >
              Add Event
            </button>
            {editMode && (
              <button
                type="button"
                onClick={handleUpdateEvent}
                className="btn btn-success btn-custom-success ml-2"
              >
                Update Event
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="event-list">
        <h2>Event List</h2>
        <ul className="list-group">
          {events.map((event) => (
            <li key={event._id} className="list-group-item">
              <div className="event-header">
                <div className="event-title-date">
                  <span className="event-title">{event.title}</span>
                  <span className="event-info">
                    Date:{" "}
                    {new Date(event.date).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}{" "}
                    | Price: ${event.price}
                  </span>
                </div>

                <div className="user-actions">
                  <button
                    className="btn btn-warning btn-sm custom-edit"
                    onClick={() => handleEditEvent(event)}
                  >
                    <EditIcon /> {}
                  </button>
                  <button
                    className="btn btn-danger btn-sm ml-2 custom-delete"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    <DeleteIcon /> {}
                  </button>
                </div>
              </div>
              <div className="event-description">{event.description}</div>
              <div className="event-images">
                {event.fetchedImageUrls.map((url, index) => (
                  <img key={index} src={url} alt="Event" />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EventContainer;
