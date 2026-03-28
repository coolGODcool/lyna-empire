import { motion } from "motion/react";
import { Shield, Sword, Trophy, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Quests() {
  const [creditScore] = useState(75); // Mock credit score

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gold-gradient-text">任務大廳 (RPG Quests)</h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/30">
          <Shield size={14} className="text-gold-primary" />
          <span className="text-xs font-bold text-gold-primary">信用分: {creditScore}</span>
        </div>
      </div>

      {creditScore < 70 && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">信用分低於 70，部分高階任務已鎖定。</p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">當前任務</h3>
        
        <QuestCard 
          title="商圈巡邏任務"
          reward="500 萊娜幣"
          difficulty="簡單"
          sop={["抵達指定店家", "上傳環境照片", "回報客流量"]}
          isLocked={false}
        />

        <QuestCard 
          title="帝國物資押運"
          reward="2500 萊娜幣"
          difficulty="困難"
          sop={["領取物資包", "15分鐘內送達", "確認收貨簽章"]}
          isLocked={creditScore < 80}
        />

        <QuestCard 
          title="領主特派：市場調查"
          reward="1200 萊娜幣"
          difficulty="中等"
          sop={["訪談3位顧客", "填寫滿意度問卷", "提交分析報告"]}
          isLocked={false}
        />
      </div>
    </div>
  );
}

function QuestCard({ title, reward, difficulty, sop, isLocked }: { title: string, reward: string, difficulty: string, sop: string[], isLocked: boolean }) {
  return (
    <motion.div 
      whileHover={!isLocked ? { scale: 1.02 } : {}}
      className={`glass-card p-5 relative overflow-hidden ${isLocked ? 'opacity-50 grayscale' : ''}`}
    >
      {isLocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-black-matte border border-gold-primary/50 px-4 py-2 rounded-lg flex items-center gap-2">
            <Sword size={16} className="text-gold-primary" />
            <span className="text-xs font-bold text-gold-primary uppercase">等級不足</span>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-bold text-white">{title}</h4>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
            difficulty === '簡單' ? 'border-green-500 text-green-500' : 
            difficulty === '中等' ? 'border-yellow-500 text-yellow-500' : 
            'border-red-500 text-red-500'
          }`}>
            {difficulty}
          </span>
        </div>
        <div className="text-right">
          <div className="text-gold-primary font-bold">{reward}</div>
          <div className="text-[10px] text-gray-500">系統費 8% 另計</div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
          <Trophy size={12} /> 任務 SOP 模擬
        </p>
        <ul className="text-xs space-y-1">
          {sop.map((step, idx) => (
            <li key={idx} className="flex items-center gap-2 text-gray-300">
              <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px]">{idx + 1}</span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {!isLocked && (
        <button className="w-full mt-4 py-2 bg-white/10 hover:bg-gold-primary hover:text-black transition-all rounded-lg text-xs font-bold uppercase tracking-widest">
          接受任務
        </button>
      )}
    </motion.div>
  );
}
