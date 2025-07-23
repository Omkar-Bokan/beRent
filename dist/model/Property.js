"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
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
    amenities: [{ type: String }] // Defines an array of strings
}, {
    timestamps: true,
    // *** Add toJSON/toObject options for _id to id transformation ***
    toJSON: {
        virtuals: true,
        // transform: (doc, ret) => {
        //     ret.id = ret._id.toString();
        //     delete ret._id;
        //     delete ret.__v;
        //     return ret;
        // }
    },
    // toObject: {
    //     virtuals: true,
    //     transform: (doc, ret) => {
    //         ret.id = ret._id.toString();
    //         delete ret._id;
    //         delete ret.__v;
    //         return ret;
    //     }
    // }
});
exports.Property = mongoose_1.default.model('Property', PropertySchema);
// It's generally better to use named exports for models
// export default Property; // You can keep this if you prefer default exports, but named is common with interfaces
