const Booking = require("../models/Bookings");
const User = require("../models/User");
const Event = require("../models/Events");
const Venue = require("../models/Venue");


const getAllEvents = async (req, res) => {
    try {
      const bookings = await Booking.find().lean(); 
  
      if (bookings.length === 0) {
        return res.status(404).send({ message: "No bookings found" });
      }
  
      const bookingData = await Promise.all(bookings.map(async (booking) => {
        const user = await User.findById(booking.userId).lean(); 
        const event = await Event.findById(booking.eventId).lean(); 
        const venue = await Venue.findById(booking.venueId).lean(); 


  
        return {
          eventDate: booking.eventDate,
          decorationPackage: booking.decorationPackage,
          specialRequests: booking.specialRequests,
          totalPrice: booking.totalPrice,
          userEmail: user?.email, 
          userFirstName: user?.firstname,
          userLastName: user?.lastname,
          eventName:event?.title,
          venueName:venue?.name,
          venueCapacity:venue?.capacity,
          vanueLocation:venue?.location,
          accommodations: booking.accommodations
        };
      }));
  
      console.log(JSON.stringify(bookingData, null, 2));
  
      res.status(200).json(bookingData); 
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  };

const createBooking = async (req, res) => {
  try {
    console.log(req.body);

    const booking = new Booking({
      userId: req.body.userId,
      eventId: req.body.eventId,
      venueId:req.body.venueId,
      eventDate: req.body.eventDate,
      decorationPackage: req.body.decorationPackage,
      specialRequests: req.body.specialRequests,
      eventLocation: req.body.eventLocation,
      accommodations:req.body.accommodations,
      totalPrice: req.body.totalPrice,
    });
    const updateData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
    };
    const userId = req.body.userId;
    await booking.save();

    const userSchema = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!userSchema) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(201).send(booking);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

module.exports = { createBooking, getAllEvents };
