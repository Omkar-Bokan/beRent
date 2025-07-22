"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLead = exports.createLead = exports.getLeadById = exports.getAllLeads = void 0;
const leads_1 = require("../model/leads");
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
