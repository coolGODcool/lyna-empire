/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  MessageSquare, 
  PlusCircle, 
  ClipboardList, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  DollarSign,
  Zap,
  Mic,
  ShieldCheck,
  Video,
  ChefHat
} from 'lucide-react';

// --- 導入模組化組件 (對應 butler.js, quests.js 等) ---
import { ButlerTab } from './components/Butler';
import { QuestsTab } from './components/Quests';
import { LoungeTab } from './components/Lounge';

/**
 * App.tsx - 萊娜帝國核心引擎 (app.js)
 * 負責全域狀態管理、導航切換、手勢偵測與沉浸式內容流
 */

// --- 執行長數據 (CEO 5566 專屬) ---
const empireDB = {
  userMaster: [{ id: 'LN-001', name: '5566', role: 'CEO', subsidy: 1.05 }],
  shopList: [{ id: 'S001', name: '帝國御膳房', type: 'Fine Dining' }]
};

// --- 頂部標題組件 ---
const Header = () => (
  <div className="fixed top-0 left-0 w-full p-4 z-[60] flex justify-between items-start pointer-events-none">
    <div className="pointer-events-auto">
      <h1 className="text-lyna-gold font-bold tracking-widest text-xl italic drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">LYNA EMPIRE</h1>
    </div>
    <div className="frosted px-4 py-2 rounded-full text-[10px] text-lyna-gold border border-lyna-gold/30 pointer-events-auto flex items-center gap-2">
      <ShieldCheck size={12} />
      <span>執行長 5566 | LN-001 | 1.05 補貼中</span>
    </div>
  </div>
);

// --- 首頁：沉浸式內容流 ---
const HomeTab = ({ onAction }: { onAction: (type: string) => void }) => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // 手勢偵測：長按語音
  const handlePointerDown = () => {
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
      onAction('voice');
    }, 600);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    setIsLongPressing(false);
  };

  // 手勢偵測：雙擊/三擊
  const handleClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 300) {
      setClickCount(prev => prev + 1);
    } else {
      setClickCount(1);
    }
    setLastClickTime(now);
  };

  useEffect(() => {
    if (clickCount === 2) { onAction('order'); setClickCount(0); }
    else if (clickCount === 3) { onAction('bounty'); setClickCount(0); }
    const timer = setTimeout(() => setClickCount(0), 400);
    return () => clearTimeout(timer);
  }, [clickCount, onAction]);

  const streamItems = [
    { id: 1, type: 'shop', img: "https://picsum.photos/seed/shop1/1080/1920", title: "帝國御膳房：黑金和牛", author: "御膳房", isHighQuality: true },
    { id: 2, type: 'citizen', img: "https://picsum.photos/seed/unboxing1/1080/1920", title: "子民開箱：萊娜金湯實測", author: "子民_A", isHighQuality: false },
    { id: 3, type: 'announcement', img: "https://picsum.photos/seed/ann/1080/1920", title: "帝國公告：L-Coin 補貼加碼", author: "萊娜官方", isHighQuality: true },
  ];

  return (
    <div className="snap-container bg-lyna-black">
      {streamItems.map((item) => (
        <div 
          key={item.id} 
          className="snap-item flex items-center justify-center overflow-hidden"
          onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onClick={handleClick}
        >
          {/* 視覺特效：高品質精選影片需有金色流光邊框 */}
          <div className={`w-full h-full relative ${item.isHighQuality ? 'gold-border-flow' : ''}`}>
            <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-70" referrerPolicy="no-referrer" />
          </div>
          
          {/* 分潤激勵：左側收益進度條 */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1 h-32 bg-white/10 rounded-full overflow-hidden">
            <div className="progress-fill w-full bg-lyna-gold rounded-full" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-lyna-gold font-bold">LC+</div>
          </div>

          {/* 語音波紋 */}
          {isLongPressing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 border-2 border-lyna-gold rounded-full animate-ping opacity-50" />
              <Mic className="text-lyna-gold z-10" size={48} />
            </div>
          )}

          {/* 右側互動按鈕 */}
          <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-lyna-gray/80 flex items-center justify-center border border-lyna-gold/20 frosted">
                <Heart className="text-white" size={22} />
              </div>
              <span className="text-[10px] text-white/70">5.5k</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-lyna-gray/80 flex items-center justify-center border border-lyna-gold/20 frosted">
                <MessageCircle className="text-white" size={22} />
              </div>
              <span className="text-[10px] text-white/70">128</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-lyna-gray/80 flex items-center justify-center border border-lyna-gold/20 frosted">
                <DollarSign className="text-lyna-gold" size={22} />
              </div>
              <span className="text-[10px] text-lyna-gold">贊助</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-lyna-gray/80 flex items-center justify-center border border-lyna-gold/20 frosted">
                <Share2 className="text-white" size={22} />
              </div>
              <span className="text-[10px] text-white/70">分享</span>
            </div>
          </div>

          {/* 底部資訊 */}
          <div className="absolute bottom-24 left-8 right-16">
            <h3 className="text-lyna-gold font-bold text-lg mb-1 italic">@{item.author}</h3>
            <p className="text-white text-xs opacity-90 leading-relaxed">{item.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- 「＋」號中心 ---
const PlusModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6"
        onClick={onClose}
      >
        <div className="grid grid-cols-2 gap-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
          <motion.div whileHover={{ scale: 1.05 }} className="frosted p-8 rounded-3xl flex flex-col items-center gap-4 cursor-pointer group border-lyna-gold/20">
            <div className="w-16 h-16 rounded-full bg-lyna-gold/10 flex items-center justify-center group-hover:bg-lyna-gold/20 transition-colors">
              <Video className="text-lyna-gold" size={32} />
            </div>
            <span className="text-lyna-gold font-bold text-sm">子民 / 領袖</span>
            <p className="text-[9px] text-gray-500 text-center">發布影片、開箱動態<br/>(國庫抽成 8%)</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="frosted p-8 rounded-3xl flex flex-col items-center gap-4 cursor-pointer group border-lyna-gold/20">
            <div className="w-16 h-16 rounded-full bg-lyna-gold/10 flex items-center justify-center group-hover:bg-lyna-gold/20 transition-colors">
              <ChefHat className="text-lyna-gold" size={32} />
            </div>
            <span className="text-lyna-gold font-bold text-sm">領主模式</span>
            <p className="text-[9px] text-gray-500 text-center">上架料理、管理領地<br/>(國庫抽成 8%)</p>
          </motion.div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- 主應用入口 ---
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [orderPopup, setOrderPopup] = useState({ show: false, time: 0 });
  const [showLightning, setShowLightning] = useState(false);

  const handleAction = (type: string) => {
    if (type === 'order') {
      const randomTime = Math.floor(Math.random() * 16) + 5;
      setOrderPopup({ show: true, time: randomTime });
      setTimeout(() => setOrderPopup({ show: false, time: 0 }), 3000);
    } else if (type === 'bounty') {
      setShowLightning(true);
      setTimeout(() => setShowLightning(false), 1000);
    }
  };

  const navItems = [
    { id: 'home', icon: Home, label: '首頁' },
    { id: 'butler', icon: MessageSquare, label: '管家' },
    { id: 'plus', icon: PlusCircle, label: '+' },
    { id: 'bulletin', icon: ClipboardList, label: '公告欄' },
    { id: 'lounge', icon: Users, label: '交誼廳' },
  ];

  return (
    <div className="relative w-full h-screen bg-lyna-black overflow-hidden select-none">
      <Header />
      
      {/* 板塊內容 */}
      <div className="w-full h-full">
        {activeTab === 'home' && <HomeTab onAction={handleAction} />}
        {activeTab === 'butler' && <ButlerTab />}
        {activeTab === 'bulletin' && <QuestsTab />}
        {activeTab === 'lounge' && <LoungeTab />}
      </div>

      {/* 底部導航 */}
      <div className="fixed bottom-0 left-0 w-full h-20 frosted border-t border-lyna-gold/20 flex items-center justify-around px-2 z-50">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => item.id === 'plus' ? setIsPlusOpen(true) : setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-lyna-gold scale-110' : 'text-gray-500'}`}
          >
            <item.icon size={item.id === 'plus' ? 32 : 24} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>

      {/* 懸賞特效 */}
      <AnimatePresence>
        {showLightning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] pointer-events-none flex items-center justify-center bg-lyna-gold/10">
            <Zap className="text-lyna-gold" size={300} strokeWidth={1} />
            <div className="absolute text-lyna-gold font-black text-4xl italic tracking-tighter">BOUNTY ISSUED</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 訂餐彈窗 */}
      <AnimatePresence>
        {orderPopup.show && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-32 left-1/2 -translate-x-1/2 frosted px-8 py-4 rounded-2xl z-50 text-center border border-lyna-gold/50">
            <p className="text-lyna-gold font-bold italic">訂餐預約中...</p>
            <p className="text-white text-xs">預計等待時間：{orderPopup.time} 分鐘</p>
          </motion.div>
        )}
      </AnimatePresence>

      <PlusModal isOpen={isPlusOpen} onClose={() => setIsPlusOpen(false)} />
    </div>
  );
}
