require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// ✅ Enable CORS for Netlify Frontend
app.use(
    cors({
        origin: ["https://your-netlify-app.netlify.app"], // Replace with your actual Netlify frontend URL
        methods: "GET,POST",
        credentials: true,
    })
);

app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

// ✅ API Endpoint to Handle Form Submission
app.post("/api/messages", (req, res) => {
    console.log("Received request to /api/messages");
    console.log("Request body:", req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        console.log("Validation failed: All fields are required");
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
    db.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error("Error saving message:", err);
            return res.status(500).json({ error: "Failed to save message" });
        }
        console.log("Message saved successfully:", { name, email, message });
        res.status(200).json({ message: `Thank you, ${name}! Your message has been saved.` });
    });
});

// ✅ Start the Server (Use Render's PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
