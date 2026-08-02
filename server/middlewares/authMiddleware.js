// server/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// 1. Verify if the user is authenticated
exports.protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true, role: true, verified: true } // Don't return password
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
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