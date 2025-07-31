// backend/src/routes/profile.ts (Updated - removed auth routes)

import express from 'express';
import {
    createProfile,
    getProfiles,
    getProfileById,
    updateProfileById,
    deleteProfileById,
    // Removed googleAuthCallback, updateGoogleProfileWithPhone
} from '../controllers/Profile';

const router = express.Router();

// Profile management routes (will be mounted under /api/users)
router.post('/', createProfile); // For email/password signup
router.get('/', getProfiles);
router.get('/:id', getProfileById);
router.put('/:id', updateProfileById);
router.delete('/:id', deleteProfileById);

export default router;
