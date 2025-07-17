"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    phone: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
});
const leadSchema = new mongoose_1.default.Schema({
    name: String,
    phone: String,
    email: String,
    location: String,
    budget: Number,
    moveInDate: Date,
    priority: { type: String, enum: ['Low', 'Medium', 'High'] },
    source: String,
    requirements: String,
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('User', userSchema);
exports.Lead = mongoose_1.default.model('Lead', leadSchema);
