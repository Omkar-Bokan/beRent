"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Profile_1 = require("../controllers/Profile");
const router = express_1.default.Router(); // <--- THIS IS THE KEY!
// Routes for the single Admin Profile (matching frontend's AdminContext)
router.get('/profile', Profile_1.getAdminProfile);
router.put('/profile', Profile_1.updateAdminProfile);
// General CRUD routes for other profiles (if needed, consider putting these under /users)
router.post('/', Profile_1.createProfile);
router.get('/', Profile_1.getProfiles);
// Routes requiring an ID (e.g., for specific general profiles)
router.get('/:id', Profile_1.getProfileById);
router.put('/:id', Profile_1.updateProfileById);
router.delete('/:id', Profile_1.deleteProfileById);
exports.default = router;
