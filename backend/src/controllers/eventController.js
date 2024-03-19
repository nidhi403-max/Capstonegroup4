const Event = require('../models/Events');

const getAllEvents = async (req, res) => {
    try {
      const events = await Event.find();
      res.json(events);
    } catch (error) {
      res.status(500).send(error);
    }
  }

const createEvent = async (req, res) => {
    try {
      const newEvent = new Event(req.body);
      console.log(newEvent)
      Number(newEvent.price)
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    } catch (error) {
      res.status(500).send(error);
    }
  };
module.exports = { getAllEvents ,createEvent};
