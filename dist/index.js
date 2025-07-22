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
// API Routes
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
