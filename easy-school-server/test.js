import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Połączenie z bazą MongoDB powiodło się!');
  } catch (err) {
    console.error('Błąd połączenia:', err);
  } finally {
    await client.close();
  }
}

run();
