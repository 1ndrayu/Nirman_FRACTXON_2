import React, { useState } from 'react';
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
        <motion.button variants={staggerItem} className="btn btn-primary" onClick={login} style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
          Sign in with Google Account
        </motion.button>
      </motion.div>
    </div>
  );
};

const BusinessInterface = () => {
  const { assets, addAsset, tokenizeAsset, updateAssetValue } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newAsset, setNewAsset] = useState({ name: '', businessName: '', value: '', cashflow: '' });

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
        <motion.button variants={staggerItem} className="btn btn-primary" onClick={() => setShowForm(true)}>
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
                  className="input-field" type="number" placeholder="Appraised Value ($)" required
                  value={newAsset.value} onChange={e => setNewAsset({...newAsset, value: e.target.value})}
                />
                <input 
                  className="input-field" type="number" placeholder="Net Monthly Yield ($)" required
                  value={newAsset.cashflow} onChange={e => setNewAsset({...newAsset, cashflow: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish to Registry</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={staggerContainer} className="dashboard-grid">
        {assets.map(asset => (
          <motion.div variants={staggerItem} key={asset.id} className="box-panel asset-card" style={{ position: 'relative' }}>
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
                {editingId === asset.id ? (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <input 
                      type="number" 
                      className="input-field" 
                      style={{ marginBottom: 0, width: '120px', padding: '4px 8px' }} 
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                    />
                    <button className="btn btn-primary" style={{ padding: '4px 8px' }} onClick={() => {
                      updateAssetValue(asset.id, editValue);
                      setEditingId(null);
                    }}><Check size={14} /></button>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setEditingId(null)}><X size={14} /></button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>${asset.value.toLocaleString()}</span>
                    <button style={{ border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => {
                      setEditingId(asset.id);
                      setEditValue(asset.value);
                    }}><Edit2 size={14} /></button>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Effective Yield</span>
                <span style={{ color: '#059669', fontWeight: 700 }}>{((asset.cashflow / asset.value) * 100).toFixed(2)}% APR</span>
              </div>
            </div>

            {!asset.isTokenized ? (
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
                onClick={() => {
                  const count = prompt("Enter total token supply architecture:", "10000");
                  if (count) tokenizeAsset(asset.id, parseInt(count));
                }}
              >
                <Database size={18} /> Initiate Asset Tokenization
              </button>
            ) : (
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Consensus Pool</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{asset.tokenCount.toLocaleString()} FTNK</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>${asset.tokenPrice.toFixed(2)} / unit</span>
                </div>
                <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${((asset.tokensSold || 0) / asset.tokenCount) * 100}%`, 
                    height: '100%', 
                    background: 'var(--accent-gradient)' 
                  }} />
                </div>
                <div style={{ fontSize: '0.7rem', marginTop: '6px', textAlign: 'right', color: 'var(--text-muted)' }}>
                  {asset.tokensSold || 0} deployed • {asset.availableTokens} floating
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const InvestorInterface = () => {
  const { assets, balance, buyTokens } = useAppState();

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <motion.div variants={staggerItem}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px' }}>Asset <span className="gradient-text">Exchange</span></h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Participate in fractionalized revenue-generating assets.</p>

          <motion.div variants={staggerContainer} className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {assets.filter(a => a.isTokenized).map(asset => (
              <motion.div variants={staggerItem} key={asset.id} className="box-panel asset-card">
                <h3 style={{ marginBottom: '4px', fontWeight: 700 }}>{asset.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{asset.businessName}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900 }}>${asset.tokenPrice.toFixed(2)}</span>
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

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', fontWeight: 700 }}
                  onClick={() => {
                    const count = prompt(`Execute purchase for ${asset.name}. Available supply: ${asset.availableTokens}`, "10");
                    if (count) buyTokens(asset.id, parseInt(count));
                  }}
                >
                  Acquire Stake <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={staggerItem}>
          <div className="box-panel" style={{ padding: '28px', position: 'sticky', top: '24px' }}>
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wallet size={20} style={{ color: 'var(--accent-primary)' }} /> Capital Reserves
            </h3>
            
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Unallocated Funds</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>${balance.toLocaleString()}</div>
            </div>

            <div className="divider" style={{ margin: '24px 0' }} />
            
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
              Re-Liquidate Profits
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const AppContent = () => {
  const { mode, user, profile, loading } = useAppState();
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
          <div className="box-panel" style={{ padding: '6px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', background: '#f0fdf4', border: 'none' }}>
            <Activity size={14} color="#059669" />
            <span style={{ color: '#059669', fontWeight: 700 }}>Chain Online</span>
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

function App() {
  const { mode } = useAppState();

  useEffect(() => {
    document.body.className = `theme-${mode}`;
  }, [mode]);

  return (
    <>
      <DottedMatrix />
      <AppContent />
    </>
  );
}

export default App;
