"use strict";
// import { Request, Response } from 'express';
// import Property from '../model/Property';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePropertyStatus = exports.updateProperty = exports.getPropertyById = exports.getProperties = exports.createProperty = void 0;
const Property_1 = __importDefault(require("../model/Property"));
const createProperty = async (req, res) => {
    console.log("Inside createProperty Controller");
    console.log("REQ BODY:", req.body);
    try {
        const { title, location, address, rentRange, totalBeds, monthlyRevenue, contactPerson, contactPhone, status, description, amenities } = req.body;
        // Basic validation for required fields
        if (!title || !location || !address || !rentRange || !totalBeds || !monthlyRevenue || !contactPerson || !contactPhone || !status || !description) {
            return res.status(400).json({ message: "All required fields are missing. Please provide title, location, address, rentRange, totalBeds, monthlyRevenue, contactPerson, contactPhone, status, and description." });
        }
        const newProperty = new Property_1.default({
            title,
            location,
            address,
            rentRange,
            totalBeds,
            monthlyRevenue,
            contactPerson,
            contactPhone,
            status,
            description,
            amenities: amenities || []
        });
        await newProperty.save();
        res.status(201).json({
            success: true,
            message: "Property created successfully.",
            data: newProperty
        });
    }
    catch (error) {
        console.error("Error creating property:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error: Could not create property.",
            error: error.message
        });
    }
};
exports.createProperty = createProperty;
// Get all properties
const getProperties = async (req, res) => {
    try {
        const properties = await Property_1.default.find({});
        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    }
    catch (error) {
        console.error("Error fetching all properties:", error);
        res.status(500).json({
            success: false,
            message: "Server error: Could not retrieve properties.",
            error: error.message
        });
    }
};
exports.getProperties = getProperties;
// Get a single property by ID
const getPropertyById = async (req, res) => {
    try {
        const property = await Property_1.default.findById(req.params.id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }
        res.status(200).json({
            success: true,
            data: property
        });
    }
    catch (error) {
        console.error("Error fetching property by ID:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid Property ID format."
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error: Could not retrieve property.",
            error: error.message
        });
    }
};
exports.getPropertyById = getPropertyById;
// Update an existing property by ID
const updateProperty = async (req, res) => {
    try {
        const property = await Property_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }
        res.status(200).json({
            success: true,
            message: "Property updated successfully.",
            data: property
        });
    }
    catch (error) {
        console.error("Error updating property:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid Property ID format."
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
            message: "Server error: Could not update property.",
            error: error.message
        });
    }
};
exports.updateProperty = updateProperty;
// Update only the status of a property by ID
const updatePropertyStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status field is required for status update."
            });
        }
        // Validate if the provided status is one of the allowed enum values
        const allowedStatuses = ['active', 'Inactive', 'Maintenance', 'Full', 'available soon'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status value. Allowed values are: ${allowedStatuses.join(', ')}.`
            });
        }
        const property = await Property_1.default.findByIdAndUpdate(req.params.id, { status: status }, // Only update the status field
        {
            new: true, // Return the updated document
            runValidators: true // Run schema validators (especially for enum)
        });
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found."
            });
        }
        res.status(200).json({
            success: true,
            message: "Property status updated successfully.",
            data: property
        });
    }
    catch (error) {
        console.error("Error updating property status:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid Property ID format."
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
            message: "Server error: Could not update property status.",
            error: error.message
        });
    }
};
exports.updatePropertyStatus = updatePropertyStatus;
