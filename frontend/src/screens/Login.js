import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from '../context/AuthContext';

const loginUser = async (credentials) => {
  const response = await fetch("http://localhost:4000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { user, login } = useAuth(); // Destructure login from useAuth

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const json = await loginUser(credentials);
      if (json.success) {
        login(json.user); // Use login from AuthContext
        navigate("/");
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    }
  };

  const onChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  return (
    <div>
      <Navbar />
      <div className="login-background">
        <div className="login-container">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Login to Your Account</h2>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" className="form-control" name="email" value={credentials.email} onChange={onChange} placeholder="Enter your email"/>
              <small className="form-text">We'll never share your email with anyone else.</small>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" name="password" value={credentials.password} onChange={onChange} placeholder="Enter your password"/>
            </div>
            <button type="submit" className="btn-submit">Login</button>
            <div className="signup-link">
              New to eventxo? <Link to="/signup">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
