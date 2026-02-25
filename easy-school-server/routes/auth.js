import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createUser, findByEmail, findByUsername } from '../models/User.js';

dotenv.config();

const router = express.Router();

function createAuthToken(user) {
  const payload = {
    id: user._id.toString(),
    username: user.username,
    role: user.role
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ message: 'Nazwa uzytkownika jest wymagana' });
    }
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email jest wymagany' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Haslo musi miec co najmniej 6 znakow' });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const existingByUsername = await findByUsername(normalizedUsername);
    if (existingByUsername) {
      return res.status(400).json({ message: 'Nazwa uzytkownika jest juz zajeta' });
    }

    const existingByEmail = await findByEmail(normalizedEmail);
    if (existingByEmail) {
      return res.status(400).json({ message: 'Uzytkownik juz istnieje' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const insertedId = await createUser({
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash: hash,
      role: 'user'
    });

    const user = {
      _id: insertedId.toString(),
      username: normalizedUsername,
      email: normalizedEmail,
      role: 'user'
    };
    const token = createAuthToken(user);

    return res.status(201).json({ token, user });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Blad serwera' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || typeof email !== 'string' || !password) {
      return res.status(400).json({ message: 'Niepoprawny email lub haslo' });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await findByEmail(normalizedEmail);
    if (!user) {
      return res.status(400).json({ message: 'Niepoprawny email lub haslo' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Niepoprawny email lub haslo' });
    }

    const token = createAuthToken(user);
    return res.status(200).json({
      token,
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
