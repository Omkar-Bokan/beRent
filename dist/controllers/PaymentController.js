"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePayment = exports.updatePayment = exports.getPaymentById = exports.getAllPayments = exports.createPayment = void 0;
const payment_1 = require("../model/payment");
const PaymentHistory_1 = require("../model/PaymentHistory");
const createPayment = async (req, res) => {
    try {
        // First, create the payment document in the main collection
        const payment = await payment_1.Payment.create(req.body);
        // --- NEW: Create a payment history entry ---
        await PaymentHistory_1.PaymentHistory.create({
            tenantName: payment.tenantName,
            propertyId: payment.propertyId,
            bedId: payment.bedId,
            amount: payment.amount,
            paymentDate: payment.paymentDate,
            status: payment.status
        });
        console.log(`Payment for '${payment.tenantName}' recorded and history logged.`);
        res.status(201).json({
            success: true,
            message: "Payment recorded successfully.",
            data: payment
        });
    }
    catch (error) {
        console.error('Error creating payment:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not record payment.'
        });
    }
};
exports.createPayment = createPayment;
// The rest of your paymentController functions remain unchanged
// ... getAllPayments, getPaymentById, updatePayment, deletePayment
const getAllPayments = async (req, res) => {
    try {
        // Populate bedId and propertyId for more context
        const payments = await payment_1.Payment.find({})
            .populate('bedId', 'bedNumber roomNumber')
            .populate('propertyId', 'title location');
        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    }
    catch (error) { // Added : any for error type
        console.error('Error fetching all payments:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve payments.'
        });
    }
};
exports.getAllPayments = getAllPayments;
// Get a single payment by ID
const getPaymentById = async (req, res) => {
    try {
        const payment = await payment_1.Payment.findById(req.params.id)
            .populate('bedId', 'bedNumber roomNumber')
            .populate('propertyId', 'title location');
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found."
            });
        }
        res.status(200).json({
            success: true,
            data: payment
        });
    }
    catch (error) {
        console.error('Error fetching payment by ID:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Payment ID format.'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve payment.'
        });
    }
};
exports.getPaymentById = getPaymentById;
// Update an existing payment by ID
const updatePayment = async (req, res) => {
    try {
        const payment = await payment_1.Payment.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run schema validators on update
        }).populate('bedId', 'bedNumber roomNumber')
            .populate('propertyId', 'title location');
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found."
            });
        }
        res.status(200).json({
            success: true,
            message: "Payment updated successfully.",
            data: payment
        });
    }
    catch (error) {
        console.error('Error updating payment:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Payment ID format.'
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error: Could not update payment.",
            error: error.message
        });
    }
};
exports.updatePayment = updatePayment;
// Delete a payment by ID
const deletePayment = async (req, res) => {
    try {
        const payment = await payment_1.Payment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found.'
            });
        }
        res.status(204).json({
            success: true,
            message: 'Payment deleted successfully.'
        });
    }
    catch (error) {
        console.error('Error deleting payment:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Payment ID format.'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not delete payment.'
        });
    }
};
exports.deletePayment = deletePayment;
