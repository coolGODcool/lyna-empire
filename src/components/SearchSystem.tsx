import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Flame, Star, MapPin, Zap, Menu, Clock } from "lucide-react";

interface SearchSystemProps {
  onExpandChange: (isExpanded: boolean) => void;
  onStoreSelect: (storeId: string) => void;
}

export default function SearchSystem({ onExpandChange, onStoreSelect }: SearchSystemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [history] = useState(["萊娜精品咖啡", "和牛燒肉", "威士忌吧"]);
  const containerRef = useRef<HTMLDivElement>(null);

  const hotTags = ["#熱賣商品", "#發燒商品", "#領主推薦", "#精品餐飲"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isExpanded) {
          setIsExpanded(false);
          onExpandChange(false);
          setSearchQuery("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, onExpandChange]);

  const toggleExpand = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    onExpandChange(nextState);
    if (!nextState) setSearchQuery("");
  };

  return (
    <div ref={containerRef} className="relative z-[110] flex items-center h-8 pointer-events-auto w-full">
      {/* Search Icon Button */}
      <div className="flex items-center z-20">
        <button
          onClick={toggleExpand}
          className="text-gold-primary/80 hover:text-gold-light hover:scale-110 active:scale-95 transition-all drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
        >
          <Search size={16} />
        </button>
      </div>

      {/* Search Bar Container - Slides out and fills available space */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute left-0 top-0 h-8 flex items-center pl-8 pr-2 overflow-hidden bg-black/40 backdrop-blur-xl rounded-full border border-gold-primary/20"
          >
            <input
              autoFocus
              type="text"
              name="empire-search-input"
              inputMode="search"
              enterKeyHint="search"
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck="false"
              data-private="true"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  console.log("Searching for:", searchQuery);
                  (e.target as HTMLInputElement).blur();
                  setIsExpanded(false);
                  onExpandChange(false);
                }
              }}
              onBlur={() => {
                // 延遲一下，讓點擊下拉選單的動作能先觸發
                setTimeout(() => {
                  // 如果不是因為點擊內部而失焦，則收起
                  // 這裡靠 handleClickOutside 處理更穩健，但 Enter 鍵需要手動收起
                }, 100);
              }}
              placeholder="搜尋"
              className="w-full bg-transparent text-[11px] font-black text-white placeholder-gold-primary/40 focus:outline-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            />
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={toggleExpand}
                className="text-gold-primary/40 hover:text-gold-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Results Dropdown - YouTube Style Minimalist */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-3xl border-x border-b border-gold-primary/10 rounded-b-2xl p-5 space-y-6 shadow-2xl"
            >
              <div className="space-y-3">
                <p className="text-[9px] font-black text-gold-primary/50 uppercase tracking-[0.2em]">歷史紀錄</p>
                <div className="flex flex-col gap-2">
                  {history.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSearchQuery(item)}
                      className="flex items-center gap-3 text-[11px] text-gray-300 hover:text-gold-primary transition-colors cursor-pointer py-1"
                    >
                      <Clock size={12} className="text-gray-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[9px] font-black text-gold-primary/50 uppercase tracking-[0.2em]">熱門探索</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {hotTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="flex-shrink-0 px-4 py-2 rounded-xl bg-gold-primary/5 border border-gold-primary/20 text-[10px] font-black text-gold-primary hover:bg-gold-primary/10 transition-all active:scale-95"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {searchQuery.length > 0 && (
                <div className="space-y-2 max-h-[40vh] overflow-y-auto no-scrollbar pt-2 border-t border-white/5">
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
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-gold-primary/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Zap size={14} className="text-gold-primary" />
                        <div>
                          <p className="text-[11px] font-black text-white group-hover:text-gold-primary transition-colors">{result.name}</p>
                          <p className="text-[8px] text-gray-500 font-bold uppercase">{result.type}</p>
                        </div>
                      </div>
                      <p className="text-[9px] font-mono text-gold-primary/60">{result.dist}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
