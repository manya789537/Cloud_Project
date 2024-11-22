const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schema and Model
const eventSchema = new mongoose.Schema({
    eventName: String,
    eventDate: String,
    eventDescription: String,
    photoPath: String,
});

const Event = mongoose.model('Event', eventSchema);

// File Upload Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, ${Date.now()}-${file.originalname}),
});

const upload = multer({ storage });

// API Endpoints
app.post('/api/events', upload.single('photo'), async (req, res) => {
    try {
        const { eventName, eventDate, eventDescription } = req.body;
        const newEvent = new Event({
            eventName,
            eventDate,
            eventDescription,
            photoPath: req.file.path,
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Start Server
app.listen(port, () => console.log(Server running on: {port}));