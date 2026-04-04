import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Crown, Sparkles, TrendingUp, Coins } from "lucide-react";

interface LevelUpAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  levelName: string;
  commissionRate: string;
}

export default function LevelUpAnimation({ isOpen, onClose, levelName, commissionRate }: LevelUpAnimationProps) {
  const [coins, setCoins] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      const newCoins = Array.from({ length: 40 }, (_, i) => i);
      setCoins(newCoins);
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    } else {
      setCoins([]);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 backdrop-blur-2xl pointer-events-none"
        >
          {/* Gold Rain Effect */}
          <div className="absolute inset-0 overflow-hidden">
            {coins.map((i) => (
              <motion.div
                key={i}
                initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1, rotate: 0 }}
                animate={{ y: window.innerHeight + 100, rotate: 360 }}
                transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, ease: "linear" }}
                className="absolute text-gold-primary"
              >
                <Coins size={24 + Math.random() * 24} fill="currentColor" />
              </motion.div>
            ))}
          </div>

          {/* Promotion Card */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="relative p-12 rounded-[3rem] bg-gradient-to-br from-gold-dark via-gold-primary to-gold-dark border-4 border-white/20 shadow-[0_0_100px_rgba(212,175,55,0.8)] text-center space-y-8"
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 p-6 rounded-full bg-black border-4 border-gold-primary shadow-[0_0_30px_rgba(212,175,55,0.6)]">
              <Trophy size={64} className="text-gold-primary" />
            </div>

            <div className="space-y-2 pt-8">
              <p className="text-xs font-black text-black/60 uppercase tracking-[0.4em]">榮耀晉升 Promotion</p>
              <h2 className="text-5xl font-black text-black italic tracking-tighter">{levelName}</h2>
            </div>

            <div className="flex items-center justify-center gap-6">
              <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] text-black/60 font-bold uppercase tracking-widest">分潤比例</p>
                <p className="text-2xl font-black text-black font-mono">{commissionRate}</p>
              </div>
              <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] text-black/60 font-bold uppercase tracking-widest">解鎖權限</p>
                <p className="text-2xl font-black text-black font-mono">1.05X</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-black font-black uppercase tracking-widest text-xs animate-pulse">
              <Sparkles size={16} />
              帝國影響力大幅提升
              <Sparkles size={16} />
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-black text-gold-primary text-[10px] font-black rounded-full border border-gold-primary/40 uppercase tracking-widest">
              感謝為帝國做出的貢獻
            </div>
          </motion.div>

          {/* Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.3),transparent_70%)] pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
