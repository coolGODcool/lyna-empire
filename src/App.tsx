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
  Spade,
  Coins,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Butler from "./components/Butler";
import Quests from "./components/Quests";
import Lounge from "./components/Lounge";
import OrderDrawer, { OrderData } from "./components/OrderDrawer";
import BountyPanel from "./components/BountyPanel";
import LevelUpAnimation from "./components/LevelUpAnimation";
import VideoPlayer from "./components/VideoPlayer";
import SupportPanel from "./components/SupportPanel";
import CommentPanel from "./components/CommentPanel";
import { Calendar, MapPin, Navigation } from "lucide-react";

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
  video: string;
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
      video: "/assets/videos/v1.mp4",
      category: "精品餐飲",
      rating: 9.9,
      distance: "0.8 KM",
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
      video: "/assets/videos/v2.mp4",
      category: "頂級美食",
      rating: 9.7,
      distance: "1.2 KM",
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
      video: "/assets/videos/v3.mp4",
      category: "夜生活",
      rating: 9.5,
      distance: "2.5 KM",
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
      video: "/assets/videos/v4.mp4",
      category: "運動健身",
      rating: 9.2,
      distance: "3.0 KM",
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
      video: "/assets/videos/v5.mp4",
      category: "精品服飾",
      rating: 10.0,
      distance: "1.2 KM",
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
  const [showSupport, setShowSupport] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [showMarquee, setShowMarquee] = useState(true);
  const [longPressActive, setLongPressActive] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isShopRedirect, setIsShopRedirect] = useState(false);
  const [likes, setLikes] = useState(995); // Start near threshold
  const [isLiked, setIsLiked] = useState(false);
  const [trustScore, setTrustScore] = useState(79); // Start near threshold
  const [balance, setBalance] = useState(24500);
  const [charityPool, setCharityPool] = useState(8200000); // 8.2M
  const [showPlusPanel, setShowPlusPanel] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>("1");
  const [showFountain, setShowFountain] = useState(false);
  
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent, store: Store) => {
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    touchStartPos.current = { x, y };
    setSelectedStore(store);

    longPressTimer.current = setTimeout(() => {
      setLongPressActive(true);
      clickCount.current = 0;
    }, 600);
  };

  const handleInteractionEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    
    const x = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    
    const dx = Math.abs(x - touchStartPos.current.x);
    const dy = Math.abs(y - touchStartPos.current.y);
    
    // If displacement > 10px, it's a scroll or swipe, not a click
    if (dx > 10 || dy > 10) {
      clickCount.current = 0;
      if (clickTimer.current) clearTimeout(clickTimer.current);
      setLongPressActive(false);
      return;
    }

    if (longPressActive) {
      setLongPressActive(false);
      return;
    }

    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);

    clickTimer.current = setTimeout(() => {
      if (clickCount.current === 1) {
        setShowOrderPanel(true);
      } else if (clickCount.current === 2) {
        if (isLiked) {
          setLikes(prev => prev - 1);
          setIsLiked(false);
          setShowFountain(false);
        } else {
          setLikes(prev => prev + 1);
          setIsLiked(true);
          setShowFountain(true);
          setTimeout(() => setShowFountain(false), 1000);
        }
      } else if (clickCount.current >= 3) {
        setShowBounty(true);
      }
      clickCount.current = 0;
    }, 300);
  };

  const handleOrderConfirm = (data: OrderData) => {
    const treasuryFee = data.totalAmount * 0.08;
    const charityFee = data.totalAmount * 0.01;
    const cashback = data.totalAmount * 0.01;
    
    setBalance(prev => prev - data.totalAmount + cashback);
    setCharityPool(prev => prev + charityFee);
    
    if (data.recipient === 'boss') {
      setTrustScore(prev => prev + 5);
    }
    
    // Show confirmation toast or message
    console.log(`Order confirmed: ${data.totalAmount}, Treasury: ${treasuryFee}, Charity: ${charityFee}`);
  };

  return (
    <div className="relative h-[100dvh] w-full bg-black-deep overflow-hidden safe-area-bottom">
      {/* CEO Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 pt-1 pb-4 flex flex-col gap-4 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
        {/* Charity Pool - Top Center */}
        <div className="w-full max-w-[240px] mx-auto px-4 py-1.5 bg-black/40 rounded-b-2xl border-x border-b border-gold-primary/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1">
              <Sparkles size={8} className="text-gold-primary animate-pulse" />
              <span className="text-[7px] font-black gold-gradient-text uppercase tracking-widest">本季公益金累積 (1%)</span>
            </div>
            <span className="text-[7px] font-black font-mono text-white/80">${(charityPool / 1000000).toFixed(2)}M</span>
          </div>
          <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(charityPool / 10000000) * 100}%` }}
              className="h-full bg-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.8)]"
            />
          </div>
        </div>

        {/* Marquee Announcement - Ticker Style (Now below Charity Pool) */}
        <AnimatePresence>
          {showMarquee && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="relative flex items-center overflow-hidden"
            >
              <div className="flex-1 bg-gold-primary/5 border-y border-gold-primary/10 py-1.5 overflow-hidden">
                <div className="whitespace-nowrap animate-marquee flex gap-8">
                  <span className="text-[9px] font-bold text-gold-light/60 uppercase tracking-widest">
                    🏛️ 規費快訊：領主 X 完成交易，8% 稅收已入庫！ ⚔️ 領主 Z 發布了新懸賞，獎金 $5,000！ 💰 國庫資產已達 $8.2M！
                  </span>
                  <span className="text-[9px] font-bold text-gold-light/60 uppercase tracking-widest">
                    🏛️ 規費快訊：領主 X 完成交易，8% 稅收已入庫！ ⚔️ 領主 Z 發布了新懸賞，獎金 $5,000！ 💰 國庫資產已達 $8.2M！
                  </span>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMarquee(false); }}
                className="absolute right-0 bg-black/80 p-1.5 text-gold-primary/40 hover:text-gold-primary transition-colors"
              >
                <X size={10} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gold-border-glow flex items-center justify-center bg-black-matte shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <Crown className="text-gold-primary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-black gold-gradient-text tracking-tighter">萊娜帝國 LYNA EMPIRE</h1>
              <p className="text-[10px] text-gold-primary/80 font-bold uppercase tracking-widest flex items-center gap-1">
                執行長 5566 <span className="w-1 h-1 rounded-full bg-gold-primary" /> 1.05 補貼中
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowBalance(!showBalance); }}
              className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-gold-primary/30 px-3 py-1.5 rounded-full hover:bg-gold-primary/20 transition-all active:scale-95"
            >
              <span className="text-[10px] font-bold gold-gradient-text">
                {showBalance ? `L-Coin: $${balance.toLocaleString()}` : "L-Coin: *****"}
              </span>
              <div className="text-gold-primary/60">
                {showBalance ? <Eye size={12} /> : <EyeOff size={12} />}
              </div>
            </button>
          </div>
        </div>
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
              className="snap-container h-screen overflow-y-scroll snap-y snap-mandatory w-full"
            >
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-gold-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                stores.map((store) => (
                  <div 
                    key={store.id} 
                    data-id={store.id}
                    className="snap-item relative h-screen w-full snap-start"
                    onMouseDown={(e) => handleInteractionStart(e, store)}
                    onMouseUp={handleInteractionEnd}
                    onTouchStart={(e) => handleInteractionStart(e, store)}
                    onTouchEnd={handleInteractionEnd}
                  >
                    <VideoPlayer 
                      src={store.video} 
                      poster={store.image} 
                      isActive={activeVideoId === store.id} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />
                    
                    {/* Info Tags - Bottom Left */}
                    <div className="absolute bottom-32 left-6 right-24 space-y-3 pointer-events-none">
                      <div className="flex flex-wrap gap-2 items-center">
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-gold-primary/20 backdrop-blur-md border border-gold-primary/40 rounded-full">
                          <MapPin size={10} className="text-gold-primary" />
                          <span className="text-[9px] font-black text-gold-primary uppercase tracking-widest">📍 距離 1.2 KM · 步行約 15 分鐘</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full">
                          <Navigation size={10} className="text-white/60" />
                          <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">抵達需 {parseInt(store.distance) * 8 || 12} 分鐘</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {store.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-bold text-gold-light rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-black text-white drop-shadow-lg italic tracking-tighter">{store.name}</h3>
                      </div>
                      <p className="text-xs text-gray-300 line-clamp-2 drop-shadow-md font-medium">
                        {store.description}
                      </p>
                    </div>

                    {/* Right Sidebar Interaction Chain */}
                    <div className="absolute right-4 bottom-32 flex flex-col gap-5 items-center z-20">
                      {/* Dynamic Clock/Calendar Logic */}
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-col items-center gap-1 mb-2"
                      >
                        <div className="w-12 h-12 rounded-full bg-gold-primary/20 backdrop-blur-md border border-gold-primary/40 flex items-center justify-center text-gold-primary animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                          {store.serviceMode === 'reserve' ? <Calendar size={20} /> : <Clock size={20} />}
                        </div>
                        <span className="text-[9px] font-black text-gold-primary drop-shadow-md">
                          {store.serviceMode === 'reserve' ? "預約制" : store.queueTime}
                        </span>
                      </div>

                      <InteractionButton 
                        icon={<Heart size={22} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />} 
                        label={likes.toLocaleString()} 
                        onClick={() => {
                          if (isLiked) {
                            setLikes(prev => prev - 1);
                            setIsLiked(false);
                          } else {
                            setLikes(prev => prev + 1);
                            setIsLiked(true);
                            setShowFountain(true);
                            setTimeout(() => setShowFountain(false), 1000);
                          }
                        }}
                      />
                      <InteractionButton icon={<Gift size={22} />} label="贊助" onClick={() => setShowSupport(true)} />
                      <InteractionButton icon={<MessageSquare size={22} />} label="留言" onClick={() => setShowComments(true)} />
                      <InteractionButton icon={<Share2 size={22} />} label="分享" onClick={() => {
                        const referralCode = `LYNA-${userId}-${store.id}`;
                        navigator.clipboard.writeText(`${window.location.origin}/?shopId=${store.id}&ref=${referralCode}`);
                        alert(`推薦碼 ${referralCode} 已複製！連動 1% 導購分潤。`);
                      }} />
                    </div>

                    {/* Gold Fountain Visual (Double Tap) */}
                    <AnimatePresence>
                      {showFountain && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 1.5, opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                        >
                          <div className="relative">
                            {[...Array(12)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ y: 0, x: 0, opacity: 1 }}
                                animate={{ y: -200 - Math.random() * 100, x: (Math.random() - 0.5) * 400, opacity: 0, rotate: 360 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="absolute text-gold-primary"
                              >
                                <Coins size={32} fill="currentColor" />
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

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

      {/* Order Panel (Single Tap) */}
      <OrderDrawer 
        isOpen={showOrderPanel}
        onClose={() => setShowOrderPanel(false)}
        storeName={selectedStore?.name || ""}
        onConfirm={handleOrderConfirm}
      />

      {/* Support Panel */}
      <SupportPanel 
        isOpen={showSupport}
        onClose={() => setShowSupport(false)}
        onConfirm={(amount) => {
          setBalance(prev => prev - amount);
          setCharityPool(prev => prev + amount * 0.01);
          // Trigger visual feedback
        }}
      />

      {/* Comment Panel */}
      <CommentPanel 
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        storeName={selectedStore?.name || ""}
      />

      {/* Bounty Panel (Triple Tap) */}
      <BountyPanel 
        isOpen={showBounty}
        onClose={() => setShowBounty(false)}
        onConfirm={(amount) => setBalance(prev => prev - amount)}
      />

      {/* Level Up Animation */}
      <LevelUpAnimation 
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        levelName="榮耀晉升：銀牌說客"
        commissionRate="0.6%"
      />

      {/* Plus Button Panel (Upload) */}
      <AnimatePresence>
        {activeTab === "plus" && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-2xl p-8 pt-24 space-y-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black gold-gradient-text italic tracking-tighter">發布帝國動態</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">領主 0 元 | 子民 200 L</p>
              </div>
              <button onClick={() => setActiveTab("home")} className="p-3 rounded-full bg-white/5 text-gold-primary"><X size={24} /></button>
            </div>

            <div className="space-y-6">
              <div className="aspect-video rounded-3xl border-2 border-dashed border-gold-primary/30 flex flex-col items-center justify-center gap-4 bg-gold-primary/5 hover:bg-gold-primary/10 transition-all cursor-pointer">
                <Plus size={48} className="text-gold-primary/40" />
                <p className="text-sm font-black text-gold-primary/60 uppercase tracking-widest">點擊上傳 .webm 高清影片</p>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">強制屬性標籤 (啟動導購分潤)</p>
                <div className="grid grid-cols-3 gap-3">
                  {['食', '衣', '住', '行', '育', '樂'].map(tag => (
                    <button key={tag} className="py-4 bg-white/5 border border-white/10 rounded-2xl text-lg font-black text-white hover:border-gold-primary hover:text-gold-primary transition-all">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gold-primary/10 rounded-3xl border border-gold-primary/20 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white">上傳規費</span>
                  <span className="text-lg font-black font-mono text-gold-primary">200 L-Coin</span>
                </div>
                <p className="text-[8px] text-gold-primary/60 font-bold uppercase tracking-widest">領主級別 (LN-001) 已自動減免手續費</p>
              </div>

              <button className="w-full py-6 bg-gold-primary text-black font-black text-xl uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                確認發布
              </button>
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

function InteractionButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: (e: React.MouseEvent) => void }) {
  return (
    <div className="flex flex-col items-center gap-1 group">
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:gold-flow-bg group-hover:text-black transition-all cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.05)]"
      >
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
