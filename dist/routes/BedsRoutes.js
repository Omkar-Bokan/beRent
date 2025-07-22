"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Assuming controller functions are imported correctly in a real file structure:
const Beds_1 = require("../controllers/Beds");
const router = express_1.default.Router();
router.route('/')
    .post(Beds_1.createBed)
    .get(Beds_1.getAllBeds);
router.route('/:id')
    .get(Beds_1.getBedById) // GET /api/beds/:id - Get a single bed by ID
    .put(Beds_1.updateBed); // PUT /api/beds/:id - Update an existing bed (full or partial update)
exports.default = router;
