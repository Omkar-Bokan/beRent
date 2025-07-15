// import express from 'express'
// import http from 'http';
// import path from 'path';
// import cors from 'cors';
// import env from 'dotenv';
// import authRoutes from './routes/AuthRoutes';

// import connectToMongo from './db/db';
// env.config();

// const app = express();
// connectToMongo();

// const PORT = process.env.PORT || 3000;

// // Create HTTP server and bind to Socket.IO
// const server = http.createServer(app);

// app.use(cors());
// app.use(express.json());
// app.use("/public", express.static(path.join(__dirname, "data")));

// app.use('/api/auth', authRoutes);


// app.get("/", (req, res) => {
//   res.send("API is working...");
// });

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });



import express, { Application } from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes';
import propertyRoutes from './routes/propertyRoutes';


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "data")));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

app.get("/", (req, res) => {
    res.send("API is working...");
});

// Start server
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

