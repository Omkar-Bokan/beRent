import express from 'express';
import {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    updatePropertyStatus
} from '../controllers/propertyController';

const router = express.Router();


router.route('/')
    .post(createProperty)
    .get(getProperties);
router.route('/:id')
    .get(getPropertyById)
    .put(updateProperty);

router.route('/:id/status')
    .patch(updatePropertyStatus);

export default router;
