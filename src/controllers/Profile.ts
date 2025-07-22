import Profile from '../model/profile';
import { Request, Response } from "express";
import mongoose from 'mongoose';

// Assuming there's only ONE admin profile (e.g., with a specific 'Super Admin' role)
// Or you could fetch it by a known fixed ID if you seed one in your DB.
const ADMIN_PROFILE_ID = 'your_fixed_admin_profile_id_here'; // If you have one, otherwise query by role

// Get THE admin profile
export const getAdminProfile = async (req: Request, res: Response) => {
    try {
        // Find the specific admin profile, e.g., by role or a predefined ID
        const profile = await Profile.findOne({ role: 'Super Admin' }); // Or await Profile.findById(ADMIN_PROFILE_ID);
        if (!profile) return res.status(404).json({ message: "Admin Profile not found" });
        res.status(200).json(profile);
    } catch (error: any) {
        console.error("Error getting admin profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Update THE admin profile
export const updateAdminProfile = async (req: Request, res: Response) => {
    try {
        // Find and update the specific admin profile
        const profile = await Profile.findOneAndUpdate(
            { role: 'Super Admin' }, // Or { _id: ADMIN_PROFILE_ID }
            req.body, // Be careful: only update allowed fields!
            { new: true, runValidators: true } // `runValidators` ensures schema validators run on update
        );
        if (!profile) return res.status(404).json({ message: "Admin Profile not found" });
        res.status(200).json(profile);
    } catch (error: any) {
        console.error("Error updating admin profile:", error);
        // Handle Mongoose validation errors (e.g., unique constraints)
        if (error.code === 11000) {
            return res.status(409).json({ message: "Duplicate email or phone number." });
        }
        res.status(400).json({ message: error.message || "Bad request." });
    }
};

// --- General CRUD for ALL profiles (if applicable, typically for other users) ---
// Note: If you have general user profiles, these routes would ideally be under /api/users or similar.

export const createProfile = async (req: Request, res: Response) => {
    try {
        const profile = new Profile(req.body);
        await profile.save();
        res.status(201).json(profile);
    } catch (error: any) {
        console.error("Error creating profile:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Duplicate email or phone number." });
        }
        res.status(400).json({ message: error.message || "Bad request." });
    }
};

export const getProfileById = async (req: Request, res: Response) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Profile ID format." });
        }
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        res.status(200).json(profile);
    } catch (error: any) {
        console.error("Error getting profile by ID:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const updateProfileById = async (req: Request, res: Response) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Profile ID format." });
        }
        // IMPORTANT: Filter req.body to only allow specific fields to be updated
        const { name, phone, email, photo } = req.body; // Example allowed fields
        const updateData = { name, phone, email, photo };

        const profile = await Profile.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        res.status(200).json(profile);
    } catch (error: any) {
        console.error("Error updating profile:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Duplicate email or phone number." });
        }
        res.status(400).json({ message: error.message || "Bad request." });
    }
};

export const deleteProfileById = async (req: Request, res: Response) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Profile ID format." });
        }
        const profile = await Profile.findByIdAndDelete(req.params.id);
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        res.status(204).send(); // 204 No Content
    } catch (error: any) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const getProfiles = async (req: Request, res: Response) => {
    try {
        const profiles = await Profile.find({}); // You might want to paginate this in a real app
        res.status(200).json(profiles);
    } catch (error: any) {
        console.error("Error getting all profiles:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};