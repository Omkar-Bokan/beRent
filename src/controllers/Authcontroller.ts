import { User } from '../model/user';
import jwt from 'jsonwebtoken';


import { protect } from '../middleware/middleware';
import { Request, Response } from "express";

const API_KEY = process.env.TWO_FACTOR_API_KEY;

export const sendOtp = async (req: any, res: any) => {
  const { phone } = req.body;
  try {
    const apiUrl = `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.Status === 'Success') {
      res.status(200).json({ sessionId: data.Details });
    } else {
      res.status(400).json({ error: 'Failed to send OTP', details: data.Details });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to send OTP', details: err.message });
  }
};

export const verifyOtp = async (req: any, res: any) => {
  const { phone, sessionId, otp } = req.body;
  try {
    const apiUrl = `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.Status === 'Success') {
      let user = await User.findOne({ phone });
      if (!user) {
        user = await User.create({ phone, isVerified: true });
      } else {
        user.isVerified = true;
        await user.save();
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
      }
      const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: '1h',
      });

      return res.status(200).json({ message: 'OTP verified', token });
    } else {
      return res.status(400).json({ error: 'Invalid OTP', details: data.Details });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'OTP verification failed', details: err.message });
  }
};

// import { protect } from '../middleware/authMiddleware.js';

// router.get('/profile', protect, async (req, res) => {
//   const user = await User.findById(req.user.userId);
//   res.json(user);
// });
