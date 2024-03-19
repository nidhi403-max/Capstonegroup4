import React, { useState, useEffect } from 'react';
import api from '../api';
//import './PackageContainer.css'; // Import custom CSS file for additional styling

function PackageContainer() {
    const [packages, setPackages] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
    });
    const [selectedPackageId, setSelectedPackageId] = useState(null);

    useEffect(() => {
        api.get('/packages')
            .then(response => setPackages(response.data))
            .catch(error => console.error('Error fetching packages:', error));
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddPackage = () => {
        api.post('/packages', formData)
            .then(response => {
                setPackages([...packages, response.data]);
                setFormData({ name: '', price: 0 });
            })
            .catch(error => console.error('Error adding package:', error));
    };

    const handleUpdatePackage = () => {
        if (selectedPackageId) {
            api.put(`/packages/${selectedPackageId}`, formData)
                .then(response => {
                    const updatedPackages = packages.map(pkg =>
                        pkg._id === selectedPackageId ? response.data : pkg
                    );
                    setPackages(updatedPackages);
                    setFormData({ name: '', price: 0 });
                    setSelectedPackageId(null);
                })
                .catch(error => console.error('Error updating package:', error));
        }
    };

    const handleDeletePackage = (packageId) => {
        api.delete(`/packages/${packageId}`)
            .then(() => {
                const updatedPackages = packages.filter(pkg => pkg._id !== packageId);
                setPackages(updatedPackages);
                setFormData({ name: '', price: 0 });
                setSelectedPackageId(null);
            })
            .catch(error => console.error('Error deleting package:', error));
    };

    const handleEditPackage = (packageItem) => {
        setFormData({
            name: packageItem.name,
            price: packageItem.price,
        });
        setSelectedPackageId(packageItem._id);
    };

    return (
        <div className="package-container container mt-4">
            <h2>Package Form</h2>
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
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <button type="button" onClick={handleAddPackage} className="btn btn-primary">Add Package</button>
                <button type="button" onClick={handleUpdatePackage} className="btn btn-success ml-2">Update Package</button>
            </form>

            <h2>Package List</h2>
            <ul className="list-group">
                {packages.map(packageItem => (
                    <li key={packageItem._id} className="list-group-item">
                        <div>
                            <span className="package-name">{packageItem.name}</span>
                            <span className="package-price">${packageItem.price}</span>
                        </div>
                        <div className="package-actions">
                            <button onClick={() => handleEditPackage(packageItem)} className="btn btn-warning btn-sm">Edit</button>
                            <button onClick={() => handleDeletePackage(packageItem._id)} className="btn btn-danger btn-sm ml-2">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>


        </div>
    );
}

export default PackageContainer;
