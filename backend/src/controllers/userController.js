const User = require('../models/User');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new user
const createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Updating an existing user
const updateUser = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Deleting an existing user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User signup
const signup = async(req,res)=>{
    const { username, email, password } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, msg: 'User already exists' });
      }
  
      user = new User({ username, email, password });
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      await user.save();
  
      res.status(201).json({ success: true, msg: 'User registered successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, msg: 'Server error' });
    }
}

// User login
const login = async(req,res)=>{
    const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: 'Invalid Credentials' });
    }

    req.session.userId = user._id;

    res.json({ success: true, msg: 'User logged in successfully', user: { id: user._id, username: user.username, email: user.email,isAdmin:user?.isAdmin } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
}

module.exports = { getAllUsers, createUser, updateUser, deleteUser, signup, login };
