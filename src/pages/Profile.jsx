import React from 'react';
import { useAppState } from '../context/StateContext';
import { 
  User as UserIcon, 
  Mail, 
  Settings, 
  CreditCard, 
  LogOut, 
  Shield, 
  Building2, 
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';

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

const ProfilePage = () => {
  const { user, profile, mode, setMode, logout, balance, testBalance, testMode, updateTestBalance } = useAppState();
  const [vaultAmount, setVaultAmount] = React.useState('10000');

  if (!user) return null;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.div variants={staggerItem} className="profile-header">
        <img src={user.photoURL || 'https://via.placeholder.com/100'} alt="Profile" className="profile-img" />
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{user.displayName}</h2>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <Mail size={16} /> {user.email}
          </p>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="box-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={20} /> Profile Settings
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Dashboard Type</label>
              <div className="interface-toggle" onClick={() => setMode()}>
                <div className="toggle-slider" style={{ 
                  left: mode === 'business' ? '4px' : 'calc(50% + 0px)', 
                  width: 'calc(50% - 4px)' 
                }} />
                <div className={`toggle-option ${mode === 'business' ? 'active' : ''}`}>Building</div>
                <div className={`toggle-option ${mode === 'investor' ? 'active' : ''}`}>Investing</div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout} 
              className="btn btn-secondary" 
              style={{ width: '100%', justifyContent: 'center', color: '#ef4444', borderColor: '#ef4444' }}
            >
              <LogOut size={18} /> Sign Out
            </motion.button>
          </div>

          <div className="box-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={20} color="var(--accent-primary)" /> Balance
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{testMode ? 'Test Balance' : 'Available Balance'}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}>{testMode ? 'F$' : '$'}{(testMode ? testBalance : balance).toLocaleString()}</div>
            </div>

            <div className="divider" style={{ margin: '20px 0' }} />

            {testMode ? (
              <div className="vault-management">
                <h4 style={{ fontSize: '0.8rem', marginBottom: '12px', color: 'var(--accent-primary)', fontWeight: 800 }}>TEST FUND MANAGER</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Manage simulated funds for testing purposes.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input 
                    className="input-field" style={{ marginBottom: 0 }}
                    value={vaultAmount}
                    onChange={e => setVaultAmount(e.target.value)}
                    placeholder="Enter amount (F$)"
                  />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => {
                        updateTestBalance(vaultAmount);
                        setVaultAmount('10000');
                      }}
                    >
                      Add Funds
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      style={{ flex: 1, justifyContent: 'center', color: '#ef4444', borderColor: '#ef4444' }}
                      onClick={() => {
                        updateTestBalance(-parseFloat(vaultAmount));
                        setVaultAmount('10000');
                      }}
                    >
                      Remove Funds
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-light)', textAlign: 'center', opacity: 0.6 }}>
                <Shield size={24} style={{ margin: '0 auto 12px', display: 'block' }} />
                <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>LIVE MODE ACTIVE</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Manual balance adjustments are disabled in production.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="box-panel" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px' }}>Account Info</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <Shield size={24} color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
              <div style={{ fontWeight: 700 }}>Verification</div>
              <div style={{ fontSize: '0.85rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                 Verified Account
              </div>
            </div>

            <div style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <Briefcase size={24} color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
              <div style={{ fontWeight: 700 }}>Account Type</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Standard
              </div>
            </div>
          </div>

          <div className="divider" style={{ margin: '32px 0' }} />

          <h4>Business Profile</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px' }}>
            Registered businesses can issue tokens for real-world assets.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} color="var(--accent-primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Company Name</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.displayName} Partners LLC</div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              Edit
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
