import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Coins, 
  ChevronRight, 
  Mic, 
  Send, 
  Calendar, 
  Check, 
  X,
  Sparkles,
  MessageSquare,
  Activity,
  ScrollText,
  Clock,
  Search,
  Languages,
  AlertCircle
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import JoinEmpire from "./JoinEmpire";

// Mock data for L_Coin and Order Logs
const USER_DATA = {
  lCoin: 12850,
  orderLogs: [
    { id: "A-001", name: "萊娜精品手沖豆", date: "2026-03-25", rating: 5 },
    { id: "S-005", name: "帝國專屬按摩券", date: "2026-03-20", rating: 4 },
  ],
  tasks: [
    { id: "A-001", status: "製作中", timeLeft: "5 分鐘", type: "order" },
    { id: "S-005", status: "預約中", timeLeft: "明日 14:00", type: "reserve" },
  ]
};

// Mock data for UID search
const STORE_ITEMS = [
  { id: "A-001", name: "萊娜精品手沖豆", price: 580, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80" },
  { id: "S-005", name: "帝國專屬按摩券", price: 1200, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80" },
  { id: "W-002", name: "五五六六和牛禮盒", price: 3200, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80" },
];

export default function Butler() {
  const [isTalking, setIsTalking] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [messages, setMessages] = useState<{ role: 'butler' | 'user', content: string, original?: string }[]>([]);
  const [searchResults, setSearchResults] = useState<typeof STORE_ITEMS>([]);
  
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey: AIzaSyANO16UJS2lnqxEAqqz2zsce2ln4Cmg_XE });

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleStartChat = () => {
    setChatStarted(true);
    const initialGreeting = "[Original]\n我是您的專屬管家 萊娜。看到您的 L-Coin 餘額還有 12,850，看來最近過得挺滋潤的嘛？上次點的 A-001 評價不錯，要再來一份嗎？\n\n[Native]\nI am your exclusive butler, Lyna. Seeing your L-Coin balance is 12,850, it seems you've been living quite well lately? The A-001 you ordered last time was well-rated, would you like another one?";
    setMessages([
      { role: 'butler', content: initialGreeting }
    ]);
  };

  const generateAIResponse = async (userInput: string) => {
    setIsTalking(true);
    try {
      const model = "gemini-3-flash-preview";
      const systemInstruction = `
        You are Laina, a humorous, professional, and occasionally snarky loyal butler of the Laina Empire.
        User Data:
        - L_Coin Balance: ${USER_DATA.lCoin}
        - Order Logs: ${JSON.stringify(USER_DATA.orderLogs)}
        - Current Tasks: ${JSON.stringify(USER_DATA.tasks)}
        
        Instructions:
        1. Automatically identify user intent (ordering, scheduling, chatting, searching).
        2. Tone: Humorous, professional, loyal, but with a bit of "poisonous tongue" (snarky) when appropriate.
        3. Memory: Proactively mention previous orders (e.g., A-001, S-005) or current balance.
        4. Global Support: Detect the input language. ALWAYS respond with TWO versions:
           - [Original]: The language the user used.
           - [Native]: The sub-people's mother tongue (Traditional Chinese/Taiwanese style).
           Format: "[Original]\\n...\\n\\n[Native]\\n..."
        5. UID Support: If the user mentions a UID like A-001 or S-005, acknowledge it specifically.
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: userInput,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      const aiText = response.text || "萊娜暫時斷線了，請稍後再試。\nLyna is temporarily offline, please try again later.";
      setMessages(prev => [...prev, { role: 'butler', content: aiText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'butler', content: "抱歉，帝國通訊出了點問題。\nSorry, there's a problem with the Empire communication." }]);
    } finally {
      setIsTalking(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue("");
    
    // Check for UID search
    const uidMatch = userMsg.match(/[A-Z]-\d{3}/i);
    if (uidMatch) {
      const found = STORE_ITEMS.filter(item => item.id.toUpperCase() === uidMatch[0].toUpperCase());
      setSearchResults(found);
    } else {
      setSearchResults([]);
    }

    generateAIResponse(userMsg);
  };

  const handleLongPressStart = () => {
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    if (isLongPressing) {
      setIsLongPressing(false);
      // Simulate voice input with "optimization"
      const voiceInput = "幫我看看 A-001 還有多久好";
      setInputValue(voiceInput);
    }
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      {/* Global Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/IMG_4166.PNG" 
          alt="Lyna" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80";
          }}
        />
        <motion.div 
          animate={{
            opacity: isTalking ? [0.3, 0.6, 0.3] : [0.1, 0.3, 0.1],
            boxShadow: isTalking 
              ? ["inset 0 0 100px rgba(212,175,55,0.3)", "inset 0 0 200px rgba(212,175,55,0.5)", "inset 0 0 100px rgba(212,175,55,0.3)"]
              : ["inset 0 0 50px rgba(212,175,55,0.1)", "inset 0 0 100px rgba(212,175,55,0.2)", "inset 0 0 50px rgba(212,175,55,0.1)"]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 z-10 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-10" />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 h-full flex flex-col pb-[100px]">
        {/* 1. Top Dashboard: Task Cards */}
        <div className="p-4 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-gold-primary/30 rounded-full px-3 py-1">
              <User size={14} className="text-gold-primary" />
              <span className="text-xs font-bold text-gold-light">執行長 5566</span>
            </div>
            <div className="flex items-center gap-2 bg-gold-primary/10 backdrop-blur-md border border-gold-primary/30 rounded-full px-3 py-1">
              <Coins size={16} className="text-gold-primary" />
              <span className="text-sm font-bold text-gold-primary">{USER_DATA.lCoin.toLocaleString()} L-Coin</span>
            </div>
          </div>

          {/* Task Cards Dashboard */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {USER_DATA.tasks.map((task) => (
              <motion.div 
                key={task.id}
                whileHover={{ scale: 1.02 }}
                className="min-w-[180px] bg-black/60 backdrop-blur-xl border border-gold-primary/20 rounded-2xl p-3 flex flex-col gap-2 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gold-primary uppercase tracking-widest">{task.id}</span>
                  <div className={`w-2 h-2 rounded-full ${task.status === '製作中' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
                </div>
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-gold-light" />
                  <span className="text-xs font-bold text-white">{task.status}</span>
                </div>
                <div className="flex items-center gap-2 text-gold-primary/80">
                  <Clock size={12} />
                  <span className="text-[10px] font-medium">{task.timeLeft} 取餐</span>
                </div>
              </motion.div>
            ))}
            <button className="min-w-[100px] bg-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-1 text-white/40 hover:bg-white/10 transition-colors">
              <PlusIcon size={20} />
              <span className="text-[8px] font-bold uppercase">新增任務</span>
            </button>
          </div>
        </div>

        {/* 2. Middle Layer: Search & Avatar */}
        <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide">
          {/* Search Results / UID Integration */}
          {searchResults.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <Search size={14} className="text-gold-primary" />
                <h3 className="text-[10px] font-bold text-gold-light uppercase tracking-widest">UID 搜尋結果</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {searchResults.map(item => (
                  <div key={item.id} className="bg-gold-primary/10 border border-gold-primary/30 rounded-xl p-3 flex items-center gap-3">
                    <img src={item.image} className="w-12 h-12 rounded-lg object-cover" alt={item.name} />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-gold-primary">${item.price}</p>
                    </div>
                    <button className="p-2 bg-gold-primary text-black rounded-lg">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Lyna Central Avatar */}
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="relative">
              <motion.div 
                animate={{ 
                  scale: isTalking ? [1, 1.05, 1] : 1,
                  boxShadow: isTalking ? ["0 0 20px #D4AF37", "0 0 40px #D4AF37", "0 0 20px #D4AF37"] : "0 0 10px rgba(212,175,55,0.2)"
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 rounded-full border-4 border-gold-primary overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.3)]"
              >
                <img 
                  src="/IMG_4166.PNG" 
                  alt="Lyna Avatar" 
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"}
                />
              </motion.div>
              
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowJoinForm(true)}
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#f4e4bc] border-2 border-[#8d6e63] rounded-lg flex items-center justify-center shadow-xl z-30"
              >
                <ScrollText className="text-[#5d4037]" size={24} />
              </motion.button>
            </div>
            
            {isTalking && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-gold-light text-[10px] font-bold tracking-[0.2em] uppercase"
              >
                <Languages size={12} />
                Lyna is translating...
              </motion.div>
            )}
          </div>
        </div>

        {/* 3. Bottom Chat: AI Butler */}
        <div className="p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
          {!chatStarted ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartChat}
              className="w-full py-4 bg-gold-primary text-black font-black rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.4)] flex items-center justify-center gap-3 text-lg"
            >
              <Sparkles size={24} />
              喚醒子民管家
            </motion.button>
          ) : (
            <div className="space-y-4">
              {/* Chat Messages */}
              <div className="max-h-[300px] overflow-y-auto space-y-4 scrollbar-hide mb-4 px-2">
                {messages.map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[90%] p-4 rounded-2xl text-sm shadow-xl ${
                      msg.role === 'user' 
                        ? 'bg-gold-primary text-black font-bold' 
                        : 'bg-white/10 backdrop-blur-xl text-white border border-white/10'
                    }`}>
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTalking && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex gap-1 items-center">
                      <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-gold-primary" />
                      <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 bg-gold-primary" />
                      <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 bg-gold-primary" />
                      <span className="ml-2 text-[10px] text-gold-light font-bold uppercase">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="輸入 UID 或指令 (如: A-001)..."
                    className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-white text-sm focus:outline-none focus:border-gold-primary/50 transition-colors pr-12"
                  />
                  <button 
                    onMouseDown={handleLongPressStart}
                    onMouseUp={handleLongPressEnd}
                    onTouchStart={handleLongPressStart}
                    onTouchEnd={handleLongPressEnd}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isLongPressing ? 'bg-gold-primary text-black' : 'text-gold-primary hover:bg-white/10'}`}
                  >
                    <Mic size={20} />
                  </button>
                </div>
                <button 
                  onClick={handleSendMessage}
                  disabled={isTalking}
                  className={`p-4 bg-gold-primary text-black rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-opacity ${isTalking ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Join Empire Form */}
      <AnimatePresence>
        {showJoinForm && (
          <JoinEmpire onClose={() => setShowJoinForm(false)} userId="Lord_5566" />
        )}
      </AnimatePresence>

      {/* Voice Ripple Animation */}
      <AnimatePresence>
        {isLongPressing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <div className="relative">
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    scale: [1, 2.5],
                    opacity: [0.5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                  className="absolute inset-0 border-2 border-gold-primary rounded-full"
                />
              ))}
              <div className="relative w-24 h-24 bg-gold-primary rounded-full flex items-center justify-center shadow-[0_0_50px_#D4AF37]">
                <Mic size={40} className="text-black" />
              </div>
            </div>
            <p className="mt-8 text-gold-light font-bold tracking-widest animate-pulse">萊娜正在優化您的語音指令...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlusIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
