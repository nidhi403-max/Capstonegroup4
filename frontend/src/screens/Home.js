import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./home.css"

const accordionData = [
  //Resource:https://unsplash.com/photos/man-in-gray-suit-and-woman-in-white-wedding-dress-1Bs2sZ9fD2Q
  { id: 1, name: "Sarah & Michael", role: "Frontend", imgSrc: "./images/Wedding1.jpg" },
  //Resource:https://unsplash.com/photos/bride-and-groom-standing-beside-brown-wooden-wall-JFAPl7brL6U
  { id: 2, name: "Ava & Ethan", role: "Backend", imgSrc: "./images/Wedding2.jpg" },
  //Resource:https://unsplash.com/photos/photo-of-a-man-and-woman-newly-wedding-holding-a-balloons-mW8IZdX7n8E
  { id: 3, name: "Emily & Danie", role: "Backend", imgSrc: "./images/Wedding3.jpg" },
  //Resource:https://unsplash.com/photos/selective-focus-photography-of-cake-L88iz147ZFY
  { id: 4, name: "Happy John's Birthday", role: "Backend", imgSrc: "./images/birthday3.jpg" },
  //Resource:https://unsplash.com/photos/toddler-looking-up-while-holding-candycane-in-party-UFdLg0BX5aM
  { id: 5, name: "Cute Amelia's Birthday", role: "Designer", imgSrc: "./images/birthday2.jpg" },
  //Resource:https://www.pexels.com/photo/photo-of-a-baby-playing-with-a-birthday-cake-16322562/
  { id: 6, name: "Emma's First Birthday", role: "Designer", imgSrc: "./images/birthday.jpg" },
  //Resource:https://unsplash.com/photos/people-sitting-on-chair-ohNCIiKVT1g
  { id: 7, name: "Executive Forum Gathering", role: "Designer", imgSrc: "./images/corporate1.jpg" },
  //Resource:https://unsplash.com/photos/audience-in-a-conference-EVgsAbL51Rk
  { id: 8, name: "Innovation Exchange", role: "Designer", imgSrc: "./images/corporate.jpg" },
  //Resource:https://unsplash.com/photos/five-person-standing-while-talking-each-other-ZDN-G1xBWHY
  { id: 9, name: "NexusConnect", role: "Designer", imgSrc: "./images/corporate2.jpg" },

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
