"use strict";
// backend/src/controllers/Profile.ts (Updated - removed auth controllers)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGoogleProfileWithPhone = exports.googleAuthCallback = exports.getProfiles = exports.deleteProfileById = exports.updateProfileById = exports.getProfileById = exports.createProfile = void 0;
const profile_1 = require("../model/profile");
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Assuming you use JWT for tokens
// IMPORTANT: Use environment variable for JWT_SECRET in production!
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';
// Helper function to generate a token
const generateToken = (profile) => {
    return jsonwebtoken_1.default.sign({ id: profile.id, email: profile.email, firebaseUid: profile.firebaseUid }, JWT_SECRET, { expiresIn: '1d' } // Token expires in 1 day
    );
};
// Helper function to find a profile by either _id or firebaseUid
const findProfileByIdOrFirebaseUid = async (id) => {
    let query = { firebaseUid: id }; // Default to finding by firebaseUid
    if (mongoose_1.default.Types.ObjectId.isValid(id)) {
        // If the ID is a valid ObjectId, try finding by either _id or firebaseUid
        // This allows both MongoDB _id and Firebase UID to be used for lookup
        query = { $or: [{ _id: id }, { firebaseUid: id }] };
    }
    return await profile_1.Profile.findOne(query);
};
const createProfile = async (req, res) => {
    try {
        const profile = new profile_1.Profile(req.body);
        await profile.save();
        const token = generateToken(profile);
        res.status(201).json({ user: profile.toJSON(), token });
    }
    catch (error) {
        console.error("Error creating profile:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Duplicate email, phone number, or Firebase UID." });
        }
        res.status(400).json({ message: error.message || "Bad request." });
    }
};
exports.createProfile = createProfile;
const getProfileById = async (req, res) => {
    try {
        const profile = await findProfileByIdOrFirebaseUid(req.params.id);
        if (!profile)
            return res.status(404).json({ message: "Profile not found" });
        res.status(200).json(profile.toJSON());
    }
    catch (error) {
        console.error("Error getting profile by ID:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
exports.getProfileById = getProfileById;
const updateProfileById = async (req, res) => {
    try {
        const profile = await findProfileByIdOrFirebaseUid(req.params.id);
        if (!profile)
            return res.status(404).json({ message: "Profile not found" });
        const { name, phone, email, photo, preferences } = req.body;
        if (name !== undefined)
            profile.name = name;
        if (phone !== undefined)
            profile.phone = phone;
        if (email !== undefined)
            profile.email = email;
        if (photo !== undefined)
            profile.photo = photo;
        if (preferences && typeof preferences === 'object') {
            if (!profile.preferences)
                profile.preferences = {};
            if (preferences.budget !== undefined)
                profile.preferences.budget = preferences.budget;
            if (preferences.location !== undefined)
                profile.preferences.location = preferences.location;
            if (preferences.occupancy !== undefined)
                profile.preferences.occupancy = preferences.occupancy;
        }
        await profile.save({ validateBeforeSave: true });
        res.status(200).json(profile.toJSON());
    }
    catch (error) {
        console.error("Error updating profile:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Duplicate email, phone number, or Firebase UID." });
        }
        res.status(400).json({ message: error.message || "Bad request." });
    }
};
exports.updateProfileById = updateProfileById;
const deleteProfileById = async (req, res) => {
    try {
        const profile = await findProfileByIdOrFirebaseUid(req.params.id);
        if (!profile)
            return res.status(404).json({ message: "Profile not found" });
        await profile.deleteOne();
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
exports.deleteProfileById = deleteProfileById;
const getProfiles = async (req, res) => {
    try {
        const profiles = await profile_1.Profile.find({});
        res.status(200).json(profiles.map(p => p.toJSON()));
    }
    catch (error) {
        console.error("Error getting all profiles:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
exports.getProfiles = getProfiles;
const googleAuthCallback = async (req, res) => {
    const { uid, email, displayName, photoURL } = req.body;
    if (!uid || !email) {
        return res.status(400).json({ message: "Missing Google user information (uid or email)." });
    }
    try {
        let profile = await profile_1.Profile.findOne({ $or: [{ firebaseUid: uid }, { email: email }] });
        let phoneRequired = false;
        let token;
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
        }
        else {
            console.log("New Google user, creating profile:", email);
            profile = new profile_1.Profile({
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
    }
    catch (error) {
        console.error("Error in googleAuthCallback:", error);
        res.status(500).json({ message: "Internal server error during Google auth callback." });
    }
};
exports.googleAuthCallback = googleAuthCallback;
const updateGoogleProfileWithPhone = async (req, res) => {
    const { firebaseUid } = req.params;
    const { phone } = req.body;
    if (!firebaseUid || !phone) {
        return res.status(400).json({ message: "Missing Firebase UID or phone number." });
    }
    try {
        const profile = await profile_1.Profile.findOne({ firebaseUid: firebaseUid });
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
    }
    catch (error) {
        console.error("Error updating Google profile with phone:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Phone number already in use." });
        }
        res.status(400).json({ message: error.message || "Bad request." });
    }
};
exports.updateGoogleProfileWithPhone = updateGoogleProfileWithPhone;
