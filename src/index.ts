import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import propertyRoutes from './routes/propertyRoutes';

import authRoutes from './routes/AuthRoutes';
import leadRoutes from './routes/LeadRoutes';
import profileRoutes from './routes/Profile';


import connectToMongo from './db/db';

dotenv.config(); // Load environment variables

const app = express();
connectToMongo(); // Connect to MongoDB

const PORT = process.env.PORT || 5000; // Common port for APIs is 5000 or 8000

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust in production)
app.use(express.json()); // Body parser for JSON data
// app.use(express.urlencoded({ extended: true })); // For URL-encoded data if needed
app.use("/public", express.static(path.join(__dirname, "data"))); // If you serve static files

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', profileRoutes);
app.use('/api/properties', propertyRoutes);

// Make sure to create these files:
// app.use('/api/properties', propertyRoutes);
// app.use('/api/beds', bedRoutes);
// app.use('/api/payments', paymentRoutes);

app.use('/api/leads', leadRoutes);

// Basic root route
app.get("/", (req, res) => {
  res.send("FriendlyAbode API is running!");
});

// Global Error Handler (Optional but Recommended)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});