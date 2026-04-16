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
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const ProfilePage = () => {
  const { user, profile, mode, setMode, logout, balance } = useAppState();

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
              <Settings size={20} /> Identity Settings
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Active Interface Theme</label>
              <div className="interface-toggle" onClick={() => setMode()}>
                <div className="toggle-slider" style={{ 
                  left: mode === 'business' ? '4px' : 'calc(50% + 0px)', 
                  width: 'calc(50% - 4px)' 
                }} />
                <div className={`toggle-option ${mode === 'business' ? 'active' : ''}`}>Building</div>
                <div className={`toggle-option ${mode === 'investor' ? 'active' : ''}`}>Investing</div>
              </div>
            </div>

            <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', color: '#ef4444', borderColor: '#ef4444' }}>
              <LogOut size={18} /> Sign Out of Protocol
            </button>
          </div>

          <div className="box-panel" style={{ padding: '24px', background: 'var(--accent-gradient)', color: 'white' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} /> Vault Balance
            </h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>${balance.toLocaleString()}</div>
            <p style={{ fontSize: '0.8rem', marginTop: '8px', opacity: 0.9 }}>Available for cross-asset deployment</p>
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="box-panel" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px' }}>Applicable Profile Data</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <Shield size={24} color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
              <div style={{ fontWeight: 700 }}>KYC Status</div>
              <div style={{ fontSize: '0.85rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                 Verified Citizen
              </div>
            </div>

            <div style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <Briefcase size={24} color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
              <div style={{ fontWeight: 700 }}>Account Tier</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Master-Chain Principal
              </div>
            </div>
          </div>

          <div className="divider" style={{ margin: '32px 0' }} />

          <h4>Business Qualifications</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px' }}>
            Verified businesses can issue tokens against real-world assets.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} color="var(--accent-primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Default Issuer Entity</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.displayName} Partners LLC</div>
            </div>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Edit</button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
