import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, Coins, Zap } from "lucide-react";

interface SupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

export default function SupportPanel({ isOpen, onClose, onConfirm }: SupportPanelProps) {
  const [amount, setAmount] = useState(5);

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed inset-0 flex items-center justify-center p-6 z-[301] pointer-events-none"
          >
            <div className="w-full max-w-[280px] glass-card p-6 border-gold-primary/40 space-y-6 pointer-events-auto shadow-[0_0_40px_rgba(212,175,55,0.2)]">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black gold-gradient-text italic uppercase tracking-tighter">贊助支持 Support</h3>
                <button onClick={onClose} className="text-gold-primary/60 hover:text-gold-primary"><X size={16} /></button>
              </div>

              <div className="bg-black/40 p-4 rounded-2xl border border-gold-primary/20 text-center space-y-1">
                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">贊助金額</p>
                <div className="flex items-center justify-center gap-2">
                  <Coins size={14} className="text-gold-primary" />
                  <span className="text-3xl font-black font-mono text-white tracking-tighter">{amount}</span>
                  <span className="text-[10px] font-bold text-gold-primary uppercase">L</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setAmount(prev => prev + 5)}
                  className="py-2 bg-gold-primary/10 border border-gold-primary/30 rounded-xl text-gold-primary text-[10px] font-black hover:bg-gold-primary/20 transition-all"
                >
                  +5 L
                </button>
                <button 
                  onClick={() => setAmount(prev => prev + 10)}
                  className="py-2 bg-gold-primary/10 border border-gold-primary/30 rounded-xl text-gold-primary text-[10px] font-black hover:bg-gold-primary/20 transition-all"
                >
                  +10 L
                </button>
              </div>

              <div className="flex items-center justify-between bg-white/5 p-1 rounded-full border border-white/10">
                <button 
                  onClick={() => setAmount(Math.max(1, amount - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gold-primary hover:bg-white/5"
                >
                  <Minus size={14} />
                </button>
                <span className="text-xs font-black text-white font-mono">微調</span>
                <button 
                  onClick={() => setAmount(amount + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gold-primary hover:bg-white/5"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button 
                onClick={handleConfirm}
                className="w-full py-3 bg-gold-primary text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Zap size={14} />
                確認贊助
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
