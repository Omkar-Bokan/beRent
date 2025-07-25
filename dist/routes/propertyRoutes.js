"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const propertyController_1 = require("../controllers/propertyController");
const router = express_1.default.Router();
router.post('/', propertyController_1.upload, propertyController_1.createProperty);
router.put('/:id', propertyController_1.uploadUpdate, propertyController_1.updateProperty);
router.get('/', propertyController_1.getProperties);
router.get('/:id', propertyController_1.getPropertyById);
router.patch('/status/:id', propertyController_1.updatePropertyStatus);
router.delete('/:id', propertyController_1.deleteProperty);
exports.default = router;
