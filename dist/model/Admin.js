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
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            const transformedRet = ret;
            if (transformedRet._id) {
                transformedRet.id = transformedRet._id.toString();
            }
            delete transformedRet._id;
            delete transformedRet.__v;
            return transformedRet;
        }
    },
    toObject: {
        virtuals: true,
        transform: (doc, ret) => {
            const transformedRet = ret;
            if (transformedRet._id) {
                transformedRet.id = transformedRet._id.toString();
            }
            delete transformedRet._id;
            delete transformedRet.__v;
            return transformedRet;
        }
    }
});
exports.AdminProfile = mongoose_1.default.model('AdminProfile', adminProfileSchema);
