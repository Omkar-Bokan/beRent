"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const propertyController_1 = require("../controllers/propertyController");
const router = express_1.default.Router();
// Route to create a new property with image uploads
// 'upload' middleware processes 'images' field from FormData
router.post('/', propertyController_1.upload, propertyController_1.createProperty);
// Route to update an existing property with new image uploads
// 'uploadUpdate' middleware processes 'newImages' field from FormData
router.put('/:id', propertyController_1.uploadUpdate, propertyController_1.updateProperty);
// Route to get all properties
router.get('/', propertyController_1.getProperties);
// Route to get a single property by ID
router.get('/:id', propertyController_1.getPropertyById);
// Route to update only the status of a property (partial update)
router.patch('/status/:id', propertyController_1.updatePropertyStatus);
// Route to delete a property by ID
router.delete('/:id', propertyController_1.deleteProperty);
exports.default = router;
