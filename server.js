const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port, fallback to 5000

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Update with your MongoDB connection URL)
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
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
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

// Start Server (Listen on 0.0.0.0 to make it externally accessible)
app.listen(port, '0.0.0.0', () => console.log(`Server running on http://localhost:${port}`)); // Listen on all network interfaces
