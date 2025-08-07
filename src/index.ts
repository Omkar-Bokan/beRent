import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; 
import propertyRoutes from './routes/propertyRoutes';
import paymentRoutes from './routes/Payment'
import authRoutes from './routes/AuthRoutes';
import historyRoutes from './routes/HistoryRoutes';
import googleRoutes from './routes/auth'
import leadRoutes from './routes/LeadRoutes';
import profileRoutes from './routes/Profile';
import bedRoutes from './routes/BedsRoutes'
import adminProfileRoutes from './routes/AdminRoutes'
import connectToMongo from './db/db';
dotenv.config();

const app = express();
connectToMongo();

const PORT = process.env.PORT || 5000;

// app.use(cors());
app.use(require('cors')({
  origin: '*', // or restrict to your firebase domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'ngrok-skip-browser-warning']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "data")));

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));


// app.use('/api/auth', authRoutes);
app.use('/api/auth', googleRoutes);
app.use('/api/admin', adminProfileRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api', historyRoutes);
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