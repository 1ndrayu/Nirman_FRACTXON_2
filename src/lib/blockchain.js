/**
 * Simulated Master Chain for FRACTXON_
 * This utility mocks blockchain behavior such as hashing and block creation.
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
  chain: [],
  
  createBlock: (transactions, previousHash = '0'.repeat(64)) => {
    const block = {
      timestamp: Date.now(),
      transactions,
      previousHash,
      hash: ''
    };
    block.hash = generateHash(block);
    return block;
  },

  addTransaction: (from, to, amount, assetId) => {
    const tx = {
      id: Math.random().toString(36).substring(7),
      from,
      to,
      amount,
      assetId,
      timestamp: Date.now()
    };
    
    // In a real blockchain, we'd wait for mining. 
    // Here we just simulate adding it to the ledger.
    console.log(`[Blockchain] New Transaction: ${tx.id}`, tx);
    return tx;
  },

  getLatestBlock: () => {
    return blockchain.chain[blockchain.chain.length - 1];
  }
};
