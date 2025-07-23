"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
const Payment_1 = __importDefault(require("./routes/Payment"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const LeadRoutes_1 = __importDefault(require("./routes/LeadRoutes"));
const Profile_1 = __importDefault(require("./routes/Profile"));
const BedsRoutes_1 = __importDefault(require("./routes/BedsRoutes"));
const AdminRoutes_1 = __importDefault(require("./routes/AdminRoutes"));
const db_1 = __importDefault(require("./db/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "data")));
app.use('/api/auth', AuthRoutes_1.default);
app.use('/api/admin', AdminRoutes_1.default);
app.use('/api/users', Profile_1.default);
app.use('/api/properties', propertyRoutes_1.default);
app.use('/api/beds', BedsRoutes_1.default);
app.use('/api/payments', Payment_1.default);
app.use('/api/leads', LeadRoutes_1.default);
// Basic root route
app.get("/", (req, res) => {
    res.send("FriendlyAbode API is running!");
});
// Global Error Handler (Optional but Recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url'; // <--- IMPORTANT: For __dirname in ES Modules
// import propertyRoutes from './routes/propertyRoutes';
// import paymentRoutes from './routes/Payment'
// import authRoutes from './routes/AuthRoutes';
// import leadRoutes from './routes/LeadRoutes';
// import profileRoutes from './routes/Profile';
// import bedRoutes from './routes/BedsRoutes'
// import adminProfileRoutes from './routes/AdminRoutes'
// import connectToMongo from './db/db';
// dotenv.config();
// const app = express();
// connectToMongo();
// // --- CORRECTED: Use port 4000 to match frontend API_BASE_URL ---
// const PORT = process.env.PORT || 4000;
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(cors());
// app.use(express.json());
// // Serve static files from the 'data' directory
// // Adjust the '..' if your 'data' folder is structured differently relative to 'dist'
// app.use("/public", express.static(path.join(__dirname, '..', "data")));
// // --- API Routes ---
// // Ensure these mounting paths match your frontend calls
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminProfileRoutes);
// app.use('/api/users', profileRoutes);
// app.use('/api/properties', propertyRoutes);
// app.use('/api/beds', bedRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/leads', leadRoutes);
// // Basic root route
// app.get("/", (req, res) => {
//   res.send("FriendlyAbode API is running!");
// });
// // Global Error Handler
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
