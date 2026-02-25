import { ObjectId } from 'mongodb';

let usersCollection = null;

export function init(db) {
  usersCollection = db.collection('users');
  usersCollection.createIndex({ email: 1 }, { unique: true }).catch((err) => {
    console.error('Failed to ensure unique index on users.email', err);
  });
  usersCollection.createIndex({ username: 1 }, { unique: true }).catch((err) => {
    console.error('Failed to ensure unique index on users.username', err);
  });
}

export async function createUser({ username, email, passwordHash, role }) {
  const user = {
    username,
    email,
    passwordHash,
    role: role || 'user',
    createdAt: new Date()
  };
  const result = await usersCollection.insertOne(user);
  return result.insertedId;
}

export async function findByEmail(email) {
  return usersCollection.findOne({ email });
}

export async function findByUsername(username) {
  return usersCollection.findOne({ username });
}

export async function findById(id) {
  if (typeof id === 'string' && !ObjectId.isValid(id)) {
    return null;
  }
  const _id = typeof id === 'string' ? new ObjectId(id) : id;
  return usersCollection.findOne({ _id });
}

export async function findAllUsers() {
  return usersCollection.find({}, {
    projection: {
      username: 1,
      email: 1,
      role: 1
    }
  }).toArray();
}

export async function updateUserById(id, updates) {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  const _id = new ObjectId(id);
  await usersCollection.updateOne({ _id }, { $set: updates });
  return usersCollection.findOne({ _id }, {
    projection: {
      username: 1,
      email: 1,
      role: 1
    }
  });
}

export async function deleteUserById(id) {
  if (!ObjectId.isValid(id)) {
    return { deletedCount: 0 };
  }
  const _id = new ObjectId(id);
  return usersCollection.deleteOne({ _id });
}
