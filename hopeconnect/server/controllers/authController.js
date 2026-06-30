// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// Helper updated to RETURN the token after setting the cookie
const generateTokenAndSetCookie = (userId, role, res) => {
    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV !== 'development', // HTTPS only in production
        sameSite: 'strict', // Prevents CSRF attacks
    });

    return token; // <-- Crucial: Return it so we can send it in the JSON response
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

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        });

        const token = generateTokenAndSetCookie(newUser.id, newUser.role, res);

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token // <-- Send token to React
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // 2. Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // 3. Generate token & set cookie (cleaner code using the helper)
        const token = generateTokenAndSetCookie(user.id, user.role, res);

        // 4. Send the user data back to React
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
            token // <-- Send token to React so localStorage works
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
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