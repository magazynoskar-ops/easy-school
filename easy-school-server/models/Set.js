import { ObjectId } from 'mongodb';

let setsCollection = null;

export function init(db) {
  setsCollection = db.collection('sets');
}

function normalizeWord(word) {
  if (!word || typeof word !== 'object') return null;
  const polish = typeof word.polish === 'string' ? toUtf8(word.polish).trim() : '';
  const english = typeof word.english === 'string' ? toUtf8(word.english).trim() : '';
  if (!polish || !english) return null;
  return { polish, english };
}

function toUtf8(text) {
  return Buffer.from(String(text), 'utf8').toString('utf8').normalize('NFC');
}

export function normalizeWords(words) {
  if (!Array.isArray(words)) return [];
  return words.map(normalizeWord).filter(Boolean);
}

export async function createSet({ name, words, createdBy, isPublic }) {
  const ownerId = typeof createdBy === 'string' ? new ObjectId(createdBy) : createdBy;
  const set = {
    name: toUtf8(name).trim(),
    words: normalizeWords(words),
    createdBy: ownerId,
    isPublic: !!isPublic,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const result = await setsCollection.insertOne(set);
  return result.insertedId;
}

export async function findById(id) {
  if (typeof id === 'string' && !ObjectId.isValid(id)) return null;
  const _id = typeof id === 'string' ? new ObjectId(id) : id;
  return setsCollection.findOne({ _id });
}

export async function findAllSets() {
  return setsCollection.find({}).sort({ createdAt: -1 }).toArray();
}

export async function findPublicSets() {
  return setsCollection.find({
    $or: [{ isPublic: true }, { isGlobal: true }]
  }).sort({ createdAt: -1 }).toArray();
}

export async function findForUser(userId, role) {
  if (role === 'admin') {
    return findAllSets();
  }
  if (typeof userId === 'string' && !ObjectId.isValid(userId)) {
    return findPublicSets();
  }
  const _id = typeof userId === 'string' ? new ObjectId(userId) : userId;
  return setsCollection.find({
    $or: [
      { isPublic: true },
      { isGlobal: true },
      { createdBy: _id },
      { userId: _id }
    ]
  }).sort({ createdAt: -1 }).toArray();
}

export async function updateSet(id, updates) {
  if (typeof id === 'string' && !ObjectId.isValid(id)) return null;
  const _id = typeof id === 'string' ? new ObjectId(id) : id;
  const safeUpdates = { ...updates, updatedAt: new Date() };
  if ('words' in safeUpdates) {
    safeUpdates.words = normalizeWords(safeUpdates.words);
  }
  await setsCollection.updateOne({ _id }, { $set: safeUpdates });
  return findById(_id);
}

export async function deleteSet(id) {
  if (typeof id === 'string' && !ObjectId.isValid(id)) return { deletedCount: 0 };
  const _id = typeof id === 'string' ? new ObjectId(id) : id;
  return setsCollection.deleteOne({ _id });
}
