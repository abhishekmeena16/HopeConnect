// server/server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// Trust Render reverse-proxy headers for accurate IP rate limiting
app.set('trust proxy', 1);

// 1. Security HTTP Headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. UNIFIED CORS CONFIGURATION
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://hopeconnect-web.onrender.com'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        // Sanitize incoming origin by stripping any trailing slashes or subpaths
        const sanitizedOrigin = origin.split('/').slice(0, 3).join('/');

        if (allowedOrigins.includes(sanitizedOrigin) || sanitizedOrigin.endsWith('.onrender.com')) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS options globally (automatically intercepts and approves preflight OPTIONS requests)
app.use(cors(corsOptions));

// 3. Rate Limiting (150 requests per 15 minutes per IP)
const limiter = rateLimit({
    max: 150,
    windowMs: 15 * 60 * 1000,
    message: { error: "Too many requests from this IP, please try again in 15 minutes." }
});
app.use('/api', limiter);

// 4. Request Parsers & Cookie Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 5. Serve Static Assets from Uploads Workspace
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. Base Server Health Check
app.get('/', (req, res) => {
    res.status(200).json({ status: "online", message: "HopeConnect API server is running cleanly." });
});

// 7. Core Application Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

// Guarded loading for integration routes to prevent startup crashes
try {
    app.use('/api/integrations', require('./routes/integrationRoutes'));
} catch (error) {
    console.warn("Integration routes skipped or failed to load:", error.message);
}

// 8. Server Boot Engine
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`HopeConnect Server running on port ${PORT}`);
});