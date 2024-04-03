import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./home.css"

const accordionData = [
  //Resource:https://pixabay.com/photos/wedding-couple-marriage-1836315/
  { id: 1, name: "Sarah & Michael", role: "Frontend", imgSrc: "./images/WeddingEvent2.jpeg" },
  //Resource:https://pixabay.com/photos/marriage-couple-wedding-love-4226896/
  { id: 2, name: "Ava & Ethan", role: "Backend", imgSrc: "./images/WeddingEvent3.jpeg" },
  //Resource:https://unsplash.com/photos/photo-of-a-man-and-woman-newly-wedding-holding-a-balloons-mW8IZdX7n8E
  { id: 3, name: "Emily & Danie", role: "Backend", imgSrc: "./images/WeddingEvent6.avif" },
  //Resource:pixabay.com/photos/child-smile-baby-first-birthday-5111077/
  { id: 4, name: "Happy Lily's Birthday", role: "Backend", imgSrc: "./images/Birthday5.jpeg" },
  //Resource:https://pixabay.com/photos/birthday-party-family-celebration-7361026/
  { id: 5, name: "Cute Amelia's Birthday", role: "Designer", imgSrc: "./images/birthday-party4.jpeg" },
  //Resource:https://www.pexels.com/photo/photo-of-a-baby-playing-with-a-birthday-cake-16322562/
  { id: 6, name: "Emma's First Birthday", role: "Designer", imgSrc: "./images/birthday.jpg" },
  //Resource:https://unsplash.com/photos/audience-in-a-conference-EVgsAbL51Rk/
  { id: 7, name: "Executive Forum Gathering", role: "Designer", imgSrc: "./images/Corporate1.avif" },
  //Resource:https://unsplash.com/photos/people-gathering-inside-the-building-BdV23FLkmxQ/
  { id: 8, name: "Innovation Exchange", role: "Designer", imgSrc: "./images/Corporate2.avif" },
  //Resource:https://unsplash.com/photos/unknown-persons-sitting-indoors-wn7dOzUh3Rs
  { id: 9, name: "NexusConnect", role: "Designer", imgSrc: "./images/Corporate3.avif" },

];

const AccordionItem = ({ name, role, imgSrc }) => (
  <li>
    <img src={imgSrc} alt={name} />
    <div className="content">
      <span>
        <h2>{name}</h2>
      </span>
    </div>
  </li>
);

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleEventClick = () => {
    navigate(`/events`);
  };

  return (
    <div>
      <Navbar />
      <section class="body__bg_gradient section__codepen">
  <div class="hero container">
    <div class="hero__image">
       <div class="hero__image_img">
        {/* {Resource:https://unsplash.com/photos/selective-focus-photography-white-and-pink-isle-flower-arrangement-fJzmPe-a0eU} */}
          <img src="/images/hero.jpg" alt="Aerial Photography of Cinque Terre in Italy"/>
       </div>
      <div class="img__after_dot"></div>     
    </div>
    <div className="link" onClick={handleEventClick} style={{ cursor: 'pointer', display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center" }}>
            <span className="link__arrow">→</span>
            <span className="link__title">Explore Events</span>
          </div>
    <div class="hero__title">
      <h1>
        <span class="span__before_dot">Make</span> 
        <span>Moments</span> 
        <span class="title__bg_grandient">Special</span>
      </h1>
    </div>
 
      
      </div>


<div className="carousel">
      <ul className="accordion">
        {accordionData.map((item) => (
          <AccordionItem key={item.id} {...item} />
        ))}
      </ul>
      </div>
      </section>
    
      <Footer />
    </div>
  );
}
