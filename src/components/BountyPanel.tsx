// 懸賞面板，處理三擊影片後彈出的 L-Coin 懸賞邏輯。
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Target, Zap, TrendingUp, Users, ShieldCheck, Plus, Minus, RotateCcw, Loader2 } from "lucide-react";

interface BountyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

export default function BountyPanel({ isOpen, onClose, onConfirm }: BountyPanelProps) {
  const [amount, setAmount] = useState(100);
  const [estimatedAcceptance, setEstimatedAcceptance] = useState(0.15);
  const [potentialHunters, setPotentialHunters] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Simulate dynamic market data
  useEffect(() => {
    // 金額越高，預計接單人數的進度條越長
    const baseRate = 0.05;
    const increment = (amount / 500); // 500 L-Coin reaches near 100%
    const rate = Math.max(0.05, Math.min(0.99, baseRate + increment));
    setEstimatedAcceptance(rate);
    setPotentialHunters(Math.floor(rate * 150)); // Max 150 hunters
  }, [amount]);

  const handleAdjust = (delta: number) => {
    setAmount(prev => Math.max(0, prev + delta));
  };

  const handleConfirm = async () => {
    if (amount < 30) return;
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    setIsLoading(true);
    // 模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConfirm(amount);
    setIsLoading(false);
    setIsConfirming(false);
    onClose();
  };

  const handleCancel = () => {
    if (isConfirming) {
      setIsConfirming(false);
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
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
                  <h3 className="text-xl font-black gold-gradient-text italic tracking-tighter">
                    {isConfirming ? "最後確認" : "發布懸賞 Bounty"}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {isConfirming ? "資金即將扣除" : "三擊發布懸賞"}
                  </p>
                </div>
                <button onClick={handleCancel} className="p-2 rounded-full bg-white/5 text-gold-primary"><X size={20} /></button>
              </div>

              {isConfirming ? (
                <div className="py-8 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-gold-primary/10 border-2 border-gold-primary/40 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck size={40} className="text-gold-primary" />
                  </div>
                  <p className="text-lg font-bold text-white leading-relaxed">
                    您確定要花費 <span className="text-gold-primary font-black">{amount} L-Coin</span> 發布懸賞嗎？😏
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">此操作將立即從國庫餘額扣除</p>
                </div>
              ) : (
                <>
                  {/* Amount Selector */}
                  <div className="space-y-4">
                    <div className="bg-black/40 p-6 rounded-3xl border border-gold-primary/20 text-center space-y-4">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">當前懸賞金額</p>
                      
                      <div className="flex flex-col items-center justify-center gap-6">
                        <div className="relative">
                          <input 
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-40 bg-transparent text-5xl font-black font-mono text-white text-center focus:outline-none tracking-tighter"
                          />
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-black text-gold-primary/60 uppercase">L-Coin</div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                          <button 
                            onClick={() => handleAdjust(-10)}
                            className="px-3 py-2 rounded-xl bg-white/5 text-gold-primary border border-gold-primary/20 hover:bg-gold-primary/20 active:scale-90 transition-all text-xs font-bold"
                          >
                            -10
                          </button>
                          <button 
                            onClick={() => handleAdjust(-5)}
                            className="px-3 py-2 rounded-xl bg-white/5 text-gold-primary border border-gold-primary/20 hover:bg-gold-primary/20 active:scale-90 transition-all text-xs font-bold"
                          >
                            -5
                          </button>
                          <button 
                            onClick={() => handleAdjust(5)}
                            className="px-3 py-2 rounded-xl bg-white/5 text-gold-primary border border-gold-primary/20 hover:bg-gold-primary/20 active:scale-90 transition-all text-xs font-bold"
                          >
                            +5
                          </button>
                          <button 
                            onClick={() => handleAdjust(10)}
                            className="px-3 py-2 rounded-xl bg-white/5 text-gold-primary border border-gold-primary/20 hover:bg-gold-primary/20 active:scale-90 transition-all text-xs font-bold"
                          >
                            +10
                          </button>
                          <button 
                            onClick={() => handleAdjust(100)}
                            className="px-3 py-2 rounded-xl bg-gold-primary/20 text-gold-primary border border-gold-primary/40 hover:bg-gold-primary/30 active:scale-90 transition-all text-xs font-bold"
                          >
                            +100
                          </button>
                        </div>
                      </div>

                      <button 
                        onClick={() => setAmount(30)}
                        className="flex items-center gap-1 mx-auto text-[9px] font-black text-gray-500 hover:text-gold-primary transition-colors uppercase tracking-widest"
                      >
                        <RotateCcw size={10} /> 重置金額 (30)
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
                      {amount < 30 && (
                        <p className="text-[9px] text-red-500 font-bold text-center animate-pulse">最低懸賞金額為 30 L-Coin</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleConfirm}
                  disabled={isLoading || (!isConfirming && amount < 30)}
                  className={`w-full py-5 ${isConfirming ? 'bg-gold-primary shadow-[0_0_30px_rgba(212,175,55,0.4)]' : 'bg-white/10 border border-gold-primary/40'} text-black font-black text-lg uppercase tracking-[0.3em] rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      處理中...
                    </>
                  ) : (
                    <>
                      <Zap size={20} className={isConfirming ? "fill-black" : "text-gold-primary"} />
                      {isConfirming ? "確認支付" : "發布懸賞"}
                    </>
                  )}
                </button>

                <button 
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="w-full py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors"
                >
                  取消發布
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
