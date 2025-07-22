"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PaymentController_1 = require("../controllers/PaymentController");
const router = express_1.default.Router();
router.route('/')
    .post(PaymentController_1.createPayment) // POST /api/payments - Create a new payment
    .get(PaymentController_1.getAllPayments); // GET /api/payments - Get all payments
router.route('/:id')
    .get(PaymentController_1.getPaymentById) // GET /api/payments/:id - Get a single payment by ID
    .put(PaymentController_1.updatePayment) // PUT /api/payments/:id - Update an existing payment
    .delete(PaymentController_1.deletePayment); // DELETE /api/payments/:id - Delete a payment
exports.default = router;
