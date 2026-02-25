import express from 'express';
import { checkAdmin, verifyJWT } from '../middleware/auth.js';
import {
  createSet,
  deleteSet,
  findAllSets,
  findById,
  findForUser,
  findPublicSets,
  normalizeWords,
  updateSet
} from '../models/Set.js';

const router = express.Router();

function wordsInputHasInvalidPairs(inputWords) {
  if (!Array.isArray(inputWords)) return true;
  return inputWords.some((word) => {
    if (!word || typeof word !== 'object') return true;
    const polish = typeof word.polish === 'string' ? word.polish.trim() : '';
    const english = typeof word.english === 'string' ? word.english.trim() : '';
    return !polish || !english;
  });
}

function serializeSet(set) {
  return {
    _id: set._id.toString(),
    name: set.name,
    words: set.words || [],
    createdBy: set.createdBy?.toString?.() || set.userId?.toString?.() || set.createdBy || set.userId,
    isPublic: !!set.isPublic || !!set.isGlobal,
    createdAt: set.createdAt,
    updatedAt: set.updatedAt
  };
}

router.get('/', verifyJWT, async (req, res) => {
  try {
    const sets = await findForUser(req.user.id, req.user.role);
    return res.json(sets.map(serializeSet));
  } catch (err) {
    console.error('Fetch sets error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/public', async (_req, res) => {
  try {
    const sets = await findPublicSets();
    return res.json(sets.map(serializeSet));
  } catch (err) {
    console.error('Fetch public sets error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', verifyJWT, checkAdmin, async (req, res) => {
  try {
    const { name, words, isPublic } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Set name is required' });
    }
    if (!Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ message: 'At least one word pair is required' });
    }
    if (wordsInputHasInvalidPairs(words)) {
      return res.status(400).json({ message: 'Each word must include both polish and english values' });
    }
    const normalizedWords = normalizeWords(words || []);
    const id = await createSet({
      name: name.trim(),
      words: normalizedWords,
      createdBy: req.user.id,
      isPublic: !!isPublic
    });
    const created = await findById(id);
    return res.status(201).json(serializeSet(created));
  } catch (err) {
    console.error('Create set error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', verifyJWT, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Set not found' });
    }

    const updates = {};
    if (typeof req.body.name === 'string' && req.body.name.trim()) {
      updates.name = req.body.name.trim();
    }
    if ('words' in req.body) {
      if (!Array.isArray(req.body.words) || req.body.words.length === 0) {
        return res.status(400).json({ message: 'At least one word pair is required' });
      }
      if (wordsInputHasInvalidPairs(req.body.words)) {
        return res.status(400).json({ message: 'Each word must include both polish and english values' });
      }
      updates.words = normalizeWords(req.body.words || []);
    }
    if ('isPublic' in req.body) {
      updates.isPublic = !!req.body.isPublic;
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updated = await updateSet(id, updates);
    return res.json(serializeSet(updated));
  } catch (err) {
    console.error('Update set error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', verifyJWT, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Set not found' });
    }
    await deleteSet(id);
    return res.json({ message: 'Set deleted' });
  } catch (err) {
    console.error('Delete set error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Dedicated endpoint for admin refreshes in admin panel if needed
router.get('/all/admin', verifyJWT, checkAdmin, async (_req, res) => {
  try {
    const sets = await findAllSets();
    return res.json(sets.map(serializeSet));
  } catch (err) {
    console.error('Fetch all sets error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
