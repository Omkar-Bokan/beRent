"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadStatus = exports.deleteLead = exports.updateLead = exports.createLead = exports.getLeadById = exports.getAllLeads = void 0;
const leads_1 = require("../model/leads");
;
const getAllLeads = async (req, res) => {
    try {
        const leads = await leads_1.Lead.find({});
        res.status(200).json({
            success: true,
            count: leads.length,
            data: leads
        });
    }
    catch (error) {
        console.error('Error fetching all leads:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve leads.'
        });
    }
};
exports.getAllLeads = getAllLeads;
// Get a single lead by ID
const getLeadById = async (req, res) => {
    try {
        const lead = await leads_1.Lead.findById(req.params.id);
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
    }
    catch (error) {
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
exports.getLeadById = getLeadById;
// Create a new lead
const createLead = async (req, res) => {
    try {
        const lead = await leads_1.Lead.create(req.body);
        res.status(201).json({
            success: true,
            data: lead
        });
    }
    catch (error) {
        console.error('Error creating lead:', error);
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
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
exports.createLead = createLead;
// Update an existing lead by ID
const updateLead = async (req, res) => {
    try {
        const lead = await leads_1.Lead.findByIdAndUpdate(req.params.id, req.body, {
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
    }
    catch (error) {
        console.error('Error updating lead:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Lead ID format.'
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
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
exports.updateLead = updateLead;
// Delete a lead by ID
const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        // Attempt to find and delete the lead
        const lead = await leads_1.Lead.findByIdAndDelete(id);
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
    }
    catch (error) {
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
exports.deleteLead = deleteLead;
// Update only the status of a lead by ID
const updateLeadStatus = async (req, res) => {
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
        const lead = await leads_1.Lead.findByIdAndUpdate(id, { status: status }, {
            new: true, // Return the updated document
            runValidators: true // Run schema validators (important for enum validation)
        });
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
    }
    catch (error) {
        console.error('Error updating lead status:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Lead ID format.'
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
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
exports.updateLeadStatus = updateLeadStatus;
