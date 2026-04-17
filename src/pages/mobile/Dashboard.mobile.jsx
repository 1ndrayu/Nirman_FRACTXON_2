import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Database, Plus, ShieldCheck, ArrowRight, Trash2, AlertTriangle, PieChart } from 'lucide-react';
import { useAppState } from '../../context/StateContext';
import { ASSET_CATEGORIES } from '../../lib/constants';
import { formatNumber } from '../../lib/utils';
import { MobileAssetCard } from '../../components/mobile/MobileAssetCard';
import { ActionDrawer } from '../../components/mobile/ActionDrawer';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.2, 
      ease: [0.23, 1, 0.32, 1] 
    } 
  }
};

const DashboardMobile = () => {
  const { 
    assets, balance, testBalance, mode, testMode, user,
    addAsset, updateAsset, tokenizeAsset, buyTokens, recallTokens, updateAssetValue, deleteAsset 
  } = useAppState();

  const [activeAsset, setActiveAsset] = useState(null);
  const [drawerMode, setDrawerMode] = useState(null); // 'register', 'tokenize', 'buy', 'recall', 'valuation'
  const [showRegister, setShowRegister] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  // Form states
  const [newAsset, setNewAsset] = useState({ 
    name: '', 
    businessName: '', 
    value: '', 
    cashflow: '', 
    category: 'LAND',
    metadata: {},
    isReserved: false, 
    reservedPercentage: '10' 
  });
  const [tokenizeCount, setTokenizeCount] = useState('10000');
  const [purchaseCount, setPurchaseCount] = useState('10');
  const [recallCount, setRecallCount] = useState('');
  
  // Deletion state
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleNumericInput = (val, setter) => {
    const pure = val.replace(/,/g, '');
    if (pure === '' || /^\d*\.?\d*$/.test(pure)) {
      setter(pure);
    }
  };

  const currentAssets = assets.filter(a => testMode ? a.isTest : !a.isTest);
  const myBusinessAssets = currentAssets.filter(a => a.ownerId === user?.uid);
  const investorAssets = currentAssets.filter(a => a.isTokenized);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.div variants={staggerItem} style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>
          {mode === 'business' ? 'Business ' : 'Asset '}
          <span className="gradient-text">{mode === 'business' ? 'Vault' : 'Exchange'}</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {mode === 'business' ? 'Manage your assets' : 'Buy tokens of revenue-generating assets'}
        </p>
      </motion.div>

      {mode === 'business' && (
        <motion.button 
          variants={staggerItem}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary" 
          style={{ width: '100%', marginBottom: '24px', justifyContent: 'center' }}
          onClick={() => setShowRegister(true)}
        >
          <Plus size={20} /> Register Asset
        </motion.button>
      )}

      <div style={{ paddingBottom: '20px' }}>
        {(() => {
          const list = mode === 'business' ? myBusinessAssets : investorAssets;
          if (list.length === 0) {
            return (
              <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.5 }}>
                <PieChart size={40} style={{ marginBottom: '12px', margin: '0 auto' }} />
                <p style={{ fontSize: '0.9rem' }}>No {testMode ? 'Test' : 'Real'} assets found.</p>
                <p style={{ fontSize: '0.75rem' }}>{mode === 'business' ? 'Register your first asset to see it here.' : 'No tokenized assets available for purchase.'}</p>
              </div>
            );
          }
          return list.map(asset => (
            <MobileAssetCard 
              key={asset.id}
              asset={asset}
              testMode={testMode}
              isInvestor={mode === 'investor'}
              onDelete={() => setAssetToDelete(asset)}
              onEdit={() => {
                setEditingAsset(asset);
                setNewAsset({
                  name: asset.name,
                  businessName: asset.businessName,
                  value: asset.value.toString(),
                  cashflow: asset.cashflow.toString(),
                  category: asset.category || 'LAND',
                  metadata: asset.metadata || {},
                  isReserved: asset.isReserved || false,
                  reservedPercentage: asset.reservedPercentage?.toString() || '10'
                });
                setShowRegister(true);
              }}
              onAction={() => {
                setActiveAsset(asset);
                if (mode === 'investor') {
                  setDrawerMode('buy');
                } else {
                  setDrawerMode(asset.isTokenized ? 'recall' : 'tokenize');
                }
              }}
            />
          ));
        })()}
      </div>

      {/* REGISTRATION DRAWER */}
      <ActionDrawer 
        isOpen={showRegister} 
        onClose={() => {
          setShowRegister(false);
          setEditingAsset(null);
          setNewAsset({ name: '', businessName: '', value: '', cashflow: '', category: 'LAND', metadata: {}, isReserved: false, reservedPercentage: '10' });
        }}
        title={editingAsset ? "Edit Asset" : "Register Asset"}
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const assetData = {
            ...newAsset,
            value: parseFloat(newAsset.value.toString().replace(/,/g, '')),
            cashflow: parseFloat(newAsset.cashflow.toString().replace(/,/g, '')) || 0,
            reservedPercentage: parseFloat(newAsset.reservedPercentage) || 0
          };
          
          if (editingAsset) {
            updateAsset(editingAsset.id, assetData);
          } else {
            addAsset(assetData);
          }
          
          setShowRegister(false);
          setEditingAsset(null);
          setNewAsset({ name: '', businessName: '', value: '', cashflow: '', category: 'LAND', metadata: {}, isReserved: false, reservedPercentage: '10' });
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              className="input-field" placeholder="Legal Entity (e.g. Acme LLC)" required
              value={newAsset.businessName} onChange={e => setNewAsset({...newAsset, businessName: e.target.value})}
            />
            <input 
              className="input-field" placeholder="Asset Identifier (e.g. Plaza B1)" required
              value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>CATEGORY</label>
              <select
                className="input-field"
                style={{ background: 'var(--bg-surface)' }}
                value={newAsset.category}
                onChange={e => setNewAsset({ ...newAsset, category: e.target.value, metadata: {} })}
              >
                {Object.values(ASSET_CATEGORIES).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '12px', fontWeight: 700, opacity: 0.5 }}>{testMode ? 'F$' : '$'}</span>
              <input 
                className="input-field" style={{ paddingLeft: '40px' }} placeholder="Total Market Value" required
                value={formatNumber(newAsset.value)} onChange={e => handleNumericInput(e.target.value, (v) => setNewAsset({...newAsset, value: v}))}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '12px', fontWeight: 700, opacity: 0.5 }}>{testMode ? 'F$' : '$'}</span>
              <input 
                className="input-field" style={{ paddingLeft: '40px' }} placeholder="Monthly Revenue (Optional)" 
                value={formatNumber(newAsset.cashflow)} onChange={e => handleNumericInput(e.target.value, (v) => setNewAsset({...newAsset, cashflow: v}))}
              />
            </div>

            {/* Mobile Dynamic Metadata */}
            <div style={{ padding: '16px', background: 'var(--bg-page)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px' }}>SPECIALIZED DETAILS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ASSET_CATEGORIES[newAsset.category].fields.map(field => (
                  <div key={field.id}>
                    <label style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{field.label.toUpperCase()}</label>
                    <input 
                      className="input-field" 
                      style={{ marginBottom: 0, padding: '10px' }} 
                      placeholder={field.placeholder}
                      value={newAsset.metadata[field.id] || ''}
                      onChange={e => setNewAsset({ 
                        ...newAsset, 
                        metadata: { ...newAsset.metadata, [field.id]: e.target.value } 
                      })}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div 
              style={{ padding: '16px', background: 'rgba(234, 179, 8, 0.05)', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.2)' }}
              onClick={() => setNewAsset({ ...newAsset, isReserved: !newAsset.isReserved })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '18px', height: '18px', border: '2px solid var(--accent-primary)', borderRadius: '4px', background: newAsset.isReserved ? 'var(--accent-primary)' : 'transparent' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Enable Token Reservation</span>
              </div>
              {newAsset.isReserved && (
                <div style={{ marginTop: '12px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.7rem' }}>
                     <span style={{ color: 'var(--text-muted)' }}>Ratio (%)</span>
                     <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Val: {testMode ? 'F$' : '$'}{formatNumber(((parseFloat(newAsset.value.replace(/,/g, '')) || 0) * (parseFloat(newAsset.reservedPercentage) || 0) / 100).toFixed(0))}</span>
                   </div>
                   <input 
                    className="input-field" style={{ marginBottom: 0 }} placeholder="e.g. 15"
                    value={newAsset.reservedPercentage}
                    onClick={e => e.stopPropagation()}
                    onChange={e => {
                      const val = e.target.value;
                      if (val === '' || (!isNaN(val) && parseFloat(val) >= 0 && parseFloat(val) <= 100)) {
                        setNewAsset({...newAsset, reservedPercentage: val});
                      }
                    }}
                   />
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '54px', justifyContent: 'center' }}>
              {editingAsset ? 'Save Changes' : 'Finalize & Publish'}
            </button>
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
          drawerMode === 'buy' ? 'Buy Tokens' : 
          drawerMode === 'tokenize' ? 'Tokenize Asset' : 'Withdraw Tokens'
        }
      >
        {activeAsset && (
          <div>
            {drawerMode === 'buy' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: 'var(--bg-page)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Price</span>
                    <span style={{ fontWeight: 800 }}>{testMode ? 'F$' : '$'}{activeAsset.tokenPrice.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Supply</span>
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
                      alert(`Error: Insufficient supply.`);
                      return;
                    }
                    const result = await buyTokens(activeAsset.id, count);
                    if (result.success) setActiveAsset(null);
                    else alert(result.error);
                  }}
                >
                  Submit Order
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
                  Submit
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
                  Confirm Withdrawal
                </button>
              </div>
            )}
          </div>
        )}
      </ActionDrawer>
      {/* DELETE CONFIRMATION */}
      <AnimatePresence>
        {assetToDelete && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.9)', zIndex: 3000, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="box-panel"
              style={{ width: '100%', padding: '32px', background: 'var(--bg-surface)' }}
            >
              <div style={{ color: '#ef4444', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={24} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Confirm Deletion</h3>
              </div>
              
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.85rem' }}>
                Irreversible. This wipes <b>{assetToDelete.name}</b> from the protocol.
              </p>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  TYPE: <span style={{ color: 'var(--text-main)', userSelect: 'none' }}>{user?.displayName}/{assetToDelete.name}</span>
                </label>
                <input 
                  className="input-field"
                  style={{ marginBottom: 0, fontSize: '0.9rem' }}
                  placeholder="name/asset"
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  onPaste={e => e.preventDefault()}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  className="btn btn-primary" 
                  disabled={deleteConfirmText !== `${user?.displayName}/${assetToDelete.name}`}
                  style={{ width: '100%', justifyContent: 'center', background: '#ef4444' }}
                  onClick={async () => {
                    await deleteAsset(assetToDelete.id);
                    setAssetToDelete(null);
                    setDeleteConfirmText('');
                  }}
                >
                  Confirm Delete
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    setAssetToDelete(null);
                    setDeleteConfirmText('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardMobile;
