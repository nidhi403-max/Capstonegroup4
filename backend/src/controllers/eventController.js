const Event = require('../models/Events');

// Getting all events
const getAllEvents = async (req, res) => {
    try {
      const events = await Event.find();
      res.json(events);
    } catch (error) {
      res.status(500).send(error);
    }
  }

// Updating an event by ID
  const updateEvent = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
      if(updateData.price) updateData.price = Number(updateData.price);
  
      if(updateData.imageUrls && typeof updateData.imageUrls === 'string') {
        updateData.imageUrls = [updateData.imageUrls];
      }
  
      const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });
  
      if(!updatedEvent) {
        return res.status(404).send({ message: "Event not found" });
      }
  
      res.status(200).send(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).send(error);
    }
  }
const createEvent = async (req, res) => {
    try {
      const newEvent = new Event(req.body);
      Number(newEvent.price)
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  const deleteEvent = async (req, res) => {
    try {
      const { id } = req.params; 
      const deletedEvent = await Event.findByIdAndDelete(id);
  
      if (!deletedEvent) {
        return res.status(404).send({ message: "Event not found" });
      }
  
      res.status(200).send({ message: "Event successfully deleted", deletedEvent });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).send(error);
    }
  };
  
module.exports = { getAllEvents ,createEvent,updateEvent,deleteEvent};
