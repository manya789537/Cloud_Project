const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// File Upload Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,        // RDS endpoint
    user: process.env.DB_USER,        // RDS username
    password: process.env.DB_PASSWORD,// RDS password
    database: process.env.DB_NAME,    // RDS database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// API Endpoints
app.post('/api/events', upload.single('photo'), async (req, res) => {
    try {
        const { eventName, eventDate, eventDescription } = req.body;
        const photoPath = req.file.path;

        // Save event data to MySQL
        const [result] = await pool.query(
            `INSERT INTO events (eventName, eventDate, eventDescription, photoPath) VALUES (?, ?, ?, ?)`,
            [eventName, eventDate, eventDescription, photoPath]
        );

        res.status(201).json({ message: 'Event created successfully!', eventId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Start Server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
