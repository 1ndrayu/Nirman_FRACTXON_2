import React from 'react';
import { useAppState } from '../context/StateContext';
import { Database, ShieldCheck, User as UserIcon, ExternalLink, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const LedgerPage = () => {
  const { transactions, user } = useAppState();

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Master <span className="gradient-text">Ledger</span></h2>
        <p style={{ color: 'var(--text-muted)' }}>Real-time transparency for all asset tokenization and transfers on the protocol.</p>
      </div>

      <div className="box-panel" style={{ overflow: 'hidden' }}>
        <div style={{ 
          background: '#f9fafb', 
          padding: '16px', 
          display: 'grid', 
          gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <span>Block Hash</span>
          <span>From / To</span>
          <span>Amount</span>
          <span>Type</span>
          <span>Status</span>
        </div>

        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {transactions.map(tx => {
            const isUserInvolved = user && (tx.from === user.uid || tx.to === user.uid);
            return (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={tx.id} 
                className={`ledger-row ${isUserInvolved ? 'tx-highlight' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  <Database size={14} />
                  {tx.hash.substring(0, 10)}...
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 600 }}>{tx.from.substring(0, 6)}...</span>
                  <ArrowRightLeft size={12} color="var(--text-muted)" />
                  <span style={{ fontWeight: 600 }}>{tx.to.substring(0, 6)}...</span>
                </div>
                <div style={{ fontWeight: 700 }}>${tx.amount.toLocaleString()}</div>
                <div>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    background: '#f3f4f6', 
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {tx.type}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 700 }}>
                  <ShieldCheck size={14} /> Verified
                </div>
              </motion.div>
            );
          })}
          {transactions.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No transactions detected on the master chain yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LedgerPage;
