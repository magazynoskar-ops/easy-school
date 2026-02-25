import express from 'express';
import { verifyJWT, checkAdmin } from '../middleware/auth.js';
import {
  deleteUserById,
  findAllUsers,
  findByEmail,
  findById,
  findByUsername,
  updateUserById
} from '../models/User.js';

const router = express.Router();

router.get('/users', verifyJWT, checkAdmin, async (_req, res) => {
  try {
    const users = await findAllUsers();
    const serialized = users.map((user) => ({
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    }));
    return res.json(serialized);
  } catch (err) {
    console.error('Admin get users error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id', verifyJWT, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updates = {};
    if (typeof req.body.username === 'string' && req.body.username.trim()) {
      const nextUsername = req.body.username.trim();
      const usernameTaken = await findByUsername(nextUsername);
      if (usernameTaken && usernameTaken._id.toString() !== id) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      updates.username = nextUsername;
    }
    if (typeof req.body.email === 'string' && req.body.email.trim()) {
      const nextEmail = req.body.email.trim().toLowerCase();
      const emailTaken = await findByEmail(nextEmail);
      if (emailTaken && emailTaken._id.toString() !== id) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updates.email = nextEmail;
    }
    if (typeof req.body.role === 'string') {
      if (!['user', 'admin'].includes(req.body.role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      updates.role = req.body.role;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updated = await updateUserById(id, updates);
    return res.json({
      _id: updated._id.toString(),
      username: updated.username,
      email: updated.email,
      role: updated.role
    });
  } catch (err) {
    console.error('Admin update user error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:id', verifyJWT, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id === id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const result = await deleteUserById(id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Admin delete user error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
