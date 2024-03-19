import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    message: "",
  });
  let navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:4000/email/sendemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to_name: 'Admin',
        from_name: credentials.name,
        email: credentials.email,
        message: credentials.message,
      }),
    });

    if (response.status === 200) {
      alert("Message sent successfully");
      setCredentials({
        name: "",
        email: "",
        message: "",
      });
    } else {
      console.error("Failed to send message");
      alert("Failed to send message. Please try again later.");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Navbar />
      <div className="contact-page">
        <div className="contact-section">
          <h1>Contact Us</h1>
          <p>Have questions or want to discuss your upcoming event? Reach out to us!</p>

          <div className="contact-details">
            <div className="contact-info">
              <h2>EventXO Headquarters</h2>
              <p>Address: 123 Event Avenue, Cityville, State 12345</p>
              <p>Email: info@eventxo.com</p>
              <p>Phone: +1 (123) 456-7890</p>
            </div>

            <div className="contact-form">
              <h2>Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <label htmlFor="name" className="form-label">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={credentials.name}
                  onChange={onChange}
                />

                <label htmlFor="email" className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={credentials.email}
                  onChange={onChange}
                />

                <label htmlFor="message" className="form-label">Message:</label>
                <textarea
                  className="form-control"
                  name="message"
                  rows="4"
                  value={credentials.message}
                  onChange={onChange}
                ></textarea>

                <button type="submit" className="m-3 btn btn-success">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
