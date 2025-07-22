import express from 'express';
import {
    createProfile,
    getProfiles,
    getProfileById,
    updateProfileById,
    deleteProfileById,
    getAdminProfile,
    updateAdminProfile
} from '../controllers/Profile';

const router = express.Router(); // <--- THIS IS THE KEY!

// Routes for the single Admin Profile (matching frontend's AdminContext)
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);

// General CRUD routes for other profiles (if needed, consider putting these under /users)
router.post('/', createProfile);
router.get('/', getProfiles);

// Routes requiring an ID (e.g., for specific general profiles)
router.get('/:id', getProfileById);
router.put('/:id', updateProfileById);
router.delete('/:id', deleteProfileById);

export default router; 