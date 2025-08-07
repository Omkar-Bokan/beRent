"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
const Payment_1 = __importDefault(require("./routes/Payment"));
const HistoryRoutes_1 = __importDefault(require("./routes/HistoryRoutes"));
const auth_1 = __importDefault(require("./routes/auth"));
const LeadRoutes_1 = __importDefault(require("./routes/LeadRoutes"));
const Profile_1 = __importDefault(require("./routes/Profile"));
const BedsRoutes_1 = __importDefault(require("./routes/BedsRoutes"));
const AdminRoutes_1 = __importDefault(require("./routes/AdminRoutes"));
const db_1 = __importDefault(require("./db/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
const PORT = process.env.PORT || 5000;
// app.use(cors());
app.use(require('cors')({
    origin: '*', // or restrict to your firebase domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'ngrok-skip-browser-warning']
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "data")));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads')));
// app.use('/api/auth', authRoutes);
app.use('/api/auth', auth_1.default);
app.use('/api/admin', AdminRoutes_1.default);
app.use('/api/users', Profile_1.default);
app.use('/api/properties', propertyRoutes_1.default);
app.use('/api/beds', BedsRoutes_1.default);
app.use('/api/payments', Payment_1.default);
app.use('/api/leads', LeadRoutes_1.default);
app.use('/api', HistoryRoutes_1.default);
// Basic root route
app.get("/", (req, res) => {
    res.send("FriendlyAbode API is running!");
});
// Global Error Handler (Optional but Recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something broke!", error: err.message });
    ;
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
