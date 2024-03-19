import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleEventClick = () => {
    navigate(`/events`);
  };
  return (
    <div>
      <Navbar />
      <div className="position-relative">
        <img src="/home.jpg" alt="Home Page Image" style={{ width: "100%", height: "auto", maxHeight: "100vh" }}/>
        <div className="position-absolute top-50 start-50 translate-middle">
          <button onClick={() => handleEventClick()} type="button" className="btn btn-outline-light">
            Book Now!
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
