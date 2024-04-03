import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sending email data to backend
    const response = await fetch("http://localhost:4000/email/sendemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to_name: "Admin",
        from_name: credentials.name,
        email: credentials.email,
        message: credentials.message,
      }),
    });

    if (response.status === 200) {
      setFeedback({ type: "success", message: "Message sent successfully" });
      setCredentials({ name: "", email: "", message: "" });
      setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
    } else {
      setFeedback({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "message") {
      const words = value.split(/\s+/).filter(Boolean);
      if (words.length <= 100) {
        setCredentials({ ...credentials, message: value });
      }
    } else {
      setCredentials({ ...credentials, [name]: value });
    }
  };

  // Function to count words
  const wordCount = (text) => text.split(/\s+/).filter(Boolean).length;

  return (
    <div>
      <Navbar />
      <div className="contact-page">
        <div className="contact-section">
          {/* {Resource:https://www.pexels.com/photo/art-party-winter-abstract-7723722/} */}
          <img src={"./images/EventXo-2.png"} alt="Event" />
          <div className="contact-details">
            <h2>Contact Us</h2>
            {feedback.message && (
              <div
                className={`alert ${
                  feedback.type === "success" ? "alert-success" : "alert-danger"
                }`}
                role="alert"
              >
                <h2>{feedback.message}</h2>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={credentials.name}
                onChange={onChange}
              />

              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={credentials.email}
                onChange={onChange}
              />

              <label htmlFor="message" className="form-label">
                Message (up to 100 words):
              </label>
              <textarea
                className="form-control"
                name="message"
                rows="4"
                value={credentials.message}
                onChange={onChange}
              ></textarea>
              <p>Word Count: {wordCount(credentials.message)} / 100</p>

              <button type="submit" className="m-3 btn btn-success">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
