import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🟢 اقرأ ملف JSON باستخدام fs
const serviceAccountPath = path.join(__dirname, 'fraud-detection-91f68-firebase-adminsdk-fbsvc-762ac94cca.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/api/transactions', async (req, res) => {
  try {
    const transactionsRef = db.collection('transactions');
    const snapshot = await transactionsRef.orderBy('timestamp', 'desc').get();

    const transactions = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.timestamp && data.timestamp.toDate) {
        data.timestamp = data.timestamp.toDate().toISOString();
      }
      transactions.push(data);
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
