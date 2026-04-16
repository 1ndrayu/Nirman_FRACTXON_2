import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Wallet, 
  History, 
  User as UserIcon,
  LayoutDashboard,
  Bell
} from 'lucide-react';

export const MobileHeader = ({ user, setCurrentPage, testMode, setTestMode }) => {
  return (
    <header style={{ 
      padding: '16px 20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div 
        className="brand" 
        onClick={() => setCurrentPage('dashboard')} 
        style={{ fontSize: '1.2rem', fontWeight: 900 }}
      >
        FRAC<span className="gradient-text">TXON_</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div 
          onClick={() => setTestMode(!testMode)}
          style={{ 
            padding: '4px 8px', 
            borderRadius: '12px', 
            background: testMode ? 'var(--accent-primary)' : 'var(--bg-page)', 
            color: testMode ? 'white' : 'var(--text-muted)',
            fontSize: '0.6rem',
            fontWeight: 800,
            border: '1px solid var(--border-light)'
          }}
        >
          {testMode ? 'TEST' : 'LIVE'}
        </div>
        <img 
          src={user?.photoURL} 
          alt="Profile" 
          style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            border: '2px solid var(--accent-primary)' 
          }} 
          onClick={() => setCurrentPage('profile')}
        />
      </div>
    </header>
  );
};

export const MobileNav = ({ currentPage, setCurrentPage }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'ledger', label: 'Ledger', icon: History },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-light)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0 24px',
      zIndex: 1000,
      boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
    }}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = currentPage === tab.id;
        return (
          <div 
            key={tab.id}
            onClick={() => setCurrentPage(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              animate={isActive ? { scale: 1.1 } : { scale: 1 }}
            >
              <Icon size={24} />
            </motion.div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{tab.label}</span>
          </div>
        );
      })}
    </nav>
  );
};

export const MobileLayout = ({ children, user, currentPage, setCurrentPage, testMode, setTestMode }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', paddingBottom: '90px' }}>
      <MobileHeader 
        user={user} 
        setCurrentPage={setCurrentPage} 
        testMode={testMode} 
        setTestMode={setTestMode} 
      />
      <main style={{ padding: '20px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};
