"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
// src/model/Property.ts
const mongoose_1 = __importStar(require("mongoose"));
const PropertySchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    rentRange: { type: String },
    minRent: { type: Number, required: false }, // Define as Number
    maxRent: { type: Number, required: false },
    totalBeds: { type: Number, required: true, min: 1 },
    monthlyRevenue: { type: Number, required: true, min: 0 },
    contactPerson: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ['active', 'inactive', 'maintenance', 'full', 'available soon'], default: 'active' },
    description: { type: String, required: true },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    area: { type: String },
    type: { type: mongoose_1.Schema.Types.Mixed },
    rating: { type: mongoose_1.Schema.Types.Mixed },
    reviews: { type: mongoose_1.Schema.Types.Mixed },
    owner: { type: String },
    rules: { type: mongoose_1.Schema.Types.Mixed },
    nearby: { type: mongoose_1.Schema.Types.Mixed },
    available: { type: mongoose_1.Schema.Types.Mixed }
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
