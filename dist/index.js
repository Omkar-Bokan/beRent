"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv")); // Use dotenv instead of 'env'
const path_1 = __importDefault(require("path")); // Only if you need static files
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
// import leadRoutes from './routes/LeadRoutes'; // <--- ASSUME YOU CREATE THIS FILE
const Profile_1 = __importDefault(require("./routes/Profile"));
// IMPORT OTHER ROUTES HERE (e.g., propertyRoutes, bedRoutes, paymentRoutes)
const db_1 = __importDefault(require("./db/db"));
dotenv_1.default.config(); // Load environment variables
const app = (0, express_1.default)();
(0, db_1.default)(); // Connect to MongoDB
const PORT = process.env.PORT || 5000; // Common port for APIs is 5000 or 8000
// Middleware
app.use((0, cors_1.default)()); // Enable CORS for all origins (adjust in production)
app.use(express_1.default.json()); // Body parser for JSON data
// app.use(express.urlencoded({ extended: true })); // For URL-encoded data if needed
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "data"))); // If you serve static files
// API Routes
app.use('/api/auth', AuthRoutes_1.default);
app.use('/api/admin', Profile_1.default); // Admin profile related routes
// Make sure to create these files:
// app.use('/api/properties', propertyRoutes);
// app.use('/api/beds', bedRoutes);
// app.use('/api/payments', paymentRoutes);
app.use('/api/leads', AuthRoutes_1.default); // Correctly mapped to LeadRoutes
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
