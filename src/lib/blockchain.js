import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Simulated Master Chain for FRACTXON_
 * This utility mocks blockchain behavior while persisting data to Firestore.
 */

const generateHash = (data) => {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0').slice(-64);
};

export const blockchain = {
  addTransaction: async (from, to, amount, assetId, type = 'TRANSFER') => {
    const tx = {
      from,
      to,
      amount,
      assetId,
      type,
      timestamp: Date.now(),
      status: 'VERIFIED'
    };

    // Calculate a simulated hash for the transaction
    const hash = generateHash(tx);
    const completeTx = { ...tx, hash };

    try {
      // Persist to Master Ledger in Firestore
      await addDoc(collection(db, 'transactions'), {
        ...completeTx,
        serverTime: serverTimestamp()
      });
      
      console.log(`[Blockchain] New Transaction Persisted: ${hash}`);
      return completeTx;
    } catch (error) {
      console.error("[Blockchain] Transaction Failed:", error);
      throw error;
    }
  }
};
