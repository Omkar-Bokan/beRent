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
import adminProfileRoutes from './routes/AdminRoutes'
import connectToMongo from './db/db';

dotenv.config();

const app = express();
connectToMongo();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "data")));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminProfileRoutes);
app.use('/api/users', profileRoutes);
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

// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url'; // <--- IMPORTANT: For __dirname in ES Modules

// import propertyRoutes from './routes/propertyRoutes';
// import paymentRoutes from './routes/Payment'
// import authRoutes from './routes/AuthRoutes';
// import leadRoutes from './routes/LeadRoutes';
// import profileRoutes from './routes/Profile';
// import bedRoutes from './routes/BedsRoutes'
// import adminProfileRoutes from './routes/AdminRoutes'


// import connectToMongo from './db/db';

// dotenv.config();

// const app = express();
// connectToMongo();

// // --- CORRECTED: Use port 4000 to match frontend API_BASE_URL ---
// const PORT = process.env.PORT || 4000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(cors());
// app.use(express.json());

// // Serve static files from the 'data' directory
// // Adjust the '..' if your 'data' folder is structured differently relative to 'dist'
// app.use("/public", express.static(path.join(__dirname, '..', "data")));


// // --- API Routes ---
// // Ensure these mounting paths match your frontend calls
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminProfileRoutes);
// app.use('/api/users', profileRoutes);
// app.use('/api/properties', propertyRoutes);
// app.use('/api/beds', bedRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/leads', leadRoutes);

// // Basic root route
// app.get("/", (req, res) => {
//   res.send("FriendlyAbode API is running!");
// });

// // Global Error Handler
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });


// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
