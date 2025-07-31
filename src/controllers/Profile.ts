// backend/src/controllers/Profile.ts (Updated - removed auth controllers)

import { Profile, IProfile } from '../model/profile';
import { Request, Response } from "express";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'; // Assuming you use JWT for tokens

// IMPORTANT: Use environment variable for JWT_SECRET in production!
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';

// Helper function to generate a token
const generateToken = (profile: IProfile) => {
    return jwt.sign(
        { id: profile.id, email: profile.email, firebaseUid: profile.firebaseUid },
        JWT_SECRET,
        { expiresIn: '1d' } // Token expires in 1 day
    );
};

// Helper function to find a profile by either _id or firebaseUid
const findProfileByIdOrFirebaseUid = async (id: string) => {
    let query: any = { firebaseUid: id }; // Default to finding by firebaseUid
    if (mongoose.Types.ObjectId.isValid(id)) {
        // If the ID is a valid ObjectId, try finding by either _id or firebaseUid
        // This allows both MongoDB _id and Firebase UID to be used for lookup
        query = { $or: [{ _id: id }, { firebaseUid: id }] };
    }
    return await Profile.findOne(query);
};

export const createProfile = async (req: Request, res: Response) => {
    try {
        const profile = new Profile(req.body);
        await profile.save();
        const token = generateToken(profile);
        res.status(201).json({ user: profile.toJSON(), token });
    } catch (error: any) {
        console.error("Error creating profile:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Duplicate email, phone number, or Firebase UID." });
        }
        res.status(400).json({ message: error.message || "Bad request." });
    }
};

export const getProfileById = async (req: Request, res: Response) => {
    try {
        const profile = await findProfileByIdOrFirebaseUid(req.params.id);
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        res.status(200).json(profile.toJSON());
    } catch (error: any) {
        console.error("Error getting profile by ID:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const updateProfileById = async (req: Request, res: Response) => {
    try {
        const profile = await findProfileByIdOrFirebaseUid(req.params.id);
        if (!profile) return res.status(404).json({ message: "Profile not found" });

        const { name, phone, email, photo, preferences } = req.body;

        if (name !== undefined) profile.name = name;
        if (phone !== undefined) profile.phone = phone;
        if (email !== undefined) profile.email = email;
        if (photo !== undefined) profile.photo = photo;

        if (preferences && typeof preferences === 'object') {
            if (!profile.preferences) profile.preferences = {};
            if (preferences.budget !== undefined) profile.preferences.budget = preferences.budget;
            if (preferences.location !== undefined) profile.preferences.location = preferences.location;
            if (preferences.occupancy !== undefined) profile.preferences.occupancy = preferences.occupancy;
        }

        await profile.save({ validateBeforeSave: true });
        res.status(200).json(profile.toJSON());
    } catch (error: any) {
        console.error("Error updating profile:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Duplicate email, phone number, or Firebase UID." });
        }
        res.status(400).json({ message: error.message || "Bad request." });
    }
};

export const deleteProfileById = async (req: Request, res: Response) => {
    try {
        const profile = await findProfileByIdOrFirebaseUid(req.params.id);
        if (!profile) return res.status(404).json({ message: "Profile not found" });

        await profile.deleteOne();
        res.status(204).send();
    } catch (error: any) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const getProfiles = async (req: Request, res: Response) => {
    try {
        const profiles = await Profile.find({});
        res.status(200).json(profiles.map(p => p.toJSON()));
    } catch (error: any) {
        console.error("Error getting all profiles:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// --- Moved Google Authentication Controllers (now in auth.ts) ---
// These functions will be moved to a new auth controller file for better separation.
// Keeping them here temporarily for reference if you haven't created the new file yet.

export const googleAuthCallback = async (req: Request, res: Response) => {
    const { uid, email, displayName, photoURL } = req.body;

    if (!uid || !email) {
        return res.status(400).json({ message: "Missing Google user information (uid or email)." });
    }

    try {
        let profile = await Profile.findOne({ $or: [{ firebaseUid: uid }, { email: email }] });

        let phoneRequired = false;
        let token: string;

        if (profile) {
            console.log("Existing Google user found:", profile.email);
            if (!profile.firebaseUid) {
                profile.firebaseUid = uid;
                await profile.save();
            }
            if (!profile.phone) {
                phoneRequired = true;
            }
            token = generateToken(profile);
        } else {
            console.log("New Google user, creating profile:", email);
            profile = new Profile({
                firebaseUid: uid,
                email: email,
                name: displayName || 'Google User',
                photo: photoURL,
                role: 'user',
                preferences: {}
            });
            await profile.save();

            phoneRequired = true;
            token = generateToken(profile);
        }

        res.status(200).json({
            user: profile.toJSON(),
            phoneRequired,
            token
        });

    } catch (error: any) {
        console.error("Error in googleAuthCallback:", error);
        res.status(500).json({ message: "Internal server error during Google auth callback." });
    }
};

export const updateGoogleProfileWithPhone = async (req: Request, res: Response) => {
    const { firebaseUid } = req.params;
    const { phone } = req.body;

    if (!firebaseUid || !phone) {
        return res.status(400).json({ message: "Missing Firebase UID or phone number." });
    }

    try {
        const profile = await Profile.findOne({ firebaseUid: firebaseUid });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found for the given Firebase UID." });
        }

        profile.phone = phone;
        await profile.save({ validateBeforeSave: true });

        const token = generateToken(profile);

        res.status(200).json({
            user: profile.toJSON(),
            token
        });

    } catch (error: any) {
        console.error("Error updating Google profile with phone:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Phone number already in use." });
        }
        res.status(400).json({ message: error.message || "Bad request." });
    }
};
