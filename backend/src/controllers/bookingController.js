const Booking = require("../models/Bookings");
const User = require("../models/User");
const Event = require("../models/Events");
const Venue = require("../models/Venue");
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const axios = require('axios');
const { createAndUploadPDF } = require('./pdfGenerate'); 

const stripe = require('stripe')(STRIPE_SECRET_KEY);

// Getting all bookings

const getAllEvents = async (req, res) => {
  try {
    const bookings = await Booking.find().lean(); 

    if (bookings.length === 0) {
      return res.status(404).send({ message: "No bookings found" });
    }
    // Fetching  details for each booking
    const bookingData = await Promise.all(bookings.map(async (booking) => {
      const user = await User.findById(booking.userId).lean(); 
      const event = await Event.findById(booking.eventId).lean(); 
      const venue = await Venue.findById(booking.venueId).lean(); 

      return {
        bookingId:booking._id,
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
        venueLocation:venue?.location,
        vanueStatus:venue?.status,
        accommodations: booking.accommodations,
        status:booking?.status
      };
    }));


    res.status(200).json(bookingData); 
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// Creating a new booking

const createBooking = async (req, res) => {
  try {


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
      status:"Review",
    });
    const updateData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
    };

    const venueData = {
      status:"Booked",
    }
    const userId = req.body.userId;
    const venueId = req.body.venueId;
    await booking.save();

    const userSchema = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    const venueSchema = Venue.findByIdAndUpdate(venueId, venueData);

    if (!userSchema) {
      return res.status(404).send({ message: "User not found" });
    }
    if (!venueSchema) {
      return res.status(404).send({ message: "venue not found" });
    }

    res.status(201).send(booking);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
// Updating booking status
const updateStatus = async (req, res) => {
  const { bookingId, status, comment } = req.body;
  console.log(req.body)

  if (!bookingId || !status) {
    return res.status(400).send({ message: "Booking ID and status are required." });
  }

  try {
    const update = { status };
    if (comment !== undefined && comment !== '') {
      console.log("adding comment")
      update.comment = comment;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      update,
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).send({ message: "Booking not found." });
    }

    res.status(200).send(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

// Getting event details by ID
const getEventById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const bookings = await Booking.find({ userId: user._id }).lean();

    if (bookings.length === 0) {
      return res.status(404).send({ message: "No bookings found for this user" });
    }
    const sendEmail = async (emailParams) => {
      try {


        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
          service_id: 'service_ktwqzr8',
          template_id: 'template_6atrwdj',
          user_id: 'UdWcIFHzOFb9W8lp7',
          template_params: emailParams,
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
    
        console.log('Email sent successfully:', response.data);
        return { success: true, data: response.data };
    
      } catch (error) {
        console.error('Failed to send email:', error.response ? error.response.data : error.message);
        return { success: false, error: error.toString() };
      }
    };

    const bookingData = await Promise.all(bookings.map(async (booking) => {
      let bookingDataForMail = {

      }
      const [event, venue, session] = await Promise.all([
        Event.findById(booking.eventId).lean(),
        Venue.findById(booking.venueId).lean(),
        booking.paymentId ? stripe.checkout.sessions.retrieve(booking.paymentId).catch(err => {
          console.error("Error retrieving Stripe session:", err);
          return null;
        }) : Promise.resolve(null)
      ]);
      bookingDataForMail.eventName = event;
      bookingDataForMail.venue = venue;
      bookingDataForMail.booking = booking;
      bookingDataForMail.user = user

      

      let paymentStatus = session ? session.payment_status : 'Not Available';
      if (paymentStatus === 'paid') {
        await Promise.all([
          Booking.findByIdAndUpdate(booking._id, { $set: { status: 'Booked' } }, { new: true }),
          Venue.findByIdAndUpdate(booking.venueId, { $set: { status: 'Booked' } }, { new: true })
        ]);


        if (!booking.isEmailSend) {

          const pdfUrl = await createAndUploadPDF(bookingDataForMail);
          console.log(pdfUrl)

          
          booking.pdfUrl = pdfUrl;
          console.log(pdfUrl)
    
          console.log('Booking ID:', booking._id);
          console.log(bookingDataForMail)
          const emailParams = {
            to_name: bookingDataForMail.user.username, 
            from_name: "EventXO", 
            to_email: bookingDataForMail.user.email,
            eventName: bookingDataForMail.eventName.title,
            eventDate: new Date(bookingDataForMail.booking.eventDate).toLocaleDateString("en-US"), 
            venueName: bookingDataForMail.venue.name,
            venueLocation: bookingDataForMail.venue.location,
            venueCapacity: bookingDataForMail.venue.capacity.toString(), 
            decorationPackage: bookingDataForMail.booking.decorationPackage,
            specialRequests: bookingDataForMail.booking.specialRequests,
            accommodations: bookingDataForMail.booking.accommodations.join(", "),
            totalPayment: bookingDataForMail.booking.totalPrice.toString(),
            status: bookingDataForMail.booking.status,
            comment: bookingDataForMail.booking.comment,
            pdfUrl: pdfUrl 
          };
          
          console.log(emailParams);
          
      
          const emailResult = await sendEmail(emailParams);
          if (emailResult.success) {
            console.log('Email sent successfully:', emailResult.data);
            await Booking.findByIdAndUpdate(booking._id, { $set: { isEmailSend: true } }, { new: true });
          } else {
            console.error('Failed to send email:', emailResult.error);
          }
        }
      }
      

      return {
        eventId: booking.eventId,
        venueId: booking.venueId,
        bookingId: booking._id,
        eventDate: booking.eventDate,
        decorationPackage: booking.decorationPackage,
        specialRequests: booking.specialRequests,
        totalPrice: booking.totalPrice,
        userEmail: user.email,
        userFirstName: user.firstname,
        userLastName: user.lastname,
        eventName: event?.title,
        venueName: venue?.name,
        venueCapacity: venue?.capacity,
        venueLocation: venue?.location,
        venueStatus: venue?.status,
        accommodations: booking.accommodations,
        status: booking.status,
        comment:booking.comment,
        eventTitle: event?.title,
        venueName: venue?.name,
        venueCapacity: venue?.capacity,
        venueStatus: venue?.status,
        paymentStatus // Include the payment status
      };
    }));
    console.log(bookingData)

    res.status(200).json(bookingData);
  } catch (error) {
    console.error("Error in getEventById:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};



const makePayment = async (req, res) => {
  const {eventName,decorationPackage, totalPrice,bookingId } = req.body; 
  console.log(req.body)


  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: eventName, 
          description: decorationPackage, 
        },
        unit_amount: Math.round(totalPrice * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'http://localhost:3000/',
    cancel_url: 'https://yourdomain.com/cancel',
    metadata: {
      eventName: eventName,
      decorationPackage: decorationPackage,
      customField: "customValue" 
    },
  });
  const sessionId = session.id;
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId, 
      { $set: { paymentId: sessionId } },
      { new: true }
    );
  
    console.log("Updated Booking:", updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
  }
  

  res.json({ id: session.id });
};
module.exports = { createBooking, getAllEvents,updateStatus ,getEventById,makePayment};
