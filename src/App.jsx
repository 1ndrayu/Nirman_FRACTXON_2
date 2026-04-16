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
  ChevronRight,
  PieChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BusinessInterface = () => {
  const { assets, setAssets, tokenizeAsset } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', businessName: '', value: '', cashflow: '' });

  const handleAddAsset = (e) => {
    e.preventDefault();
    const asset = {
      ...newAsset,
      id: Math.random().toString(36).substring(7),
      value: parseFloat(newAsset.value),
      cashflow: parseFloat(newAsset.cashflow),
      isTokenized: false,
      timestamp: Date.now()
    };
    setAssets([...assets, asset]);
    setNewAsset({ name: '', businessName: '', value: '', cashflow: '' });
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Business <span className="gradient-text">Studio</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Tokenize your real-world assets and raise capital.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={20} /> Add New Asset
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="box-panel" 
            style={{ padding: '32px', marginBottom: '32px', overflow: 'hidden' }}
          >
            <form onSubmit={handleAddAsset}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <input 
                  className="input-field" placeholder="Business Name" required
                  value={newAsset.businessName} onChange={e => setNewAsset({...newAsset, businessName: e.target.value})}
                />
                <input 
                  className="input-field" placeholder="Asset Name (e.g. Real Estate, Equipment)" required
                  value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})}
                />
                <input 
                  className="input-field" type="number" placeholder="Total Value ($)" required
                  value={newAsset.value} onChange={e => setNewAsset({...newAsset, value: e.target.value})}
                />
                <input 
                  className="input-field" type="number" placeholder="Estimated Annual Cashflow ($)" required
                  value={newAsset.cashflow} onChange={e => setNewAsset({...newAsset, cashflow: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Asset Registry</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="dashboard-grid">
        {assets.map(asset => (
          <div key={asset.id} className="box-panel asset-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{asset.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building2 size={12} /> {asset.businessName}
                </p>
              </div>
              <div className={`status-badge ${asset.isTokenized ? 'badge-success' : 'badge-warning'}`}>
                {asset.isTokenized ? 'TOKENIZED' : 'DRAFT'}
              </div>
            </div>

            <div className="divider" />

            <div style={{ margin: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Asset Value</span>
                <span style={{ fontWeight: 700 }}>${asset.value.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Yield</span>
                <span style={{ color: '#059669', fontWeight: 600 }}>{((asset.cashflow / asset.value) * 100).toFixed(2)}% APR</span>
              </div>
            </div>

            {!asset.isTokenized ? (
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  const count = prompt("Enter number of tokens to create:", "1000");
                  if (count) tokenizeAsset(asset.id, parseInt(count));
                }}
              >
                <Database size={18} /> Tokenize Asset
              </button>
            ) : (
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>TOKEN POOL</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{asset.tokenCount} FTNK</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>${asset.tokenPrice.toFixed(2)} ea</span>
                </div>
                <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${(asset.tokensSold / asset.tokenCount) * 100}%`, 
                    height: '100%', 
                    background: 'var(--accent-primary)' 
                  }} />
                </div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px', textAlign: 'right', color: 'var(--text-muted)' }}>
                  {asset.tokensSold} sold • {asset.availableTokens} remaining
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const InvestorInterface = () => {
  const { assets, balance, buyTokens, investmentPortfolio } = useAppState();

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Asset <span className="gradient-text">Marketplace</span></h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Invest in partial shares of high-value assets secured by the master chain.</p>

          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {assets.filter(a => a.isTokenized && a.availableTokens > 0).map(asset => (
              <div key={asset.id} className="box-panel asset-card" style={{ cursor: 'default' }}>
                <h3 style={{ marginBottom: '4px' }}>{asset.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{asset.businessName}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>${asset.tokenPrice.toFixed(2)}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Per Token</span>
                </div>

                <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Expected yield</span>
                    <span style={{ color: '#059669', fontWeight: 600 }}>+{( (asset.cashflow / asset.value) * 100 ).toFixed(1)}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Liquidity</span>
                    <span>High</span>
                  </div>
                </div>

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
                  onClick={() => {
                    const count = prompt(`Buy tokens of ${asset.name}. Available: ${asset.availableTokens}`, "10");
                    if (count) buyTokens(asset.id, parseInt(count));
                  }}
                >
                  Invest Now <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="box-panel" style={{ padding: '24px', position: 'sticky', top: '24px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wallet size={20} style={{ color: 'var(--accent-primary)' }} /> My Portfolio
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Available Capital</div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>${balance.toLocaleString()}</div>
            </div>

            <div className="divider" />
            
            <div style={{ paddingTop: '8px' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Active Holdings</h4>
              {investmentPortfolio.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No tokens in portfolio yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {investmentPortfolio.map(p => {
                    const asset = assets.find(a => a.id === p.assetId);
                    return (
                      <div key={p.assetId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.assetName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.count} Tokens • Floor: ${asset?.tokenPrice.toFixed(2)}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#059669', fontSize: '0.9rem', fontWeight: 700 }}>+${( (p.count * (asset?.tokenPrice || 0)) * 0.05 ).toFixed(2)}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dividends</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '32px', justifyContent: 'center' }}>
              Withdraw Profits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { mode, setMode } = useAppState();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
        <div className="brand" style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-1px' }}>
          FRAC<span className="gradient-text">TXON_</span>
        </div>
        
        <div className="interface-toggle" onClick={() => setMode(mode === 'business' ? 'investor' : 'business')}>
          <div className="toggle-slider" style={{ 
            left: mode === 'business' ? '4px' : 'calc(50% + 0px)', 
            width: 'calc(50% - 4px)' 
          }} />
          <div className={`toggle-option ${mode === 'business' ? 'active' : ''}`}>
            Building
          </div>
          <div className={`toggle-option ${mode === 'investor' ? 'active' : ''}`}>
            Investing
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="box-panel" style={{ padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Activity size={14} color="#059669" />
            <span>Master Chain: <span style={{ color: '#059669', fontWeight: 700 }}>Synching</span></span>
          </div>
        </div>
      </header>

      <main>
        {mode === 'business' ? <BusinessInterface /> : <InvestorInterface />}
      </main>
      
      <footer style={{ marginTop: '80px', borderTop: '1px solid var(--border-light)', paddingTop: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>&copy; 2026 FRACTXON_ Protocol. All assets verified on the public consensus layer.</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <StateProvider>
      <AppContent />
    </StateProvider>
  );
}

export default App;
