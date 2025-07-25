"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
// src/model/Property.ts
const mongoose_1 = __importDefault(require("mongoose"));
const PropertySchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    rentRange: { type: String, required: true },
    totalBeds: { type: Number, required: true },
    monthlyRevenue: { type: Number, required: true },
    contactPerson: { type: String, required: true },
    contactPhone: { type: String, required: true },
    status: { type: String, required: true, enum: ['active', 'Inactive', 'Maintenance', 'Full', 'available soon'] },
    description: { type: String, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }] // <--- ADD THIS LINE to the schema
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
exports.Property = mongoose_1.default.model('Property', PropertySchema);
