import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
const BASE_URL = 'https://capstonegroup4.onrender.com';

const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", server: "" }); 
  const navigate = useNavigate();
  const { user, login, loginAsAdmin } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = { server: "" };
    if (!credentials.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!credentials.password) {
      newErrors.password = "Password is required.";
    } else if (credentials.password.length < 2) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 1;
  };

  const handleSubmit = async (e) => {
    // Preventing submission if validation fails
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const json = await loginUser(credentials);
      if (json.success) {
        login(json.user);
        if (json.user?.isAdmin) {
          console.log("isAdmin");
          loginAsAdmin(json.user);
          return navigate("/Admin");
        }
        navigate("/");
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          server: json.msg || "An error occurred. Please try again later.",
        }));
      }
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        server: "An error occurred. Please try again later.",
      }));
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (errors.server) {
      setErrors((prevErrors) => ({ ...prevErrors, server: "" }));
    }
  };
  return (
    <div>
      <Navbar />
      <div className="login-background">
        <div
          className="login-bg-img"
          style={{
            //Resource:https://www.pexels.com/photo/art-party-winter-abstract-7723722/
            backgroundImage: 'url("images/EventXo-2.png")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "65%",
            minHeight: "65%",
          }}
        ></div>
        <div className="login-container">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Login to Your Account</h2>
            {errors.server && (
              <div className="alert-danger">{errors.server}</div>
            )}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={credentials.email}
                onChange={onChange}
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className="alert-danger">{errors.email}</div>
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
                placeholder="Enter your password"
              />
              {errors.password && (
                <div className="alert-danger">{errors.password}</div>
              )}
            </div>
            <button type="submit" className="btn-submit">
              Login
            </button>
            <div className="signup-link">
              New to eventxo? <Link to="/signup">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
