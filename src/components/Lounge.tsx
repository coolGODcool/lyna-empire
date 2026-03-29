import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Zap,
  Spade,
  Club,
  Diamond,
  Heart,
  Activity,
  Trophy,
  Gamepad2
} from "lucide-react";

interface LoungeProps {
  userId?: string;
}

// RPG 戰情室 & 交誼廳美學重構
export default function Lounge({ userId = "User_001" }: LoungeProps) {
  // 權限判斷：CEO (LN-001) 或 領主 (Lord_xxx)
  const isCEOOrLord = userId === "LN-001" || userId.startsWith("Lord");
  
  const [warRoomData] = useState({
    todayVolume: 284500,
    activeCitizens: 1240,
    treasuryIncome: 22760, // 8% of volume
  });

  const [games] = useState([
    { id: 1, name: "E-Card: 心理博弈", players: 12, pool: "5,000 L-Coin", icon: <Spade className="text-gold-primary" /> },
    { id: 2, name: "帝國德州撲克", players: 8, pool: "12,500 L-Coin", icon: <Heart className="text-red-500" /> },
    { id: 3, name: "21點：國庫對決", players: 5, pool: "3,200 L-Coin", icon: <Club className="text-gold-light" /> },
  ]);

  return (
    <div className="p-6 space-y-8 font-serif">
      {/* 1. 戰情室 (War Room) - 僅限 CEO/領主 */}
      <AnimatePresence>
        {isCEOOrLord && (
          <motion.section 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-gold-primary/60">
              <ShieldCheck size={14} className="animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Empire War Room (Restricted)</span>
            </div>
            <h2 className="text-2xl font-black gold-gradient-text italic tracking-tighter">帝國戰情監控</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  label="今日交易額" 
                  value={`$${warRoomData.todayVolume.toLocaleString()}`} 
                  icon={<TrendingUp size={18} className="text-green-500" />}
                />
                <StatCard 
                  label="活躍領民" 
                  value={warRoomData.activeCitizens.toLocaleString()} 
                  icon={<Users size={18} className="text-gold-primary" />}
                />
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="glass-card p-6 border-gold-primary/40 bg-gradient-to-br from-gold-primary/10 to-transparent relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <ShieldCheck size={80} />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] text-gold-primary/60 uppercase tracking-widest font-bold mb-1">8% 國庫收益 (今日)</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black font-mono gold-gradient-text">
                      ${warRoomData.treasuryIncome.toLocaleString()}
                    </span>
                    <span className="text-xs text-gold-light/60 font-mono">+8.2%</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 2. 交誼廳 (Lounge) - 所有人可見 */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gold-primary/60">
              <Gamepad2 size={14} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Empire Social Lounge</span>
            </div>
            <h2 className="text-2xl font-black text-white italic tracking-tighter">E-Card 競技場</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold-primary/20 border border-gold-primary/40 flex items-center justify-center">
            <Spade className="text-gold-primary" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {games.map((game) => (
            <motion.div 
              key={game.id}
              whileHover={{ x: 5 }}
              className="glass-card p-5 border-white/5 bg-black/40 flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:border-gold-primary/40 transition-colors">
                {game.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-black text-white tracking-tight">{game.name}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Users size={10} /> {game.players} 人在線
                  </span>
                  <span className="text-[10px] text-gold-primary/60 flex items-center gap-1">
                    <Trophy size={10} /> 獎池: {game.pool}
                  </span>
                </div>
              </div>
              <button className="px-4 py-2 bg-gold-primary/10 border border-gold-primary/40 text-gold-primary text-[10px] font-black uppercase tracking-widest rounded-lg group-hover:bg-gold-primary group-hover:text-black transition-all">
                進入
              </button>
            </motion.div>
          ))}
        </div>

        {/* 底部裝飾 */}
        <div className="pt-8 flex flex-col items-center gap-4">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent" />
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.4em] font-mono">May the luck be with you</p>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="glass-card p-4 border-white/5 bg-black/40 flex flex-col justify-between h-28"
    >
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
        <div className="p-1.5 rounded-lg bg-white/5">{icon}</div>
      </div>
      <div className="text-xl font-black text-white font-mono tracking-tighter">
        {value}
      </div>
    </motion.div>
  );
}
