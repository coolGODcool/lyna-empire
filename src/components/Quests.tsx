import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, Camera, CheckCircle, AlertTriangle, Shield } from 'lucide-react';

/**
 * quests.js - RPG 公告欄與任務邏輯
 * 包含外送規則、信用分防禦機制與 SOP 模擬
 */
export const QuestsTab = () => {
  const [creditScore, setCreditScore] = useState(85); // 執行長預設信用分
  const [activeTask, setActiveTask] = useState<any>(null);
  const [sopStep, setSopStep] = useState(0); // 0: 接單, 1: 領主拍照, 2: 取餐, 3: 送達拍照

  const tasks = [
    { id: 1, name: "御膳房：黑金松露和牛", reward: 350, type: 'delivery', minCredit: 70 },
    { id: 2, name: "領主委託：頂級魚子醬採購", reward: 520, type: 'delivery', minCredit: 80 },
    { id: 3, name: "帝國巡邏：核心區域安檢", reward: 150, type: 'patrol', minCredit: 50 },
  ];

  const handleAcceptTask = (task: any) => {
    if (creditScore < task.minCredit) {
      alert("信用分不足，無法接取此高級任務！");
      return;
    }
    setActiveTask(task);
    setSopStep(1);
  };

  const nextSop = () => {
    if (sopStep < 3) setSopStep(sopStep + 1);
    else {
      // 任務完成
      alert(`任務完成！獲得獎勵 ${activeTask.reward} LC (國庫已扣除 5% 轉贈稅)`);
      setActiveTask(null);
      setSopStep(0);
    }
  };

  const handleFail = () => {
    alert("任務失敗！放鳥懲罰：信用分歸零並封號。");
    setCreditScore(0);
    setActiveTask(null);
  };

  return (
    <div className="h-full pt-20 pb-24 px-4 overflow-y-auto custom-scroll bg-lyna-black">
      {/* 信用分狀態 */}
      <div className="frosted p-4 rounded-2xl mb-6 flex justify-between items-center border-lyna-gold/30">
        <div className="flex items-center gap-2">
          <Shield className="text-lyna-gold" size={20} />
          <span className="text-sm font-bold">帝國信用分</span>
        </div>
        <span className={`text-xl font-black ${creditScore > 70 ? 'text-lyna-gold' : 'text-red-500'}`}>{creditScore}</span>
      </div>

      <h2 className="text-lyna-gold text-xl font-bold mb-6 italic flex items-center gap-2">
        <ClipboardList /> RPG 任務大廳
      </h2>

      <div className="flex flex-col gap-4">
        {tasks.map(task => (
          <div key={task.id} className="frosted p-5 rounded-2xl flex justify-between items-center border-lyna-gold/10">
            <div>
              <h4 className="text-white font-bold text-sm mb-1">{task.name}</h4>
              <p className="text-[10px] text-gray-500">要求信用分: {task.minCredit}</p>
            </div>
            <div className="text-right">
              <div className="text-lyna-gold font-bold text-sm">{task.reward} LC</div>
              <button 
                onClick={() => handleAcceptTask(task)}
                className="mt-2 px-4 py-1 bg-lyna-gold text-black text-[10px] font-bold rounded-full"
              >
                接單
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SOP 模擬彈窗 */}
      <AnimatePresence>
        {activeTask && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-6"
          >
            <div className="frosted w-full max-w-sm p-8 rounded-3xl text-center border-lyna-gold/50">
              <h3 className="text-lyna-gold font-bold mb-6 italic">任務進行中: {activeTask.name}</h3>
              
              <div className="flex flex-col gap-6 items-center">
                {sopStep === 1 && (
                  <>
                    <Camera size={48} className="text-lyna-gold" />
                    <p className="text-sm text-white">步驟 1: 領主拍照確認料理完成</p>
                  </>
                )}
                {sopStep === 2 && (
                  <>
                    <Shield size={48} className="text-lyna-gold" />
                    <p className="text-sm text-white">步驟 2: 外送員取餐驗證</p>
                  </>
                )}
                {sopStep === 3 && (
                  <>
                    <CheckCircle size={48} className="text-lyna-gold" />
                    <p className="text-sm text-white">步驟 3: 送達拍照上傳</p>
                  </>
                )}

                <button 
                  onClick={nextSop}
                  className="w-full py-3 bg-lyna-gold text-black rounded-xl font-bold"
                >
                  {sopStep === 3 ? "完成任務" : "下一步"}
                </button>
                
                <button 
                  onClick={handleFail}
                  className="text-red-500 text-xs flex items-center gap-1"
                >
                  <AlertTriangle size={12} /> 放鳥 (警告：後果自負)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
