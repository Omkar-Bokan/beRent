import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import propertyRoutes from './routes/propertyRoutes';
import paymentRoutes from './routes/Payment'
import authRoutes from './routes/AuthRoutes';
import leadRoutes from './routes/LeadRoutes';
import profileRoutes from './routes/Profile';
import bedRoutes from './routes/BedsRoutes'

import connectToMongo from './db/db';

dotenv.config();

const app = express();
connectToMongo();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "data")));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', profileRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/payments', paymentRoutes);

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