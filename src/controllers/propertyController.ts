import { Request, Response } from 'express';
import Property from '../model/Property';

export const createProperty = async (req: Request, res: Response) => {
    console.log("Inside createProperty Controller");
    console.log("REQ BODY:", req.body);
    try {
        const {
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
            amenities
        } = req.body;

        // Basic validation for required fields
        if (!title || !location || !address || !rentRange || !totalBeds || !monthlyRevenue || !contactPerson || !contactPhone || !status || !description) {
            return res.status(400).json({ message: "All required fields are missing. Please provide title, location, address, rentRange, totalBeds, monthlyRevenue, contactPerson, contactPhone, status, and description." });
        }

        const newProperty = new Property({
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
            amenities: amenities || [] // Ensure amenities is an array, even if empty
        });

        await newProperty.save();
        res.status(201).json({
            success: true,
            message: "Property created successfully.",
            data: newProperty
        });

    } catch (error: any) {
        console.error("Error creating property:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
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

// Get all properties
export const getProperties = async (req: Request, res: Response) => {
    try {
        const properties = await Property.find({});
        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    } catch (error: any) {
        console.error("Error fetching all properties:", error);
        res.status(500).json({
            success: false,
            message: "Server error: Could not retrieve properties.",
            error: error.message
        });
    }
};

// Get a single property by ID
export const getPropertyById = async (req: Request, res: Response) => {
    try {
        const property = await Property.findById(req.params.id);

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
    } catch (error: any) {
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

// Update an existing property by ID
export const updateProperty = async (req: Request, res: Response) => {
    try {
        const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
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
    } catch (error: any) {
        console.error("Error updating property:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid Property ID format."
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
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

// Update only the status of a property by ID
export const updatePropertyStatus = async (req: Request, res: Response) => {
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

        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { status: status }, // Only update the status field
            {
                new: true, // Return the updated document
                runValidators: true // Run schema validators (especially for enum)
            }
        );

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
    } catch (error: any) {
        console.error("Error updating property status:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid Property ID format."
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
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

