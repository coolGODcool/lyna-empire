import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Mic, Flame, Star, MapPin, Zap, Menu } from "lucide-react";

interface SearchSystemProps {
  onExpandChange: (isExpanded: boolean) => void;
  onStoreSelect: (storeId: string) => void;
}

export default function SearchSystem({ onExpandChange, onStoreSelect }: SearchSystemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const placeholders = [
    "搜尋店家... 😏",
    "搜尋子民 L-XXX",
    "搜尋美食 #懸賞",
    "搜尋帝國規費..."
  ];

  const butlerTags = ["#離我最近", "#發燒第一", "#生活樂趣"];
  const hotTags = ["#美食", "#新開幕", "#高評價", "#在地空投", "#領主推薦"];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    onExpandChange(nextState);
    if (!nextState) setSearchQuery("");
  };

  return (
    <div className="relative z-[110] flex items-center h-8 pointer-events-auto gap-3">
      {/* Search Icons - Floating on Progress Bar */}
      <div className="flex items-center gap-3 z-20">
        <button
          onClick={toggleExpand}
          className="text-gold-primary/80 hover:text-gold-light hover:scale-110 active:scale-95 transition-all drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
        >
          <Search size={16} />
        </button>
      </div>

      {/* Search Bar Container - Slides out from under the progress bar area */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ width: 0, opacity: 0, x: -10 }}
            animate={{ width: "75vw", opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute left-0 top-0 h-8 flex items-center pl-16 pr-4 overflow-hidden"
          >
            <input
              autoFocus
              type="search"
              name="empire-search"
              id="empire-search"
              inputMode="search"
              enterKeyHint="search"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // 執行搜尋邏輯
                  console.log("Searching for:", searchQuery);
                  (e.target as HTMLInputElement).blur(); // 搜尋後收起鍵盤
                }
              }}
              placeholder={placeholders[placeholderIndex]}
              className="w-full bg-transparent text-[11px] font-black text-white placeholder-gold-primary/40 focus:outline-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            />
            
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // 回歸穩定：單次點擊開啟辨識
                  if (navigator.vibrate) navigator.vibrate([50]);
                  setIsRecording(true);
                  
                  // 模擬辨識過程
                  setTimeout(() => {
                    setIsRecording(false);
                    const mockResults = ["萊娜精品咖啡", "五五六六和牛燒肉", "黑金流光威士忌吧"];
                    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
                    setSearchQuery(randomResult);
                    if (navigator.vibrate) navigator.vibrate([10]);
                  }, 2000);
                }}
                className={`p-2 rounded-full transition-all select-none touch-callout-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${
                  isRecording ? "bg-red-500 text-white animate-pulse scale-125" : "text-gold-primary/80 hover:text-gold-primary"
                }`}
              >
                <Mic size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={toggleExpand}
                className="text-gold-primary/40 hover:text-gold-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Results Dropdown */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-3xl border-x border-b border-gold-primary/10 rounded-b-2xl p-4 space-y-4 shadow-2xl"
            >
              <div className="space-y-2">
                <p className="text-[8px] font-black text-gold-primary/40 uppercase tracking-[0.2em]">管家學習推薦</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {butlerTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-full bg-gold-primary/10 border border-gold-primary/30 text-[10px] font-black text-gold-primary hover:bg-gold-primary/20 transition-all shadow-[0_0_10px_rgba(212,175,55,0.1)]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">熱門搜尋</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {hotTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-gray-400 hover:bg-white/10 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {searchQuery.length > 0 && (
                <div className="space-y-2 max-h-[30vh] overflow-y-auto no-scrollbar">
                  {[
                    { id: "1", name: "萊娜精品咖啡", type: "精品餐飲", dist: "0.8km" },
                    { id: "2", name: "五五六六和牛燒肉", type: "頂級美食", dist: "1.2km" }
                  ].filter(s => s.name.includes(searchQuery) || searchQuery.startsWith('#')).map((result) => (
                    <div
                      key={result.id}
                      onClick={() => {
                        onStoreSelect(result.id);
                        toggleExpand();
                      }}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:border-gold-primary/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <Zap size={12} className="text-gold-primary" />
                        <div>
                          <p className="text-[10px] font-black text-white group-hover:text-gold-primary transition-colors">{result.name}</p>
                          <p className="text-[8px] text-gray-500 font-bold uppercase">{result.type}</p>
                        </div>
                      </div>
                      <p className="text-[8px] font-mono text-gold-primary/60">{result.dist}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Overlay */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center animate-pulse">
                <Mic size={32} className="text-red-500" />
              </div>
              <p className="text-sm font-black text-white italic tracking-tighter">帝國語音辨識中...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
