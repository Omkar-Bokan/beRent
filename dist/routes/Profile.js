"use strict";
// backend/src/routes/profile.ts (Updated - removed auth routes)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Profile_1 = require("../controllers/Profile");
const router = express_1.default.Router();
// Profile management routes (will be mounted under /api/users)
router.post('/', Profile_1.createProfile); // For email/password signup
router.get('/', Profile_1.getProfiles);
router.get('/:id', Profile_1.getProfileById);
router.put('/:id', Profile_1.updateProfileById);
router.delete('/:id', Profile_1.deleteProfileById);
exports.default = router;
