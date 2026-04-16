import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Database, Plus, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { formatNumber } from '../../lib/utils';
import { MobileAssetCard } from '../../components/mobile/MobileAssetCard';
import { ActionDrawer } from '../../components/mobile/ActionDrawer';

const DashboardMobile = () => {
  const { 
    assets, balance, testBalance, mode, testMode, 
    addAsset, tokenizeAsset, buyTokens, recallTokens, updateAssetValue 
  } = useAppState();

  const [activeAsset, setActiveAsset] = useState(null);
  const [drawerMode, setDrawerMode] = useState(null); // 'register', 'tokenize', 'buy', 'recall', 'valuation'
  const [showRegister, setShowRegister] = useState(false);

  // Form states
  const [newAsset, setNewAsset] = useState({ name: '', businessName: '', value: '', cashflow: '', isReserved: false, reservedCount: '0' });
  const [tokenizeCount, setTokenizeCount] = useState('10000');
  const [purchaseCount, setPurchaseCount] = useState('10');
  const [recallCount, setRecallCount] = useState('');
  const [editValue, setEditValue] = useState('');

  const handleNumericInput = (val, setter) => {
    const pure = val.replace(/,/g, '');
    if (pure === '' || /^\d*\.?\d*$/.test(pure)) {
      setter(pure);
    }
  };

  const currentAssets = assets.filter(a => testMode ? a.isTest : !a.isTest);
  const investorAssets = currentAssets.filter(a => a.isTokenized);

  const handleAddAsset = (e) => {
    e.preventDefault();
    addAsset({
      ...newAsset,
      value: parseFloat(newAsset.value),
      cashflow: parseFloat(newAsset.cashflow),
      isReserved: newAsset.isReserved,
      reservedCount: parseInt(newAsset.reservedCount.replace(/,/g, '')) || 0
    });
    setNewAsset({ name: '', businessName: '', value: '', cashflow: '', isReserved: false, reservedCount: '0' });
    setShowRegister(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>
          {mode === 'business' ? 'Business ' : 'Asset '}
          <span className="gradient-text">{mode === 'business' ? 'Vault' : 'Exchange'}</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {mode === 'business' ? 'Manage your tokenized assets' : 'Fractionalized revenue-generating assets'}
        </p>
      </div>

      {mode === 'business' && (
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginBottom: '24px', justifyContent: 'center' }}
          onClick={() => setShowRegister(true)}
        >
          <Plus size={20} /> Register New Asset
        </button>
      )}

      <div style={{ paddingBottom: '20px' }}>
        {(mode === 'business' ? currentAssets : investorAssets).map(asset => (
          <MobileAssetCard 
            key={asset.id}
            asset={asset}
            testMode={testMode}
            isInvestor={mode === 'investor'}
            onAction={() => {
              setActiveAsset(asset);
              if (mode === 'investor') {
                setDrawerMode('buy');
              } else {
                setDrawerMode(asset.isTokenized ? 'recall' : 'tokenize');
              }
            }}
          />
        ))}
      </div>

      {/* REGISTRATION DRAWER */}
      <ActionDrawer 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)}
        title="Register Asset"
      >
        <form onSubmit={handleAddAsset}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              className="input-field" placeholder="Legal Entity (e.g. Acme LLC)" required
              value={newAsset.businessName} onChange={e => setNewAsset({...newAsset, businessName: e.target.value})}
            />
            <input 
              className="input-field" placeholder="Asset Identifier (e.g. Plaza B1)" required
              value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})}
            />
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '12px', fontWeight: 700, opacity: 0.5 }}>{testMode ? 'F$' : '$'}</span>
              <input 
                className="input-field" style={{ paddingLeft: '40px' }} placeholder="Valuation" required
                value={formatNumber(newAsset.value)} onChange={e => handleNumericInput(e.target.value, (v) => setNewAsset({...newAsset, value: v}))}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '12px', fontWeight: 700, opacity: 0.5 }}>{testMode ? 'F$' : '$'}</span>
              <input 
                className="input-field" style={{ paddingLeft: '40px' }} placeholder="Monthly Revenue" required
                value={formatNumber(newAsset.cashflow)} onChange={e => handleNumericInput(e.target.value, (v) => setNewAsset({...newAsset, cashflow: v}))}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '54px', justifyContent: 'center' }}>Finalize & Publish</button>
          </div>
        </form>
      </ActionDrawer>

      {/* ACTION DRAWER (BUY/TOKENIZE/RECALL) */}
      <ActionDrawer
        isOpen={!!activeAsset}
        onClose={() => {
          setActiveAsset(null);
          setDrawerMode(null);
        }}
        title={
          drawerMode === 'buy' ? 'Acquire Stake' : 
          drawerMode === 'tokenize' ? 'Token Issuance' : 'Recall Tokens'
        }
      >
        {activeAsset && (
          <div>
            {drawerMode === 'buy' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: 'var(--bg-page)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Price per FTNK</span>
                    <span style={{ fontWeight: 800 }}>{testMode ? 'F$' : '$'}{activeAsset.tokenPrice.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Floating</span>
                    <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{formatNumber(activeAsset.availableTokens)}</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>QUANTITY</label>
                  <input 
                    className="input-field" 
                    value={formatNumber(purchaseCount)}
                    onChange={e => handleNumericInput(e.target.value, setPurchaseCount)}
                  />
                  <div style={{ textAlign: 'right', fontWeight: 900, fontSize: '1.2rem', marginTop: '12px' }}>
                    Total: {testMode ? 'F$' : '$'}{formatNumber((activeAsset.tokenPrice * (parseInt(purchaseCount.replace(/,/g, '')) || 0)).toFixed(2))}
                  </div>
                </div>

                <button 
                  className="btn btn-primary" 
                  style={{ height: '54px', justifyContent: 'center' }}
                  onClick={async () => {
                    const count = parseInt(purchaseCount.replace(/,/g, ''));
                    if (count > activeAsset.availableTokens) {
                      alert(`Insufficient floating tokens.`);
                      return;
                    }
                    const result = await buyTokens(activeAsset.id, count);
                    if (result.success) setActiveAsset(null);
                    else alert(result.error);
                  }}
                >
                  Confirm Acquisition
                </button>
              </div>
            )}

            {drawerMode === 'tokenize' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Define the total supply for this asset.</p>
                <input 
                  className="input-field" 
                  value={formatNumber(tokenizeCount)}
                  onChange={e => handleNumericInput(e.target.value, setTokenizeCount)}
                  placeholder="Token Supply"
                />
                <button 
                  className="btn btn-primary" 
                  style={{ height: '54px', justifyContent: 'center' }}
                  onClick={() => {
                    tokenizeAsset(activeAsset.id, parseInt(tokenizeCount.replace(/,/g, '')));
                    setActiveAsset(null);
                  }}
                >
                  Authorize Issuance
                </button>
              </div>
            )}

            {drawerMode === 'recall' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Recall tokens from circulation.</p>
                <input 
                  className="input-field" 
                  value={formatNumber(recallCount)}
                  onChange={e => handleNumericInput(e.target.value, setRecallCount)}
                  placeholder="Recall Amount"
                />
                <button 
                  className="btn btn-primary" 
                  disabled={(testMode ? testBalance : balance) < (activeAsset.tokenPrice * (parseInt(recallCount.replace(/,/g, '')) || 0))}
                  style={{ height: '54px', justifyContent: 'center' }}
                  onClick={async () => {
                    const result = await recallTokens(activeAsset.id, parseInt(recallCount.replace(/,/g, '')));
                    if (result.success) setActiveAsset(null);
                  }}
                >
                  Execute Recall
                </button>
              </div>
            )}
          </div>
        )}
      </ActionDrawer>
    </div>
  );
};

export default DashboardMobile;
