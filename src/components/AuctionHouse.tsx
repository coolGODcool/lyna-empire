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

export default function AuctionHouse({ userId = "User_001" }: { userId?: string }) {
  const [gameState, setGameState] = useState<"PREVIEW" | "BIDDING" | "SOLD">("PREVIEW");
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentBid, setCurrentBid] = useState(MOCK_ITEM.basePrice);
  const [highestBidder, setHighestBidder] = useState<string | null>(null);
  const [trustScore] = useState(85); // Mocked
  const [balance, setBalance] = useState(24500); // Mocked
  const [treasuryIncome, setTreasuryIncome] = useState(0);
  const [showHammer, setShowHammer] = useState(false);
  const [lynaMessage, setLynaMessage] = useState("歡迎來到帝國拍賣行。這裡只歡迎有實力的人。😏");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 萊娜性格語音邏輯
  useEffect(() => {
    if (gameState === "BIDDING") {
      if (timeLeft <= 5) {
        setLynaMessage("最後五秒，不出價這就是別人的了！😏");
      } else if (timeLeft <= 15) {
        setLynaMessage("猶豫就會敗北，這張卡值得你傾家蕩產。💸");
      } else if (round === 3) {
        setLynaMessage("第三拍！氣氛開始緊張了，誰才是真正的領主？🔥");
      }
    }
  }, [timeLeft, round, gameState]);

  // 計時器邏輯
  useEffect(() => {
    if (gameState === "BIDDING") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (round < 3) {
              setRound(r => r + 1);
              return 30;
            } else {
              handleFinish();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, round]);

  const handleStart = () => {
    if (trustScore < 80) {
      setLynaMessage("誠信分不足 80，你連門票都拿不到。滾吧。🙄");
      return;
    }
    setGameState("BIDDING");
    setLynaMessage("拍賣開始！第一拍，起標價 $500 L-Coin。");
  };

  const handleBid = () => {
    if (balance < currentBid + 50) {
      setLynaMessage("錢不夠就別來湊熱鬧，去挖礦吧。⛏️");
      return;
    }
    
    // 扣除 10 L-Coin 維護費 (0.1 沒收)
    setBalance(prev => prev - 0.1);
    setCurrentBid(prev => prev + 50);
    setHighestBidder(userId);
    setTimeLeft(30); // 重置計時器
    setLynaMessage("有人加價了！誰還要挑戰？💰");
    
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  const handleFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("SOLD");
    setShowHammer(true);
    
    // 金融清算
    const treasury = currentBid * 0.15;
    setTreasuryIncome(treasury);
    
    setLynaMessage(`成交！恭喜 ${highestBidder || "無人"} 以 $${currentBid} 標得。國庫收割完畢。🥂`);
    if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 200]);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-serif overflow-hidden relative">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-end border-b border-gold-primary/20 pb-4">
          <div>
            <div className="flex items-center gap-2 text-gold-primary/60 mb-1">
              <ShieldCheck size={14} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Altate Global Auction House</span>
            </div>
            <h1 className="text-4xl font-black gold-gradient-text italic tracking-tighter">帝國拍賣行</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Your Trust Score</p>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-black font-mono ${trustScore >= 80 ? 'text-green-500' : 'text-red-500'}`}>
                {trustScore}
              </span>
              {trustScore >= 80 ? <CheckCircle2 size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-red-500" />}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Asset Preview */}
          <div className="space-y-6">
            <motion.div 
              layoutId="auction-item"
              className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold-primary/30 shadow-[0_0_30px_rgba(212,175,55,0.2)] group"
            >
              <img 
                src={MOCK_ITEM.image} 
                alt={MOCK_ITEM.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Crown className="text-gold-primary" size={18} />
                  <span className="text-xs font-black text-gold-primary uppercase tracking-widest">{MOCK_ITEM.type}</span>
                </div>
                <h2 className="text-2xl font-black text-white">{MOCK_ITEM.name}</h2>
                <p className="text-sm text-gray-400 font-medium">{MOCK_ITEM.description}</p>
              </div>

              {/* Gavel Animation Overlay */}
              <div className="absolute top-4 right-4 z-20">
                <motion.div
                  animate={{ 
                    rotate: gameState === "BIDDING" ? (round === 3 ? [-30, 30, -30] : [-15, 15, -15]) : 0,
                    y: showHammer ? 150 : 0,
                    scale: showHammer ? 1.5 : 1
                  }}
                  transition={{ 
                    rotate: { repeat: Infinity, duration: round === 3 ? 0.4 : 1.5, ease: "easeInOut" },
                    y: { type: "spring", stiffness: 300, damping: 15 }
                  }}
                  className={`p-4 rounded-full bg-black/60 backdrop-blur-md border border-gold-primary/40 text-gold-primary ${showHammer ? 'shadow-[0_0_50px_rgba(212,175,55,0.8)]' : ''}`}
                >
                  <Gavel size={32} />
                </motion.div>
              </div>
            </motion.div>

            {/* Lyna Dialogue */}
            <motion.div 
              key={lynaMessage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-4 border-gold-primary/20 bg-gold-primary/5 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-full border-2 border-gold-primary overflow-hidden flex-shrink-0">
                <img src="/IMG_4166.PNG" alt="Lyna" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gold-primary/60 font-bold uppercase tracking-widest mb-1">Lyna (AI Butler)</p>
                <p className="text-sm text-gold-light font-bold italic">「{lynaMessage}」</p>
              </div>
            </motion.div>
          </div>

          {/* Right: Bidding Controls */}
          <div className="space-y-6">
            {/* Timer & Round */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 border-white/5 bg-black/40 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Current Round</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3].map(r => (
                    <div 
                      key={r} 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-black transition-all ${round === r ? 'bg-gold-primary text-black scale-110 shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/5 text-gray-600'}`}
                    >
                      {r}
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card p-4 border-white/5 bg-black/40 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Time Left</p>
                <div className="flex items-center justify-center gap-2">
                  <Clock size={16} className={timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-gold-primary"} />
                  <span className={`text-2xl font-black font-mono ${timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>
                    00:{timeLeft.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Bid Display */}
            <div className="glass-card p-8 border-gold-primary/40 bg-gradient-to-br from-gold-primary/10 to-transparent text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <TrendingUp size={100} />
              </div>
              <p className="text-xs text-gold-primary/60 uppercase tracking-[0.3em] font-bold mb-2">Current Highest Bid</p>
              <div className="flex flex-col items-center">
                <motion.span 
                  key={currentBid}
                  initial={{ scale: 1.2, color: "#fff" }}
                  animate={{ scale: 1, color: "#d4af37" }}
                  className="text-6xl font-black font-mono gold-gradient-text"
                >
                  ${currentBid.toLocaleString()}
                </motion.span>
                <div className="flex items-center gap-2 mt-2 text-gray-400">
                  <User size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">{highestBidder || "No Bids Yet"}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {gameState === "PREVIEW" ? (
                <button 
                  onClick={handleStart}
                  className="w-full py-6 bg-gold-primary text-black font-black text-xl uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  開始競標
                </button>
              ) : gameState === "BIDDING" ? (
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={handleBid}
                    className="w-full py-6 bg-gradient-to-r from-gold-dark via-gold-primary to-gold-dark text-black font-black text-2xl uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.5)] hover:brightness-110 active:scale-95 transition-all flex flex-col items-center"
                  >
                    <span>出價 +$50</span>
                    <span className="text-[10px] opacity-60">Fee: 10 L-Coin (9.9 Refundable)</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="glass-card p-6 border-green-500/40 bg-green-500/5 text-center">
                    <h3 className="text-green-500 font-black text-2xl mb-4 flex items-center justify-center gap-2">
                      <Sparkles /> SOLD OUT <Sparkles />
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      <SettlementStat label="國庫 (15%)" value={`$${(currentBid * 0.15).toFixed(0)}`} highlight />
                      <SettlementStat label="畫家 (5%)" value={`$${(currentBid * 0.05).toFixed(0)}`} />
                      <SettlementStat label="賣家 (80%)" value={`$${(currentBid * 0.8).toFixed(0)}`} />
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setGameState("PREVIEW");
                      setRound(1);
                      setTimeLeft(30);
                      setCurrentBid(MOCK_ITEM.basePrice);
                      setHighestBidder(null);
                      setShowHammer(false);
                    }}
                    className="w-full py-4 border-2 border-gold-primary/40 text-gold-primary font-black uppercase tracking-widest rounded-xl hover:bg-gold-primary/10 transition-all"
                  >
                    下一場拍賣
                  </button>
                </div>
              )}
            </div>

            {/* User Stats */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-primary/20 flex items-center justify-center text-gold-primary">
                  <Coins size={16} />
                </div>
                <div>
                  <p className="text-[8px] text-gray-500 uppercase font-bold">Your Balance</p>
                  <p className="text-sm font-black font-mono text-white">${balance.toLocaleString()}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <ArrowUpRight size={16} />
                </div>
                <div>
                  <p className="text-[8px] text-gray-500 uppercase font-bold">Listing Fee</p>
                  <p className="text-sm font-black font-mono text-white">$10.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hammer Fall Animation Overlay */}
      <AnimatePresence>
        {showHammer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: [0, 1.5, 1], rotate: 0 }}
              className="text-gold-primary drop-shadow-[0_0_100px_rgba(212,175,55,1)]"
            >
              <Gavel size={200} />
            </motion.div>
            
            {/* Glowing Data Flow (Treasury) */}
            <motion.div 
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: -300, opacity: [0, 1, 0] }}
              transition={{ duration: 2, delay: 0.5 }}
              className="absolute text-4xl font-black gold-gradient-text italic"
            >
              Treasury +${treasuryIncome.toFixed(0)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettlementStat({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className={`p-2 rounded-lg ${highlight ? 'bg-gold-primary/20 border border-gold-primary/40' : 'bg-white/5'}`}>
      <p className="text-[8px] text-gray-500 uppercase font-bold mb-1">{label}</p>
      <p className={`text-xs font-black font-mono ${highlight ? 'text-gold-primary' : 'text-white'}`}>{value}</p>
    </div>
  );
}
