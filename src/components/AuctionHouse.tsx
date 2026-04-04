import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Gavel, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Coins, 
  User, 
  Crown,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Sparkles
} from "lucide-react";

interface AuctionItem {
  id: string;
  name: string;
  type: "EMPEROR" | "CITIZEN" | "SLAVE" | "PICKAXE" | "BUTLER";
  artist: string;
  basePrice: number;
  image: string;
  description: string;
}

const MOCK_ITEM: AuctionItem = {
  id: "auc-001",
  name: "皇帝卡 (Emperor) #001",
  type: "EMPEROR",
  artist: "Altate Master Painter",
  basePrice: 500,
  image: "https://picsum.photos/seed/emperor/400/600",
  description: "帝國權力的象徵，持有者在交誼廳享有優先發言權。"
};

import AuctionLiveRoom from "./AuctionLiveRoom";

export default function AuctionHouse({ userId = "User_001" }: { userId?: string }) {
  const [currentRoom, setCurrentRoom] = useState<"LOBBY" | "LIVE">("LOBBY");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [balance, setBalance] = useState(24500);
  const [trustScore] = useState(85);

  const categories = [
    { id: "ALL", label: "全部資產", icon: <TrendingUp size={14} /> },
    { id: "ARTIST", label: "畫家創作", icon: <User size={14} /> },
    { id: "CEO", label: "官方特許", icon: <Crown size={14} /> },
    { id: "AI", label: "AI 管家", icon: <Sparkles size={14} /> },
  ];

  const auctionItems: AuctionItem[] = [
    { id: "auc-001", name: "皇帝卡 (Emperor) #001", type: "EMPEROR", artist: "Altate Master Painter", basePrice: 500, image: "https://picsum.photos/seed/emperor/400/600", description: "帝國權力的象徵，持有者在交誼廳享有優先發言權。" },
    { id: "auc-002", name: "平民卡 (Citizen) #042", type: "CITIZEN", artist: "Street Artist", basePrice: 150, image: "https://picsum.photos/seed/citizen/400/600", description: "帝國的中堅力量，享有基本的國庫補貼權。" },
    { id: "auc-003", name: "奴隸卡 (Slave) #999", type: "SLAVE", artist: "Underground Painter", basePrice: 50, image: "https://picsum.photos/seed/slave/400/600", description: "最底層的勞動力，但具備極高的逆天改命潛力。" },
    { id: "auc-004", name: "帝國鎬子 (Pickaxe) - 傳奇", type: "PICKAXE", artist: "CEO Official", basePrice: 1200, image: "https://picsum.photos/seed/pickaxe/400/600", description: "開採 L-Coin 的終極神器，產量提升 300%。" },
    { id: "auc-005", name: "AI 管家：萊娜 (Lyna)", type: "BUTLER", artist: "Digital Life Lab", basePrice: 2500, image: "/IMG_4166.PNG", description: "具備毒舌屬性的全能管家，帝國最受歡迎的人格。" },
    { id: "auc-006", name: "AI 管家：萊恩 (Ryan)", type: "BUTLER", artist: "Digital Life Lab", basePrice: 2200, image: "https://picsum.photos/seed/ryan/400/600", description: "沉穩冷靜的戰術顧問，適合管理大型領地。" },
  ];

  const filteredItems = auctionItems.filter(item => {
    if (activeCategory === "ALL") return true;
    if (activeCategory === "ARTIST") return ["EMPEROR", "CITIZEN", "SLAVE"].includes(item.type);
    if (activeCategory === "CEO") return item.type === "PICKAXE";
    if (activeCategory === "AI") return item.type === "BUTLER";
    return true;
  });

  const enterLiveRoom = (item: AuctionItem) => {
    setSelectedItem(item);
    setCurrentRoom("LIVE");
  };

  return (
    <div className="min-h-screen bg-black text-white font-serif overflow-hidden relative">
      <AnimatePresence mode="wait">
        {currentRoom === "LOBBY" ? (
          <motion.div 
            key="lobby"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="p-6 max-w-6xl mx-auto space-y-8 relative z-10"
          >
            {/* Header */}
            <div className="flex justify-between items-end border-b border-gold-primary/20 pb-4">
              <div>
                <div className="flex items-center gap-2 text-gold-primary/60 mb-1">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Altate Global Treasury</span>
                </div>
                <h1 className="text-4xl font-black gold-gradient-text italic tracking-tighter">帝國寶庫</h1>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-gold-primary/60 uppercase tracking-widest font-bold">今日國庫累積規費 (15%)</p>
                  <p className="text-xl font-black font-mono gold-gradient-text">$1,245,800</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Your Trust Score</p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className={`text-xl font-black font-mono ${trustScore >= 80 ? 'text-green-500' : 'text-red-500'}`}>
                      {trustScore}
                    </span>
                    {trustScore >= 80 ? <CheckCircle2 size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-red-500" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Category Nav */}
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-full border-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    activeCategory === cat.id 
                      ? 'bg-gold-primary/20 border-gold-primary text-gold-primary shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-gold-primary/40'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  onClick={() => enterLiveRoom(item)}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-card border-white/10 bg-black/40 overflow-hidden cursor-pointer group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 border border-white/20 rounded text-[8px] font-black text-white uppercase tracking-widest animate-pulse">
                      LIVE NOW
                    </div>
                    
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[8px] font-black text-gold-primary uppercase tracking-widest">
                      誠信分 80+ 准入
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                        {["EMPEROR", "CITIZEN", "SLAVE"].includes(item.type) ? "畫家作品 (5% 版稅)" : "官方授權"}
                      </p>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-white group-hover:text-gold-primary transition-colors">{item.name}</h3>
                      <span className="text-[10px] font-mono text-gold-light/60">#{item.id.split('-')[1]}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">當前出價</p>
                        <p className="text-lg font-black font-mono text-gold-primary">${item.basePrice.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">剩餘時間</p>
                        <p className="text-xs font-black font-mono text-white flex items-center gap-1 justify-end">
                          <Clock size={12} /> 00:30
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="live"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {selectedItem && (
              <AuctionLiveRoom 
                item={selectedItem}
                userId={userId}
                balance={balance}
                trustScore={trustScore}
                onBid={(amount) => setBalance(prev => prev - amount)}
                onBack={() => setCurrentRoom("LOBBY")}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
