"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfiles = exports.deleteProfileById = exports.updateProfileById = exports.getProfileById = exports.createProfile = void 0;
const profile_1 = require("../model/profile");
const mongoose_1 = __importDefault(require("mongoose"));
const createProfile = async (req, res) => {
    try {
        const profile = new profile_1.Profile(req.body);
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
        const profile = await profile_1.Profile.findById(req.params.id);
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
        const profile = await profile_1.Profile.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
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
        const profile = await profile_1.Profile.findByIdAndDelete(req.params.id);
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
        const profiles = await profile_1.Profile.find({}); // You might want to paginate this in a real app
        res.status(200).json(profiles);
    }
    catch (error) {
        console.error("Error getting all profiles:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
exports.getProfiles = getProfiles;
