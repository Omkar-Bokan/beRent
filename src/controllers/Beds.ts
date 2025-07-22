import { Bed } from '../model/beds'
import { Request, Response } from "express";

export const createBed = async (req: Request, res: Response) => {
    try {
        const bed = await Bed.create(req.body);
        res.status(201).json({
            success: true,
            message: "Bed created successfully.",
            data: bed
        });
    } catch (error: any) {
        console.error('Error creating bed:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
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

// Get all beds
export const getAllBeds = async (req: Request, res: Response) => {
    try {
        // Populate propertyId to get details of the associated property
        const beds = await Bed.find({}).populate('propertyId', 'title location'); // Only fetch title and location of property
        res.status(200).json({
            success: true,
            count: beds.length,
            data: beds
        });
    } catch (error) {
        console.error('Error fetching all beds:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve beds.'
        });
    }
};

// Get a single bed by ID
export const getBedById = async (req: Request, res: Response) => {
    try {
        // Populate propertyId to get details of the associated property
        const bed = await Bed.findById(req.params.id).populate('propertyId', 'title location');

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
    } catch (error: any) {
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

// Update an existing bed by ID
export const updateBed = async (req: Request, res: Response) => {
    try {
        // Use findByIdAndUpdate with runValidators to trigger pre-findOneAndUpdate hook
        const bed = await Bed.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run schema validators on update, crucial for pre-hook
        }).populate('propertyId', 'title location'); // Populate after update

        if (!bed) {
            return res.status(404).json({
                success: false,
                error: 'Bed not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: "Bed updated successfully.",
            data: bed
        });
    } catch (error: any) {
        console.error('Error updating bed:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Bed ID format.'
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
            error: 'Server Error: Could not update bed.'
        });
    }
};