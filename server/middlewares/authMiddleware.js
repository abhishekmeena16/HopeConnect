// server/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// 1. Verify if the user is authenticated
exports.protect = async (req, res, next) => {
    try {
        let token = req.cookies?.jwt;

        // Fallback to Bearer token in Authorization header
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const jwtSecret = process.env.JWT_SECRET || 'Abhishek@123';
        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { 
                id: true, 
                name: true, 
                email: true, 
                role: true, 
                verified: true,
                phone: true,
                location: true,
                bio: true,
                avatarUrl: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        return res.status(401).json({ error: "Unauthorized - Invalid or expired session" });
    }
};

// 2. Role-Based Access Control (RBAC) Wrapper
exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Forbidden - ${req.user.role} is not authorized to access this route` 
            });
        }
        next();
    };
};