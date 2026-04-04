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
  const [amount, setAmount] = useState(10);
  const [isCustom, setIsCustom] = useState(false);
  const [showCoins, setShowCoins] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const holdTimer = React.useRef<NodeJS.Timeout | null>(null);
  const holdInterval = React.useRef<NodeJS.Timeout | null>(null);

  const quickAmounts = [5, 10, 50];

  React.useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const viewport = window.visualViewport;
      if (!viewport) return;
      
      const offset = window.innerHeight - viewport.height;
      // If keyboard is up, shift the panel up
      setOffsetY(offset > 0 ? -offset * 0.5 : 0);
    };

    window.visualViewport.addEventListener("resize", handleResize);
    return () => window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);

  const triggerCoinDrop = () => {
    setShowCoins(true);
    setTimeout(() => setShowCoins(false), 1000);
  };

  const handleConfirm = () => {
    if (amount >= 5) {
      onConfirm(amount);
      onClose();
    }
  };

  const handleAdjust = (delta: number) => {
    setAmount(prev => Math.max(5, prev + delta));
    triggerCoinDrop();
  };

  const startHold = (delta: number) => {
    handleAdjust(delta);
    if (navigator.vibrate) navigator.vibrate(10);
    
    holdTimer.current = setTimeout(() => {
      holdInterval.current = setInterval(() => {
        handleAdjust(delta);
        if (navigator.vibrate) navigator.vibrate(10);
      }, 100);
    }, 500);
  };

  const stopHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (holdInterval.current) clearInterval(holdInterval.current);
  };

  const setFixedAmount = (val: number) => {
    setAmount(val);
    setIsCustom(false);
    triggerCoinDrop();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: offsetY }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-zinc-900/95 border border-gold-primary/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.2)] pointer-events-auto"
          >
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

            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-zinc-900 to-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-primary/20 rounded-xl">
                  <Heart className="w-5 h-5 text-gold-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-black gold-gradient-text italic tracking-tighter">贊助支持</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">支持您喜愛的帝國創作者</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Quick Amounts */}
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setFixedAmount(amt)}
                    className={`py-3 rounded-xl border-2 transition-all font-black ${
                      !isCustom && amount === amt
                        ? "bg-gold-primary/20 border-gold-primary text-gold-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                        : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/20"
                    }`}
                  >
                    {amt}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setIsCustom(true);
                    setTimeout(() => inputRef.current?.focus(), 100);
                  }}
                  className={`py-3 rounded-xl border-2 transition-all font-black ${
                    isCustom
                      ? "bg-gold-primary/20 border-gold-primary text-gold-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                      : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/20"
                  }`}
                >
                  自定義
                </button>
              </div>

              {/* Amount Adjuster */}
              <div className="bg-black/40 p-8 rounded-3xl border border-white/10 space-y-6">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">贊助金額</span>
                  <div className="flex items-center gap-8">
                    <button
                      onMouseDown={() => startHold(-1)}
                      onMouseUp={stopHold}
                      onMouseLeave={stopHold}
                      onTouchStart={(e) => { e.preventDefault(); startHold(-1); }}
                      onTouchEnd={stopHold}
                      disabled={amount <= 5}
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-primary hover:bg-gold-primary/20 transition-all disabled:opacity-20"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <div className="flex flex-col items-center">
                      {isCustom ? (
                        <div className="relative">
                          <input
                            ref={inputRef}
                            type="number"
                            inputMode="numeric"
                            value={amount}
                            onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-32 bg-transparent text-5xl font-black font-mono gold-gradient-text text-center focus:outline-none"
                          />
                        </div>
                      ) : (
                        <span className="text-5xl font-black font-mono gold-gradient-text">{amount}</span>
                      )}
                      <span className="text-[10px] text-gold-primary/60 font-bold tracking-[0.2em]">L-COIN</span>
                    </div>
                    <button
                      onMouseDown={() => startHold(1)}
                      onMouseUp={stopHold}
                      onMouseLeave={stopHold}
                      onTouchStart={(e) => { e.preventDefault(); startHold(1); }}
                      onTouchEnd={stopHold}
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-primary hover:bg-gold-primary/20 transition-all"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Fee Distribution */}
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Zap className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">規費分配</span>
                  </div>
                  <p className="text-[10px] text-gold-primary/60 font-bold">8% 國庫 | 1% 公益 | 1% 回饋</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-black/40 border-t border-white/5">
              <button
                onClick={handleConfirm}
                disabled={amount < 5}
                className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-lg ${
                  amount < 5
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-gold-dark via-gold-primary to-gold-dark text-black hover:scale-[1.02] active:scale-[0.95] shadow-gold-primary/40 animate-pulse-slow"
                }`}
              >
                <Sparkles className="w-5 h-5" />
                確認贊助
              </button>
              <p className="text-center mt-4 text-[10px] text-zinc-600 font-medium tracking-widest uppercase">最低贊助門檻為 5 L-Coin</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
