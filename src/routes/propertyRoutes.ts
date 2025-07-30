import express from 'express';
import {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    updatePropertyStatus,
    deleteProperty,
    upload,      // Multer middleware for creating properties (single or multiple images)
    uploadUpdate // Multer middleware for updating properties (new images)
} from '../controllers/propertyController';

const router = express.Router();

// Route to create a new property with image uploads
// 'upload' middleware processes 'images' field from FormData
router.post('/', upload, createProperty);

// Route to update an existing property with new image uploads
// 'uploadUpdate' middleware processes 'newImages' field from FormData
router.put('/:id', uploadUpdate, updateProperty);

// Route to get all properties
router.get('/', getProperties);

// Route to get a single property by ID
router.get('/:id', getPropertyById);

// Route to update only the status of a property (partial update)
router.patch('/status/:id', updatePropertyStatus);

// Route to delete a property by ID
router.delete('/:id', deleteProperty);

export default router;