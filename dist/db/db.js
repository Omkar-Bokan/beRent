"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectionString = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.${process.env.MONGO_DB_STRING}.mongodb.net/${process.env.MONGO_DB_DATABASE}`;
const connectToDatabase = async () => {
    try {
        const response = await mongoose_1.default.connect(connectionString);
        if (response) {
            console.log("Database connection successful !");
        }
    }
    catch (error) {
        console.warn(error);
    }
};
exports.default = connectToDatabase;
