// backend/src/routes/auth.ts

import express from 'express';
import {
    googleAuthCallback,
    updateGoogleProfileWithPhone,
    // Add other auth-related controllers here if you have them (e.g., login, register)
} from '../controllers/Profile'; // Assuming these are still in Profile.ts for now, will move later

const router = express.Router();

// Google Auth specific routes
router.post('/google-callback', googleAuthCallback); // Full path will be /api/auth/google-callback
router.put('/google/:firebaseUid/phone', updateGoogleProfileWithPhone); // Full path will be /api/auth/google/:firebaseUid/phone

// You might add other authentication routes here, e.g.:
// router.post('/login', loginUser);
// router.post('/register', registerUser);

export default router;
