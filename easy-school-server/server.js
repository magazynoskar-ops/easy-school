import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables early.
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

// Create MongoDB client (no options needed for mongodb v7.x).
const client = new MongoClient(MONGO_URI);

import authRoutes from './routes/auth.js';
import setsRoutes from './routes/sets.js';
import adminRoutes from './routes/admin.js';
import { init as initUserModel } from './models/User.js';
import { init as initSetModel } from './models/Set.js';

async function connectDB() {
  try {
    await client.connect();
    console.log('Polaczenie z baza MongoDB powiodlo sie');

    const db = client.db();
    initUserModel(db);
    initSetModel(db);

    app.use('/api/auth', authRoutes);
    app.use('/api/sets', setsRoutes);
    app.use('/api/admin', adminRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Blad polaczenia:', err);
    process.exit(1);
  }
}

connectDB();

app.get('/', (_req, res) => {
  res.send('Server dziala na porcie ' + PORT);
});

app.get('/api/test', (_req, res) => {
  res.json({ message: 'Backend API dziala poprawnie' });
});