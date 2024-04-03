import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./signup.css";
import { colors } from "@mui/material";

const createUser = async (credentials) => {
  const response = await fetch("http://localhost:4000/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || "Failed to sign up");
  }
  return response.json();
};


const validateEmail = (email) => {
  // email validation
  return /\S+@\S+\.\S+/.test(email);
};

const validatePassword = (password) => {
  // Password must be at least 6 characters
  return password.length >= 6;
};

const validateUsername = (username) => {
  // Allows letters
  return /^[A-Za-z]+$/.test(username);
};

export default function Signup() {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState({
    username: "", // validation message
    email: "",
    password: "",
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset validation messages
    setValidationMessage({ username: "", email: "", password: "" });
    setErrorMessage("");

    if (!validateUsername(credentials.username)) {
      setValidationMessage((prev) => ({
        ...prev,
        username: "Username should contains characters",
      }));
      return;
    }
    // Validate email
    if (!validateEmail(credentials.email)) {
      setValidationMessage((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
      return;
    }

    // Validate password
    if (!validatePassword(credentials.password)) {
      setValidationMessage((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters long.",
      }));
      return;
    }

    try {
      await createUser(credentials);
      setIsSuccess(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const onChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  return (
    <div>
      <Navbar />
      <div className="signup-background">
        <div
          className="signup-bg-img"
          style={{
            //Resource:https://www.pexels.com/photo/art-party-winter-abstract-7723722/
            backgroundImage: 'url("/images/EventXo-2.png")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "65%",
            minHeight: "65%",
          }}
        ></div>
        <div className="signup-container">
          <h2 className="text-center">Register New User</h2>

          {isSuccess ? (
            <div className="alert alert-success" role="alert">
              Account created successfully. Redirecting to login...
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={credentials.username}
                    onChange={onChange}
                  />
                    {validationMessage.username && (
                    <small className="text-danger">
                      {validationMessage.username}
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={credentials.email}
                    onChange={onChange}
                  />
                  {validationMessage.email && (
                    <small className="text-danger">
                      {validationMessage.email}
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={credentials.password}
                    onChange={onChange}
                  />
                  {validationMessage.password && (
                    <small style={{colors:'red'}} className="text-danger">
                      {validationMessage.password}
                    </small>
                  )}
                </div>
                <button type="submit" className="btn btn-success">
                  Submit
                </button>
                <Link to="/login" className="btn btn-danger">
                  Already a user?
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
