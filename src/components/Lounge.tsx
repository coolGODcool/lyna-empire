import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  ShieldCheck, 
  Zap,
} from "lucide-react";

interface LoungeProps {
  userId?: string;
}

// RPG 戰情室美學重建 - 高級財務監控面板
export default function Lounge({ userId = "CEO_5566" }: LoungeProps) {
  const isCEO = userId === "CEO_5566";
  const [financialData, setFinancialData] = useState({
    revenue: 1284500,
    expenses: 450000,
    performance: 85600,
  });
  const [logs] = useState([
    { id: 1, type: "treasury", text: "💰 [國庫進帳]：領主 X 完成交易，8% 稅收已入庫。", time: "12:45:01" },
    { id: 2, type: "battle", text: "⚔️ [競技戰報]：用戶 Y 在 E-Card 贏得 2,000 L-Coin，系統抽水 10% 已完成。", time: "12:44:30" },
    { id: 3, type: "quest", text: "📜 [新懸賞]：領主 Z 發布了新任務，獎金 $5,000。", time: "12:42:15" },
    { id: 4, type: "treasury", text: "💰 [國庫進帳]：領主 A 完成交易，8% 稅收已入庫。", time: "12:40:00" },
    { id: 5, type: "battle", text: "⚔️ [競技戰報]：用戶 B 在 E-Card 贏得 1,500 L-Coin，系統抽水 10% 已完成。", time: "12:38:22" },
  ]);

  const [showToast, setShowToast] = useState(false);

  // 預留未來透過 GAS 抓取 Google Sheets 的真實帳目接口
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        // const response = await fetch('YOUR_GAS_URL');
        // const data = await response.json();
        // setFinancialData(data);
      } catch (error) {
        console.error("GAS Fetch Error:", error);
      }
    };
    fetchRealData();
  }, []);

  const handleClaimBonus = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="p-6 space-y-8 font-serif">
      {/* 戰情室標題 */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-gold-primary/60">
          <Activity size={14} className="animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Empire War Room v1.05</span>
        </div>
        <h2 className="text-3xl font-black gold-gradient-text italic tracking-tighter">
          {isCEO ? "帝國財務監控中心" : "領主戰情室"}
        </h2>
      </div>

      {/* 財務數據區 - Quiet Luxury Style */}
      <div className="space-y-4">
        {isCEO ? (
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FinancialCard 
                label="本月總收益" 
                value={financialData.revenue} 
                subLabel="商圈8% + 任務5% + 競技10%"
                icon={<TrendingUp size={18} className="text-green-500" />}
              />
              <FinancialCard 
                label="本月總支出" 
                value={financialData.expenses} 
                subLabel="1.05 方案補貼支出"
                icon={<TrendingDown size={18} className="text-red-500" />}
              />
            </div>
            {/* 帝國淨利 - 極致金色漸層 */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border-gold-primary/40 bg-gradient-to-br from-gold-primary/10 to-transparent relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldCheck size={100} />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] text-gold-primary/60 uppercase tracking-widest font-bold mb-1">Empire Net Profit</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono gold-gradient-text">
                    ${(financialData.revenue - financialData.expenses).toLocaleString()}
                  </span>
                  <span className="text-xs text-gold-light/60 font-mono">+12.4%</span>
                </div>
                <div className="mt-4 h-1 w-full bg-black/40 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-gold-dark via-gold-primary to-gold-light"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FinancialCard 
                label="個人總業績" 
                value={financialData.performance} 
                subLabel="本月累積成交額"
                icon={<TrendingUp size={18} className="text-gold-primary" />}
              />
              <FinancialCard 
                label="應得利潤 (92%)" 
                value={Math.floor(financialData.performance * 0.92)} 
                subLabel="已扣除 8% 國庫抽成"
                icon={<Zap size={18} className="text-gold-light" />}
              />
            </div>
            
            {/* 領取獎金按鈕 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClaimBonus}
              className="w-full py-4 bg-gradient-to-r from-gold-dark via-gold-primary to-gold-dark text-black font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 border border-white/20"
            >
              <DollarSign size={20} />
              領取獎金
            </motion.button>
          </div>
        )}
      </div>

      {/* 動態日誌區 (Empire Live Log) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-primary/60 flex items-center gap-2">
            <Activity size={12} /> Empire Live Log
          </h3>
          <span className="text-[10px] text-gray-600 font-mono">LIVE FEED</span>
        </div>
        
        <div className="glass-card h-48 overflow-y-auto border-white/5 bg-black/20 custom-scrollbar">
          <div className="p-4 space-y-3">
            {logs.map((log) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 text-[11px] leading-relaxed border-b border-white/5 pb-2 last:border-0"
              >
                <span className="text-gray-600 font-mono shrink-0">[{log.time}]</span>
                <span className="text-gray-300">{log.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部裝飾 */}
      <div className="pt-4 flex justify-center">
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent" />
      </div>

      {/* Toast 提示 */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-6 right-6 z-[100] glass-card p-4 border-gold-primary bg-black/90 flex items-center gap-3 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            <div className="w-10 h-10 rounded-full bg-gold-primary/20 flex items-center justify-center text-gold-primary">
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">申請已提交至國庫</p>
              <p className="text-[10px] text-gold-primary/60">執行長 5566 審核中...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FinancialCard({ label, value, subLabel, icon }: { label: string, value: number, subLabel: string, icon: React.ReactNode }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="glass-card p-4 border-white/5 bg-black/40 flex flex-col justify-between h-32"
    >
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
        <div className="p-1.5 rounded-lg bg-white/5">{icon}</div>
      </div>
      <div>
        <div className="text-xl font-black text-white font-mono tracking-tighter">
          ${value.toLocaleString()}
        </div>
        <div className="text-[9px] text-gray-600 mt-1 truncate">{subLabel}</div>
      </div>
    </motion.div>
  );
}
