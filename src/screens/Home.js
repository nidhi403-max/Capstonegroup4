import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


export default function Home() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <div class="position-relative">
          <img
          // Source : https://www.pexels.com/photo/banquet-table-in-stylish-loft-restaurant-4577408/
            src="images/home.jpg"
            alt="Home Page Image"
            style={{ width: "100%", height: "auto", maxHeight: "100vh" }}
          />
        </div>
        <div class="position-absolute top-100 start-50 translate-middle">
          <button type="button" class="btn btn-outline-light">
            Book Now!
          </button>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
