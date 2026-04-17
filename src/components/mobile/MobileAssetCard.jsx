import React from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, Database, ArrowRight, Map, Trash2, Edit2 } from 'lucide-react';
import { formatNumber } from '../../lib/utils';
import { ASSET_CATEGORIES } from '../../lib/constants';

export const MobileAssetCard = ({ asset, testMode, onAction, onDelete, onEdit, isInvestor }) => {
  const yieldValue = ((asset.cashflow / asset.value) * 100).toFixed(2);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="box-panel"
      style={{ padding: '20px', marginBottom: '16px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2px' }}>{asset.name}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <Building2 size={12} /> {asset.businessName}
          </p>
          {asset.category && (
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              padding: '2px 8px', 
              borderRadius: '6px', 
              fontSize: '0.6rem', 
              fontWeight: 800, 
              background: ASSET_CATEGORIES[asset.category]?.bg || 'var(--bg-page)', 
              color: ASSET_CATEGORIES[asset.category]?.color || 'var(--text-muted)',
              border: `1px solid ${ASSET_CATEGORIES[asset.category]?.color}33`,
            }}>
              {ASSET_CATEGORIES[asset.category]?.label.toUpperCase()}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div className={`status-badge ${asset.isTokenized ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.6rem' }}>
            {asset.isTokenized ? 'LIVE' : 'DRAFT'}
          </div>
          {!isInvestor && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {onEdit && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: '4px' }}
                >
                  <Edit2 size={16} />
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', padding: '4px' }}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {asset.metadata && Object.keys(asset.metadata).length > 0 && (
        <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.entries(asset.metadata).slice(0, 2).map(([key, value]) => (
            <div key={key} style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              <span style={{ fontWeight: 800 }}>{key.toUpperCase()}:</span> {value}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div style={{ padding: '12px', background: 'var(--bg-page)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>VALUE</div>
          <div style={{ fontSize: '1rem', fontWeight: 800 }}>{testMode ? 'F$' : '$'}{formatNumber(asset.value)}</div>
        </div>
        <div style={{ padding: '12px', background: 'var(--bg-page)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>YIELD</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>{yieldValue}%</div>
        </div>
      </div>

      {asset.isTokenized && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>SUPPLY: {formatNumber(asset.tokenCount)}</span>
            <span>SOLD: {formatNumber(asset.tokensSold || 0)}</span>
          </div>
          <div style={{ height: '6px', background: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${((asset.tokensSold || 0) / asset.tokenCount) * 100}%`, 
              height: '100%', 
              background: 'var(--accent-gradient)' 
            }} />
          </div>
        </div>
      )}

      <button 
        className={isInvestor ? "btn btn-primary" : "btn btn-secondary"}
        style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
        onClick={onAction}
      >
        {isInvestor ? (
          <>Buy Tokens <ArrowRight size={16} /></>
        ) : (
          asset.isTokenized ? "Manage" : "Tokenize"
        )}
      </button>
    </motion.div>
  );
};
