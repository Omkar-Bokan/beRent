"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const profileSchema = new mongoose_1.default.Schema({
    phone: { type: Number, required: true, unique: true }, // Consider String for phone numbers
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
    photo: { type: String },
    date: { type: Date, default: Date.now }
}, {
    timestamps: true, // Assuming you want timestamps for user profiles too
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
exports.Profile = mongoose_1.default.model("Profile", profileSchema);
