import React, { useState } from "react";
import { motion } from "motion/react";
import { Shield, Sword, Trophy, AlertCircle } from "lucide-react";

export default function Quests() {
  const [creditScore] = useState(75); // Mock credit score

  return (
    // RPG 公告欄美學重建: 背景改為深色木紋
    <div className="wood-board p-4 sm:p-8 font-serif min-h-full">
      {/* RPG 公告欄美學重建: 頂部木質/金色滾軸 */}
      <div className="max-w-2xl mx-auto relative">
        <div className="absolute -top-4 left-0 right-0 h-8 bg-gradient-to-b from-[#996515] to-[#7a5110] rounded-full shadow-lg z-20 border-b-2 border-black/20" />
        
        {/* RPG 公告欄美學重建: 羊皮紙掛軸主體 */}
        <div className="parchment mt-2 p-8 sm:p-12 min-h-[80vh] relative overflow-hidden">
          <div className="parchment-edge" />
          
          <div className="relative z-10 space-y-10">
            {/* RPG 公告欄美學重建: 立體火印風格標題 */}
            <div className="text-center border-b-2 border-[#d4af37]/30 pb-6">
              <h2 className="text-3xl sm:text-4xl font-black gold-title-3d uppercase tracking-widest mb-2">
                國庫懸賞中心
              </h2>
              <p className="text-[#5d4037] text-sm italic opacity-80">National Treasury Bounty Center</p>
            </div>

            <div className="flex items-center justify-between bg-black/5 p-3 rounded-lg border border-[#d4af37]/20">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-[#996515]" />
                <span className="text-lg font-bold text-[#5d4037]">信用分: {creditScore}</span>
              </div>
              <div className="text-[10px] text-[#5d4037]/60 uppercase tracking-tighter">LN-001 Authorized</div>
            </div>

            {creditScore < 70 && (
              <div className="bg-red-900/10 border-2 border-red-900/30 p-4 rounded-lg flex items-center gap-3 text-red-900">
                <AlertCircle size={24} />
                <p className="text-sm font-bold italic">「警告：信用不足，高階懸賞已封印。」</p>
              </div>
            )}

            <div className="space-y-8">
              <h3 className="text-xl font-bold text-[#5d4037] border-l-4 border-[#d4af37] pl-3">
                當前懸賞清單
              </h3>
              
              <div className="grid gap-8">
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
          </div>
        </div>
        
        {/* RPG 公告欄美學重建: 底部滾軸 */}
        <div className="absolute -bottom-4 left-0 right-0 h-6 bg-gradient-to-t from-[#996515] to-[#7a5110] rounded-full shadow-lg z-20" />
      </div>
    </div>
  );
}

function QuestCard({ title, reward, difficulty, sop, isLocked }: { title: string, reward: string, difficulty: string, sop: string[], isLocked: boolean }) {
  return (
    <motion.div 
      whileHover={!isLocked ? { scale: 1.01, rotate: 0.5 } : {}}
      className={`relative p-6 border-2 border-[#d4af37]/20 bg-white/20 rounded-sm shadow-sm transition-all ${isLocked ? 'opacity-40 grayscale' : ''}`}
      style={{ backgroundImage: 'radial-gradient(circle at center, rgba(212,175,55,0.05), transparent)' }}
    >
      {/* RPG 公告欄美學重建: 火印簽名浮水印 */}
      <div className="fire-stamp">LN-001</div>

      {isLocked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="bg-[#2c1b0e] text-[#d4af37] border-2 border-[#d4af37] px-6 py-2 rotate-[-5deg] font-bold shadow-xl">
            封印中
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-4">
          {/* RPG 公告欄美學重建: 紅色蠟封標籤 */}
          <div className="wax-seal shrink-0" title={`門檻: ${difficulty}`} />
          <div>
            <h4 className="text-xl font-bold text-[#3e2723] leading-tight">{title}</h4>
            <span className="text-xs italic text-[#5d4037]/70">等級：{difficulty}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-[#996515]">{reward}</div>
          <div className="text-[10px] text-[#5d4037]/50 font-bold">國庫 8% 抽成</div>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        <p className="text-sm font-bold text-[#5d4037] flex items-center gap-2 border-b border-[#d4af37]/20 pb-1">
          <Trophy size={14} /> 任務執行規範 (SOP)
        </p>
        <ul className="text-sm space-y-2 italic text-[#3e2723]">
          {sop.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-[#996515] font-bold">◈</span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {!isLocked && (
        <button className="w-full mt-8 py-3 bg-[#3e2723] text-[#d4af37] hover:bg-[#5d4037] hover:text-[#f9e29c] transition-all rounded-sm text-sm font-bold uppercase tracking-[0.3em] shadow-md border border-[#d4af37]/30">
          領取懸賞
        </button>
      )}
    </motion.div>
  );
}
