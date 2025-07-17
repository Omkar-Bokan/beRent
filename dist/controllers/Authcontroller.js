"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLead = exports.verifyOtp = exports.sendOtp = void 0;
const user_1 = __importDefault(require("../model/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_2 = __importDefault(require("../model/user"));
const API_KEY = process.env.TWO_FACTOR_API_KEY;
const sendOtp = async (req, res) => {
    const { phone } = req.body;
    try {
        const apiUrl = `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.Status === 'Success') {
            res.status(200).json({ sessionId: data.Details });
        }
        else {
            res.status(400).json({ error: 'Failed to send OTP', details: data.Details });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to send OTP', details: err.message });
    }
};
exports.sendOtp = sendOtp;
const verifyOtp = async (req, res) => {
    const { phone, sessionId, otp } = req.body;
    try {
        const apiUrl = `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.Status === 'Success') {
            let user = await user_1.default.findOne({ phone });
            if (!user) {
                user = await user_1.default.create({ phone, isVerified: true });
            }
            else {
                user.isVerified = true;
                await user.save();
            }
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, jwtSecret, {
                expiresIn: '1h',
            });
            return res.status(200).json({ message: 'OTP verified', token });
        }
        else {
            return res.status(400).json({ error: 'Invalid OTP', details: data.Details });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'OTP verification failed', details: err.message });
    }
};
exports.verifyOtp = verifyOtp;
const createLead = async (req, res) => {
    try {
        const newLead = new user_2.default(req.body);
        await newLead.save();
        res.status(201).json({ message: "Lead created", lead: newLead });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create lead" });
    }
};
exports.createLead = createLead;
// import { protect } from '../middleware/authMiddleware.js';
// router.get('/profile', protect, async (req, res) => {
//   const user = await User.findById(req.user.userId);
//   res.json(user);
// });
