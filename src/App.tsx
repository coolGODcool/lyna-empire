import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Crown, 
  Utensils, 
  Target,
  Zap,
  Scroll,
  TrendingUp,
  MessageSquare,
  Heart,
  Gift,
  Share2,
  Eye,
  EyeOff,
  Clock,
  X,
  Mic,
  Spade
} from "lucide-react";
import Butler from "./components/Butler";
import Quests from "./components/Quests";
import Lounge from "./components/Lounge";

// RPG 公告欄美學重建 - Navbar 精緻化
function LynaLIcon({ active }: { active: boolean }) {
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-gradient-to-br from-gold-light via-gold-primary to-gold-dark border-2 border-white/20 shadow-[0_0_15px_rgba(212,175,55,0.6)]' : 'border-2 border-gold-primary/30'}`}>
      <span className={`text-lg font-black italic tracking-tighter ${active ? 'text-black' : 'gold-gradient-text'}`}>L</span>
    </div>
  );
}

function ButlerIcon({ active }: { active: boolean }) {
  return (
    <div className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 ${active ? 'border-gold-primary breathing-gold' : 'border-gold-primary/30'}`}>
      <img 
        src="/IMG_4166.PNG" 
        alt="Butler" 
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://picsum.photos/seed/butler/100/100";
        }}
      />
    </div>
  );
}

function QuestsIcon({ active }: { active: boolean }) {
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-gold-primary/20 border-2 border-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'border-2 border-gold-primary/30'}`}>
      <Scroll size={18} className={active ? "text-gold-light" : "text-gold-primary/60"} />
    </div>
  );
}

// 交誼廳精緻圓框 (撲克牌/黑桃樣式)
function LoungeIcon({ active }: { active: boolean }) {
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-gold-primary/20 border-2 border-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'border-2 border-gold-primary/30'}`}>
      <Spade size={18} className={active ? "text-gold-light" : "text-gold-primary/60"} />
    </div>
  );
}

// Types
type Tab = "home" | "butler" | "plus" | "announcements" | "lounge";

interface Store {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  distance: string;
  sales: string;
  queueTime: string;
  tags: string[];
  serviceMode: 'mixed' | 'order' | 'reserve';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [userId] = useState("LN-001"); // Mock identity: LN-001 (CEO), Lord_001, or User_001
  
  const initialStores: Store[] = [
    { 
      id: "1", 
      name: "萊娜精品咖啡 (旗艦店)", 
      description: "帝國首席烘焙師親手調製，感受黑金般的絲滑質感。", 
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
      category: "精品餐飲",
      rating: 9.9,
      distance: "0.8KM",
      sales: "2.5K",
      queueTime: "10min",
      tags: ["#高雄", "#鼓山區", "#精品餐飲", "#評價: 9.9"],
      serviceMode: 'mixed'
    },
    { 
      id: "2", 
      name: "五五六六和牛燒肉", 
      description: "執行長最愛。頂級 A5 和牛，入口即化的尊榮體驗。", 
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      category: "頂級美食",
      rating: 9.7,
      distance: "1.2KM",
      sales: "1.2K",
      queueTime: "25min",
      tags: ["#高雄", "#前鎮區", "#和牛", "#評價: 9.7"],
      serviceMode: 'order'
    },
    { 
      id: "3", 
      name: "黑金流光威士忌吧", 
      description: "在微醺中商議大計，這裡是領主們的秘密基地。", 
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
      category: "夜生活",
      rating: 9.5,
      distance: "2.5KM",
      sales: "0.8K",
      queueTime: "5min",
      tags: ["#高雄", "#新興區", "#威士忌", "#評價: 9.5"],
      serviceMode: 'reserve'
    },
    { 
      id: "4", 
      name: "帝國極限體能館", 
      description: "鍛鍊體魄，守護帝國。最先進的重訓設備與私人教練。", 
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      category: "運動健身",
      rating: 9.2,
      distance: "3.0KM",
      sales: "1.5K",
      queueTime: "15min",
      tags: ["#高雄", "#左營區", "#健身", "#評價: 9.2"],
      serviceMode: 'reserve'
    },
    { 
      id: "5", 
      name: "LN-001 專屬訂製西服", 
      description: "量身打造帝國威儀。每一針一線皆展現不凡品味。", 
      image: "https://images.unsplash.com/photo-1594932224828-b4b057b7d6ee?auto=format&fit=crop&w=800&q=80",
      category: "精品服飾",
      rating: 10.0,
      distance: "全域配送",
      sales: "0.5K",
      queueTime: "預約制",
      tags: ["#全域配送", "#訂製", "#精品", "#評價: 10.0"],
      serviceMode: 'mixed'
    }
  ];

  const [stores, setStores] = useState<Store[]>(initialStores);
  const [loading, setLoading] = useState(false);
  const [showBounty, setShowBounty] = useState(false);
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  const [orderSubMode, setOrderSubMode] = useState<'instant' | 'reserve' | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [showMarquee, setShowMarquee] = useState(true);
  const [longPressActive, setLongPressActive] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [orderForGirlfriend, setOrderForGirlfriend] = useState(false);
  const [isShopRedirect, setIsShopRedirect] = useState(false);
  
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // URL shopId 穿透邏輯
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shopId = params.get('shopId');
    if (shopId) {
      // 模擬加載對應店家的菜單
      // 在此範例中，我們假設 shopId 對應到 stores 中的某個 ID，或者直接彈出通用菜單
      const store = stores.find(s => s.id === shopId) || stores[0];
      setSelectedStore(store);
      setIsShopRedirect(true);
      
      // 延遲彈出，確保加載感
      setTimeout(() => {
        setShowOrderPanel(true);
      }, 1500);
    }
  }, []);

  const handleInteractionStart = (store: Store) => {
    setSelectedStore(store);
    longPressTimer.current = setTimeout(() => {
      setLongPressActive(true);
      clickCount.current = 0;
    }, 600);
  };

  const handleInteractionEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (longPressActive) {
      setLongPressActive(false);
      return;
    }

    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);

    clickTimer.current = setTimeout(() => {
      if (clickCount.current === 2) {
        setShowOrderPanel(true);
        setOrderSubMode(null);
      } else if (clickCount.current >= 3) {
        setShowBounty(true);
      }
      clickCount.current = 0;
    }, 300);
  };

  return (
    <div className="relative h-[100dvh] w-full bg-black-deep overflow-hidden safe-area-bottom">
      {/* CEO Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex flex-col gap-2 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gold-border-glow flex items-center justify-center bg-black-matte">
              <Crown className="text-gold-primary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-black gold-gradient-text tracking-tighter">萊娜帝國 LYNA EMPIRE</h1>
              <p className="text-[10px] text-gold-primary/80 font-bold uppercase tracking-widest">執行長 5566 | 1.05 補貼中</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-gold-primary/20 px-3 py-1.5 rounded-full hover:bg-gold-primary/10 transition-colors"
            >
              <span className="text-[10px] font-bold gold-gradient-text">
                {showBalance ? "L-Coin: $24,500" : "L-Coin: *****"}
              </span>
              <div className="text-gold-primary/60">
                {showBalance ? <Eye size={12} /> : <EyeOff size={12} />}
              </div>
            </button>
          </div>
        </div>

        {/* Marquee Announcement */}
        <AnimatePresence>
          {showMarquee && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="relative flex items-center overflow-hidden"
            >
              <div className="flex-1 bg-gold-primary/10 border-y border-gold-primary/20 py-1 overflow-hidden">
                <div className="whitespace-nowrap animate-marquee flex gap-8">
                  <span className="text-[10px] font-bold text-gold-light uppercase tracking-widest">
                    🏛️ 國庫公告：領主 X 完成交易，8% 稅收已入庫！ ⚔️ 新懸賞：領主 Z 發布了新任務，獎金 $5,000！ 💰 國庫資產已達 $8.2M，感謝全體子民貢獻！
                  </span>
                  <span className="text-[10px] font-bold text-gold-light uppercase tracking-widest">
                    🏛️ 國庫公告：領主 X 完成交易，8% 稅收已入庫！ ⚔️ 新懸賞：領主 Z 發布了新任務，獎金 $5,000！ 💰 國庫資產已達 $8.2M，感謝全體子民貢獻！
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowMarquee(false)}
                className="absolute right-0 bg-black/60 p-1 text-gold-primary"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {!showMarquee && (
          <button 
            onClick={() => setShowMarquee(true)}
            className="self-end text-[8px] font-bold text-gold-primary/40 uppercase tracking-widest"
          >
            開啟公告
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="h-full w-full pb-[120px]">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="snap-container"
            >
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-gold-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                stores.map((store) => (
                  <div 
                    key={store.id} 
                    className="snap-item relative h-full"
                    onMouseDown={() => handleInteractionStart(store)}
                    onMouseUp={handleInteractionEnd}
                    onTouchStart={() => handleInteractionStart(store)}
                    onTouchEnd={handleInteractionEnd}
                  >
                    <img 
                      src={store.image} 
                      alt={store.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                    
                    {/* Info Tags - Bottom Left */}
                    <div className="absolute bottom-32 left-6 right-20 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {store.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-bold text-gold-light rounded-full">
                            {tag}
                          </span>
                        ))}
                        <span className="px-2 py-0.5 bg-gold-primary text-black text-[9px] font-bold rounded-full">
                          本月銷量: {store.sales}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-black text-white drop-shadow-lg italic tracking-tighter">{store.name}</h3>
                      </div>
                      <p className="text-xs text-gray-300 line-clamp-2 drop-shadow-md font-medium">
                        {store.description}
                      </p>
                    </div>

                    {/* Right Sidebar Interaction Chain */}
                    <div className="absolute right-4 bottom-32 flex flex-col gap-5 items-center">
                      {/* Queue Monitor */}
                      <div className="flex flex-col items-center gap-1 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gold-primary/20 backdrop-blur-md border border-gold-primary/40 flex items-center justify-center text-gold-primary animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                          <Clock size={20} />
                        </div>
                        <span className="text-[9px] font-black text-gold-primary drop-shadow-md">{store.queueTime}</span>
                      </div>

                      <InteractionButton icon={<Heart size={22} />} label="喜歡" />
                      <InteractionButton icon={<Gift size={22} />} label="贊助" />
                      <InteractionButton icon={<MessageSquare size={22} />} label="留言" />
                      <InteractionButton icon={<Share2 size={22} />} label="分享" />
                    </div>

                    {/* Long Press Ripple Effect */}
                    <AnimatePresence>
                      {longPressActive && (
                        <motion.div 
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1.5, opacity: 1 }}
                          exit={{ scale: 2, opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-gold-primary/20 rounded-full animate-ping" />
                            <div className="w-24 h-24 rounded-full bg-gold-primary/10 border-2 border-gold-primary/40 flex items-center justify-center">
                              <Mic className="text-gold-primary animate-bounce" size={40} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "butler" && (
            <motion.div key="butler" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="pt-24 h-full overflow-y-auto">
              <Butler />
            </motion.div>
          )}

          {activeTab === "announcements" && (
            <motion.div key="quests" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="pt-24 h-full overflow-y-auto">
              <Quests />
            </motion.div>
          )}

          {activeTab === "lounge" && (
            <motion.div key="lounge" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="pt-24 h-full overflow-y-auto">
              <Lounge userId={userId} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bounty Panel (Triple Tap) */}
      <AnimatePresence>
        {showBounty && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="w-full max-w-sm glass-card p-8 border-gold-primary/40 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black gold-gradient-text italic">懸賞發布面板</h3>
                <button onClick={() => setShowBounty(false)} className="text-gold-primary"><X /></button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">當前懸賞金額</p>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black font-mono text-white">30 <span className="text-sm">L-Coin</span></span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-gold-primary/20 border border-gold-primary/40 text-gold-primary text-xs font-bold rounded-lg hover:bg-gold-primary hover:text-black transition-colors">+5</button>
                      <button className="px-3 py-1 bg-gold-primary/20 border border-gold-primary/40 text-gold-primary text-xs font-bold rounded-lg hover:bg-gold-primary hover:text-black transition-colors">+10</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">實時行情觀測</p>
                  <div className="grid grid-cols-1 gap-2">
                    <MarketRow price="30點" status="0人接單" color="text-gray-500" />
                    <MarketRow price="35點" status="3人待命中" color="text-gold-primary" />
                    <MarketRow price="40點" status="12人搶單" color="text-green-500" />
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-gold-primary text-black font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                確認發布懸賞
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Panel (Double Tap) */}
      <AnimatePresence>
        {showOrderPanel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="w-full max-w-sm glass-card p-8 border-gold-primary/40 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black gold-gradient-text italic">
                  {selectedStore?.serviceMode === 'mixed' ? "行動選單" : (selectedStore?.serviceMode === 'reserve' ? "時段預約" : "快速訂餐")}
                </h3>
                <button onClick={() => setShowOrderPanel(false)} className="text-gold-primary"><X /></button>
              </div>

              {selectedStore?.serviceMode === 'mixed' && !orderSubMode ? (
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => setOrderSubMode('instant')}
                    className="w-full py-6 bg-gold-primary/10 border-2 border-gold-primary/40 rounded-2xl flex flex-col items-center gap-2 hover:bg-gold-primary/20 transition-all"
                  >
                    <Utensils className="text-gold-primary" size={32} />
                    <span className="font-black text-white tracking-widest">即時點餐</span>
                  </button>
                  <button 
                    onClick={() => setOrderSubMode('reserve')}
                    className="w-full py-6 bg-white/5 border-2 border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all"
                  >
                    <Clock className="text-gold-primary" size={32} />
                    <span className="font-black text-white tracking-widest">時段預約</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {(selectedStore?.serviceMode === 'reserve' || orderSubMode === 'reserve') ? (
                    <div className="space-y-4">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">熱門空檔時間表</p>
                      <div className="grid grid-cols-2 gap-3">
                        <TimeSlot day="明日" time="14:00" />
                        <TimeSlot day="明日" time="16:30" />
                        <TimeSlot day="後日" time="10:00" />
                        <TimeSlot day="後日" time="15:00" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gold-primary/10 p-4 rounded-xl border border-gold-primary/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="text-gold-primary" />
                          <div>
                            <p className="text-xs font-bold text-white">預計取餐時間</p>
                            <p className="text-[10px] text-gold-primary/60">目前排隊: {selectedStore?.queueTime}</p>
                          </div>
                        </div>
                        <span className="text-lg font-black font-mono text-gold-primary">12:45</span>
                      </div>
                      <button 
                        onClick={() => setOrderForGirlfriend(!orderForGirlfriend)}
                        className={`w-full py-4 border transition-all rounded-xl flex items-center justify-center gap-2 ${orderForGirlfriend ? 'bg-gold-primary text-black border-gold-primary' : 'border-gold-primary/40 text-gold-primary'}`}
                      >
                        <Heart size={18} fill={orderForGirlfriend ? "black" : "none"} /> 
                        <span className="font-bold">再訂一份給女友</span>
                      </button>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {selectedStore?.serviceMode === 'mixed' && (
                      <button 
                        onClick={() => setOrderSubMode(null)}
                        className="flex-1 py-4 border border-white/20 text-white font-bold rounded-xl"
                      >
                        返回
                      </button>
                    )}
                    <button className="flex-[2] py-4 bg-gold-primary text-black font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                      確認送出
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar - 精緻模式 */}
      <nav className="fixed bottom-0 left-0 w-full z-50 px-6 py-6 bg-gradient-to-t from-black to-transparent">
        <div className="glass-card flex justify-between items-center px-8 py-3 border-gold-primary/20">
          <NavIcon 
            icon={<LynaLIcon active={activeTab === "home"} />} 
            active={activeTab === "home"} 
            onClick={() => setActiveTab("home")} 
          />
          <NavIcon 
            icon={<ButlerIcon active={activeTab === "butler"} />} 
            active={activeTab === "butler"} 
            onClick={() => setActiveTab("butler")} 
          />
          <div className="relative -top-6">
            <button 
              onClick={() => setActiveTab("plus")}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-light via-gold-primary to-gold-dark text-black flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:scale-110 active:scale-95 transition-all vibrate-on-click"
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
          <NavIcon 
            icon={<QuestsIcon active={activeTab === "announcements"} />} 
            active={activeTab === "announcements"} 
            onClick={() => setActiveTab("announcements")} 
          />
          <NavIcon 
            icon={<LoungeIcon active={activeTab === "lounge"} />} 
            active={activeTab === "lounge"} 
            onClick={() => setActiveTab("lounge")} 
          />
        </div>
      </nav>
    </div>
  );
}

function NavIcon({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-1 transition-all duration-300 ${active ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
    >
      {icon}
    </button>
  );
}

function InteractionButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 group">
      <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:gold-flow-bg group-hover:text-black transition-all cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.05)]">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-white drop-shadow-md opacity-80 group-hover:opacity-100">{label}</span>
    </div>
  );
}

function MarketRow({ price, status, color }: { price: string, status: string, color: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-xs font-mono text-white">{price}</span>
      <span className={`text-[10px] font-bold ${color}`}>{status}</span>
    </div>
  );
}

function TimeSlot({ day, time }: { day: string, time: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center hover:border-gold-primary transition-all cursor-pointer hover:bg-gold-primary/5">
      <p className="text-[10px] text-gray-500">{day}</p>
      <p className="text-sm font-black text-white font-mono">{time}</p>
    </div>
  );
}
