import React from "react";
import { motion } from "motion/react";
import { BarChart3, TrendingUp, Users, CreditCard, Play } from "lucide-react";

export default function Lounge() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gold-gradient-text">交誼廳 (The Lounge)</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
          <BarChart3 size={16} /> 領主戰情室 (War Room Data)
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="今日交易額" value="$128,450" icon={<TrendingUp size={16} />} />
          <StatCard label="活躍領民" value="1,205" icon={<Users size={16} />} />
          <StatCard label="國庫收益 (8%)" value="$10,276" icon={<BarChart3 size={16} />} />
          <StatCard label="補貼支出" value="$5,400" icon={<CreditCard size={16} />} />
        </div>
      </div>

      <div className="glass-card p-6 border-gold-primary/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <CreditCard size={120} />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">E-Card 競技場</h3>
            <span className="text-[10px] px-2 py-1 rounded bg-red-500/20 text-red-400 font-bold">10% 抽水</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            「智慧與運氣的博弈。每場對局系統將抽取 10% 作為國庫建設基金。」
          </p>
          <button className="w-full py-4 bg-gold-primary text-black font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:bg-gold-light transition-all">
            <Play size={20} fill="currentColor" />
            進入遊戲
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">最新動態</h3>
        <div className="space-y-3">
          <ActivityItem user="User_882" action="在 E-Card 贏得 $5,000" time="2分鐘前" />
          <ActivityItem user="Lyna_Bot" action="發布了新任務：商圈巡邏" time="5分鐘前" />
          <ActivityItem user="CEO_5566" action="注入了 $10,000 補貼金" time="15分鐘前" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="glass-card p-4 space-y-2">
      <div className="text-gold-primary/60">{icon}</div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function ActivityItem({ user, action, time }: { user: string, action: string, time: string }) {
  return (
    <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
      <div className="flex items-center gap-2">
        <span className="text-gold-primary font-bold">{user}</span>
        <span className="text-gray-400">{action}</span>
      </div>
      <span className="text-[10px] text-gray-600">{time}</span>
    </div>
  );
}
