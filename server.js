import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});

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
