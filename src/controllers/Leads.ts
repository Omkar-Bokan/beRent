import { Lead } from '../model/leads'
import { Request, Response } from "express";
import mongoose from 'mongoose';

export const getAllLeads = async (req: Request, res: Response) => {
    try {
        const leads = await Lead.find({});
        res.status(200).json({
            success: true,
            count: leads.length,
            data: leads
        });
    } catch (error) {
        console.error('Error fetching all leads:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve leads.'
        });
    }
};

// Get a single lead by ID
export const getLeadById = async (req: Request, res: Response) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                error: 'Lead not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: lead
        });
    } catch (error: any) {
        console.error('Error fetching lead by ID:', error);
        // Check if the error is due to an invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Lead ID format.'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve lead.'
        });
    }
};

// Create a new lead
export const createLead = async (req: Request, res: Response) => {
    try {
        const lead = await Lead.create(req.body);
        res.status(201).json({
            success: true,
            data: lead
        });
    } catch (error: any) {
        console.error('Error creating lead:', error);
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => (val as { message: string }).message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not create lead.'
        });
    }
};

// Update an existing lead by ID
export const updateLead = async (req: Request, res: Response) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run schema validators on update
        });

        if (!lead) {
            return res.status(404).json({
                success: false,
                error: 'Lead not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: lead
        });
    } catch (error: any) {
        console.error('Error updating lead:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Lead ID format.'
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => (val as { message: string }).message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not update lead.'
        });
    }
};
