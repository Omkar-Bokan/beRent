"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSchema = new mongoose_1.default.Schema({
    bedId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Bed',
        required: [true, 'Bed ID is required for payment.']
    },
    propertyId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Property',
        required: [true, 'Property ID is required for payment.']
    },
    tenantName: {
        type: String,
        required: [true, 'Tenant name is required.']
    },
    amount: {
        type: Number,
        required: [true, 'Payment amount is required.'],
        min: [0, 'Amount cannot be negative.']
    },
    paymentDate: {
        type: Date,
        default: Date.now,
        required: [true, 'Payment date is required.']
    },
    status: {
        type: String,
        enum: {
            values: ['paid', 'pending', 'overdue'],
            message: 'Status must be one of: paid, pending, overdue.'
        },
        default: 'pending',
        required: [true, 'Payment status is required.']
    },
    // You can add more fields like:
    // paymentMethod: { type: String },
    // transactionId: { type: String },
    // notes: { type: String }
}, {
    timestamps: true
});
exports.Payment = mongoose_1.default.model('Payment', paymentSchema);
