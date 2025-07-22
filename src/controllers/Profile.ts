import { Profile } from '../model/profile';
import { Request, Response } from "express";
import mongoose from 'mongoose';

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