// server/controllers/messageController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Send a new direct / logistics message
exports.sendMessage = async (req, res) => {
    try {
        const { content, receiverId, resourceId } = req.body;
        const senderId = req.user.id;

        if (!content || !content.trim()) {
            return res.status(400).json({ error: "Message content cannot be blank." });
        }

        if (!receiverId) {
            return res.status(400).json({ error: "Receiver ID is required." });
        }

        if (receiverId === senderId) {
            return res.status(400).json({ error: "You cannot message yourself." });
        }

        // Verify receiver exists
        const receiver = await prisma.user.findUnique({
            where: { id: receiverId }
        });

        if (!receiver) {
            return res.status(404).json({ error: "Receiver does not exist." });
        }

        const message = await prisma.message.create({
            data: {
                content: content.trim(),
                senderId,
                receiverId,
                resourceId: resourceId || null
            },
            include: {
                sender: { select: { id: true, name: true, role: true, avatarUrl: true } },
                receiver: { select: { id: true, name: true, role: true, avatarUrl: true } },
                resource: { select: { id: true, title: true, type: true, status: true } }
            }
        });

        res.status(201).json(message);
    } catch (error) {
        console.error("Send message error:", error);
        res.status(500).json({ error: "Failed to transmit message." });
    }
};

// 2. Get messages in a conversation with a specific user or resource
exports.getMessages = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const { otherUserId, resourceId } = req.query;

        const where = {};

        if (resourceId) {
            where.resourceId = resourceId;
        } else if (otherUserId) {
            where.OR = [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId }
            ];
        } else {
            return res.status(400).json({ error: "Provide either otherUserId or resourceId." });
        }

        const messages = await prisma.message.findMany({
            where,
            orderBy: { createdAt: 'asc' },
            include: {
                sender: { select: { id: true, name: true, role: true, avatarUrl: true } },
                receiver: { select: { id: true, name: true, role: true, avatarUrl: true } },
                resource: { select: { id: true, title: true, type: true, status: true } }
            }
        });

        // Mark incoming messages as read
        await prisma.message.updateMany({
            where: {
                receiverId: currentUserId,
                senderId: otherUserId,
                read: false
            },
            data: { read: true }
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({ error: "Failed to retrieve conversation stream." });
    }
};

// 3. Get all conversation threads summary for current user
exports.getConversations = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const allMessages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUserId },
                    { receiverId: currentUserId }
                ]
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: { select: { id: true, name: true, role: true, avatarUrl: true, location: true } },
                receiver: { select: { id: true, name: true, role: true, avatarUrl: true, location: true } },
                resource: { select: { id: true, title: true, type: true, status: true } }
            }
        });

        // Group by the counterpart user
        const threadMap = new Map();

        allMessages.forEach(msg => {
            const isSender = msg.senderId === currentUserId;
            const counterpart = isSender ? msg.receiver : msg.sender;
            if (!counterpart) return;

            if (!threadMap.has(counterpart.id)) {
                threadMap.set(counterpart.id, {
                    partner: counterpart,
                    lastMessage: msg,
                    resource: msg.resource,
                    unreadCount: 0
                });
            }

            if (msg.receiverId === currentUserId && !msg.read) {
                threadMap.get(counterpart.id).unreadCount++;
            }
        });

        const threads = Array.from(threadMap.values());
        res.status(200).json(threads);
    } catch (error) {
        console.error("Get threads error:", error);
        res.status(500).json({ error: "Failed to retrieve active logistics threads." });
    }
};
