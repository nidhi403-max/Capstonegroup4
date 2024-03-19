import React, { useState, useEffect } from 'react';
import api from '../api';
//import './UserContainer.css'; // Import custom CSS file for additional styling

function UserContainer() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        // Fetch users from the backend
        api.get('/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddUser = () => {
        api.post('/users', formData)
            .then(response => {
                setUsers([...users, response.data]);
                setFormData({ username: '', email: '', password: '' });
            })
            .catch(error => console.error('Error adding user:', error));
    };

    const handleUpdateUser = () => {
        if (selectedUserId) {
            api.put(`/users/${selectedUserId}`, formData)
                .then(response => {
                    const updatedUsers = users.map(user =>
                        user._id === selectedUserId ? response.data : user
                    );
                    setUsers(updatedUsers);
                    setFormData({ username: '', email: '', password: '' });
                    setSelectedUserId(null);
                })
                .catch(error => console.error('Error updating user:', error));
        }
    };

    const handleDeleteUser = (userId) => {
        api.delete(`/users/${userId}`)
            .then(() => {
                const updatedUsers = users.filter(user => user._id !== userId);
                setUsers(updatedUsers);
                setFormData({ username: '', email: '', password: '' });
                setSelectedUserId(null);
            })
            .catch(error => console.error('Error deleting user:', error));
    };

    const handleEditUser = (user) => {
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
        });
        setSelectedUserId(user._id);
    };

    return (
        <div className="user-container container mt-4">
            <h2>User Form</h2>
            <form>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <button type="button" onClick={handleAddUser} className="btn btn-primary">Add User</button>
                <button type="button" onClick={handleUpdateUser} className="btn btn-success ml-2">Update User</button>
            </form>

            <h2>User List</h2>
            <ul className="list-group">
                {users.map(user => (
                    <li key={user._id} className="list-group-item">
                        <div>
                            <span className="user-username">{user.username}</span>
                            <span className="user-email">{user.email}</span>
                        </div>
                        <div className="user-actions">
                            <button onClick={() => handleEditUser(user)} className="btn btn-warning btn-sm">Edit</button>
                            <button onClick={() => handleDeleteUser(user._id)} className="btn btn-danger btn-sm ml-2">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>


        </div>
    );
}

export default UserContainer;
