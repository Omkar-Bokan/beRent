"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const AuthRoutes_1 = __importDefault(require("./routes/AuthRoutes"));
const db_1 = __importDefault(require("./db/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
const PORT = process.env.PORT || 3000;
// Create HTTP server and bind to Socket.IO
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "data")));
app.use('/api/auth', AuthRoutes_1.default);
app.get("/", (req, res) => {
    res.send("API is working...");
});
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
