"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/AdminProfileRoutes.ts
const express_1 = __importDefault(require("express"));
const AdminController_1 = require("../controllers/AdminController");
const router = express_1.default.Router();
/**
 * @fileoverview Admin Profile Routes - Defines API endpoints for the SINGLE admin profile management.
 * These routes operate on a single, implicit admin profile, not by ID.
 */
router.route('/')
    .get(AdminController_1.getAdminProfile) // GET /api/admin/profile - Get the admin profile
    .post(AdminController_1.createAdminProfile) // POST /api/admin/profile - Create an admin profile (initial setup)
    .put(AdminController_1.updateAdminProfile); // PUT /api/admin/profile - Update the existing admin profile
exports.default = router;
