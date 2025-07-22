
import express from 'express';

import {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment
} from '../controllers/PaymentController';

const router = express.Router();

router.route('/')
    .post(createPayment) // POST /api/payments - Create a new payment
    .get(getAllPayments); // GET /api/payments - Get all payments

router.route('/:id')
    .get(getPaymentById) // GET /api/payments/:id - Get a single payment by ID
    .put(updatePayment) // PUT /api/payments/:id - Update an existing payment
    .delete(deletePayment); // DELETE /api/payments/:id - Delete a payment

export default router;
