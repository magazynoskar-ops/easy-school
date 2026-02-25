import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// load environment variables early
dotenv.config();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS blocked for this origin'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env');
  process.exit(1);
}

// create MongoDB client (no options needed for v7.x)
const client = new MongoClient(MONGO_URI);

// import routers and models so we can init after connection
import authRoutes from './routes/auth.js';
import setsRoutes from './routes/sets.js';
import adminRoutes from './routes/admin.js';
import { init as initUserModel } from './models/User.js';
import { init as initSetModel } from './models/Set.js';

// attempt connection once at startup
async function connectDB() {
  try {
    await client.connect();
    console.log('Połączenie z bazą MongoDB powiodło się!');

    const db = client.db();
    // initialize models with db instance
    initUserModel(db);
    initSetModel(db);

    // mount routes after models initialized
    app.use('/api/auth', authRoutes);
    app.use('/api/sets', setsRoutes);
    app.use('/api/admin', adminRoutes);

    // start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Błąd połączenia:', err);
    process.exit(1);
  }
}

connectDB();

// basic health check route
app.get('/', (req, res) => {
  res.send('Server działa na porcie ' + PORT);
});

// test endpoint to verify backend is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API działa poprawnie' });
});
