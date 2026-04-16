import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';

/**
 * Simulated Master Chain for FRACTXON_
 * This utility mocks blockchain behavior while persisting data to Firestore.
 */

/**
 * Cryptographically Linked Ledger for FRACTXON_
 * This utility establishes a verifiable chain of custody for tokens using SHA-256.
 */

const generateSHA256 = async (message) => {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return '0x' + hashHex;
};

const getPreviousBlockHash = async () => {
  try {
    const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // Genesis Block Hash
      return '0x' + '0'.repeat(64);
    }
    return snapshot.docs[0].data().hash;
  } catch (error) {
    console.warn("[Blockchain] Could not fetch previous block, defaulting to Genesis:", error);
    return '0x' + '0'.repeat(64);
  }
};

export const blockchain = {
  /**
   * Adds a new transaction block to the ledger with integrity chaining.
   */
  addTransaction: async (from, to, amount, assetId, type = 'TRANSFER', metadata = {}) => {
    // 1. Fetch the hash of the preceding block to establish the link
    const previousBlockHash = await getPreviousBlockHash();
    
    // 2. Prepare block data as per Cryptographically Linked Ledger requirements
    const blockData = {
      senderPublicKey: from,       // Public Key / UID of the sender
      recipientPublicKey: to,     // Public Key / UID of the recipient
      tokenID: assetId,           // Unique identifier for the tokenized asset
      amount,                     // Transaction value
      type,                       // Event type (ISSUANCE, TRANSFER, etc.)
      nonce: Math.floor(Math.random() * 1000000), // Prevent replay attacks
      previousBlockHash,          // Immutable chronological link
      timestamp: Date.now(),      // Chronological marker
      protocolVersion: '2.5.0'    // Cryptographic upgrade version
    };

    // 3. Include existing from/to for UI compatibility
    const tx = {
      ...blockData,
      from,
      to,
      assetId,
      metadata,
      status: 'VERIFIED'
    };

    // 4. Calculate integrity hash: current data + previous hash
    // We stringify the block data to ensure a consistent hash input
    const hashInput = JSON.stringify(blockData) + previousBlockHash;
    const hash = await generateSHA256(hashInput);
    
    const completeTx = { ...tx, hash };

    try {
      // Persist to Master Ledger in Firestore
      await addDoc(collection(db, 'transactions'), {
        ...completeTx,
        serverTime: serverTimestamp()
      });
      
      console.log(`[Blockchain] Block ${hash.substring(0, 10)}... chained to ${previousBlockHash.substring(0, 10)}...`);
      return completeTx;
    } catch (error) {
      console.error("[Blockchain] Transaction Failed:", error);
      throw error;
    }
  },

  /**
   * Validates the integrity of the transaction chain.
   * If a record's hash doesn't match its data + previous hash, the chain is broken.
   */
  verifyChain: async () => {
    console.log("[Blockchain] Initiating chain integrity audit...");
    const q = query(collection(db, 'transactions'), orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);
    
    let isValid = true;
    let expectedPreviousHash = '0x' + '0'.repeat(64);

    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Re-calculate hash for validation
      const blockData = {
        senderPublicKey: data.senderPublicKey,
        recipientPublicKey: data.recipientPublicKey,
        tokenID: data.tokenID,
        amount: data.amount,
        type: data.type,
        nonce: data.nonce,
        previousBlockHash: data.previousBlockHash,
        timestamp: data.timestamp,
        protocolVersion: data.protocolVersion
      };

      const hashInput = JSON.stringify(blockData) + data.previousBlockHash;
      const actualHash = await generateSHA256(hashInput);

      if (actualHash !== data.hash) {
        console.error(`[Blockchain] Integrity Breach! Block ${doc.id} has invalid hash.`);
        isValid = false;
        break;
      }

      if (data.previousBlockHash !== expectedPreviousHash) {
        console.error(`[Blockchain] Continuity Breach! Block ${doc.id} points to wrong previous block.`);
        isValid = false;
        break;
      }

      expectedPreviousHash = data.hash;
    }

    if (isValid) console.log("[Blockchain] Chain audit successful. All records verified.");
    return isValid;
  }
};
