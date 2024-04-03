import React from 'react';
import './App.css';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Admin from './screens/Admin';
import Events from './screens/Events';
import Contact from './screens/contact';
import EventForm from './screens/EventForm';
import MyBookings from './screens/MyBookings';


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext'; 

//Defining different routes
function App() {
  return (
    <Router>
      <AuthProvider> 
        <div>
          <Routes>

            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/events" element={<Events/>}/>
            <Route exact path="/contact" element={<Contact/>}/>
            <Route exact path='/myBooking' element={<MyBookings/>}/>
            <Route exact path="/eventform" element={<EventForm/>}/>
            <Route exact path="/bookevent/:id" element={<EventForm/>}/>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/signup" element={<Signup/>}/>
            <Route exact path="/Admin" element={<Admin/>}/>

          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
