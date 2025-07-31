"use strict";
// backend/src/routes/auth.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Profile_1 = require("../controllers/Profile"); // Assuming these are still in Profile.ts for now, will move later
const router = express_1.default.Router();
// Google Auth specific routes
router.post('/google-callback', Profile_1.googleAuthCallback); // Full path will be /api/auth/google-callback
router.put('/google/:firebaseUid/phone', Profile_1.updateGoogleProfileWithPhone); // Full path will be /api/auth/google/:firebaseUid/phone
// You might add other authentication routes here, e.g.:
// router.post('/login', loginUser);
// router.post('/register', registerUser);
exports.default = router;
