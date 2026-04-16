import React, { useState, useEffect } from 'react';
import { StateProvider, useAppState } from './context/StateContext';
import { 
  Building2, 
  Wallet, 
  Plus, 
  Database, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Activity,
  History,
  User as UserIcon,
  PieChart,
  LogOut,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber } from './lib/utils';

// Pages
import ProfilePage from './pages/Profile';
import LedgerPage from './pages/Ledger';

// Components
import BroadcastBar from './components/BroadcastBar';
import DottedMatrix from './components/DottedMatrix';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const LoginView = () => {
  const { login } = useAppState();
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="box-panel" 
        style={{ padding: '60px', textAlign: 'center', maxWidth: '500px', border: '1px solid var(--border-light)' }}
      >
        <motion.h1 variants={staggerItem} style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '16px' }}>FRAC<span className="gradient-text">TXON_</span></motion.h1>
        <motion.p variants={staggerItem} style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
          Secure, transparent asset tokenization powered by a decentralized master-chain ledger.
        </motion.p>
        <motion.button 
          variants={staggerItem} 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary" 
          onClick={login} 
          style={{ fontSize: '1.1rem', padding: '16px 32px' }}
        >
          Sign in with Google Account
        </motion.button>
      </motion.div>
    </div>
  );
};

const BusinessInterface = () => {
  const { assets, addAsset, tokenizeAsset, updateAssetValue, testMode, recallTokens } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null); // 'valuation', 'tokenize', 'recall'
  const [activeAssetId, setActiveAssetId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [tokenizeCount, setTokenizeCount] = useState('10000');
  const [recallCount, setRecallCount] = useState('');
  const [newAsset, setNewAsset] = useState({ name: '', businessName: '', value: '', cashflow: '' });

  const handleNumericInput = (val, setter) => {
    const pure = val.replace(/,/g, '');
    if (pure === '' || /^\d*\.?\d*$/.test(pure)) {
      setter(pure);
    }
  };

  const handleAddAsset = (e) => {
    e.preventDefault();
    addAsset({
      ...newAsset,
      value: parseFloat(newAsset.value),
      cashflow: parseFloat(newAsset.cashflow)
    });
    setNewAsset({ name: '', businessName: '', value: '', cashflow: '' });
    setShowForm(false);
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Business <span className="gradient-text">Vault</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your asset registry and tokenization strategies.</p>
        </motion.div>
        <motion.button 
          variants={staggerItem} 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary" 
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} /> Register New Asset
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="box-panel" 
            style={{ padding: '32px', marginBottom: '32px' }}
          >
            <form onSubmit={handleAddAsset}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <input 
                  className="input-field" placeholder="Business Legal Name" required
                  value={newAsset.businessName} onChange={e => setNewAsset({...newAsset, businessName: e.target.value})}
                />
                <input 
                  className="input-field" placeholder="Asset Identifier" required
                  value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})}
                />
                <input 
                  className="input-field" placeholder={`Appraised Value (${testMode ? 'F$' : '$'})`} required
                  value={formatNumber(newAsset.value)} onChange={e => handleNumericInput(e.target.value, (v) => setNewAsset({...newAsset, value: v}))}
                />
                <input 
                  className="input-field" placeholder={`Net Monthly Yield (${testMode ? 'F$' : '$'})`} required
                  value={formatNumber(newAsset.cashflow)} onChange={e => handleNumericInput(e.target.value, (v) => setNewAsset({...newAsset, cashflow: v}))}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    id="isTestAsset"
                    checked={testMode}
                    readOnly
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                  <label htmlFor="isTestAsset" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer' }}>
                    {testMode ? 'PROVISIONAL TEST ASSET (F$)' : 'LIVE MARKET ASSET ($)'}
                  </label>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish to Registry</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={staggerContainer} className="dashboard-grid">
        {assets.filter(a => testMode ? a.isTest : !a.isTest).map(asset => (
          <div key={asset.id}>
            <motion.div 
              variants={staggerItem} 
              className={`box-panel asset-card ${activeAssetId === asset.id ? 'expanded' : ''}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>{asset.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building2 size={12} /> {asset.businessName}
                  </p>
                </div>
                <div className={`status-badge ${asset.isTokenized ? 'badge-success' : 'badge-warning'}`}>
                  {asset.isTokenized ? 'LIVE ON CHAIN' : 'DRAFT'}
                </div>
              </div>

              <div className="divider" style={{ margin: '24px 0' }} />

              <div style={{ margin: '20px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Market Valuation</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{testMode ? 'F$' : '$'}{formatNumber(asset.value)}</span>
                    <button 
                      style={{ border: 'none', background: 'none', color: activeAssetId === asset.id && expandedId === 'valuation' ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer' }} 
                      onClick={() => {
                        if (activeAssetId === asset.id && expandedId === 'valuation') {
                          setActiveAssetId(null);
                        } else {
                          setActiveAssetId(asset.id);
                          setExpandedId('valuation');
                          setEditValue(asset.value.toString());
                        }
                      }}
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Effective Yield</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>{((asset.cashflow / asset.value) * 100).toFixed(2)}% APR</span>
                </div>

                {asset.isTokenized && (
                  <div style={{ padding: '16px', background: 'var(--bg-page)', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Consensus Pool</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{formatNumber(asset.tokenCount)} FTNK</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{testMode ? 'F$' : '$'}{asset.tokenPrice.toFixed(2)} / unit</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--border-light)', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${((asset.tokensSold || 0) / asset.tokenCount) * 100}%`, 
                        height: '100%', 
                        background: 'var(--accent-gradient)' 
                      }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', marginTop: '6px', textAlign: 'right', color: 'var(--text-muted)' }}>
                      {formatNumber(asset.tokensSold || 0)} deployed • {formatNumber(asset.availableTokens)} floating
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {!asset.isTokenized ? (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-primary" 
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => {
                      setActiveAssetId(asset.id);
                      setExpandedId('tokenize');
                    }}
                  >
                    <Database size={18} /> Initiate Tokenization
                  </motion.button>
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-secondary" 
                    style={{ flex: 1, justifyContent: 'center', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
                    onClick={() => {
                      setActiveAssetId(asset.id);
                      setExpandedId('recall');
                      setRecallCount(asset.tokensSold.toString());
                    }}
                  >
                    <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Recall Tokens
                  </motion.button>
                )}
              </div>
            </motion.div>

            <AnimatePresence>
              {activeAssetId === asset.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="action-outlay"
                >
                  {expandedId === 'valuation' && (
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '16px', fontWeight: 700 }}>Update Asset Valuation</h4>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, opacity: 0.5 }}>
                            {testMode ? 'F$' : '$'}
                          </span>
                          <input 
                            className="input-field" style={{ marginBottom: 0, paddingLeft: '40px' }}
                            value={formatNumber(editValue)}
                            onChange={e => handleNumericInput(e.target.value, setEditValue)}
                          />
                        </div>
                        <button className="btn btn-primary" style={{ padding: '0 20px' }} onClick={() => {
                          updateAssetValue(asset.id, editValue);
                          setActiveAssetId(null);
                        }}>Confirm Update</button>
                        <button className="btn btn-secondary" onClick={() => setActiveAssetId(null)}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {expandedId === 'tokenize' && (
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', fontWeight: 700 }}>Chain Issuance Architecture</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Define the total supply of tokens for this asset. This is a permanent consensus event.</p>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <input 
                            className="input-field" style={{ marginBottom: 0 }}
                            value={formatNumber(tokenizeCount)}
                            onChange={e => handleNumericInput(e.target.value, setTokenizeCount)}
                            placeholder="Token Supply (FTNK)"
                          />
                        </div>
                        <button className="btn btn-primary" onClick={() => {
                          tokenizeAsset(asset.id, parseInt(tokenizeCount));
                          setActiveAssetId(null);
                        }}>Authorize Issuance</button>
                        <button className="btn btn-secondary" onClick={() => setActiveAssetId(null)}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {expandedId === 'recall' && (
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', fontWeight: 700 }}>Reciprocal Token Liquidation</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Pull back tokens from circulation into the business vault. Max available: {formatNumber(asset.tokensSold)}</p>
                      
                      <div style={{ background: 'var(--bg-page)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Required Payout</span>
                          <span style={{ fontWeight: 700 }}>{testMode ? 'F$' : '$'}{formatNumber((asset.tokenPrice * (parseInt(recallCount.replace(/,/g, '')) || 0)).toFixed(2))}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Current Vault</span>
                          <span style={{ fontWeight: 700, color: (testMode ? testBalance : balance) < (asset.tokenPrice * (parseInt(recallCount.replace(/,/g, '')) || 0)) ? '#ef4444' : 'inherit' }}>
                            {testMode ? 'F$' : '$'}{formatNumber(testMode ? testBalance : balance)}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input 
                          className="input-field" style={{ marginBottom: 0, flex: 1 }}
                          value={formatNumber(recallCount)}
                          onChange={e => handleNumericInput(e.target.value, setRecallCount)}
                          placeholder="Recall Amount (FTNK)"
                        />
                        <button 
                          className="btn btn-primary" 
                          disabled={(testMode ? testBalance : balance) < (asset.tokenPrice * (parseInt(recallCount.replace(/,/g, '')) || 0))}
                          onClick={async () => {
                            const success = await recallTokens(asset.id, parseInt(recallCount.replace(/,/g, '')));
                            if (success) setActiveAssetId(null);
                            else alert("Recall failed: Insufficient vault reserves.");
                          }}
                        >
                          Execute Recall
                        </button>
                        <button className="btn btn-secondary" onClick={() => setActiveAssetId(null)}>Cancel</button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const InvestorInterface = () => {
  const { assets, balance, testBalance, buyTokens, testMode, reliquidateProfits } = useAppState();
  const [activeAssetId, setActiveAssetId] = useState(null);
  const [purchaseCount, setPurchaseCount] = useState('10');
  const [paymentTab, setPaymentTab] = useState('balance');

  const handleNumericInput = (val, setter) => {
    const pure = val.replace(/,/g, '');
    if (pure === '' || /^\d*\.?\d*$/.test(pure)) {
      setter(pure);
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px' }}>Asset <span className="gradient-text">Exchange</span></h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Participate in fractionalized revenue-generating assets.</p>

          <motion.div variants={staggerContainer} className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {assets.filter(a => a.isTokenized && (testMode ? a.isTest : !a.isTest)).map(asset => (
              <div key={asset.id}>
                <motion.div variants={staggerItem} className={`box-panel asset-card ${activeAssetId === asset.id ? 'expanded' : ''}`}>
                  <h3 style={{ marginBottom: '4px', fontWeight: 700 }}>{asset.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{asset.businessName}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 900 }}>{testMode ? 'F$' : '$'}{asset.tokenPrice.toFixed(2)}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>INDEX PRICE</span>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Projected ROI</span>
                      <span style={{ color: '#059669', fontWeight: 700 }}>+{( (asset.cashflow / asset.value) * 100 ).toFixed(1)}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Asset Class</span>
                      <span style={{ fontWeight: 600 }}>Premium Tier</span>
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-secondary" 
                    style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', fontWeight: 700 }}
                    onClick={() => {
                      if (activeAssetId === asset.id) setActiveAssetId(null);
                      else setActiveAssetId(asset.id);
                    }}
                  >
                    {activeAssetId === asset.id ? 'Cancel Order' : 'Acquire Stake'} <ArrowRight size={16} />
                  </motion.button>
                </motion.div>

                <AnimatePresence>
                  {activeAssetId === asset.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="action-outlay"
                    >
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', fontWeight: 700 }}>Consensus Acquisition</h4>
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ORDER QUANTITY (FTNK)</div>
                          <input 
                            className="input-field" style={{ marginBottom: 0 }}
                            value={formatNumber(purchaseCount)}
                            onChange={e => handleNumericInput(e.target.value, setPurchaseCount)}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ESTIMATED COST</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: '8px' }}>
                            {testMode ? 'F$' : '$'}{formatNumber((asset.tokenPrice * (parseInt(purchaseCount.replace(/,/g, '')) || 0)).toFixed(2))}
                          </div>
                        </div>
                      </div>
                      <button 
                        className="btn btn-primary" 
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => {
                          const success = buyTokens(asset.id, parseInt(purchaseCount.replace(/,/g, '')));
                          if (success) setActiveAssetId(null);
                        }}
                      >
                        Confirm Acquisition
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={staggerItem}>
          <div className="box-panel" style={{ padding: '24px', position: 'sticky', top: '24px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wallet size={20} style={{ color: 'var(--accent-primary)' }} /> Capital Reserves
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{testMode ? 'F$' : 'USD'} Unallocated Funds</div>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}>{testMode ? 'F$' : '$'}{formatNumber(testMode ? testBalance : balance)}</div>
            </div>

            <div className="divider" style={{ margin: '20px 0' }} />

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button 
                onClick={() => setPaymentTab('balance')}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)', background: paymentTab === 'balance' ? 'var(--bg-page)' : 'transparent', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Vault
              </button>
              <button 
                onClick={() => setPaymentTab('methods')}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)', background: paymentTab === 'methods' ? 'var(--bg-page)' : 'transparent', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Payments
              </button>
            </div>

            {paymentTab === 'methods' ? (
              <div style={{ fontSize: '0.85rem' }}>
                <div style={{ padding: '12px', border: '1px dashed var(--border-light)', borderRadius: '8px', marginBottom: '8px', opacity: 0.6, display: 'flex', justifyContent: 'space-between' }}>
                  <span>UPI Payment</span>
                  <span>Locked</span>
                </div>
                <div style={{ padding: '12px', border: '1px dashed var(--border-light)', borderRadius: '8px', opacity: 0.6, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Credit/Debit Cards</span>
                  <span>Locked</span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center' }}>Real-world clearing is available in Production mode.</p>
              </div>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
                onClick={() => reliquidateProfits()}
              >
                Re-Liquidate Profits
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const AppContent = () => {
  const { mode, user, profile, loading, testMode, setTestMode } = useAppState();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Protocol...</div>;
  if (!user) return <LoginView />;

  const renderPage = () => {
    switch(currentPage) {
      case 'ledger': return <LedgerPage />;
      case 'profile': return <ProfilePage />;
      default: return mode === 'business' ? <BusinessInterface /> : <InvestorInterface />;
    }
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      <header className="box-panel" style={{ margin: '20px auto 40px', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 32px', borderRadius: '16px' }}>
        <div className="brand" onClick={() => setCurrentPage('dashboard')} style={{ fontSize: '1.5rem', fontWeight: 900, cursor: 'pointer' }}>
          FRAC<span className="gradient-text">TXON_</span>
        </div>
        
        <nav style={{ display: 'flex', gap: '32px' }}>
          <div className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>
            Dashboard
          </div>
          <div className={`nav-link ${currentPage === 'ledger' ? 'active' : ''}`} onClick={() => setCurrentPage('ledger')}>
            <History size={16} /> Ledger
          </div>
          <div className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`} onClick={() => setCurrentPage('profile')}>
            <UserIcon size={16} /> Profile
          </div>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div 
            onClick={() => setTestMode(!testMode)}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '20px', 
              background: testMode ? 'var(--accent-primary)' : 'var(--bg-page)', 
              color: testMode ? 'white' : 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: '1px solid var(--border-light)',
              transition: 'all 0.3s ease'
            }}
          >
            {testMode ? 'TEST MODE: ON' : 'TEST MODE: OFF'}
          </div>
          <div className="box-panel" style={{ padding: '6px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Activity size={14} color="#10b981" />
            <span style={{ color: '#10b981', fontWeight: 700 }}>Chain Online</span>
          </div>
          <img 
            src={user.photoURL} 
            alt="Profile" 
            style={{ width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', border: '2px solid white', boxShadow: '0 0 0 2px var(--accent-primary)' }} 
            onClick={() => setCurrentPage('profile')}
          />
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {renderPage()}
      </main>

      <BroadcastBar />
      
      <footer style={{ marginTop: '100px', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem', paddingBottom: '60px' }}>
        &copy; 2026 FRACTXON PROTOCOL. Verified on public mainnet.
      </footer>
    </div>
  );
};

const AppWrapper = () => {
  const { mode } = useAppState();

  useEffect(() => {
    if (mode) {
      document.body.className = `theme-${mode}`;
    }
  }, [mode]);

  return (
    <>
      <DottedMatrix />
      <AppContent />
    </>
  );
};

function App() {
  return (
    <StateProvider>
      <AppWrapper />
    </StateProvider>
  );
}

export default App;
