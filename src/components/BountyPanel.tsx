import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Target, Zap, TrendingUp, Users, ShieldCheck, Plus } from "lucide-react";

interface BountyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

export default function BountyPanel({ isOpen, onClose, onConfirm }: BountyPanelProps) {
  const [amount, setAmount] = useState(30);
  const [estimatedAcceptance, setEstimatedAcceptance] = useState(0.15); // 15% base
  const [potentialHunters, setPotentialHunters] = useState(0);

  // Simulate dynamic market data
  useEffect(() => {
    const baseRate = 0.15;
    const increment = (amount - 30) * 0.025; // 2.5% increase per L-Coin
    const rate = Math.min(0.99, baseRate + increment);
    setEstimatedAcceptance(rate);
    setPotentialHunters(Math.floor(rate * 100));
  }, [amount]);

  const handleConfirm = () => {
    onConfirm(amount);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300]"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-6 z-[301] pointer-events-none"
          >
            <div className="w-full max-w-sm glass-card p-8 border-gold-primary/40 space-y-8 pointer-events-auto shadow-[0_0_50px_rgba(212,175,55,0.2)]">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black gold-gradient-text italic tracking-tighter">發布懸賞 Bounty</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">三擊發布懸賞</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-gold-primary"><X size={20} /></button>
              </div>

              {/* Amount Selector */}
              <div className="space-y-4">
                <div className="bg-black/40 p-6 rounded-3xl border border-gold-primary/20 text-center space-y-2">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">當前懸賞金額</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-5xl font-black font-mono text-white tracking-tighter">{amount}</span>
                    <span className="text-xs font-bold text-gold-primary uppercase tracking-widest">L-Coin</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setAmount(prev => prev + 5)}
                    className="flex-1 py-4 bg-gold-primary/10 border-2 border-gold-primary/40 rounded-2xl text-gold-primary font-black uppercase tracking-widest hover:bg-gold-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> 5
                  </button>
                  <button 
                    onClick={() => setAmount(prev => prev + 10)}
                    className="flex-1 py-4 bg-gold-primary/10 border-2 border-gold-primary/40 rounded-2xl text-gold-primary font-black uppercase tracking-widest hover:bg-gold-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> 10
                  </button>
                </div>
              </div>

              {/* Market Monitoring */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <TrendingUp size={12} />
                  熱度監控與預測
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">預計接單人數</span>
                    <span className="text-xs font-black text-white font-mono">{potentialHunters} 人</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${estimatedAcceptance * 100}%` }}
                      className={`h-full ${estimatedAcceptance > 0.8 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]'}`}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">接單機率預測</span>
                    <span className={`text-xs font-black font-mono ${estimatedAcceptance > 0.8 ? 'text-green-500' : 'text-gold-primary'}`}>
                      {(estimatedAcceptance * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Tips */}
              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                <ShieldCheck className="text-gold-primary flex-shrink-0" size={16} />
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase">
                  懸賞金額越高，吸引高等級領主接單的機率越大。國庫將抽取 8% 作為治理規費。
                </p>
              </div>

              <button 
                onClick={handleConfirm}
                className="w-full py-5 bg-gold-primary text-black font-black text-lg uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Zap size={20} />
                發布懸賞
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
