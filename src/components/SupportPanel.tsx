// 贊助支持面板，提供快速金額鍵與 L-Coin 微調功能。
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, Coins, Zap, Heart, Sparkles } from "lucide-react";

interface SupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  initialAmount?: number;
}

export default function SupportPanel({ isOpen, onClose, onConfirm, initialAmount = 10 }: SupportPanelProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [isCustom, setIsCustom] = useState(false);
  const [showCoins, setShowCoins] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const [showRelationSelector, setShowRelationSelector] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  
  const inputRef = React.useRef<HTMLInputElement>(null);
  const holdTimer = React.useRef<NodeJS.Timeout | null>(null);
  const holdInterval = React.useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = React.useRef<number>(0);

  const quickAmounts = [5, 10, 50];

  React.useEffect(() => {
    if (isOpen) {
      setAmount(initialAmount);
    }
  }, [isOpen, initialAmount]);

  React.useEffect(() => {
    if (!window.visualViewport) return;
    // ... (rest of visualViewport logic)

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
    if (navigator.vibrate) navigator.vibrate(5);
    
    startTimeRef.current = Date.now();
    
    holdTimer.current = setTimeout(() => {
      const runInterval = () => {
        const elapsed = Date.now() - startTimeRef.current;
        handleAdjust(delta);
        if (navigator.vibrate) navigator.vibrate(5);
        
        // 贊助金額長按調速邏輯
        let nextInterval = 200; // 預設速度
        if (elapsed < 1000) {
          nextInterval = 500; // 前 1 秒保持慢速
        } else if (elapsed > 2000) {
          nextInterval = 100; // 按住超過 2 秒後進入中速模式
        }

        if (holdInterval.current) clearInterval(holdInterval.current);
        holdInterval.current = setInterval(runInterval, nextInterval);
      };
      
      holdInterval.current = setInterval(runInterval, 500);
    }, 500);
  };

  const stopHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (holdInterval.current) clearInterval(holdInterval.current);
    startTimeRef.current = 0;
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
              {/* Relationship Selector */}
              <div className="space-y-4">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">送禮對象 (帝國家譜)</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {[
                    { id: 'gf', label: '女友', msg: '親愛的，這個一定要吃看看，我特地為妳點的 ❤️' },
                    { id: 'bf', label: '男友', msg: '兄弟，這份好料算我的，補一下！ 💪' },
                    { id: 'mom', label: '媽媽', msg: '媽，辛苦了，這份帝國精選給您嚐嚐 🌹' },
                    { id: 'bro', label: '好兄弟', msg: '老鐵，帝國大餐來了，下次換你請！ 🍻' }
                  ].map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => {
                        setSelectedRelation(rel.id);
                        setMessage(rel.msg);
                        triggerCoinDrop();
                      }}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl border transition-all text-[11px] font-black ${
                        selectedRelation === rel.id 
                          ? "bg-gold-primary text-black border-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.4)]" 
                          : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                      }`}
                    >
                      {rel.label}
                    </button>
                  ))}
                </div>
                
                {selectedRelation && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gold-primary/5 border border-gold-primary/20 rounded-2xl"
                  >
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="輸入祝福語..."
                      className="w-full bg-transparent text-xs text-gold-primary/80 font-bold focus:outline-none resize-none h-12"
                    />
                  </motion.div>
                )}
              </div>

              {/* Quick Amounts */}
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onMouseDown={() => startHold(amt)}
                    onMouseUp={stopHold}
                    onMouseLeave={stopHold}
                    onTouchStart={(e) => { e.preventDefault(); startHold(amt); }}
                    onTouchEnd={stopHold}
                    className={`py-3 rounded-xl border-2 transition-all font-black select-none touch-callout-none ${
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
                  className={`py-3 rounded-xl border-2 transition-all font-black select-none touch-callout-none ${
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
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-primary hover:bg-gold-primary/20 transition-all disabled:opacity-20 select-none touch-callout-none"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <div className="flex flex-col items-center">
                      {isCustom ? (
                        <div className="relative flex items-center justify-center h-[60px]">
                          <input
                            ref={inputRef}
                            type="number"
                            inputMode="decimal"
                            pattern="[0-9]*"
                            autoCorrect="off"
                            autoComplete="off"
                            spellCheck="false"
                            value={amount}
                            onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-40 bg-transparent text-5xl font-black font-mono gold-gradient-text text-center focus:outline-none p-0 flex items-center justify-center"
                            style={{ lineHeight: '60px', height: '60px' }}
                          />
                        </div>
                      ) : (
                        <div className="h-[60px] flex items-center justify-center">
                          <span className="text-5xl font-black font-mono gold-gradient-text leading-[60px]">{amount}</span>
                        </div>
                      )}
                      <span className="text-[10px] text-gold-primary/60 font-bold tracking-[0.2em] mt-1">L-COIN</span>
                    </div>
                    <button
                      onMouseDown={() => startHold(1)}
                      onMouseUp={stopHold}
                      onMouseLeave={stopHold}
                      onTouchStart={(e) => { e.preventDefault(); startHold(1); }}
                      onTouchEnd={stopHold}
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-primary hover:bg-gold-primary/20 transition-all select-none touch-callout-none"
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
              <div className="text-center mb-4">
                <p className="text-[10px] text-gold-primary/60 font-bold uppercase tracking-widest">
                  8% 國庫 | 1% 公益 | 1% 影片主
                </p>
              </div>
              <button
                onClick={handleConfirm}
                disabled={amount < 5}
                className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-lg ${
                  amount < 5
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-gold-dark via-gold-primary to-gold-dark text-black hover:scale-[1.02] active:scale-[0.95] shadow-gold-primary/40 gold-shimmer"
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
