"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminProfile = exports.createAdminProfile = exports.getAdminProfile = void 0;
const Admin_1 = require("../model/Admin");
const getAdminProfile = async (req, res) => {
    console.log('--- DEBUG: Inside getAdminProfile controller ---');
    try {
        const profile = await Admin_1.AdminProfile.findOne({});
        if (!profile) {
            console.log('--- DEBUG: Admin Profile not found, returning 404. ---');
            return res.status(404).json({
                success: false,
                message: 'Admin Profile not found.'
            });
        }
        console.log('--- DEBUG: Admin Profile found, returning 200. ---');
        res.status(200).json({
            success: true,
            data: profile
        });
    }
    catch (error) {
        console.error('--- ERROR: Error fetching admin profile in getAdminProfile:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Internal Database Error: Invalid data format encountered during fetch.'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve admin profile.'
        });
    }
};
exports.getAdminProfile = getAdminProfile;
// Create an admin profile
const createAdminProfile = async (req, res) => {
    console.log('--- DEBUG: Inside createAdminProfile controller ---');
    try {
        const existingProfile = await Admin_1.AdminProfile.findOne({});
        if (existingProfile) {
            return res.status(409).json({
                success: false,
                message: 'Admin profile already exists. Use PUT to update.'
            });
        }
        const { name, email, phone, role } = req.body;
        if (!name || !email || !phone || !role) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, phone, and role are required to create an admin profile.'
            });
        }
        const newProfile = await Admin_1.AdminProfile.create({ name, email, phone, role });
        res.status(201).json({
            success: true,
            message: "Admin profile created successfully.",
            data: newProfile
        });
    }
    catch (error) {
        console.error('--- ERROR: Error creating admin profile:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'A profile with this email or phone number already exists.'
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
            error: 'Server Error: Could not create admin profile.'
        });
    }
};
exports.createAdminProfile = createAdminProfile;
// Update the admin profile
const updateAdminProfile = async (req, res) => {
    console.log('--- DEBUG: Inside updateAdminProfile controller ---');
    try {
        const profile = await Admin_1.AdminProfile.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Admin Profile not found for update. Please create one first.'
            });
        }
        res.status(200).json({
            success: true,
            message: "Admin profile updated successfully.",
            data: profile
        });
    }
    catch (error) {
        console.error('--- ERROR: Error updating admin profile:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid data format provided for update.'
            });
        }
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'A profile with this email or phone number already exists.'
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
            error: 'Server Error: Could not update admin profile.'
        });
    }
};
exports.updateAdminProfile = updateAdminProfile;
