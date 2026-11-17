// server/controllers/aidRequestController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to provide realistic map coordinates around major relief zones if not provided
const resolveCoordinates = (locationStr, titleStr) => {
    const defaultCoords = [
        { lat: 28.6139, lng: 77.2090 }, // Central Delhi
        { lat: 28.5355, lng: 77.3910 }, // Noida
        { lat: 28.4595, lng: 77.0266 }, // Gurugram
        { lat: 19.0760, lng: 72.8777 }, // Mumbai
        { lat: 12.9716, lng: 77.5946 }, // Bangalore
        { lat: 13.0827, lng: 80.2707 }, // Chennai
        { lat: 22.5726, lng: 88.3639 }  // Kolkata
    ];
    let hash = 0;
    const str = (locationStr || '') + (titleStr || '');
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    const idx = Math.abs(hash) % defaultCoords.length;
    // Add minor jitter so multiple points in same city don't completely overlap
    const jitterLat = ((Math.abs(hash * 7) % 100) - 50) / 2500;
    const jitterLng = ((Math.abs(hash * 13) % 100) - 50) / 2500;
    return {
        lat: defaultCoords[idx].lat + jitterLat,
        lng: defaultCoords[idx].lng + jitterLng
    };
};

// 1. Post a new Aid Requisition / Need
exports.createAidRequest = async (req, res) => {
    try {
        const { title, type, quantity, location, urgency, description, latitude, longitude } = req.body;
        const requesterId = req.user.id;

        const validTypes = ['FOOD', 'MEDICAL_SUPPLY', 'SHELTER'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: `Invalid aid type. Must be one of: ${validTypes.join(', ')}` });
        }

        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity < 1) {
            return res.status(400).json({ error: "Quantity needed must be at least 1." });
        }

        const validUrgencies = ['NORMAL', 'HIGH', 'CRITICAL'];
        const evaluatedUrgency = validUrgencies.includes(urgency) ? urgency : 'NORMAL';

        let finalLat = parseFloat(latitude);
        let finalLng = parseFloat(longitude);
        if (isNaN(finalLat) || isNaN(finalLng)) {
            const fallback = resolveCoordinates(location, title);
            finalLat = fallback.lat;
            finalLng = fallback.lng;
        }

        const newRequest = await prisma.$transaction(async (tx) => {
            const request = await tx.aidRequest.create({
                data: {
                    title,
                    type,
                    quantity: parsedQuantity,
                    location: location || req.user.location || "Community Relief Camp",
                    urgency: evaluatedUrgency,
                    description: description || null,
                    latitude: finalLat,
                    longitude: finalLng,
                    requesterId
                },
                include: {
                    requester: {
                        select: { id: true, name: true, email: true, role: true, phone: true, location: true }
                    }
                }
            });

            await tx.auditLog.create({
                data: {
                    action: 'AID_REQUEST_CREATED',
                    description: `${req.user.name} broadcasted urgent need for ${parsedQuantity} units of [${type}] with [${evaluatedUrgency}] urgency.`,
                    userId: requesterId
                }
            });

            return request;
        });

        res.status(201).json(newRequest);
    } catch (error) {
        console.error("Error creating aid request:", error);
        res.status(500).json({ error: "Failed to broadcast aid request." });
    }
};

// 2. Fetch all Aid Requisitions (with search, filter, status)
exports.getAllAidRequests = async (req, res) => {
    try {
        const { type, urgency, status, search } = req.query;

        const where = {};

        if (status) {
            where.status = status.toUpperCase();
        } else {
            where.status = 'OPEN'; // default to open requests
        }

        if (type && ['FOOD', 'MEDICAL_SUPPLY', 'SHELTER'].includes(type.toUpperCase())) {
            where.type = type.toUpperCase();
        }

        if (urgency && ['NORMAL', 'HIGH', 'CRITICAL'].includes(urgency.toUpperCase())) {
            where.urgency = urgency.toUpperCase();
        }

        if (search && search.trim()) {
            where.OR = [
                { title: { contains: search.trim(), mode: 'insensitive' } },
                { location: { contains: search.trim(), mode: 'insensitive' } },
                { description: { contains: search.trim(), mode: 'insensitive' } }
            ];
        }

        const requests = await prisma.aidRequest.findMany({
            where,
            orderBy: [
                { urgency: 'desc' },
                { createdAt: 'desc' }
            ],
            include: {
                requester: {
                    select: { id: true, name: true, email: true, role: true, phone: true, location: true }
                },
                fulfilledBy: {
                    select: { id: true, name: true, email: true, role: true, phone: true, location: true }
                }
            }
        });

        res.status(200).json(requests);
    } catch (error) {
        console.error("Fetch aid requests error:", error);
        res.status(500).json({ error: "Failed to fetch aid requests." });
    }
};

// 3. Fulfill / Pledge Aid for a Community Request
exports.fulfillAidRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const fulfillerId = req.user.id;

        const existing = await prisma.aidRequest.findUnique({
            where: { id },
            include: { requester: true }
        });

        if (!existing) {
            return res.status(404).json({ error: "Aid request not found." });
        }

        if (existing.status !== 'OPEN') {
            return res.status(400).json({ error: "This request is no longer open." });
        }

        if (existing.requesterId === fulfillerId) {
            return res.status(400).json({ error: "You cannot fulfill your own aid request." });
        }

        const fulfilled = await prisma.$transaction(async (tx) => {
            const updated = await tx.aidRequest.update({
                where: { id },
                data: {
                    status: 'FULFILLED',
                    fulfilledById: fulfillerId
                },
                include: {
                    requester: {
                        select: { id: true, name: true, email: true, role: true, phone: true, location: true }
                    },
                    fulfilledBy: {
                        select: { id: true, name: true, email: true, role: true, phone: true, location: true }
                    }
                }
            });

            await tx.auditLog.create({
                data: {
                    action: 'AID_REQUEST_FULFILLED',
                    description: `${req.user.name} pledged and fulfilled aid requisition [${existing.title}] for ${existing.requester.name}.`,
                    userId: fulfillerId
                }
            });

            return updated;
        });

        res.status(200).json(fulfilled);
    } catch (error) {
        console.error("Fulfill aid request error:", error);
        res.status(500).json({ error: "Failed to fulfill aid request." });
    }
};

// 4. Cancel / Close Request
exports.deleteAidRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const existing = await prisma.aidRequest.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: "Aid request not found." });
        }

        if (existing.requesterId !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "You can only cancel your own aid requests." });
        }

        await prisma.aidRequest.delete({ where: { id } });

        res.status(200).json({ message: "Aid request removed successfully." });
    } catch (error) {
        console.error("Delete aid request error:", error);
        res.status(500).json({ error: "Failed to delete aid request." });
    }
};
