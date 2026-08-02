// server/server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path'); // ─── NEW: Added Path Utility ───

dotenv.config();
const app = express();

// 1. Set Security HTTP Headers
// UPDATED: Configured to allow cross-origin image streams to render on your frontend port
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Rate Limiting (Limits requests from the same IP)
const limiter = rateLimit({
    max: 100, // Limit each IP to 100 requests per windowMs
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: { error: "Too many requests from this IP, please try again in 15 minutes." }
});
// Apply rate limiter to all API routes
app.use('/api', limiter);

// Standard Middleware
app.use(express.json({ limit: '10kb' })); // Limits body payload size to prevent DOS attacks
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
}));

// ─── NEW: Serve Static Assets from Uploads Workspace ───
// This opens http://localhost:5001/uploads/filename to public requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/integrations', require('./routes/integrationRoutes'));

const PORT = process.env.PORT || 5000;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanOldData() {
    // This deletes the old resource records still holding the "FUNDS" value
    await prisma.resource.deleteMany({});
    console.log("Database logistics buffer cleared successfully!");
}
cleanOldData();

app.listen(PORT, () => {
    console.log(`HopeConnect Server running on port ${PORT}`);
});