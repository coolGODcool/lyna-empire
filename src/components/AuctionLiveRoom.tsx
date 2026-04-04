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
  Sparkles,
  Send,
  MessageSquare,
  Heart,
  ArrowLeft,
  Trophy
} from "lucide-react";

interface Message {
  id: string;
  user: string;
  text: string;
  type: "NORMAL" | "SUPER_CHAT" | "SYSTEM" | "FLOWER";
  amount?: number;
}

interface AuctionLiveRoomProps {
  item: {
    id: string;
    name: string;
    type: string;
    image: string;
    basePrice: number;
    description: string;
  };
  userId: string;
  balance: number;
  onBid: (amount: number) => void;
  onBack: () => void;
  trustScore: number;
}

export default function AuctionLiveRoom({ item, userId, balance, onBid, onBack, trustScore }: AuctionLiveRoomProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", user: "系統", text: "歡迎來到帝國拍賣直播間！請遵守帝國法律。⚖️", type: "SYSTEM" },
    { id: "2", user: "子民_777", text: "這張卡我勢在必得！", type: "NORMAL" },
  ]);
  const [inputText, setInputText] = useState("");
  const [gameState, setGameState] = useState<"PREVIEW" | "BIDDING" | "SOLD">("PREVIEW");
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentBid, setCurrentBid] = useState(item.basePrice);
  const [highestBidder, setHighestBidder] = useState<string | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [showFlowers, setShowFlowers] = useState(false);
  const [lynaMessage, setLynaMessage] = useState("直播已開啟。讓子民們見識一下什麼叫真正的財力。😏");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 自動滾動聊天室
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 模擬聊天流
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState === "BIDDING") {
        const randomMsgs = [
          "太瘋狂了！這價格還在漲？",
          "有人出價了！🔥",
          "這就是財富自由的味道嗎？",
          "國庫又要進帳了，CEO 萬歲！🙌",
          "我只是來看熱鬧的，誠信分 +1 拜託。",
        ];
        const msg = randomMsgs[Math.floor(Math.random() * randomMsgs.length)];
        addMessage(`子民_${Math.floor(Math.random() * 999)}`, msg);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [gameState]);

  // 計時器邏輯
  useEffect(() => {
    if (gameState === "BIDDING") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (round < 3) {
              setRound(r => r + 1);
              addMessage("系統", `第 ${round + 1} 拍！還有機會！`, "SYSTEM");
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

  const addMessage = (user: string, text: string, type: Message["type"] = "NORMAL", amount?: number) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), user, text, type, amount }]);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    addMessage("你", inputText);
    setInputText("");
    // 隨機獎勵誠信分
    if (Math.random() > 0.8) {
      addMessage("系統", "感謝參與互動，誠信分 +1！📈", "SYSTEM");
    }
  };

  const handleSuperChat = (type: "FLOWER" | "ANNOUNCEMENT") => {
    if (type === "FLOWER") {
      if (balance < 50) return;
      setShowFlowers(true);
      addMessage("你", "灑了金花！✨💰", "FLOWER", 50);
      setTimeout(() => setShowFlowers(false), 3000);
    } else {
      if (balance < 100) return;
      addMessage("你", "發布了帝國賀電：全場目光向我看齊！📣", "SUPER_CHAT", 100);
    }
  };

  const handleStart = () => {
    setGameState("BIDDING");
    addMessage("系統", "拍賣正式開始！起標價 $" + item.basePrice, "SYSTEM");
  };

  const handleBid = () => {
    const bidAmount = 50;
    setCurrentBid(prev => prev + bidAmount);
    setHighestBidder(userId);
    setTimeLeft(30);
    onBid(bidAmount);
    addMessage("你", `出價了 $${currentBid + bidAmount}！🔥`, "NORMAL");
  };

  const handleFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("SOLD");
    setShowVictory(true);
    addMessage("系統", `拍賣結束！恭喜 ${highestBidder || "無人"} 奪得 ${item.name}！🏆`, "SYSTEM");
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black overflow-hidden font-sans">
      {/* Left: Auction Stage (16:9 Aspect) */}
      <div className="flex-1 relative flex flex-col bg-zinc-950 border-r border-white/5">
        {/* Top Bar */}
        <div className="p-4 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/5 z-20">
          <button onClick={onBack} className="flex items-center gap-2 text-gold-primary hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span className="text-xs font-black uppercase tracking-widest">返回寶庫</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-red-600 rounded text-[10px] font-black animate-pulse flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white" /> LIVE
            </div>
            <div className="text-xs font-mono text-gray-400">
              <User size={12} className="inline mr-1" /> 1,245 Watching
            </div>
          </div>
        </div>

        {/* Main Stage */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
          <div className="w-full max-w-4xl aspect-video relative rounded-3xl overflow-hidden border-2 border-gold-primary/20 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

            {/* Auction Info Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="glass-card p-4 border-gold-primary/40 bg-black/60">
                  <p className="text-[10px] text-gold-primary/60 uppercase font-black tracking-widest mb-1">Current Bid</p>
                  <motion.p 
                    key={currentBid}
                    initial={{ scale: 1.2, color: "#fff" }}
                    animate={{ scale: 1, color: "#d4af37" }}
                    className="text-4xl font-black font-mono gold-gradient-text"
                  >
                    ${currentBid.toLocaleString()}
                  </motion.p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="glass-card px-4 py-2 border-white/10 bg-black/60 flex items-center gap-3">
                    <Clock size={16} className={timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-gold-primary"} />
                    <span className={`text-xl font-black font-mono ${timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>
                      00:{timeLeft.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex gap-1 justify-end">
                    {[1, 2, 3].map(r => (
                      <div key={r} className={`w-6 h-6 rounded border flex items-center justify-center text-[10px] font-black ${round === r ? 'bg-gold-primary text-black border-gold-primary' : 'bg-black/60 text-gray-500 border-white/10'}`}>
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Crown className="text-gold-primary" size={16} />
                    <span className="text-[10px] font-black text-gold-primary uppercase tracking-widest">{item.type}</span>
                  </div>
                  <h2 className="text-3xl font-black text-white italic tracking-tighter">{item.name}</h2>
                </div>
                
                {gameState === "PREVIEW" ? (
                  <button onClick={handleStart} className="px-8 py-4 bg-gold-primary text-black font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-transform">
                    開始競標
                  </button>
                ) : gameState === "BIDDING" ? (
                  <button onClick={handleBid} className="px-10 py-5 bg-gradient-to-r from-gold-dark to-gold-primary text-black font-black text-xl uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all">
                    出價 +$50
                  </button>
                ) : null}
              </div>
            </div>

            {/* Gavel Animation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <motion.div
                animate={{ 
                  rotate: gameState === "BIDDING" ? (round === 3 ? [-30, 30, -30] : [-15, 15, -15]) : 0,
                  opacity: gameState === "BIDDING" ? 0.4 : 0
                }}
                transition={{ repeat: Infinity, duration: round === 3 ? 0.4 : 1.5 }}
                className="text-gold-primary"
              >
                <Gavel size={240} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Lyna Dialogue Footer */}
        <div className="p-6 bg-black/60 border-t border-white/5 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full border-2 border-gold-primary overflow-hidden flex-shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <img src="/IMG_4166.PNG" alt="Lyna" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-gold-primary/60 font-black uppercase tracking-widest mb-1">Lyna (AI Butler)</p>
            <p className="text-lg text-gold-light font-bold italic">「{lynaMessage}」</p>
          </div>
        </div>
      </div>

      {/* Right: YouTube Style Chat (Fixed Width) */}
      <div className="w-full lg:w-96 flex flex-col bg-zinc-900 border-l border-white/5">
        <div className="p-4 border-b border-white/5 bg-zinc-950 flex items-center gap-2">
          <MessageSquare size={16} className="text-gold-primary" />
          <h3 className="text-sm font-black uppercase tracking-widest text-white">帝國即時聊天室</h3>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex flex-col ${msg.type === 'SUPER_CHAT' ? 'bg-gold-primary/10 border border-gold-primary/20 p-3 rounded-xl' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-black uppercase ${msg.type === 'SYSTEM' ? 'text-blue-400' : 'text-gold-primary/60'}`}>
                  {msg.user}
                </span>
                {msg.type === 'SUPER_CHAT' && (
                  <span className="px-2 py-0.5 bg-gold-primary text-black text-[8px] font-black rounded">
                    ${msg.amount} L-Coin
                  </span>
                )}
                {msg.type === 'FLOWER' && (
                  <span className="px-2 py-0.5 bg-pink-500 text-white text-[8px] font-black rounded">
                    灑花
                  </span>
                )}
              </div>
              <p className={`text-sm ${msg.type === 'SUPER_CHAT' ? 'text-gold-light font-bold' : msg.type === 'SYSTEM' ? 'text-blue-200 italic' : 'text-gray-300'}`}>
                {msg.text}
              </p>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input & Super Chat Buttons */}
        <div className="p-4 bg-zinc-950 border-t border-white/5 space-y-4">
          <div className="flex gap-2">
            <button 
              onClick={() => handleSuperChat("FLOWER")}
              className="flex-1 py-2 bg-pink-600/20 border border-pink-600/40 rounded-lg text-pink-400 text-[10px] font-black hover:bg-pink-600/30 transition-all flex items-center justify-center gap-1"
            >
              <Heart size={12} /> 灑金花 (50)
            </button>
            <button 
              onClick={() => handleSuperChat("ANNOUNCEMENT")}
              className="flex-1 py-2 bg-gold-primary/20 border border-gold-primary/40 rounded-lg text-gold-primary text-[10px] font-black hover:bg-gold-primary/30 transition-all flex items-center justify-center gap-1"
            >
              <Sparkles size={12} /> 帝國賀電 (100)
            </button>
          </div>

          <div className="flex gap-2">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="說點垃圾話..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-primary transition-all"
            />
            <button 
              onClick={handleSendMessage}
              className="p-3 bg-gold-primary text-black rounded-xl hover:scale-105 active:scale-95 transition-all"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[8px] text-gray-500 text-center uppercase tracking-widest">
            發言消耗 0.1 L-Coin | 規費 100% 歸入國庫
          </p>
        </div>
      </div>

      {/* Victory Ceremony Overlay */}
      <AnimatePresence>
        {showVictory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            <div className="text-center space-y-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="flex justify-center"
              >
                <div className="p-8 rounded-full bg-gold-primary/20 border-4 border-gold-primary shadow-[0_0_100px_rgba(212,175,55,0.5)]">
                  <Trophy size={120} className="text-gold-primary" />
                </div>
              </motion.div>
              
              <div className="space-y-2">
                <h2 className="text-6xl font-black gold-gradient-text italic tracking-tighter">SOLD OUT!</h2>
                <p className="text-2xl text-white font-bold">
                  恭喜 <span className="text-gold-primary">【{highestBidder || "幸運子民"}】</span> 奪得皇帝位
                </p>
              </div>

              <button 
                onClick={onBack}
                className="px-12 py-4 border-2 border-gold-primary text-gold-primary font-black uppercase tracking-[0.3em] rounded-xl hover:bg-gold-primary hover:text-black transition-all"
              >
                返回帝國寶庫
              </button>
            </div>

            {/* Confetti / Gold Rain Effect */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1 }}
                animate={{ y: window.innerHeight + 100, rotate: 360 }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
                className="absolute text-gold-primary pointer-events-none"
              >
                <Coins size={24} fill="currentColor" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gold Flower Effect */}
      <AnimatePresence>
        {showFlowers && (
          <div className="fixed inset-0 z-[90] pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: window.innerHeight, x: Math.random() * window.innerWidth, opacity: 1 }}
                animate={{ y: -100, x: (Math.random() - 0.5) * 500 + (window.innerWidth / 2), opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute text-pink-500"
              >
                <Sparkles size={40} fill="currentColor" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
