import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// Typical mojibake artifacts created by decoding UTF-8 as latin1/cp1252.
const MOJIBAKE_HINT = /[ÃÄÅ]/;

const MANUAL_FIXES = new Map([
  ['d?ugi weekend', 'długi weekend'],
  ['wzi?? udział w zaj?ciach', 'wziąć udział w zajęciach'],
  ['robi? zdjęcia', 'robić zdjęcia'],
  ['zrelaksowany, rozlu?niony', 'zrelaksowany, rozluźniony'],
  ['mie? problem z kim?/czym?', 'mieć problem z kimś/czymś'],
  ['zwr?cić się do kogo? po rad?', 'zwrócić się do kogoś po radę'],
  ['zmywa? naczynia', 'zmywać naczynia'],
  ['wzi?? prysznic', 'wziąć prysznic'],
  ['za godzin?/kilka minut', 'za godzinę/kilka minut'],
  ['Bo?e Narodzenie', 'Boże Narodzenie']
]);

function toUtf8(value) {
  return Buffer.from(String(value ?? ''), 'utf8').toString('utf8').normalize('NFC');
}

function decodeLatin1AsUtf8(value) {
  return Buffer.from(String(value), 'latin1').toString('utf8').normalize('NFC');
}

function repairText(input) {
  const original = toUtf8(input);
  let output = original;

  if (MOJIBAKE_HINT.test(original)) {
    const repaired = decodeLatin1AsUtf8(original);
    if (repaired && repaired.length > 0) {
      output = repaired;
    }
  }

  if (MANUAL_FIXES.has(output)) {
    output = MANUAL_FIXES.get(output);
  }

  return output;
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is missing in .env');
}

const client = new MongoClient(process.env.MONGO_URI);
await client.connect();

const db = client.db();
const sets = db.collection('sets');

const allSets = await sets.find({ words: { $type: 'array' } }).toArray();

let updatedSets = 0;
let updatedWords = 0;
const unresolved = [];

for (const set of allSets) {
  let changed = false;
  const nextWords = (set.words || []).map((word) => {
    if (!word || typeof word !== 'object') return word;
    const currentPolish = String(word.polish ?? '');
    const currentEnglish = String(word.english ?? '');
    const fixedPolish = repairText(currentPolish);
    const fixedEnglish = repairText(currentEnglish);

    if (fixedPolish !== currentPolish || fixedEnglish !== currentEnglish) {
      changed = true;
      updatedWords += 1;
    }

    if (fixedPolish.includes('?')) {
      unresolved.push({
        setId: set._id.toString(),
        setName: set.name,
        english: fixedEnglish,
        polish: fixedPolish
      });
    }

    return { ...word, polish: fixedPolish, english: fixedEnglish };
  });

  if (changed) {
    await sets.updateOne(
      { _id: set._id },
      { $set: { words: nextWords, updatedAt: new Date() } }
    );
    updatedSets += 1;
  }
}

console.log(JSON.stringify({
  scannedSets: allSets.length,
  updatedSets,
  updatedWords,
  unresolvedCount: unresolved.length,
  unresolvedPreview: unresolved.slice(0, 10)
}, null, 2));

await client.close();
