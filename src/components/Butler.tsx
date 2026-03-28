import { motion } from "motion/react";
import { Bot, ShoppingBag, Sparkles, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

export default function Butler() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const keywords = ["萊娜", "帝國", "執行長", "5566", "補貼"];
    const interval = setInterval(() => {
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      setKeyword(randomKeyword);
      setIsBreathing(true);
      setTimeout(() => setIsBreathing(false), 2000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gold-gradient-text">萊娜管家 (Lyna Butler)</h2>
        <motion.div
          animate={{
            scale: isBreathing ? [1, 1.2, 1] : 1,
            opacity: isBreathing ? [0.5, 1, 0.5] : 0.5,
          }}
          transition={{ duration: 2, repeat: isBreathing ? Infinity : 0 }}
          className="w-4 h-4 rounded-full bg-gold-primary shadow-[0_0_10px_#D4AF37]"
        />
      </div>

      <div className="glass-card p-6 space-y-4 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gold-primary/20 flex items-center justify-center border border-gold-primary/50">
            <Bot className="text-gold-primary w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-1">偵測到關鍵字：<span className="text-gold-light font-mono">{keyword}</span></p>
            <p className="text-lg leading-relaxed">
              「尊貴的賓客，我是萊娜。今日執行長 5566 已為您準備了專屬補貼。請問需要為您導購哪類商品？」
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gold-primary text-black font-bold rounded-xl hover:bg-gold-light transition-colors">
            <ShoppingBag size={18} />
            熱門導購
          </button>
          <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gold-primary/50 text-gold-primary font-bold rounded-xl hover:bg-gold-primary/10 transition-colors">
            <MessageSquare size={18} />
            諮詢管家
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">管家推薦</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-4 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-16 h-16 rounded-lg bg-black-matte border border-white/10 flex items-center justify-center">
              <Sparkles className="text-gold-primary/40" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold">帝國精選商品 #{i}</h4>
              <p className="text-xs text-gray-400">執行長 5566 推薦 | 8% 系統費已內含</p>
            </div>
            <div className="text-gold-primary font-bold">$999</div>
          </div>
        ))}
      </div>
    </div>
  );
}
