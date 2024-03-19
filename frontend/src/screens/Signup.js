import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const createUser = async (credentials) => {
  const response = await fetch("http://localhost:4000/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || 'Failed to sign up');
  }
  return response.json();
};

export default function Signup() {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const json = await createUser(credentials);
      alert("Account created successfully. Please login.");
      navigate("/login"); 
    } catch (error) {
      alert(error.message);
    }
  };

  const onChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  return (
    <div>
    <Navbar />

    <div className="signup-background">
      <div className="signup-container">
      <h2 className="text-center">Register New user</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Name</label>
            <input type="text" className="form-control" name="username" value={credentials.username} onChange={onChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" className="form-control" name="email" value={credentials.email} onChange={onChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" name="password" value={credentials.password} onChange={onChange} />
          </div>
          <button type="submit" className="btn btn-success">Submit</button>
          <Link to="/login" className="btn btn-danger">Already a user?</Link>
        </form>
      </div>
    </div>
    </div>
  );
}
