"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfiles = exports.deleteProfileById = exports.updateProfileById = exports.getProfileById = exports.createProfile = exports.updateAdminProfile = exports.getAdminProfile = void 0;
const profile_1 = __importDefault(require("../model/profile"));
const mongoose_1 = __importDefault(require("mongoose")); // Import mongoose to check for ObjectId validity
// Assuming there's only ONE admin profile (e.g., with a specific 'Super Admin' role)
// Or you could fetch it by a known fixed ID if you seed one in your DB.
const ADMIN_PROFILE_ID = 'your_fixed_admin_profile_id_here'; // If you have one, otherwise query by role
// Get THE admin profile
const getAdminProfile = async (req, res) => {
    try {
        // Find the specific admin profile, e.g., by role or a predefined ID
        const profile = await profile_1.default.findOne({ role: 'Super Admin' }); // Or await Profile.findById(ADMIN_PROFILE_ID);
        if (!profile)
            return res.status(404).json({ message: "Admin Profile not found" });
        res.status(200).json(profile);
    }
    catch (error) {
        console.error("Error getting admin profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
exports.getAdminProfile = getAdminProfile;
// Update THE admin profile
const updateAdminProfile = async (req, res) => {
    try {
        // Find and update the specific admin profile
        const profile = await profile_1.default.findOneAndUpdate({ role: 'Super Admin' }, // Or { _id: ADMIN_PROFILE_ID }
        req.body, // Be careful: only update allowed fields!
        { new: true, runValidators: true } // `runValidators` ensures schema validators run on update
        );
        if (!profile)
            return res.status(404).json({ message: "Admin Profile not found" });
        res.status(200).json(profile);
    }
    catch (error) {
        console.error("Error updating admin profile:", error);
        // Handle Mongoose validation errors (e.g., unique constraints)
        if (error.code === 11000) {
            return res.status(409).json({ message: "Duplicate email or phone number." });
        }
        res.status(400).json({ message: error.message || "Bad request." });
    }
};
exports.updateAdminProfile = updateAdminProfile;
// --- General CRUD for ALL profiles (if applicable, typically for other users) ---
// Note: If you have general user profiles, these routes would ideally be under /api/users or similar.
const createProfile = async (req, res) => {
    try {
        const profile = new profile_1.default(req.body);
        await profile.save();
        res.status(201).json(profile);
    }
    catch (error) {
        console.error("Error creating profile:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Duplicate email or phone number." });
        }
        res.status(400).json({ message: error.message || "Bad request." });
    }
};
exports.createProfile = createProfile;
const getProfileById = async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Profile ID format." });
        }
        const profile = await profile_1.default.findById(req.params.id);
        if (!profile)
            return res.status(404).json({ message: "Profile not found" });
        res.status(200).json(profile);
    }
    catch (error) {
        console.error("Error getting profile by ID:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
exports.getProfileById = getProfileById;
const updateProfileById = async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Profile ID format." });
        }
        // IMPORTANT: Filter req.body to only allow specific fields to be updated
        const { name, phone, email, photo } = req.body; // Example allowed fields
        const updateData = { name, phone, email, photo };
        const profile = await profile_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!profile)
            return res.status(404).json({ message: "Profile not found" });
        res.status(200).json(profile);
    }
    catch (error) {
        console.error("Error updating profile:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Duplicate email or phone number." });
        }
        res.status(400).json({ message: error.message || "Bad request." });
    }
};
exports.updateProfileById = updateProfileById;
const deleteProfileById = async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Profile ID format." });
        }
        const profile = await profile_1.default.findByIdAndDelete(req.params.id);
        if (!profile)
            return res.status(404).json({ message: "Profile not found" });
        res.status(204).send(); // 204 No Content
    }
    catch (error) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
exports.deleteProfileById = deleteProfileById;
const getProfiles = async (req, res) => {
    try {
        const profiles = await profile_1.default.find({}); // You might want to paginate this in a real app
        res.status(200).json(profiles);
    }
    catch (error) {
        console.error("Error getting all profiles:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
exports.getProfiles = getProfiles;
