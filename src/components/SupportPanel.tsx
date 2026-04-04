// 贊助支持面板，提供快速金額鍵與 L-Coin 微調功能。
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, Coins, Zap, Heart, Sparkles } from "lucide-react";

interface SupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

export default function SupportPanel({ isOpen, onClose, onConfirm }: SupportPanelProps) {
  const [amount, setAmount] = useState(50);
  const [showCoins, setShowCoins] = useState(false);

  const handleConfirm = () => {
    onConfirm(amount);
    onClose();
  };

  const triggerCoinDrop = () => {
    setShowCoins(true);
    setTimeout(() => setShowCoins(false), 1000);
  };

  const handleAdjust = (delta: number) => {
    setAmount(prev => Math.max(1, prev + delta));
    triggerCoinDrop();
  };

  const setFixedAmount = (val: number) => {
    setAmount(val);
    triggerCoinDrop();
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
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center p-6 z-[301] pointer-events-auto"
          >
            <div className="w-full max-w-sm glass-card p-8 border-gold-primary/40 space-y-8 shadow-[0_0_50px_rgba(212,175,55,0.3)] relative overflow-hidden">
              {/* Background Coin Drop Animation */}
              <AnimatePresence>
                {showCoins && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: -20, x: Math.random() * 300 - 150, opacity: 0, rotate: 0 }}
                        animate={{ y: 400, opacity: [0, 1, 0], rotate: 360 }}
                        transition={{ duration: 1, ease: "linear" }}
                        className="absolute top-0 left-1/2 text-gold-primary/40"
                      >
                        <Coins size={20} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gold-primary/10 border border-gold-primary/30">
                    <Heart size={18} className="text-gold-primary fill-gold-primary/20" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black gold-gradient-text italic tracking-tighter uppercase">贊助支持 Support</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">貢獻國庫與公益</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-gold-primary/60 hover:text-gold-primary"><X size={20} /></button>
              </div>

              <div className="bg-black/40 p-8 rounded-3xl border border-gold-primary/20 text-center space-y-4 relative">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">贊助金額</p>
                <div className="flex items-center justify-center gap-3">
                  <Coins size={24} className="text-gold-primary" />
                  <span className="text-5xl font-black font-mono text-white tracking-tighter">{amount}</span>
                  <span className="text-xs font-bold text-gold-primary uppercase">L-Coin</span>
                </div>
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => handleAdjust(-10)}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-primary hover:bg-gold-primary/20 transition-all"
                  >
                    <Minus size={16} />
                  </button>
                  <button 
                    onClick={() => handleAdjust(10)}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-primary hover:bg-gold-primary/20 transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[50, 100, 500].map((val) => (
                  <button
                    key={val}
                    onClick={() => setFixedAmount(val)}
                    className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${amount === val ? 'bg-gold-primary/20 border-gold-primary text-gold-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                  >
                    <span className="text-xs font-black font-mono">{val}</span>
                    <span className="text-[8px] font-bold uppercase tracking-widest">L-Coin</span>
                  </button>
                ))}
              </div>

              <div className="p-4 bg-gold-primary/5 border border-gold-primary/20 rounded-2xl flex items-center gap-3">
                <Sparkles size={16} className="text-gold-primary animate-pulse" />
                <p className="text-[9px] text-gold-primary/80 font-bold uppercase tracking-widest leading-relaxed">
                  贊助金額的 1% 將自動撥入公益金，<br />感謝您對帝國的貢獻。
                </p>
              </div>

              <button 
                onClick={handleConfirm}
                className="w-full py-5 bg-gradient-to-r from-gold-dark via-gold-primary to-gold-dark text-black font-black text-lg uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Zap size={20} className="fill-black" />
                確認贊助
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
