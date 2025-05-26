import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url'; // لحل المسار

// جلب مسار الملف بطريقة صحيحة (لأنك بتستخدمي ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔒 استيراد مفتاح الخدمة بشكل صحيح
import serviceAccount from './fraud-detection-91f68-firebase-adminsdk-fbsvc-762ac94cca.json' assert { type: 'json' };

// ⚙️ تهيئة Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 🔗 الاتصال بقاعدة البيانات
const db = admin.firestore();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // لخدمة index.html مثلاً

// 📡 Endpoint لجلب البيانات
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
  console.log(`🚀 Server running at http://localhost:${port}`);
});
