import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut 
} from '../lib/firebase';
import { 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { blockchain } from '../lib/blockchain';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('investor'); // Default role
  const [testMode, setTestMode] = useState(false);
  const [assets, setAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [balance, setBalance] = useState(0);
  const [testBalance, setTestBalance] = useState(0);
  const [portfolio, setPortfolio] = useState([]);

  // 1. Authentication Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Create or fetch profile
        const profileRef = doc(db, 'users', user.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (!profileSnap.exists()) {
          const newProfile = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: 'investor', // default
            balance: 0,
            testBalance: 0,
            createdAt: serverTimestamp()
          };
          await setDoc(profileRef, newProfile);
          setProfile(newProfile);
          setMode('investor');
          setBalance(0);
          setTestBalance(0);
        } else {
          const data = profileSnap.data();
          setProfile(data);
          setMode(data.role || 'investor');
          setBalance(data.balance || 0);
          setTestBalance(data.testBalance || 1000000);
          setTestMode(data.testMode || false);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Assets Listener
  useEffect(() => {
    const q = query(collection(db, 'assets'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const assetsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAssets(assetsData);
    });
    return () => unsubscribe();
  }, []);

  // 3. Real-time Transactions (Master Ledger) Listener
  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(txData);
    });
    return () => unsubscribe();
  }, []);

  // 4. Real-time Broadcasts Listener
  useEffect(() => {
    const q = query(collection(db, 'broadcasts'), orderBy('timestamp', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const broadcastData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBroadcasts(broadcastData);
    });
    return () => unsubscribe();
  }, []);

  // 5. User Portfolio Listener
  useEffect(() => {
    if (!user) {
      setPortfolio([]);
      return;
    }
    const q = query(collection(db, 'users', user.uid, 'portfolio'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPortfolio(pData);
    });
    return () => unsubscribe();
  }, [user]);

  // Actions
  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  const logout = () => signOut(auth);

  const toggleMode = async () => {
    const newMode = mode === 'business' ? 'investor' : 'business';
    setMode(newMode);
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), { role: newMode });
    }
  };

  const addAsset = async (assetData) => {
    if (!user) return;
    const newAsset = {
      ...assetData,
      ownerId: user.uid,
      ownerName: user.displayName,
      isTokenized: false,
      isTest: testMode,
      timestamp: Date.now()
    };
    await addDoc(collection(db, 'assets'), newAsset);
  };

  const updateAssetValue = async (assetId, newValue) => {
    const assetRef = doc(db, 'assets', assetId);
    const asset = assets.find(a => a.id === assetId);
    
    await updateDoc(assetRef, { 
      value: parseFloat(newValue),
      tokenPrice: asset.isTokenized ? parseFloat(newValue) / asset.tokenCount : 0
    });

    // Create Broadcast
    await addDoc(collection(db, 'broadcasts'), {
      type: 'VALUE_UPDATE',
      assetName: asset.name,
      oldValue: asset.value,
      newValue: parseFloat(newValue),
      timestamp: Date.now(),
      author: user.displayName
    });
  };

  const tokenizeAsset = async (assetId, tokenCount) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;
    
    const reservedAmount = asset.isReserved ? (asset.reservedCount || 0) : 0;
    const initialAvailable = Math.max(0, tokenCount - reservedAmount);

    const updateData = {
      isTokenized: true,
      tokenCount,
      tokenPrice,
      availableTokens: initialAvailable,
      tokensSold: 0,
      reservedCount: reservedAmount
    };
    
    await updateDoc(doc(db, 'assets', assetId), updateData);
    
    // Create Blockchain record of Issuance
    await blockchain.addTransaction('0x0000', user.uid, asset.value, assetId, 'TOKEN_ISSUANCE', {
      tokenCount,
      tokenPrice,
      assetName: asset.name
    });
  };

  const recallTokens = async (assetId, count) => {
    try {
      const asset = assets.find(a => a.id === assetId);
      if (!asset || !asset.isTokenized || (asset.tokensSold || 0) < count || !user) {
        throw new Error("Validation Failed: Invalid asset or count.");
      }

      const recallCost = count * asset.tokenPrice;
      const currentBalance = testMode ? testBalance : balance;
      if (currentBalance < recallCost) {
        throw new Error("Insufficient vault reserves for token recall.");
      }

      // 1. Update Asset
      await updateDoc(doc(db, 'assets', assetId), {
        availableTokens: asset.availableTokens + count,
        tokensSold: asset.tokensSold - count
      });

      // 2. Add to Ledger (Blockchain)
      await blockchain.addTransaction(asset.ownerId, '0x0000', recallCost, assetId, 'TOKEN_RECALL', {
        recalledCount: count,
        assetName: asset.name,
        payoutRate: asset.tokenPrice
      });

      // 3. Update Business Balance (Payout)
      if (testMode) {
        const newTB = testBalance - recallCost;
        await updateDoc(doc(db, 'users', user.uid), { testBalance: newTB });
        setTestBalance(newTB);
      } else {
        const newB = balance - recallCost;
        await updateDoc(doc(db, 'users', user.uid), { balance: newB });
        setBalance(newB);
      }

      return { success: true };
    } catch (error) {
      console.error("[Recall] Failed:", error.message);
      return { success: false, error: error.message };
    }
  };

  const buyTokens = async (assetId, count) => {
    try {
      const asset = assets.find(a => a.id === assetId);
      if (!asset || asset.availableTokens < count || !user) {
        throw new Error("Acquisition failed: Asset unavailable or user not logged in.");
      }

      const totalCost = asset.tokenPrice * count;
      const currentBalance = testMode ? testBalance : balance;
      if (currentBalance < totalCost) {
        throw new Error("Insufficient unallocated funds.");
      }

      // 1. Update Asset
      await updateDoc(doc(db, 'assets', assetId), {
        availableTokens: asset.availableTokens - count,
        tokensSold: (asset.tokensSold || 0) + count
      });

      // 2. Add to Ledger (Blockchain)
      await blockchain.addTransaction(user.uid, asset.ownerId, totalCost, assetId, 'TOKEN_PURCHASE', {
        tokenCount: count,
        assetName: asset.name
      });

      // 3. Update User Balance
      if (testMode) {
        const newTB = testBalance - totalCost;
        await updateDoc(doc(db, 'users', user.uid), { testBalance: newTB });
        setTestBalance(newTB);
      } else {
        const newB = balance - totalCost;
        await updateDoc(doc(db, 'users', user.uid), { balance: newB });
        setBalance(newB);
      }

      // 4. Update Portfolio
      const portfolioRef = doc(db, 'users', user.uid, 'portfolio', assetId);
      const portfolioSnap = await getDoc(portfolioRef);
      if (portfolioSnap.exists()) {
        await updateDoc(portfolioRef, { count: portfolioSnap.data().count + count });
      } else {
        await setDoc(portfolioRef, { assetId, assetName: asset.name, count });
      }

      return { success: true };
    } catch (error) {
      console.error("[Acquisition] Failed:", error.message);
      return { success: false, error: error.message };
    }
  };

  const reliquidateProfits = async () => {
    if (!user || portfolio.length === 0) return { success: false, error: "No active holdings found." };
    
    // Calculate real-time yield: sum(owned_tokens * accrued_since_last_harvest)
    // For this prototype, we'll use a dynamic factor: (asset.cashflow / asset.tokenCount) * 1.5 (simulated accrual multiplyer)
    let totalHarvest = 0;
    
    portfolio.forEach(item => {
      const asset = assets.find(a => a.id === item.assetId);
      if (asset && asset.tokenCount > 0) {
        const yieldPerToken = asset.cashflow / asset.tokenCount;
        totalHarvest += (item.count * yieldPerToken) * 12; // Annualized harvest
      }
    });

    if (totalHarvest === 0) return { success: false, error: "Zero accrued profits to liquidate." };
    
    if (testMode) {
      const newB = testBalance + totalHarvest;
      await updateDoc(doc(db, 'users', user.uid), { testBalance: newB });
      setTestBalance(newB);
    } else {
      const newB = balance + totalHarvest;
      await updateDoc(doc(db, 'users', user.uid), { balance: newB });
      setBalance(newB);
    }

    await blockchain.addTransaction('0x0000', user.uid, totalHarvest, 'PROTOCOL', 'YIELD_HARVEST', {
      method: 'PORTFOLIO_SWEEP'
    });
    
    return { success: true, amount: totalHarvest };
  };

  const updateTestBalance = async (amount) => {
    if (!user) return;
    const newB = testBalance + parseFloat(amount);
    await updateDoc(doc(db, 'users', user.uid), { testBalance: newB });
    setTestBalance(newB);
    
    await blockchain.addTransaction('0x0000', user.uid, amount, 'PROTOCOL', 'VAULT_ADJUSTMENT', {
      type: 'SIMULATED_FUNDING'
    });
  };

  return (
    <StateContext.Provider value={{
      user, profile, loading, mode, setMode: toggleMode,
      testMode, setTestMode: async (val) => {
        setTestMode(val);
        if (user) await updateDoc(doc(db, 'users', user.uid), { testMode: val });
      },
      assets, transactions, broadcasts, balance, testBalance, portfolio,
      login, logout, addAsset, updateAssetValue, tokenizeAsset, buyTokens, recallTokens, reliquidateProfits,
      updateTestBalance,
      verifyChain: blockchain.verifyChain
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
