import express from 'express'
import http from 'http';
import path from 'path';
import cors from 'cors';
import env from 'dotenv';
import authRoutes from './src/routes/AuthRoutes';

import connectToMongo from './src/db/db';
env.config();

const app = express();
connectToMongo();

const PORT = process.env.PORT || 3000;

// Create HTTP server and bind to Socket.IO
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "data")));

app.use('/api/auth', authRoutes);


app.get("/", (req, res) => {
  res.send("API is working...");
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});