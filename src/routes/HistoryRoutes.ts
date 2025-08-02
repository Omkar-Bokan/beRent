// src/routes/historyRoutes.ts

import express from 'express';
import { PaymentHistory } from '../model/PaymentHistory'; // Assuming the path
import { TenantHistory } from '../model/TenantSchema' // Assuming the path
import { Request, Response } from 'express';

const router = express.Router();

// GET all payment history records
router.get('/payment-history', async (req: Request, res: Response) => {
    try {
        const history = await PaymentHistory.find({})
            .populate('propertyId', 'title location')
            .populate('bedId', 'bedNumber roomNumber');

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve payment history.'
        });
    }
});

// GET all tenant history records
router.get('/tenant-history', async (req: Request, res: Response) => {
    try {
        const history = await TenantHistory.find({})
            .populate('propertyId', 'title location')
            .populate('bedId', 'bedNumber roomNumber');

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        console.error('Error fetching tenant history:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve tenant history.'
        });
    }
});

export default router;