"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentHistory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PaymentHistorySchema = new mongoose_1.default.Schema({
    tenantName: {
        type: String,
        required: true,
        trim: true
    },
    propertyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Property', // Reference to the Property model
        required: true
    },
    bedId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Bed', // Reference to the Bed model
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['paid', 'pending', 'overdue'],
        default: 'pending'
    }
}, {
    timestamps: true
});
exports.PaymentHistory = mongoose_1.default.model('PaymentHistory', PaymentHistorySchema);
