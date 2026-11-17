// server/server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();
const app = express();

// Trust reverse-proxy headers for rate limiting
app.set('trust proxy', 1);

// 1. Set Security HTTP Headers with cross-origin resource policy
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Comprehensive CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5001',
    'https://hopeconnect-6gmo.onrender.com',
    'https://hopeconnect-web.onrender.com'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const sanitized = origin.split('/').slice(0, 3).join('/');
        if (allowedOrigins.includes(sanitized) || sanitized.endsWith('.onrender.com') || sanitized.includes('localhost')) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Rate Limiting (150 requests per 15 minutes per IP)
const limiter = rateLimit({
    max: 200,
    windowMs: 15 * 60 * 1000,
    message: { error: "Too many requests from this IP, please try again in 15 minutes." }
});
app.use('/api', limiter);

// 4. Standard Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 5. Ensure Uploads Directory Exists & Serve Static Assets with CORS
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(uploadsPath));

// 6. Base Health Check
app.get('/', (req, res) => {
    res.status(200).json({ status: "online", message: "HopeConnect API server running cleanly." });
});

// 7. Core Application Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/aid-requests', require('./routes/aidRequestRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Guarded loading for integration routes
try {
    app.use('/api/integrations', require('./routes/integrationRoutes'));
} catch (error) {
    console.warn("Integration routes skipped or failed to load:", error.message);
}

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`HopeConnect Server running on port ${PORT}`);
});