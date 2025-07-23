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
        unique: true,
        match: [/.+@.+\..+/, 'Please use a valid email address.']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required.'],
        unique: true
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
    properties: { type: Number, default: 0 },
    totalBeds: { type: Number, default: 0 },
    avatar: { type: String, default: '' }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    // *** IMPORTANT: Add the toJSON configuration here ***
    toJSON: {
        virtuals: true, // Ensure virtuals (like the default 'id') are included
        transform: (doc, ret) => {
            // Map _id to id and remove _id and __v from the response
            // ret.id = ret._id.toString(); // Convert ObjectId to string for 'id'
            // delete ret._id;             // Remove the original _id field
            // delete ret.__v;             // Remove the version key
            // return ret;
        }
    },
    // You might also want to add this for explicit .toObject() calls
    //     toObject: {
    //         virtuals: true,
    //         transform: (doc, ret) => {
    //             ret.id = ret._id.toString();
    //             delete ret._id;
    //             delete ret.__v;
    //             return ret;
    //     }
    // }
});
exports.AdminProfile = mongoose_1.default.model('AdminProfile', adminProfileSchema);
