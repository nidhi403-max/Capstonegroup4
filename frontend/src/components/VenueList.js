import React, { useState, useEffect } from 'react';
import api from '../api';
//import './VenueContainer.css'; // Import custom CSS file for additional styling

function VenueContainer() {
    const [venues, setVenues] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        capacity: 0,
        location: '',
    });
    const [selectedVenueId, setSelectedVenueId] = useState(null);

    useEffect(() => {
        api.get('/venues')
            .then(response => setVenues(response.data))
            .catch(error => console.error('Error fetching venues:', error));
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddVenue = () => {
        api.post('/venues', formData)
            .then(response => {
                setVenues([...venues, response.data]);
                setFormData({ name: '', capacity: 0, location: '' });
            })
            .catch(error => console.error('Error adding venue:', error));
    };

    const handleUpdateVenue = () => {
        if (selectedVenueId) {
            api.put(`/venues/${selectedVenueId}`, formData)
                .then(response => {
                    const updatedVenues = venues.map(venue =>
                        venue._id === selectedVenueId ? response.data : venue
                    );
                    setVenues(updatedVenues);
                    setFormData({ name: '', capacity: 0, location: '' });
                    setSelectedVenueId(null);
                })
                .catch(error => console.error('Error updating venue:', error));
        }
    };

    const handleDeleteVenue = (venueId) => {
        api.delete(`/venues/${venueId}`)
            .then(() => {
                const updatedVenues = venues.filter(venue => venue._id !== venueId);
                setVenues(updatedVenues);
                setFormData({ name: '', capacity: 0, location: '' });
                setSelectedVenueId(null);
            })
            .catch(error => console.error('Error deleting venue:', error));
    };

    const handleEditVenue = (venue) => {
        setFormData({
            name: venue.name,
            capacity: venue.capacity,
            location: venue.location,
        });
        setSelectedVenueId(venue._id);
    };

    return (
        <div className="venue-container container mt-4">
            <h2>Venue Form</h2>
            <form>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Capacity:</label>
                    <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <button type="button" onClick={handleAddVenue} className="btn btn-primary">Add Venue</button>
                <button type="button" onClick={handleUpdateVenue} className="btn btn-success ml-2">Update Venue</button>
            </form>

            <h2>Venue List</h2>
            <ul className="list-group">
                {venues.map(venue => (
                    <li key={venue._id} className="list-group-item">
                        <div>
                            <span className="venue-name">{venue.name}</span>
                            <span className="venue-info">Capacity: {venue.capacity} | Location: {venue.location}</span>
                        </div>
                        <div className="venue-actions">
                            <button onClick={() => handleEditVenue(venue)} className="btn btn-warning btn-sm">Edit</button>
                            <button onClick={() => handleDeleteVenue(venue._id)} className="btn btn-danger btn-sm ml-2">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>


        </div>
    );
}

export default VenueContainer;
