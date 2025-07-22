import express from 'express';
// Assuming controller functions are imported correctly in a real file structure:
import {
    createBed,
    getAllBeds,
    getBedById,
    updateBed
} from '../controllers/Beds'

const router = express.Router();


router.route('/')
    .post(createBed) // POST /api/beds - Create a new bed
    .get(getAllBeds); // GET /api/beds - Get all beds

router.route('/:id')
    .get(getBedById) // GET /api/beds/:id - Get a single bed by ID
    .put(updateBed); // PUT /api/beds/:id - Update an existing bed (full or partial update)

export default router;