import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Utensils, Clock, Zap } from 'lucide-react';

/**
 * butler.js - 萊娜管家模組
 * 負責 AI 對話、導購邏輯與快速功能按鈕
 */
export const ButlerTab = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: '執行長 5566 您好，我是您的專屬管家萊娜。今日帝國營運一切正常，需要為您安排深夜御膳嗎？' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isKeywordDetected, setIsKeywordDetected] = useState(false);

  // 導購邏輯：偵測關鍵字觸發呼吸燈
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const keywords = ['餓', '吃', '餐', '預約', '外送'];
    setIsKeywordDetected(keywords.some(k => val.includes(k)));
  };

  return (
    <div className="h-full pt-20 pb-24 px-4 flex flex-col bg-lyna-black">
      {/* 聊天對話窗 */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-2 custom-scroll">
        {messages.map((msg, i) => (
          <div key={i} className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'ai' ? 'frosted self-start rounded-tl-none text-white' : 'bg-lyna-gold text-black self-end rounded-tr-none font-bold'}`}>
            <p className="text-sm leading-relaxed">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* 常駐功能按鈕區 */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button className={`frosted py-3 rounded-xl flex flex-col items-center gap-1 border-lyna-gold/40 ${isKeywordDetected ? 'breathe-btn' : ''}`}>
          <Utensils size={18} className="text-lyna-gold" />
          <span className="text-[10px] text-lyna-gold font-bold">快速訂餐</span>
        </button>
        <button className="frosted py-3 rounded-xl flex flex-col items-center gap-1 border-lyna-gold/40">
          <Clock size={18} className="text-lyna-gold" />
          <span className="text-[10px] text-lyna-gold font-bold">預約排隊</span>
        </button>
        <button className="frosted py-3 rounded-xl flex flex-col items-center gap-1 border-lyna-gold/40">
          <Zap size={18} className="text-lyna-gold" />
          <span className="text-[10px] text-lyna-gold font-bold">發布懸賞</span>
        </button>
      </div>

      {/* 輸入框 */}
      <div className="frosted p-2 rounded-2xl flex items-center gap-2">
        <input 
          type="text" 
          value={inputValue}
          onChange={handleInputChange}
          placeholder="指令下達..." 
          className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-white"
        />
        <button className="w-10 h-10 bg-lyna-gold rounded-xl flex items-center justify-center text-black">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
