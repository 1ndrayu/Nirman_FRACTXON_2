import React from 'react';
import { useAppState } from '../context/StateContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, TrendingUp, TrendingDown, Clock } from 'lucide-react';

const BroadcastBar = () => {
  const { broadcasts } = useAppState();

  if (!broadcasts || broadcasts.length === 0) return null;

  return (
    <div className="broadcast-container">
      <div className="broadcast-label">
        <Megaphone size={16} />
        <span>LIVE BROADCASTS</span>
      </div>
      <div className="broadcast-ticker">
        <AnimatePresence mode="wait">
          {broadcasts.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ x: '100%' }}
              animate={{ x: '-100%' }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear",
                delay: idx * 5 
              }}
              className="broadcast-item"
            >
              <span className="timestamp">
                <Clock size={12} /> {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="author">{msg.author}</span> updated 
              <span className="asset-name">{msg.assetName}</span> value to 
              <span className="price-tag">${msg.newValue.toLocaleString()}</span>
              {msg.newValue > msg.oldValue ? (
                <TrendingUp size={14} color="#10b981" />
              ) : (
                <TrendingDown size={14} color="#ef4444" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BroadcastBar;
