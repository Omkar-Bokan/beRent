"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authcontroller_1 = require("../controllers/Authcontroller");
const router = express_1.default.Router();
router.post('/send-otp', Authcontroller_1.sendOtp);
router.post('/verify-otp', Authcontroller_1.verifyOtp);
exports.default = router;
