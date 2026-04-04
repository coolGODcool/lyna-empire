import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Mic, Flame, Star, MapPin, Zap } from "lucide-react";

interface SearchSystemProps {
  onExpandChange: (isExpanded: boolean) => void;
  onStoreSelect: (storeId: string) => void;
}

export default function SearchSystem({ onExpandChange, onStoreSelect }: SearchSystemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  const placeholders = [
    "搜尋店家... 😏",
    "搜尋子民 L-XXX",
    "搜尋美食 #懸賞",
    "搜尋帝國規費..."
  ];

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

  const handleVoiceStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (navigator.vibrate) navigator.vibrate(50);
    setIsRecording(true);
    // Logic for recording would go here
  };

  const handleVoiceEnd = () => {
    setIsRecording(false);
    if (navigator.vibrate) navigator.vibrate(10);
    // Stop recording logic
  };

  return (
    <div className="absolute top-0 left-0 z-[100] flex items-start p-0">
      {/* Search Square / Bar Container */}
      <motion.div
        initial={false}
        animate={{ 
          width: isExpanded ? "75vw" : "40px",
          height: isExpanded ? "auto" : "40px"
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="relative bg-black/60 backdrop-blur-xl border border-gold-primary/40 rounded-br-2xl overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.2)]"
      >
        <div className="flex items-center h-10 px-2.5">
          <button
            onClick={toggleExpand}
            className="flex-shrink-0 text-gold-primary hover:scale-110 active:scale-95 transition-all"
          >
            <Search size={20} />
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex items-center ml-2"
              >
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholders[placeholderIndex]}
                  className="w-full bg-transparent text-sm font-bold text-white placeholder-gold-primary/40 focus:outline-none"
                />
                
                <div className="flex items-center gap-2 pr-2">
                  <button
                    onMouseDown={handleVoiceStart}
                    onMouseUp={handleVoiceEnd}
                    onMouseLeave={handleVoiceEnd}
                    onTouchStart={handleVoiceStart}
                    onTouchEnd={handleVoiceEnd}
                    className={`p-1.5 rounded-full transition-all select-none touch-callout-none ${
                      isRecording ? "bg-red-500 text-white animate-pulse" : "text-gold-primary/60 hover:text-gold-primary"
                    }`}
                  >
                    <Mic size={16} />
                  </button>
                  <button
                    onClick={toggleExpand}
                    className="text-gold-primary/40 hover:text-gold-primary"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Expanded Content: Tags & Results */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4 space-y-4"
            >
              {/* Hot Tags */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {hotTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="flex-shrink-0 px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-[10px] font-black text-gold-primary hover:bg-gold-primary/20 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Mock Results */}
              {searchQuery.length > 0 && (
                <div className="space-y-2 max-h-[40vh] overflow-y-auto no-scrollbar">
                  <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">帝國搜尋結果</p>
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
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold-primary/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gold-primary/20 flex items-center justify-center text-gold-primary">
                          <Zap size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-white group-hover:text-gold-primary transition-colors">{result.name}</p>
                          <p className="text-[9px] text-gray-500 font-bold uppercase">{result.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-mono text-gold-primary">{result.dist}</p>
                        <p className="text-[8px] text-gray-600 font-bold">點擊預約</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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
              <div className="w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center animate-pulse">
                <Mic size={48} className="text-red-500" />
              </div>
              <p className="text-lg font-black text-white italic tracking-tighter">帝國語音辨識中...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
