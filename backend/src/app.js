require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const app = express();

app.use(session({
    secret: 'eventXo',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }));

app.use(cors())
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

// console.log(process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');

    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

// Routes
const venueRoutes = require('./routes/venueRoutes');
const packageRoutes = require('./routes/packageRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes = require('./routes/eventRoutes');
const emailRoutes = require('./routes/emailRoutes');



app.use('/venues', venueRoutes);
app.use('/packages', packageRoutes);
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/booking', bookingRoutes);
app.use('/email',emailRoutes);



// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
