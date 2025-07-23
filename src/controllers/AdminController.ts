import { Request, Response } from 'express';
import { AdminProfile } from '../model/Admin'

export const getAdminProfile = async (req: Request, res: Response) => {
    console.log('--- DEBUG: Inside getAdminProfile controller ---');
    try {
        const profile = await AdminProfile.findOne({});

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
    } catch (error: any) {
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

// Create an admin profile
export const createAdminProfile = async (req: Request, res: Response) => {
    console.log('--- DEBUG: Inside createAdminProfile controller ---');
    try {
        const existingProfile = await AdminProfile.findOne({});
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

        const newProfile = await AdminProfile.create({ name, email, phone, role });

        res.status(201).json({
            success: true,
            message: "Admin profile created successfully.",
            data: newProfile
        });
    } catch (error: any) {
        console.error('--- ERROR: Error creating admin profile:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'A profile with this email or phone number already exists.'
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
            error: 'Server Error: Could not create admin profile.'
        });
    }
};

// Update the admin profile
export const updateAdminProfile = async (req: Request, res: Response) => {
    console.log('--- DEBUG: Inside updateAdminProfile controller ---');
    try {
        const profile = await AdminProfile.findOneAndUpdate(
            {},
            req.body,
            { new: true, runValidators: true }
        );

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
    } catch (error: any) {
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
            const messages = Object.values(error.errors).map((val: any) => val.message);
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
