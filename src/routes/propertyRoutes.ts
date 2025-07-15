import express from 'express';
import { addProperty, getProperties, createProperty } from '../controllers/propertyController';

const router = express.Router();

router.post('/add', addProperty);
router.post('/', createProperty);
router.get('/', getProperties);

export default router;



