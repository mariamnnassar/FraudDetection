import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // للسماح بالطلبات من الـ frontend

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDyc6Bzi5M75CepEL2PtxiBxGSd7cwLyNc",
  authDomain: "fraud-detection-91f68.firebaseapp.com",
  projectId: "fraud-detection-91f68",
  storageBucket: "fraud-detection-91f68.firebasestorage.app",
  messagingSenderId: "459360027582",
  appId: "1:459360027582:web:80d215f275af2fc8dfefef"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// API Endpoint to get transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    const transactions = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      // convert timestamp to ISO string for JSON serializing
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
