// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// Helper updated to RETURN the token after setting the cookie
const generateTokenAndSetCookie = (userId, role, res) => {
    const jwtSecret = process.env.JWT_SECRET || 'Abhishek@123';
    const token = jwt.sign({ id: userId, role }, jwtSecret, {
        expiresIn: '7d',
    });

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
    });

    return token;
};

// Get current logged-in user
exports.getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
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

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getMe:", error);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || typeof email !== 'string') {
            return res.status(400).json({ error: "Valid name, email address, and password are required." });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existingUser) return res.status(400).json({ error: "An account with this email already exists." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const validRoles = ['ADMIN', 'INDIVIDUAL_DONOR', 'RESTAURANT', 'HOSPITAL', 'NGO', 'OLD_AGE_HOME'];
        const userRole = (role && validRoles.includes(String(role).toUpperCase())) 
            ? String(role).toUpperCase() 
            : 'INDIVIDUAL_DONOR';

        const newUser = await prisma.user.create({
            data: {
                name: String(name).trim(),
                email: normalizedEmail,
                password: hashedPassword,
                role: userRole
            }
        });

        const token = generateTokenAndSetCookie(newUser.id, newUser.role, res);

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            verified: newUser.verified,
            phone: newUser.phone,
            location: newUser.location,
            bio: newUser.bio,
            avatarUrl: newUser.avatarUrl,
            token
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || typeof email !== 'string' || !password) {
            return res.status(400).json({ error: "Please provide both a valid email and password." });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        const token = generateTokenAndSetCookie(user.id, user.role, res);

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            verified: user.verified,
            phone: user.phone,
            location: user.location,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.logout = (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('jwt', '', { 
        maxAge: 0,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    });
    res.status(200).json({ message: "Logged out successfully" });
};

// --- UPDATED PROFILE CONTROLLER LOGIC ---
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { phone, location, bio, name } = req.body;

        // Base text update parameters
        let updateData = {
            name,      
            phone,
            location,
            bio
        };

        // If a new image binary was intercepted by the upload handler, append path string
        if (req.file) {
            updateData.avatarUrl = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { 
                id: true, 
                name: true, 
                email: true, 
                role: true, 
                phone: true, 
                location: true, 
                bio: true, 
                avatarUrl: true,
                verified: true
            }
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};