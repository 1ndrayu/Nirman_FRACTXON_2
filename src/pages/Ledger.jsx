import { motion } from 'framer-motion';
import { formatNumber } from '../lib/utils';
import { useAppState } from '../context/StateContext';
import { Database, ArrowRightLeft, ShieldCheck, Link as LinkIcon, Building2 } from 'lucide-react';
import { ASSET_CATEGORIES } from '../lib/constants';

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

const LedgerPage = () => {
  const { transactions, user, assets, testMode } = useAppState();

  const resolveAssetName = (id) => {
    if (!id || id === 'PROTOCOL') return 'SYSTEM_VAULT';
    const asset = assets.find(a => a.id === id);
    return asset ? asset.name : `${id.substring(0, 8)}...`;
  };

  const resolveProfileName = (id) => {
    if (!id || id === '0x0000' || id === 'SYSTEM') return 'MASTER_PROTOCOL';
    if (user && id === user.uid) return 'YOU (VLD_SIG)';
    return `${id.substring(0, 8)}...`;
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="animate-fade-in-disabled">
      <div style={{ marginBottom: '40px' }}>
        <motion.h2 variants={staggerItem} style={{ fontSize: '2rem', fontWeight: 800 }}>Transaction <span className="gradient-text">History</span></motion.h2>
        <motion.p variants={staggerItem} style={{ color: 'var(--text-muted)' }}>View all tokenization and transfer activity on the protocol.</motion.p>
      </div>

      <div className="box-panel" style={{ overflow: 'hidden' }}>
        <div style={{ 
          background: 'var(--bg-surface)', 
          padding: '16px', 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 1.80fr 1.5fr 1fr 1fr',
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <span>Transaction Hash</span>
          <span>Asset</span>
          <span>Sender / Receiver</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {(transactions || []).map(tx => {
            const isUserInvolved = user && (tx.from === user.uid || tx.to === user.uid);
            const assetName = resolveAssetName(tx.assetId || tx.tokenID);
            const fromName = resolveProfileName(tx.from || tx.senderPublicKey);
            const toName = resolveProfileName(tx.to || tx.recipientPublicKey);

            return (
              <motion.div 
                variants={staggerItem}
                key={tx.id} 
                className={`ledger-row ${isUserInvolved ? 'tx-highlight' : ''}`}
                style={{ gridTemplateColumns: '1.2fr 1.8fr 1.5fr 1fr 1fr' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div 
                    data-tooltip={tx.hash || 'PENDING'}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.8rem' }}
                  >
                    <ShieldCheck size={14} color="var(--accent-primary)" />
                    {tx.hash?.substring(0, 14) || '0xPENDING...'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.3)', fontFamily: 'monospace', paddingLeft: '22px' }}>
                    Link: {tx.previousBlockHash?.substring(0, 10) || '0x000...'}
                  </div>
                </div>

                <div 
                  data-tooltip={tx.assetId || tx.tokenID || 'N/A'}
                  style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{assetName}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.6rem', opacity: 0.6, fontWeight: 800 }}>{tx.type}</span>
                    {tx.metadata?.category && (
                      <span style={{ 
                        fontSize: '0.55rem', 
                        padding: '1px 6px', 
                        borderRadius: '4px', 
                        background: ASSET_CATEGORIES[tx.metadata.category]?.bg || 'rgba(0,0,0,0.05)', 
                        color: ASSET_CATEGORIES[tx.metadata.category]?.color || 'inherit',
                        border: `1px solid ${ASSET_CATEGORIES[tx.metadata.category]?.color}22`,
                        fontWeight: 900
                      }}>
                        {tx.metadata.category}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span data-tooltip={tx.from || tx.senderPublicKey || 'SYSTEM'} style={{ fontWeight: 600, fontSize: '0.8rem' }}>{fromName}</span>
                  <ArrowRightLeft size={10} color="var(--text-muted)" />
                  <span data-tooltip={tx.to || tx.recipientPublicKey || 'SYSTEM'} style={{ fontWeight: 600, fontSize: '0.8rem' }}>{toName}</span>
                </div>

                <div style={{ fontWeight: 700 }}>{testMode ? 'F$' : '$'}{formatNumber(tx.amount || 0)}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 700, fontSize: '0.7rem' }}>
                  <ShieldCheck size={14} /> VERIFIED
                </div>
              </motion.div>
            );
          })}
          {(transactions || []).length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No transactions found.
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LedgerPage;
