import React, { useState, useEffect } from 'react';
import { StateProvider, useAppState } from './context/StateContext';
import { ASSET_CATEGORIES } from './lib/constants';
import { 
  Building2, Database, TrendingUp, History, ShieldCheck, Plus, X, ArrowRight,
  Edit2, Save, ArrowRightLeft, User as UserIcon, Layout, Wallet, PieChart, Trash2, AlertTriangle, Check,
  Activity, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber } from './lib/utils';
import { useIsMobile } from './hooks/useMediaQuery';

// Pages - Desktop
import ProfilePage from './pages/Profile';
import LedgerPage from './pages/Ledger';

// Pages - Mobile
import MobileDashboard from './pages/mobile/Dashboard.mobile';
import MobileLedger from './pages/mobile/Ledger.mobile';
import MobileProfile from './pages/mobile/Profile.mobile';

// Components
import BroadcastBar from './components/BroadcastBar';
import DottedMatrix from './components/DottedMatrix';
import { MobileLayout } from './components/mobile/MobileLayout';

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

const LoginView = () => {
  const { login } = useAppState();
  const isMobile = useIsMobile();
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="box-panel"
        style={{
          padding: isMobile ? '40px 24px' : '60px',
          textAlign: 'center',
          maxWidth: '500px',
          border: '1px solid var(--border-light)'
        }}
      >
        <motion.h1 variants={staggerItem} style={{ fontSize: isMobile ? '2.2rem' : '3rem', fontWeight: 900, marginBottom: '16px' }}>FRAC<span className="gradient-text">TXON_</span></motion.h1>
        <motion.p variants={staggerItem} style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: isMobile ? '0.9rem' : '1rem' }}>
          Secure, transparent asset tokenization powered by a decentralized master-chain ledger.
        </motion.p>
        <motion.button
          variants={staggerItem}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary"
          onClick={login}
          style={{ fontSize: '1.1rem', padding: '16px 32px', width: isMobile ? '100%' : 'auto' }}
        >
          Sign in with Google Account
        </motion.button>
      </motion.div>
    </div>
  );
};

const BusinessInterface = () => {
  const { assets, addAsset, updateAsset, tokenizeAsset, updateAssetValue, deleteAsset, testMode, recallTokens, balance, testBalance, user } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('vault'); // 'vault' or 'portfolio'
  const [expandedId, setExpandedId] = useState(null); // 'valuation', 'tokenize', 'recall'
  const [activeAssetId, setActiveAssetId] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  // Editing state
  const [editingAsset, setEditingAsset] = useState(null);
  const [tokenizeCount, setTokenizeCount] = useState('10000');
  const [recallCount, setRecallCount] = useState('');
  
  // Deletion state
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

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
      value: parseFloat(newAsset.value.replace(/,/g, '')),
      cashflow: parseFloat(newAsset.cashflow.replace(/,/g, '')) || 0,
      isReserved: newAsset.isReserved,
      reservedPercentage: parseFloat(newAsset.reservedPercentage) || 0
    });
    setNewAsset({
      name: '',
      businessName: '',
      value: '',
      cashflow: '',
      category: 'LAND',
      metadata: {},
      isReserved: false,
      reservedPercentage: '10'
    });
    setShowForm(false);
  };

  const myAssets = assets.filter(a => a.ownerId === user?.uid);
  const currentModeAssets = (activeSubTab === 'vault' ? assets : myAssets).filter(a => testMode ? a.isTest : !a.isTest);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Asset <span className="gradient-text">Management</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your asset registry and tokenization.</p>
        </motion.div>
        
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-surface)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <button 
            className={`btn ${activeSubTab === 'vault' ? 'btn-primary' : ''}`} 
            style={{ padding: '8px 20px', fontSize: '0.85rem', background: activeSubTab === 'vault' ? '' : 'transparent', color: activeSubTab === 'vault' ? '' : 'var(--text-muted)', border: 'none' }}
            onClick={() => setActiveSubTab('vault')}
          >
            Inventory
          </button>
          <button 
            className={`btn ${activeSubTab === 'portfolio' ? 'btn-primary' : ''}`} 
            style={{ padding: '8px 20px', fontSize: '0.85rem', background: activeSubTab === 'portfolio' ? '' : 'transparent', color: activeSubTab === 'portfolio' ? '' : 'var(--text-muted)', border: 'none' }}
            onClick={() => setActiveSubTab('portfolio')}
          >
            My Assets
          </button>
        </div>

        <motion.button
          variants={staggerItem}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} /> Register Asset
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            key="registry-form"
            onViewportEnter={() => {
              if (editingAsset) {
                setNewAsset({
                  name: editingAsset.name,
                  businessName: editingAsset.businessName,
                  value: editingAsset.value.toString(),
                  cashflow: editingAsset.cashflow.toString(),
                  category: editingAsset.category,
                  metadata: editingAsset.metadata || {},
                  isReserved: editingAsset.isReserved,
                  reservedPercentage: editingAsset.reservedPercentage?.toString() || '10'
                });
              }
            }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ ease: [0.65, 0, 0.35, 1], duration: 0.4 }}
            className="registry-gate"
            style={{ marginBottom: '40px' }}
          >
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--glow-color)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.5 }} />

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
                {editingAsset ? 'Edit Asset Details' : 'Register New Asset'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {editingAsset ? `Modifying ${editingAsset.name} configuration.` : 'Enter the details to register a new asset on the protocol.'}
              </p>
            </div>

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
                setEditingAsset(null);
              } else {
                addAsset(assetData);
              }
              
              setNewAsset({ name: '', businessName: '', value: '', cashflow: '', category: 'LAND', metadata: {}, isReserved: false, reservedPercentage: '10' });
              setShowForm(false);
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>COMPANY NAME</label>
                  <input
                    className="input-field" style={{ marginBottom: 0 }} placeholder="e.g. Acme Corp" required
                    value={newAsset.businessName} onChange={e => setNewAsset({ ...newAsset, businessName: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ASSET NAME</label>
                  <input
                    className="input-field" style={{ marginBottom: 0 }} placeholder="e.g. Building A" required
                    value={newAsset.name} onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CATEGORY</label>
                  <select
                    className="input-field"
                    style={{ background: 'var(--bg-surface)', cursor: 'pointer' }}
                    value={newAsset.category}
                    onChange={e => setNewAsset({ ...newAsset, category: e.target.value, metadata: {} })}
                  >
                    {Object.values(ASSET_CATEGORIES).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>MARKET VALUE</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, opacity: 0.5 }}>{testMode ? 'F$' : '$'}</span>
                    <input
                      className="input-field" style={{ marginBottom: 0, paddingLeft: '40px' }} required
                      value={formatNumber(newAsset.value)} onChange={e => handleNumericInput(e.target.value, (v) => setNewAsset({ ...newAsset, value: v }))}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ESTIMATED MONTHLY REVENUE (OPTIONAL)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, opacity: 0.5 }}>{testMode ? 'F$' : '$'}</span>
                    <input
                      className="input-field" style={{ marginBottom: 0, paddingLeft: '40px' }}
                      value={formatNumber(newAsset.cashflow)} onChange={e => handleNumericInput(e.target.value, (v) => setNewAsset({ ...newAsset, cashflow: v }))}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Metadata Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px', padding: '20px', background: 'var(--bg-page)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                {ASSET_CATEGORIES[newAsset.category].fields.map(field => (
                  <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{field.label}</label>
                    <input
                      className="input-field"
                      style={{ marginBottom: 0, fontSize: '0.85rem' }}
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

              <div style={{ padding: '20px', background: 'rgba(234, 179, 8, 0.05)', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.2)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setNewAsset({ ...newAsset, isReserved: !newAsset.isReserved })}>
                  <div style={{ width: '18px', height: '18px', border: '2px solid var(--accent-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: newAsset.isReserved ? 'var(--accent-primary)' : 'transparent' }}>
                    {newAsset.isReserved && <Check size={14} color="white" />}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Enable Token Allocation Reservation</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Secure a portion of the supply for price stabilization or internal yield.</div>
                  </div>
                </div>

                {newAsset.isReserved && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(234, 179, 8, 0.2)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>RESERVATION RATIO (%)</label>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                        Reserved Value: {testMode ? 'F$' : '$'}{formatNumber(((parseFloat(newAsset.value.replace(/,/g, '')) || 0) * (parseFloat(newAsset.reservedPercentage) || 0) / 100).toFixed(2))}
                      </span>
                    </div>
                    <input
                      className="input-field" style={{ marginBottom: 0 }} placeholder="e.g. 10"
                      value={newAsset.reservedPercentage}
                      onChange={e => {
                        const val = e.target.value;
                        if (val === '' || (!isNaN(val) && parseFloat(val) >= 0 && parseFloat(val) <= 100)) {
                           setNewAsset({ ...newAsset, reservedPercentage: val });
                        }
                      }}
                    />
                  </motion.div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                    VERIFIED REGISTRY
                  </span>
                </div>
                <button type="button" className="btn btn-secondary" style={{ padding: '12px 32px' }} onClick={() => {
                  setShowForm(false);
                  setEditingAsset(null);
                  setNewAsset({ name: '', businessName: '', value: '', cashflow: '', category: 'LAND', metadata: {}, isReserved: false, reservedPercentage: '10' });
                }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '12px 40px' }}>
                  {editingAsset ? 'Save Changes' : 'Submit'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div key={activeSubTab} variants={staggerContainer} initial="hidden" animate="show" className="dashboard-grid">
        {currentModeAssets.map(asset => (
          <div key={asset.id}>
            <motion.div
              variants={staggerItem}
              className={`box-panel asset-card ${activeAssetId === asset.id ? 'expanded' : ''}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>{asset.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                    <Building2 size={12} /> {asset.businessName}
                  </p>
                  
                  {asset.category && (
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      padding: '4px 10px', 
                      borderRadius: '8px', 
                      fontSize: '0.7rem', 
                      fontWeight: 800, 
                      background: ASSET_CATEGORIES[asset.category]?.bg || 'var(--bg-page)', 
                      color: ASSET_CATEGORIES[asset.category]?.color || 'var(--text-muted)',
                      border: `1px solid ${ASSET_CATEGORIES[asset.category]?.color}22`,
                      marginBottom: '16px'
                    }}>
                      {(() => {
                        const CatIcon = ASSET_CATEGORIES[asset.category]?.icon || Building2;
                        return <CatIcon size={12} />;
                      })()}
                      {ASSET_CATEGORIES[asset.category]?.label.toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div className={`status-badge ${asset.isTokenized ? 'badge-success' : 'badge-warning'}`}>
                    {asset.isTokenized ? 'TOKENIZED' : 'DRAFT'}
                  </div>
                  {asset.ownerId === user?.uid && (
                    <button 
                      onClick={() => setAssetToDelete(asset)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', opacity: 0.6 }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {asset.metadata && Object.keys(asset.metadata).length > 0 && asset.id === activeAssetId && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px', padding: '12px', background: 'var(--bg-page)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  {Object.entries(asset.metadata).map(([key, value]) => (
                    <div key={key}>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800 }}>{key.toUpperCase()}</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{value}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="divider" style={{ margin: '24px 0' }} />

              <div style={{ margin: '20px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Market Value</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{testMode ? 'F$' : '$'}{formatNumber(asset.value)}</span>
                    {asset.ownerId === user?.uid && (
                      <button
                        style={{ border: 'none', background: 'none', color: editingAsset?.id === asset.id ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer' }}
                        onClick={() => {
                          setEditingAsset(asset);
                          setShowForm(true);
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Annual Yield</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>{((asset.cashflow / asset.value) * 100).toFixed(2)}%</span>
                </div>

                {asset.isTokenized && (
                  <div style={{ padding: '16px', background: 'var(--bg-page)', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Token Supply</div>
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

              {asset.ownerId === user?.uid && (
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
                      <Database size={18} /> Tokenize
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
                      <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Withdraw Tokens
                    </motion.button>
                  )}
                </div>
              )}
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
                        }}>Submit</button>
                        <button className="btn btn-secondary" onClick={() => setActiveAssetId(null)}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {expandedId === 'tokenize' && (
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', fontWeight: 700 }}>Tokenize Asset</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Define the total supply of tokens for this asset.</p>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <input
                            className="input-field" style={{ marginBottom: 0 }}
                            value={formatNumber(tokenizeCount)}
                            onChange={e => handleNumericInput(e.target.value, setTokenizeCount)}
                            placeholder="Token Supply"
                          />
                        </div>
                        <button className="btn btn-primary" onClick={() => {
                          tokenizeAsset(asset.id, parseInt(tokenizeCount));
                          setActiveAssetId(null);
                        }}>Submit</button>
                        <button className="btn btn-secondary" onClick={() => setActiveAssetId(null)}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {expandedId === 'recall' && (
                    <div>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', fontWeight: 700 }}>Withdraw Tokens</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Recall tokens from circulation. Max available: {formatNumber(asset.tokensSold)}</p>

                      <div style={{ background: 'var(--bg-page)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Required Payout</span>
                          <span style={{ fontWeight: 700 }}>{testMode ? 'F$' : '$'}{formatNumber((asset.tokenPrice * (parseInt(recallCount.replace(/,/g, '')) || 0)).toFixed(2))}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Balance</span>
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
                          placeholder="Amount"
                        />
                        <button
                          className="btn btn-primary"
                          disabled={(testMode ? testBalance : balance) < (asset.tokenPrice * (parseInt(recallCount.replace(/,/g, '')) || 0))}
                          onClick={async () => {
                            const result = await recallTokens(asset.id, parseInt(recallCount.replace(/,/g, '')));
                            if (result.success) {
                              setActiveAssetId(null);
                            } else {
                              alert(`Failed: ${result.error}`);
                            }
                          }}
                        >
                          Confirm Withdrawal
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
      
      {currentModeAssets.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
          <PieChart size={48} style={{ marginBottom: '16px' }} />
          <p>No assets found in {testMode ? 'TEST' : 'REAL'} mode.</p>
          <p style={{ fontSize: '0.8rem' }}>{activeSubTab === 'vault' ? 'The global vault is empty.' : 'You haven\'t registered any assets here yet.'}</p>
        </div>
      )}

      <AnimatePresence>
        {assetToDelete && (
          <DeleteConfirmationModal 
            asset={assetToDelete}
            user={user}
            onCancel={() => setAssetToDelete(null)}
            onConfirm={async () => {
              await deleteAsset(assetToDelete.id);
              setAssetToDelete(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DeleteConfirmationModal = ({ asset, onConfirm, onCancel, user }) => {
  const [confirmText, setConfirmText] = useState('');
  const requiredText = `${user?.displayName || 'USER'}/${asset?.name}`;

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.85)', zIndex: 2000, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="box-panel"
        style={{ maxWidth: '450px', width: '100%', padding: '40px', background: 'var(--bg-surface)' }}
      >
        <div style={{ color: '#ef4444', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={24} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Confirm Deletion</h3>
        </div>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
          This action is irreversible. It will wipe all history and linked ledger entries for <b>{asset.name}</b>.
        </p>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            TYPE THIS TO CONFIRM: <span style={{ color: 'var(--text-main)', userSelect: 'none' }}>{requiredText}</span>
          </label>
          <input 
            className="input-field"
            style={{ marginBottom: 0, border: confirmText === requiredText ? '1px solid #059669' : '1px solid var(--border-light)' }}
            placeholder="Enter confirmation string"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            onPaste={e => e.preventDefault()}
            autoFocus
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            disabled={confirmText !== requiredText}
            style={{ flex: 1, justifyContent: 'center', background: '#ef4444' }}
            onClick={onConfirm}
          >
            Delete Asset
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const InvestorInterface = () => {
  const { assets, balance, testBalance, buyTokens, testMode, claimYield, portfolio } = useAppState();
  const [activeAssetId, setActiveAssetId] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('exchange'); // 'exchange' or 'portfolio'
  const [purchaseCount, setPurchaseCount] = useState('10');

  const handleNumericInput = (val, setter) => {
    const pure = val.replace(/,/g, '');
    if (pure === '' || /^\d*\.?\d*$/.test(pure)) {
      setter(pure);
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Market<span className="gradient-text">place</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Buy tokens of revenue-generating assets.</p>
        </motion.div>

        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-surface)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <button 
            className={`btn ${activeSubTab === 'exchange' ? 'btn-primary' : ''}`} 
            style={{ padding: '8px 20px', fontSize: '0.85rem', background: activeSubTab === 'exchange' ? '' : 'transparent', color: activeSubTab === 'exchange' ? '' : 'var(--text-muted)', border: 'none' }}
            onClick={() => setActiveSubTab('exchange')}
          >
            Market
          </button>
          <button 
            className={`btn ${activeSubTab === 'portfolio' ? 'btn-primary' : ''}`} 
            style={{ padding: '8px 20px', fontSize: '0.85rem', background: activeSubTab === 'portfolio' ? '' : 'transparent', color: activeSubTab === 'portfolio' ? '' : 'var(--text-muted)', border: 'none' }}
            onClick={() => setActiveSubTab('portfolio')}
          >
            Portfolio
          </button>
        </div>

        <div style={{ padding: '8px 16px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={16} color="#fbbf24" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Real-time yield tracking active</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeSubTab} variants={staggerContainer} initial="hidden" animate="show" className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {activeSubTab === 'exchange' ? (
            (() => {
              const marketAssets = assets.filter(a => a.isTokenized && (testMode ? a.isTest : !a.isTest));
              if (marketAssets.length === 0) {
                return (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 0', opacity: 0.5 }}>
                    <Database size={48} style={{ marginBottom: '16px' }} />
                    <p>No tokenized assets available in {testMode ? 'TEST' : 'REAL'} mode.</p>
                  </div>
                );
              }
              return marketAssets.map(asset => (
              <div key={asset.id}>
                <motion.div variants={staggerItem} className={`box-panel asset-card ${activeAssetId === asset.id ? 'expanded' : ''}`}>
                  <h3 style={{ marginBottom: '4px', fontWeight: 700 }}>{asset.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{asset.businessName}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 900 }}>{testMode ? 'F$' : '$'}{asset.tokenPrice.toFixed(2)}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PRICE</span>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>ROI</span>
                      <span style={{ color: '#059669', fontWeight: 700 }}>+{((asset.cashflow / asset.value) * 100).toFixed(1)}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Supply</span>
                      <span style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{formatNumber(asset.availableTokens)} FTNK</span>
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
                    {activeAssetId === asset.id ? 'Cancel' : 'Buy Tokens'} <ArrowRight size={16} />
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
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', fontWeight: 700 }}>Buy Tokens</h4>
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>QUANTITY</div>
                          <input
                            className="input-field" style={{ marginBottom: 0 }}
                            value={formatNumber(purchaseCount)}
                            onChange={e => handleNumericInput(e.target.value, setPurchaseCount)}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>COST</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: '8px' }}>
                            {testMode ? 'F$' : '$'}{formatNumber((asset.tokenPrice * (parseInt(purchaseCount.replace(/,/g, '')) || 0)).toFixed(2))}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            BALANCE: {testMode ? 'F$' : '$'}{formatNumber(testMode ? testBalance : balance)}
                          </div>
                        </div>
                      </div>
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        disabled={(testMode ? testBalance : balance) < (asset.tokenPrice * (parseInt(purchaseCount.replace(/,/g, '')) || 0))}
                        onClick={async () => {
                          const count = parseInt(purchaseCount.replace(/,/g, ''));
                          if (count > asset.availableTokens) {
                            alert(`Error: Only ${formatNumber(asset.availableTokens)} tokens available.`);
                            return;
                          }
                          const result = await buyTokens(asset.id, count);
                          if (result.success) {
                            setActiveAssetId(null);
                          } else {
                            alert(result.error);
                          }
                        }}
                      >
                        Submit Order
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ));
            })()
          ) : (
            (() => {
              const portfolioAssets = portfolio.map(item => {
                const asset = assets.find(a => a.id === item.assetId);
                return { ...item, asset };
              }).filter(item => item.asset && (testMode ? item.asset.isTest : !item.asset.isTest));

              if (portfolioAssets.length === 0) {
                return (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
                    <PieChart size={48} style={{ marginBottom: '16px', margin: '0 auto' }} />
                    <p>Your {testMode ? 'TEST' : 'REAL'} portfolio is empty.</p>
                  </div>
                );
              }
              return portfolioAssets.map(item => (
              <motion.div variants={staggerItem} key={item.id} className="box-panel asset-card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontWeight: 800 }}>{item.assetName}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.asset.businessName}</p>
                  </div>
                  <div className="badge-success" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800 }}>
                    ACTIVE
                  </div>
                </div>

                <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: 'var(--bg-page)', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Held Tokens</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{formatNumber(item.count)} <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>FTNK</span></div>
                  </div>
                  <div style={{ background: 'var(--bg-page)', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Equity Value</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{testMode ? 'F$' : '$'}{formatNumber((item.count * item.asset.tokenPrice).toFixed(2))}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={16} color="#059669" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669' }}>+{((item.asset.cashflow / item.asset.value) * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Yield Accruing
                  </div>
                </div>
              </motion.div>
            ));
          })()
        )}
      </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const AppContent = () => {
  const { mode, user, profile, loading, testMode, setTestMode } = useAppState();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const isMobile = useIsMobile();

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Protocol...</div>;
  if (!user) return <LoginView />;

  // Mobile Render Path
  if (isMobile) {
    const renderMobilePage = () => {
      switch (currentPage) {
        case 'ledger': return <MobileLedger />;
        case 'profile': return <MobileProfile />;
        default: return <MobileDashboard />;
      }
    };

    return (
      <MobileLayout
        user={user}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        testMode={testMode}
        setTestMode={setTestMode}
      >
        {renderMobilePage()}
      </MobileLayout>
    );
  }

  // Desktop Render Path
  const renderPage = () => {
    switch (currentPage) {
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
            <History size={16} /> History
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
        &copy; FRACTXON_.
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
