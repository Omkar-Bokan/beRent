import { Lead } from '../model/leads'
import { Request, Response } from "express";;

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

// Delete a lead by ID
export const deleteLead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Attempt to find and delete the lead
        const lead = await Lead.findByIdAndDelete(id);

        // If no lead was found and deleted, send a 404 response
        if (!lead) {
            return res.status(404).json({
                success: false,
                error: 'Lead not found.'
            });
        }

        // If the lead was successfully deleted, send a 200 OK response
        res.status(200).json({
            success: true,
            message: 'Lead deleted successfully.',
            data: lead // Optionally return the deleted lead data
        });

    } catch (error: any) {
        console.error('Error deleting lead:', error);
        // Handle CastError for invalid Mongoose ID format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Lead ID format.'
            });
        }
        // Handle other server-side errors
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not delete lead.'
        });
    }
};

// Update only the status of a lead by ID
export const updateLeadStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate if status is provided
        if (!status) {
            return res.status(400).json({
                success: false,
                error: 'Status field is required for status update.'
            });
        }

        // Validate if the provided status is one of the allowed enum values
        const allowedStatuses = ['new', 'contacted', 'interested', 'qualified', 'converted', 'not_interested'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Invalid status value. Allowed values are: ${allowedStatuses.join(', ')}.`
            });
        }

        // Find the lead by ID and update only the status field
        const lead = await Lead.findByIdAndUpdate(
            id,
            { status: status },
            {
                new: true, // Return the updated document
                runValidators: true // Run schema validators (important for enum validation)
            }
        );

        if (!lead) {
            return res.status(404).json({
                success: false,
                error: 'Lead not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Lead status updated successfully.',
            data: lead
        });

    } catch (error: any) {
        console.error('Error updating lead status:', error);
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
            error: 'Server Error: Could not update lead status.'
        });
    }
};