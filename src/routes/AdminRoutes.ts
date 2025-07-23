
import express from 'express';
import {
    getAdminProfile,
    createAdminProfile,
    updateAdminProfile
} from '../controllers/AdminController';

const router = express.Router();


router.route('/profile')
    .get(getAdminProfile)    // GET /api/admin/profile - Get the admin profile
    .post(createAdminProfile) // POST /api/admin/profile - Create an admin profile (initial setup)
    .put(updateAdminProfile); // PUT /api/admin/profile - Update the existing admin profile

export default router;
