import React, { useState } from 'react';
import { useAppState } from '../../context/StateContext';
import { 
  Building2, 
  Mail, 
  Settings, 
  LogOut, 
  Shield, 
  Briefcase 
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileMobile = () => {
  const { user, profile, mode, setMode, logout, balance, testBalance, testMode, updateTestBalance } = useAppState();
  const [vaultAmount, setVaultAmount] = useState('10000');

  if (!user) return null;

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <img src={user.photoURL} alt="Profile" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid white', boxShadow: 'var(--shadow-md)' }} />
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user.displayName}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Protocol Capital */}
        <div className="box-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} color="var(--accent-primary)" /> Capital
          </h3>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>
            {testMode ? 'F$' : '$'}{(testMode ? testBalance : balance).toLocaleString()}
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Unallocated Funds</p>
          
          {testMode && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  className="input-field" style={{ marginBottom: 0, height: '44px', flex: 1 }}
                  value={vaultAmount}
                  onChange={e => setVaultAmount(e.target.value)}
                  placeholder="F$ Amount"
                />
                <button 
                  className="btn btn-primary" 
                  onClick={() => updateTestBalance(vaultAmount)}
                  style={{ height: '44px', padding: '0 12px' }}
                >
                  Adjust
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Identity & Settings */}
        <div className="box-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} /> Settings
          </h3>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>INTERFACE MODE</label>
            <div className="interface-toggle" onClick={() => setMode()} style={{ width: '100%' }}>
              <div className="toggle-slider" style={{ 
                left: mode === 'business' ? '4px' : 'calc(50% + 0px)', 
                width: 'calc(50% - 4px)' 
              }} />
              <div className={`toggle-option ${mode === 'business' ? 'active' : ''}`} style={{ flex: 1, textAlign: 'center' }}>Building</div>
              <div className={`toggle-option ${mode === 'investor' ? 'active' : ''}`} style={{ flex: 1, textAlign: 'center' }}>Investing</div>
            </div>
          </div>

          <button 
            onClick={logout} 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'center', color: '#ef4444', borderColor: '#ef4444', height: '48px' }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>

        {/* Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="box-panel" style={{ padding: '16px' }}>
            <Shield size={20} color="var(--accent-primary)" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>KYC</div>
            <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>Verified</div>
          </div>
          <div className="box-panel" style={{ padding: '16px' }}>
            <Building2 size={20} color="var(--accent-primary)" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>Tier</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Principal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMobile;
