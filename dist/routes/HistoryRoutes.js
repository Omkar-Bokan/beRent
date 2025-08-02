"use strict";
// src/routes/historyRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PaymentHistory_1 = require("../model/PaymentHistory"); // Assuming the path
const TenantSchema_1 = require("../model/TenantSchema"); // Assuming the path
const router = express_1.default.Router();
// GET all payment history records
router.get('/payment-history', async (req, res) => {
    try {
        const history = await PaymentHistory_1.PaymentHistory.find({})
            .populate('propertyId', 'title location')
            .populate('bedId', 'bedNumber roomNumber');
        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    }
    catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve payment history.'
        });
    }
});
// GET all tenant history records
router.get('/tenant-history', async (req, res) => {
    try {
        const history = await TenantSchema_1.TenantHistory.find({})
            .populate('propertyId', 'title location')
            .populate('bedId', 'bedNumber roomNumber');
        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    }
    catch (error) {
        console.error('Error fetching tenant history:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve tenant history.'
        });
    }
});
exports.default = router;
