"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const profileSchema = new mongoose_1.default.Schema({
    phone: { type: String, unique: true, sparse: true }, // Made optional, unique, and sparse
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
    photo: { type: String },
    date: { type: Date, default: Date.now }, // Keep if needed, otherwise remove
    preferences: {
        budget: { type: String }, // Made optional
        location: { type: String }, // Made optional
        occupancy: { type: String } // Made optional
    },
    firebaseUid: { type: String, unique: true, sparse: true } // Add firebaseUid field
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
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
exports.Profile = mongoose_1.default.model("Profile", profileSchema);
