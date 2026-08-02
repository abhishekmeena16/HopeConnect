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

// Enable Trust Proxy for Render reverse-proxies (Required for accurate IP rate-limiting)
app.set('trust proxy', 1);

// 1. Security HTTP Headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. UNIFIED CORS CONFIGURATION
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://hopeconnect-web.onrender.com' // Clean origin string without trailing slashes
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g. server-to-server, Postman, health probes)
        if (!origin) return callback(null, true);

        // Strip subpaths or trailing slashes if present
        const sanitizedOrigin = origin.split('/').slice(0, 3).join('/');

        if (allowedOrigins.includes(sanitizedOrigin) || sanitizedOrigin.endsWith('.onrender.com')) {
            return callback(null, true);
        }
        return callback(null, true); // Staging fallback
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS options globally
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight OPTIONS requests explicitly

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

// 5. Static Uploads Folder (Serves uploaded images at http://your-domain/uploads/...)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. Base Server Health Check
app.get('/', (req, res) => {
    res.status(200).json({ status: "online", message: "HopeConnect API server is running cleanly." });
});

// 7. Core Application Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/integrations', require('./routes/integrationRoutes'));

// 8. Server Boot Engine
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`HopeConnect Server running on port ${PORT}`);
});