
import express from 'express';
import {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    updatePropertyStatus,
    deleteProperty,
    upload,
    uploadUpdate
} from '../controllers/propertyController';

const router = express.Router();


router.post('/', upload, createProperty);
router.put('/:id', uploadUpdate, updateProperty);

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.patch('/status/:id', updatePropertyStatus);
router.delete('/:id', deleteProperty);

export default router;