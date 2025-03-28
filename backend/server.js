const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./routes/api'); 

const app = express();
const PORT = 5001;

// ✅ Enable CORS for frontend at localhost:3000
app.use(cors({
    origin: "http://localhost:3000", // Allow requests from frontend
    methods: "GET,POST", // Allow these methods
    credentials: true // Allow cookies (if needed)
}));

// ✅ Middleware for parsing JSON & URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Register API routes before starting server
app.use('/api', apiRoutes);

// ✅ Start the server AFTER middleware & routes
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
