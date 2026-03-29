import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Store, 
  Coins, 
  ChevronRight, 
  Mic, 
  Send, 
  Calendar, 
  Check, 
  X,
  Sparkles,
  MessageSquare,
  Volume2
} from "lucide-react";

// Mock data for recommended products
const RECOMMENDED_PRODUCTS = [
  { id: 1, name: "萊娜精品手沖豆", price: 580, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80" },
  { id: 2, name: "五五六六和牛禮盒", price: 3200, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80" },
  { id: 3, name: "帝國專屬按摩券", price: 1200, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80" },
];

export default function Butler() {
  const [isFranchisee, setIsFranchisee] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [messages, setMessages] = useState<{ role: 'butler' | 'user', content: string }[]>([]);
  
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Marquee updates
  const updates = [
    "最新國庫收益：8.5% 成長中",
    "新加盟主「萊娜咖啡-台中店」正式入駐",
    "今日執行長 5566 補貼已發放",
    "五五六六和牛燒肉 預約名額剩餘 3 組"
  ];

  const handleStartChat = () => {
    setChatStarted(true);
    setIsTalking(true);
    setMessages([
      { role: 'butler', content: "我是您的專屬管家 萊娜，我可以幫您做到心靈聊天、占卜、旅遊規劃與健身建議..." }
    ]);
    // Simulate speaking effect
    setTimeout(() => setIsTalking(false), 3000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessages = [...messages, { role: 'user' as const, content: inputValue }];
    setMessages(newMessages);
    setInputValue("");
    
    // Simulate AI response
    setIsTalking(true);
    setTimeout(() => {
      let response = "好的，我正在為您處理中。";
      if (inputValue.includes("預約") || inputValue.includes("行程")) {
        response = "萊娜偵測到您的行程需求，我已經為您規劃好了。";
        setShowCalendarDialog(true);
      }
      setMessages(prev => [...prev, { role: 'butler', content: response }]);
      setIsTalking(false);
    }, 1500);
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
      // Simulate voice input
      setInputValue("我想預約明天的按摩行程");
    }
  };

  const handleConfirmCalendar = () => {
    setShowCalendarDialog(false);
    // Logic to sync with Google Calendar via GAS would go here
    alert("行程已成功同步至您的 Google 日曆與店家日曆！");
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      {/* Global Background - Lena (IMG_4166.PNG placeholder) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80" 
          alt="Lyna" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        {/* Breathing Light Overlay */}
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
        {/* 1. Top Status: CEO Info */}
        <div className="p-4 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-gold-primary/30 rounded-full px-3 py-1">
              <div className="w-6 h-6 rounded-full bg-gold-primary flex items-center justify-center">
                <User size={14} className="text-black" />
              </div>
              <span className="text-xs font-bold text-gold-light">執行長 5566</span>
            </div>
            <div className="flex items-center gap-2 bg-gold-primary/10 backdrop-blur-md border border-gold-primary/30 rounded-full px-3 py-1">
              <Coins size={16} className="text-gold-primary" />
              <span className="text-sm font-bold text-gold-primary">12,850 L-Coin</span>
            </div>
          </div>

          {/* Marquee */}
          <div className="w-full overflow-hidden bg-gold-primary/5 border-y border-gold-primary/20 py-1">
            <motion.div 
              animate={{ x: ["100%", "-100%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="whitespace-nowrap flex gap-8"
            >
              {updates.map((update, idx) => (
                <span key={idx} className="text-[10px] text-gold-light/80 uppercase tracking-widest">
                  {update}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* 2. Middle Layer: Identity & Functions */}
        <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide">
          {/* Identity Toggle */}
          <div className="flex items-center justify-center gap-4 py-2">
            <span className={`text-xs font-bold transition-colors ${!isFranchisee ? 'text-gold-primary' : 'text-gray-500'}`}>子民</span>
            <button 
              onClick={() => setIsFranchisee(!isFranchisee)}
              className="w-12 h-6 bg-gray-800 rounded-full relative border border-gold-primary/30"
            >
              <motion.div 
                animate={{ x: isFranchisee ? 24 : 2 }}
                className="absolute top-1 w-4 h-4 bg-gold-primary rounded-full shadow-[0_0_10px_#D4AF37]"
              />
            </button>
            <span className={`text-xs font-bold transition-colors ${isFranchisee ? 'text-gold-primary' : 'text-gray-500'}`}>加盟主</span>
          </div>

          {/* Franchise Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-dark/40 to-gold-primary/40 backdrop-blur-xl border border-gold-primary/50 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          >
            <Store className="text-gold-primary" />
            <span className="text-gold-light font-bold tracking-widest">加盟申請表</span>
            <ChevronRight size={18} className="text-gold-primary" />
          </motion.button>

          {/* Recommended Products */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gold-primary" />
              <h3 className="text-xs font-bold text-gold-light uppercase tracking-widest">萊娜管家推薦</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {RECOMMENDED_PRODUCTS.map((product) => (
                <motion.div 
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className="min-w-[160px] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden"
                >
                  <img src={product.image} alt={product.name} className="w-full h-24 object-cover" />
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gold-primary font-bold text-sm">${product.price}</span>
                      <button className="p-1 bg-gold-primary/20 rounded-lg">
                        <ChevronRight size={14} className="text-gold-primary" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
              <MessageSquare size={24} />
              開始與萊娜對話
            </motion.button>
          ) : (
            <div className="space-y-4">
              {/* Chat Messages */}
              <div className="max-h-[200px] overflow-y-auto space-y-3 scrollbar-hide mb-4">
                {messages.map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-gold-primary text-black font-medium' 
                        : 'bg-white/10 backdrop-blur-md text-white border border-white/10'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isTalking && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl flex gap-1">
                      <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 h-3 bg-gold-primary" />
                      <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 h-3 bg-gold-primary" />
                      <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 h-3 bg-gold-primary" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="輸入訊息或長按語音..."
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-5 text-white text-sm focus:outline-none focus:border-gold-primary/50 transition-colors"
                  />
                  <button 
                    onMouseDown={handleLongPressStart}
                    onMouseUp={handleLongPressEnd}
                    onTouchStart={handleLongPressStart}
                    onTouchEnd={handleLongPressEnd}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isLongPressing ? 'bg-gold-primary text-black' : 'text-gold-primary hover:bg-white/10'}`}
                  >
                    <Mic size={18} />
                  </button>
                </div>
                <button 
                  onClick={handleSendMessage}
                  className="p-3 bg-gold-primary text-black rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Calendar Dialog */}
      <AnimatePresence>
        {showCalendarDialog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-black-matte border border-gold-primary/50 rounded-3xl p-6 space-y-6 shadow-[0_0_50px_rgba(212,175,55,0.3)]"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gold-primary/20 flex items-center justify-center border border-gold-primary/50">
                  <Calendar size={32} className="text-gold-primary" />
                </div>
                <h3 className="text-xl font-bold text-gold-light">日曆同步請求</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  萊娜偵測到您的行程需求，是否同意將此行程寫入您的 Google 日曆？
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowCalendarDialog(false)}
                  className="py-3 rounded-xl border border-white/10 text-white font-bold flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  取消
                </button>
                <button 
                  onClick={handleConfirmCalendar}
                  className="py-3 rounded-xl bg-gold-primary text-black font-bold flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  同意寫入
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Screen Voice Ripple Animation */}
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
                    scale: [1, 2],
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
            <p className="mt-8 text-gold-light font-bold tracking-widest animate-pulse">正在聆聽您的指令...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
