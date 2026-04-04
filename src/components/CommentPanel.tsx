// 權重留言系統，根據誠信分、評價星等與時間進行複合排序。
import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, MessageSquare, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

interface Comment {
  id: string;
  user: string;
  score: number;
  rating: number;
  text: string;
  time: string;
  timestamp: number;
  weight: number;
}

interface CommentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
}

export default function CommentPanel({ isOpen, onClose, storeName }: CommentPanelProps) {
  const [sortBy, setSortBy] = useState<'weight' | 'time' | 'rating'>('weight');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // 監聽 VisualViewport 以處理虛擬鍵盤彈出
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const viewport = window.visualViewport;
      if (!viewport) return;
      
      // 計算鍵盤高度 (視窗底部與可視區域底部的差值)
      const offset = window.innerHeight - viewport.height;
      setKeyboardHeight(Math.max(0, offset));
    };

    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);
    
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  // 失焦回彈邏輯
  const handleBlur = () => {
    // 延遲執行以確保鍵盤收起完成
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 100);
  };

  const initialComments: Comment[] = [
    { id: "1", user: "帝國賢者 5566", score: 98, rating: 10, text: "這家店的咖啡豆是從帝國邊境空運過來的，口感極其醇厚，強烈推薦！", time: "10分鐘前", timestamp: Date.now() - 600000, weight: 5 },
    { id: "2", user: "領主 001", score: 85, rating: 9, text: "服務非常到位，環境也很適合商議大計。", time: "30分鐘前", timestamp: Date.now() - 1800000, weight: 3 },
    { id: "3", user: "子民 778", score: 72, rating: 8, text: "排隊時間有點長，但味道確實不錯。", time: "1小時前", timestamp: Date.now() - 3600000, weight: 1 },
    { id: "4", user: "帝國守衛 101", score: 96, rating: 10, text: "每次巡邏完都要來這裡喝一杯，這就是帝國的味道。", time: "5分鐘前", timestamp: Date.now() - 300000, weight: 5 },
  ];

  const sortedComments = useMemo(() => {
    return [...initialComments].sort((a, b) => {
      if (sortBy === 'weight') {
        if (b.weight !== a.weight) return b.weight - a.weight;
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.timestamp - a.timestamp;
      }
      if (sortBy === 'time') return b.timestamp - a.timestamp;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [sortBy]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300]"
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{ 
              // 使用 dvh 確保在不同手機瀏覽器高度正確
              height: '80dvh',
              // 動態調整底部位置以避開鍵盤
              bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : '0px'
            }}
            className="fixed left-0 right-0 bg-zinc-900 border-t border-gold-primary/30 rounded-t-[2.5rem] z-[301] flex flex-col overflow-hidden"
          >
            <div className="p-8 space-y-6 flex-shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black gold-gradient-text italic tracking-tighter">{storeName} - 權重留言區</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">優先按 [權重] 排序，次選 [時間]、[評價星數]</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-gold-primary"><X size={20} /></button>
              </div>

              <div className="flex gap-2">
                {['weight', 'time', 'rating'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSortBy(mode as any)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === mode ? 'bg-gold-primary text-black' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                  >
                    {mode === 'weight' ? '權重排序' : mode === 'time' ? '最新時間' : '最高評價'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-4 space-y-4">
              {sortedComments.map((comment) => (
                <div 
                  key={comment.id}
                  className={`p-5 rounded-2xl border transition-all ${comment.score >= 95 ? 'bg-gold-primary/10 border-gold-primary/40 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'bg-white/5 border-white/10'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${comment.score >= 95 ? 'bg-gold-primary text-black' : 'bg-white/10 text-gold-primary'}`}>
                        {comment.user.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className={`text-xs font-black ${comment.score >= 95 ? 'text-gold-primary' : 'text-white'}`}>{comment.user}</span>
                          {comment.score >= 95 && <ShieldCheck size={12} className="text-gold-primary" />}
                        </div>
                        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">誠信分: {comment.score}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gold-primary mb-1">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[10px] font-black font-mono">{comment.rating}/10</span>
                      </div>
                      {comment.weight > 1 && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold-primary/20 rounded-full border border-gold-primary/30">
                          <TrendingUp size={8} className="text-gold-primary" />
                          <span className="text-[8px] font-black text-gold-primary uppercase">x{comment.weight} 權重</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium">{comment.text}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-[8px] text-gray-600 font-bold uppercase">{comment.time}</span>
                    <div className="flex gap-3">
                      <button className="text-gray-500 hover:text-gold-primary transition-colors"><Sparkles size={14} /></button>
                      <button className="text-gray-500 hover:text-gold-primary transition-colors"><MessageSquare size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-black/40 border-t border-white/10 flex gap-3 flex-shrink-0">
              <input 
                ref={inputRef}
                type="text" 
                placeholder="發表您的帝國見解..." 
                onBlur={handleBlur}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-primary outline-none transition-all"
                style={{ fontSize: '16px' }} // 雙重保險確保 iOS 不縮放
              />
              <button className="px-6 py-3 bg-gold-primary text-black font-black text-xs uppercase tracking-widest rounded-xl">發布</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
