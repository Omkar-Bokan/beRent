// import express from 'express';
// import {
//     createProperty,
//     getProperties,
//     getPropertyById,
//     updateProperty,
//     updatePropertyStatus,
//     deleteProperty,
//     upload,    
//     uploadUpdate 
// } from '../controllers/propertyController';
// const router = express.Router();
// router.post('/', upload, createProperty);
// router.put('/:id', uploadUpdate, updateProperty);
// router.get('/', getProperties);
// router.get('/:id', getPropertyById);
// router.patch('/status/:id', updatePropertyStatus);
// router.delete('/:id', deleteProperty);
// export default router;



import express from 'express';
import {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    updatePropertyStatus,
    deleteProperty,
    upload
} from '../controllers/propertyController';

const router = express.Router();

// The upload middleware is now a single, more flexible one.
// We remove `uploadUpdate` as it's no longer necessary with the new logic.

router.post('/', upload, createProperty);
router.put('/:id', upload, updateProperty);
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.patch('/status/:id', updatePropertyStatus);
router.delete('/:id', deleteProperty);

export default router;