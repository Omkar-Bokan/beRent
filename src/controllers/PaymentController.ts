// src/controllers/paymentController.ts
import { Request, Response } from 'express';
import { Payment } from '../model/payment';
export const createPayment = async (req: Request, res: Response) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json({
            success: true,
            message: "Payment recorded successfully.",
            data: payment
        });
    } catch (error: any) {
        console.error('Error creating payment:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
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

// Get all payments
export const getAllPayments = async (req: Request, res: Response) => {
    try {
        // Populate bedId and propertyId for more context
        const payments = await Payment.find({})
            .populate('bedId', 'bedNumber roomNumber')
            .populate('propertyId', 'title location');
        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error: any) { // Added : any for error type
        console.error('Error fetching all payments:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve payments.'
        });
    }
};

// Get a single payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
    try {
        const payment = await Payment.findById(req.params.id)
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
    } catch (error: any) {
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

// Update an existing payment by ID
export const updatePayment = async (req: Request, res: Response) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
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
    } catch (error: any) {
        console.error('Error updating payment:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Payment ID format.'
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
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

// Delete a payment by ID
export const deletePayment = async (req: Request, res: Response) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found.'
            });
        }

        res.status(204).json({ // 204 No Content for successful deletion
            success: true,
            message: 'Payment deleted successfully.'
        });
    } catch (error: any) {
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
