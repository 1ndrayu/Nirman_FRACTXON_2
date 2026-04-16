import { motion } from 'framer-motion';
import { formatNumber } from '../lib/utils';
import { useAppState } from '../context/StateContext';
import { Database, ArrowRightLeft, ShieldCheck, Link as LinkIcon } from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const LedgerPage = () => {
  const { transactions, user, testMode } = useAppState();

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="animate-fade-in-disabled">
      <div style={{ marginBottom: '40px' }}>
        <motion.h2 variants={staggerItem} style={{ fontSize: '2rem', fontWeight: 800 }}>Master <span className="gradient-text">Ledger</span></motion.h2>
        <motion.p variants={staggerItem} style={{ color: 'var(--text-muted)' }}>Real-time transparency for all asset tokenization and transfers on the protocol.</motion.p>
      </div>

      <div className="box-panel" style={{ overflow: 'hidden' }}>
        <div style={{ 
          background: 'var(--bg-surface)', 
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
          <span>Asset / Path</span>
          <span>From / To</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {(transactions || []).map(tx => {
            const isUserInvolved = user && (tx.from === user.uid || tx.to === user.uid);
            return (
              <motion.div 
                variants={staggerItem}
                key={tx.id} 
                className={`ledger-row ${isUserInvolved ? 'tx-highlight' : ''}`}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    <ShieldCheck size={14} color="var(--accent-primary)" />
                    {tx.hash?.substring(0, 14) || '0xPENDING...'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.3)', fontFamily: 'monospace', paddingLeft: '22px' }}>
                    Link: {tx.previousBlockHash?.substring(0, 10) || '0x000...'}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{(tx.tokenID || tx.assetId)?.substring(0, 8) || 'N/A'}...</span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>{tx.type}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 600 }}>{(tx.senderPublicKey || tx.from)?.substring(0, 6) || 'SYSTEM'}...</span>
                  <ArrowRightLeft size={12} color="var(--text-muted)" />
                  <span style={{ fontWeight: 600 }}>{(tx.recipientPublicKey || tx.to)?.substring(0, 6) || 'SYSTEM'}...</span>
                </div>

                <div style={{ fontWeight: 700 }}>{testMode ? 'F$' : '$'}{formatNumber(tx.amount || 0)}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 700 }}>
                  <ShieldCheck size={14} /> IMMUTABLE
                </div>
              </motion.div>
            );
          })}
          {transactions.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No transactions detected on the master chain yet.
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LedgerPage;
