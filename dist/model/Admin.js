"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProfile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const adminProfileSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Admin name is required.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true, // Email should be unique for the admin profile
        match: [/.+@.+\..+/, 'Please use a valid email address.']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required.'],
        unique: true // Phone number should also be unique
    },
    role: {
        type: String,
        enum: {
            values: ['superadmin', 'admin', 'manager'],
            message: 'Role must be superadmin, admin, or manager.'
        },
        default: 'admin',
        required: [true, 'Role is required.']
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    // Optional fields for statistics or avatar, not directly from initial form
    properties: { type: Number, default: 0 },
    totalBeds: { type: Number, default: 0 },
    avatar: { type: String, default: '' }
}, {
    timestamps: true // Adds createdAt and updatedAt
});
exports.AdminProfile = mongoose_1.default.model('AdminProfile', adminProfileSchema);
