"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantHistory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TenantHistorySchema = new mongoose_1.default.Schema({
    tenantName: {
        type: String,
        required: true,
        trim: true
    },
    action: {
        type: String,
        enum: ['moved-in', 'moved-out'],
        required: true
    },
    propertyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    bedId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Bed',
        required: true
    },
    actionDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
exports.TenantHistory = mongoose_1.default.model('TenantHistory', TenantHistorySchema);
