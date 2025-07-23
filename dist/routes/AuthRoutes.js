"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Authcontroller_1 = require("../controllers/Authcontroller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/send-otp', Authcontroller_1.sendOtp);
router.post('/verify-otp', Authcontroller_1.verifyOtp);
router.get('/', async (req, res) => {
    res.json({ message: 'GET /api working!' });
});
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // your logic here
        res.status(200).json({ message: 'Success' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        res.status(200).json({ message: 'Updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
