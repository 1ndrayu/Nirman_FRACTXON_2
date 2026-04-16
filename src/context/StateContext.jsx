import React, { createContext, useContext, useState, useEffect } from 'react';
import { blockchain } from '../lib/blockchain';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [mode, setMode] = useState('business'); // 'business' or 'investor'
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('fractxon_assets');
    return saved ? JSON.parse(saved) : [];
  });
  const [investmentPortfolio, setInvestmentPortfolio] = useState(() => {
    const saved = localStorage.getItem('fractxon_portfolio');
    return saved ? JSON.parse(saved) : [];
  });
  const [balance, setBalance] = useState(1000000); // Initial dummy balance

  useEffect(() => {
    localStorage.setItem('fractxon_assets', JSON.stringify(assets));
    localStorage.setItem('fractxon_portfolio', JSON.stringify(investmentPortfolio));
  }, [assets, investmentPortfolio]);

  const tokenizeAsset = (assetId, tokenCount) => {
    setAssets(prev => prev.map(asset => {
      if (asset.id === assetId) {
        const tokenPrice = asset.value / tokenCount;
        return {
          ...asset,
          isTokenized: true,
          tokenCount,
          tokenPrice,
          availableTokens: tokenCount,
          tokensSold: 0
        };
      }
      return asset;
    }));
  };

  const buyTokens = (assetId, count) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset || asset.availableTokens < count) return false;

    const totalCost = asset.tokenPrice * count;
    if (balance < totalCost) return false;

    // Update Blockchain
    blockchain.addTransaction('Investor_01', asset.businessName, totalCost, assetId);

    // Update Assets
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          availableTokens: a.availableTokens - count,
          tokensSold: a.tokensSold + count
        };
      }
      return a;
    }));

    // Update Portfolio
    setInvestmentPortfolio(prev => {
      const existing = prev.find(p => p.assetId === assetId);
      if (existing) {
        return prev.map(p => p.assetId === assetId ? { ...p, count: p.count + count } : p);
      }
      return [...prev, { assetId, assetName: asset.name, count, buyPrice: asset.tokenPrice }];
    });

    setBalance(prev => prev - totalCost);
    return true;
  };

  return (
    <StateContext.Provider value={{
      mode, setMode,
      assets, setAssets,
      investmentPortfolio,
      balance,
      tokenizeAsset,
      buyTokens
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
