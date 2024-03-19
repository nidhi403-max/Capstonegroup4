const Venue = require('../models/Venue');

const getAllVenues = async (req, res) => {
    try {
        const venues = await Venue.find();
        res.json(venues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createVenue = async (req, res) => {
    const venue = new Venue(req.body);
    try {
        const newVenue = await venue.save();
        res.status(201).json(newVenue);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateVenue = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedVenue = await Venue.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedVenue) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        res.json(updatedVenue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteVenue = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedVenue = await Venue.findByIdAndDelete(id);

        if (!deletedVenue) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        res.json({ message: 'Venue deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllVenues, createVenue, updateVenue, deleteVenue };
