"use strict";
// import express from 'express';
// import {
//     createProperty,
//     getProperties,
//     getPropertyById,
//     updateProperty,
//     updatePropertyStatus
// } from '../controllers/propertyController';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// router.route('/')
//     .post(createProperty)
//     .get(getProperties);
// router.route('/:id')
//     .get(getPropertyById)
//     .put(updateProperty);
// router.route('/:id/status')
//     .patch(updatePropertyStatus);
// export default router;
const express_1 = __importDefault(require("express"));
const propertyController_1 = require("../controllers/propertyController");
const router = express_1.default.Router();
router.route('/')
    .post(propertyController_1.createProperty)
    .get(propertyController_1.getProperties);
router.route('/:id')
    .get(propertyController_1.getPropertyById)
    .put(propertyController_1.updateProperty);
router.route('/:id/status')
    .patch(propertyController_1.updatePropertyStatus);
exports.default = router;
