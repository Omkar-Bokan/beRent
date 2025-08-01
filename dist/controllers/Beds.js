"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBed = exports.getBedById = exports.getAllBeds = exports.createBed = void 0;
const beds_1 = require("../model/beds"); // Ensure this path is correct
const TenantSchema_1 = require("../model/TenantSchema");
const createBed = async (req, res) => {
    try {
        const bed = await beds_1.Bed.create(req.body);
        res.status(201).json({
            success: true,
            message: "Bed created successfully.",
            data: bed
        });
    }
    catch (error) {
        console.error('Error creating bed:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({
                success: false,
                error: 'Duplicate bed number. A bed with this number already exists.'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not create bed.'
        });
    }
};
exports.createBed = createBed;
// Get all beds
const getAllBeds = async (req, res) => {
    try {
        console.log("--> [bedsController] Attempting to fetch all beds from DB..."); // Added log
        const beds = await beds_1.Bed.find({}).populate('propertyId', 'title location');
        console.log(`--> [bedsController] Fetched ${beds.length} beds.`);
        if (beds.length > 0) {
            console.log("--> [bedsController] Example fetched bed (first one):", beds[0]);
        }
        else {
            console.log("--> [bedsController] No beds found in the database.");
        }
        res.status(200).json({
            success: true,
            count: beds.length,
            data: beds
        });
    }
    catch (error) {
        console.error('--> [bedsController] Error fetching all beds:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve beds.'
        });
    }
};
exports.getAllBeds = getAllBeds;
// Get a single bed by ID
const getBedById = async (req, res) => {
    try {
        const bed = await beds_1.Bed.findById(req.params.id).populate('propertyId', 'title location');
        if (!bed) {
            return res.status(404).json({
                success: false,
                error: 'Bed not found.'
            });
        }
        res.status(200).json({
            success: true,
            data: bed
        });
    }
    catch (error) {
        console.error('Error fetching bed by ID:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Bed ID format.'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve bed.'
        });
    }
};
exports.getBedById = getBedById;
// Update an existing bed by ID (MODIFIED)
const updateBed = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // 1. Fetch the existing bed to compare its state
        const oldBed = await beds_1.Bed.findById(id);
        if (!oldBed) {
            return res.status(404).json({
                success: false,
                error: 'Bed not found.'
            });
        }
        // 2. Perform the update
        const updatedBed = await beds_1.Bed.findByIdAndUpdate(id, updateData, {
            new: true, // Return the updated document
            runValidators: true // Run schema validators on update
        }).populate('propertyId', 'title location');
        if (!updatedBed) {
            return res.status(404).json({
                success: false,
                error: 'Bed not found after update attempt.'
            });
        }
        // 3. --- NEW: Logic to save tenant history based on status change ---
        const oldStatus = oldBed.status;
        const newStatus = updatedBed.status;
        const oldTenantName = oldBed.tenantDetails?.tenantName;
        const newTenantName = updatedBed.tenantDetails?.tenantName;
        // Condition for a tenant moving in
        if (oldStatus !== 'occupied' && oldStatus !== 'on notice' && (newStatus === 'occupied' || newStatus === 'on notice')) {
            if (newTenantName) {
                await TenantSchema_1.TenantHistory.create({
                    tenantName: newTenantName,
                    action: 'moved-in',
                    propertyId: updatedBed.propertyId,
                    bedId: updatedBed._id,
                    actionDate: new Date()
                });
                console.log(`Tenant '${newTenantName}' moved into Bed ${updatedBed.bedNumber}. History logged.`);
            }
        }
        // Condition for a tenant moving out
        else if ((oldStatus === 'occupied' || oldStatus === 'on notice') && (newStatus === 'vacant' || newStatus === 'maintenance')) {
            if (oldTenantName) {
                await TenantSchema_1.TenantHistory.create({
                    tenantName: oldTenantName,
                    action: 'moved-out',
                    propertyId: updatedBed.propertyId,
                    bedId: updatedBed._id,
                    actionDate: new Date()
                });
                console.log(`Tenant '${oldTenantName}' moved out of Bed ${updatedBed.bedNumber}. History logged.`);
            }
        }
        res.status(200).json({
            success: true,
            message: "Bed updated successfully.",
            data: updatedBed
        });
    }
    catch (error) {
        console.error('Error updating bed:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Bed ID format.'
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not update bed.'
        });
    }
};
exports.updateBed = updateBed;
