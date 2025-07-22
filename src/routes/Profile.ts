import express from 'express';
import {
    createProfile,
    getProfiles,
    getProfileById,
    updateProfileById,
    deleteProfileById,
} from '../controllers/Profile';

const router = express.Router();


router.post('/', createProfile);
router.get('/', getProfiles);

router.get('/:id', getProfileById);
router.put('/:id', updateProfileById);
router.delete('/:id', deleteProfileById);

export default router; 