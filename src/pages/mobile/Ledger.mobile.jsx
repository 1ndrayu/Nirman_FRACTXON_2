import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../context/StateContext';
import { formatNumber } from '../../lib/utils';
import { ShieldCheck, ArrowRightLeft, Clock } from 'lucide-react';

const LedgerMobile = () => {
  const { transactions, user, testMode } = useAppState();

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Master <span className="gradient-text">Ledger</span></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Immutable record of protocol activity.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(transactions || []).map(tx => {
          const isUserInvolved = user && (tx.from === user.uid || tx.to === user.uid);
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={tx.id}
              className="box-panel"
              style={{ 
                padding: '16px',
                borderLeft: isUserInvolved ? '4px solid var(--accent-primary)' : '1px solid var(--border-light)',
                background: isUserInvolved ? 'var(--glow-color)' : 'var(--bg-surface)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  <ShieldCheck size={14} color="var(--accent-primary)" />
                  {tx.hash?.substring(0, 12)}...
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 900 }}>
                  {testMode ? 'F$' : '$'}{formatNumber(tx.amount || 0)}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{tx.type}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Path: {tx.assetId?.substring(0, 8)}...</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', fontWeight: 600 }}>
                  <span>{tx.from?.substring(0, 4) || 'SYS'}</span>
                  <ArrowRightLeft size={10} />
                  <span>{tx.to?.substring(0, 4) || 'SYS'}</span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {transactions.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No transactions found on chain.
          </div>
        )}
      </div>
    </div>
  );
};

export default LedgerMobile;
