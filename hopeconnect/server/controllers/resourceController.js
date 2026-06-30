// server/controllers/resourceController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. LOG A NEW DONATION MATRIX NODE (With Multi-part Handling)
exports.createResource = async (req, res) => {
    try {
        const { title, type, quantity, description, isEmergency, location } = req.body;
        const donorId = req.user.id;

        // Enforce valid database categorization types matching your clean non-monetary enum
        const validTypes = ['FOOD', 'MEDICAL_SUPPLY', 'SHELTER'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: `Invalid resource classification type. Must be one of: ${validTypes.join(', ')}` });
        }

        // Multi-part FormData transmits everything as strings. Safely parse data structures:
        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity < 1) {
            return res.status(400).json({ error: "Quantity tracking dimension must be a positive integer value." });
        }

        const evaluatedEmergency = isEmergency === 'true' || isEmergency === true;

        // LOCAL STORAGE REDIRECT: Capture file properties generated locally by multer
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Run a database transaction to build both the resource record and its audit trail line
        const result = await prisma.$transaction(async (tx) => {
            const newResource = await tx.resource.create({
                data: {
                    title, 
                    type, 
                    quantity: parsedQuantity, 
                    isEmergency: evaluatedEmergency,
                    description: description || null, 
                    location: location || req.user.location || "Central Buffer", // Fallbacks to secure anchor locations
                    donorId,
                    imageUrl 
                }
            });

            await tx.auditLog.create({
                data: {
                    action: 'RESOURCE_CREATED',
                    description: `${req.user.name} logged ${parsedQuantity} units of physical asset classification [${type}].`,
                    resourceId: newResource.id,
                    userId: donorId
                }
            });

            return newResource;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating resource:", error);
        res.status(500).json({ error: "Failed to log resource entity onto the tracking ledger." });
    }
};

// 2. FETCH UNCLAIMED LOGISTICS BUFFERS (Fixes Frontend 404 Render Breaks)
exports.getAllResources = async (req, res) => {
    try {
        // Expose open, unclaimed logistics lines to verified receiving facilities
        const resources = await prisma.resource.findMany({
            where: { 
                status: 'PENDING',
                beneficiaryId: null 
            },
            orderBy: { createdAt: 'desc' }, // Displays newest available stock tracking parameters first
            include: { 
                donor: { 
                    select: { name: true, email: true, location: true } 
                } 
            }
        });
        
        res.status(200).json(resources);
    } catch (error) {
        console.error("Fetch buffer error:", error);
        res.status(500).json({ error: "Failed to stream active unclaimed metrics." });
    }
};

// 3. SECURE MATCHING LOGISTICS ACQUISITION (Express Claim Link Anchor)
exports.claimResource = async (req, res) => {
    try {
        const { id } = req.params;
        const beneficiaryId = req.user.id;

        const claimedResource = await prisma.$transaction(async (tx) => {
            const resource = await tx.resource.update({
                where: { id },
                data: { 
                    status: 'ACCEPTED', 
                    beneficiaryId 
                }
            });

            await tx.auditLog.create({
                data: {
                    action: 'RESOURCE_CLAIMED',
                    description: `${req.user.name} successfully established and locked a distribution matching route for [${resource.title}].`,
                    resourceId: id,
                    userId: beneficiaryId
                }
            });

            return resource;
        });

        res.status(200).json(claimedResource);
    } catch (error) {
        console.error("Claim matching routing error:", error);
        res.status(500).json({ error: "Failed to allocate routing matching parameters to destination facility." });
    }
};

// 4. RETENTION STATE MACHINE AUDITS
exports.updateResourceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // E.g., ACCEPTED, IN_TRANSIT, DELIVERED, CANCELLED
        const beneficiaryId = req.user.id;

        const updatedResource = await prisma.$transaction(async (tx) => {
            const resource = await tx.resource.update({
                where: { id },
                data: { status, beneficiaryId }
            });

            await tx.auditLog.create({
                data: {
                    action: `STATUS_UPDATED_TO_${status}`,
                    description: `${req.user.name} modified logistical distribution parameters status state to ${status}`,
                    resourceId: id,
                    userId: beneficiaryId
                }
            });

            return resource;
        });

        res.status(200).json(updatedResource);
    } catch (error) {
        console.error("Status state update deviation failure:", error);
        res.status(500).json({ error: "Failed to alter resource status metadata tracking lines." });
    }
};

// 5. EXTRACT AUDITING ACCOUNT TIMELINES LEDGER DATA
exports.getActivityHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const history = await prisma.resource.findMany({
            where: {
                OR: [
                    { donorId: userId },         // Items dispatched from this creator node
                    { beneficiaryId: userId }    // Items intercepted/claimed by this receiver node
                ]
            },
            orderBy: {
                createdAt: 'desc' // Orders timelines strictly with newest logs first
            }
        });

        res.status(200).json(history);
    } catch (error) {
        console.error("History logging extraction query failure:", error);
        res.status(500).json({ error: "Failed to compile verified activity tracking history accounts." });
    }
};