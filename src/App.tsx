// 萊娜帝國主應用程式，負責導航、影音流布局與核心交互邏輯。
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
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Clock,
  X,
  Mic,
  Spade,
  Coins,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Menu,
  Pause,
  Play
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
import SearchSystem from "./components/SearchSystem";
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
  lat: number;
  lng: number;
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
      serviceMode: 'mixed',
      lat: 22.6593,
      lng: 120.2930
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
      serviceMode: 'order',
      lat: 22.6050,
      lng: 120.3050
    },
    { 
      id: "3", 
      name: "黑金流光威士忌吧", 
      description: "在微醺中商議大計，這裡是領主們的秘密基地。", 
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
      video: "/assets/videos/v1.mp4",
      category: "夜生活",
      rating: 9.5,
      distance: "2.5 KM",
      sales: "0.8K",
      queueTime: "5min",
      tags: ["#高雄", "#新興區", "#威士忌", "#評價: 9.5"],
      serviceMode: 'reserve',
      lat: 22.6250,
      lng: 120.3020
    },
    { 
      id: "4", 
      name: "帝國極限體能館", 
      description: "鍛鍊體魄，守護帝國。最先進的重訓設備與私人教練。", 
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      video: "/assets/videos/v2.mp4",
      category: "運動健身",
      rating: 9.2,
      distance: "3.0 KM",
      sales: "1.5K",
      queueTime: "15min",
      tags: ["#高雄", "#左營區", "#健身", "#評價: 9.2"],
      serviceMode: 'reserve',
      lat: 22.6750,
      lng: 120.3010
    },
    { 
      id: "5", 
      name: "LN-001 專屬訂製西服", 
      description: "量身打造帝國威儀。每一針一線皆展現不凡品味。", 
      image: "https://images.unsplash.com/photo-1594932224828-b4b057b7d6ee?auto=format&fit=crop&w=800&q=80",
      video: "/assets/videos/v1.mp4",
      category: "精品服飾",
      rating: 10.0,
      distance: "1.2 KM",
      sales: "0.5K",
      queueTime: "預約制",
      tags: ["#全域配送", "#訂製", "#精品", "#評價: 10.0"],
      serviceMode: 'mixed',
      lat: 22.6300,
      lng: 120.3000
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
  const [lastDonatedAmount, setLastDonatedAmount] = useState(10);
  const [showPlusPanel, setShowPlusPanel] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>("1");
  const [showFountain, setShowFountain] = useState(false);
  const [isUserMuted, setIsUserMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'play' | 'pause' | null>(null);
  const [showDonationConfirm, setShowDonationConfirm] = useState(false);
  const [pendingDonationAmount, setPendingDonationAmount] = useState(0);
  const [isUiVisible, setIsUiVisible] = useState(true);
  const [interestWeights, setInterestWeights] = useState<Record<string, number>>({});
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  
  const stealthTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoStartTimeRef = useRef<number>(Date.now());

  const resetStealthTimer = (forceVisible = true) => {
    if (forceVisible) setIsUiVisible(true);
    if (stealthTimerRef.current) clearTimeout(stealthTimerRef.current);
    stealthTimerRef.current = setTimeout(() => {
      // 完善沉浸式隱身計時器：暫停時不准躲起來
      if (!isPaused) {
        setIsUiVisible(false);
      }
    }, 5000);
  };

  useEffect(() => {
    resetStealthTimer();
    return () => {
      if (stealthTimerRef.current) clearTimeout(stealthTimerRef.current);
    };
  }, [isPaused]);

  const updateWeights = (tags: string[]) => {
    setInterestWeights(prev => {
      const next = { ...prev };
      tags.forEach(tag => {
        next[tag] = (next[tag] || 0) + 1;
      });
      return next;
    });
  };

  // 初始化全局鎖
  useEffect(() => {
    (window as any).isUserPaused = isPaused;
    if (isPaused) setIsUiVisible(true);
  }, [isPaused]);

  // 演算法追蹤：停留超過 8 秒
  useEffect(() => {
    videoStartTimeRef.current = Date.now();
    const timer = setTimeout(() => {
      const currentStore = stores.find(s => s.id === activeVideoId);
      if (currentStore) {
        updateWeights(currentStore.tags);
      }
    }, 8000);
    setIsInfoExpanded(false); // Reset info expansion on video change
    return () => clearTimeout(timer);
  }, [activeVideoId]);

  // 根據權重排序商店
  const sortedStores = React.useMemo(() => {
    return [...stores].sort((a, b) => {
      const scoreA = a.tags.reduce((sum, tag) => sum + (interestWeights[tag] || 0), 0);
      const scoreB = b.tags.reduce((sum, tag) => sum + (interestWeights[tag] || 0), 0);
      return scoreB - scoreA;
    });
  }, [stores, interestWeights]);

  // 任務二：頂部「公益金季度百分比」算法 (Quarterly Progress Logic)
  const getQuarterlyProgress = () => {
    const now = new Date();
    const month = now.getMonth();
    const quarterStartMonth = Math.floor(month / 3) * 3;
    const quarterStart = new Date(now.getFullYear(), quarterStartMonth, 1);
    const nextQuarterStart = new Date(now.getFullYear(), quarterStartMonth + 3, 1);
    
    const totalDays = (nextQuarterStart.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed = (now.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24);
    
    return Math.min(100, Math.max(0, Math.floor((daysPassed / totalDays) * 100)));
  };

  const quarterlyProgress = getQuarterlyProgress();
  
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) setActiveVideoId(id);
            
            // 硬核攔截：如果全局鎖開啟，確保該區域內的影片保持暫停
            const video = entry.target.querySelector('video');
            if (video && (window as any).isUserPaused) {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    const items = document.querySelectorAll('.snap-item');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [stores, activeTab]);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent, store: Store) => {
    // 滑動不解除隱身：延遲判定，如果是點擊才 resetStealthTimer
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    touchStartPos.current = { x, y };
    setSelectedStore(store);

    // 如果計時器尚未啟動，這可能是連續點擊的第一下
    if (!clickTimer.current) {
      clickCount.current = 0;
      clickTimer.current = setTimeout(() => {
        const screenWidth = window.innerWidth;
        const isInCenter = touchStartPos.current.x >= screenWidth * 0.2 && touchStartPos.current.x <= screenWidth * 0.8;

        if (isInCenter) {
          const finalCount = clickCount.current;
          // 帝國手勢指令集：1下暫停、2下系統預留、3下喜歡、4下懸賞
          if (finalCount === 1) {
            resetStealthTimer(true); // 只有點擊中間暫停時才解除隱身
            setIsPaused(prev => {
              const next = !prev;
              (window as any).isUserPaused = next; // 同步鎖定
              setFeedbackType(next ? 'pause' : 'play');
              setTimeout(() => setFeedbackType(null), 500);
              return next;
            });
          } else if (finalCount === 3) {
            resetStealthTimer(true);
            // 3 下：喜歡 (Like - 噴金心)
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
          } else if (finalCount >= 4) {
            // 4 下：發布懸賞 (Bounty)
            setShowBounty(true);
          }
          // finalCount === 2 時無動作，留給系統縮放
        }
        clickCount.current = 0;
        clickTimer.current = null;
      }, 400); // 延長至 400ms，為 4 連擊提供充足空間
    }

    clickCount.current += 1;

    longPressTimer.current = setTimeout(() => {
      setLongPressActive(true);
      // 長按時取消點擊計數
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      clickCount.current = 0;
    }, 600);
  };

  const handleInteractionEnd = (e: React.MouseEvent | React.TouchEvent) => {
    const x = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    
    const dx = x - touchStartPos.current.x;
    const dy = y - touchStartPos.current.y;
    
    // 如果發生明顯位移（滑動），取消所有點擊計時器
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      clickCount.current = 0;
      setLongPressActive(false);
    }

    // 左右滑動手勢導航
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 50) {
        // 由左往右滑：開啟個人資訊/資產側邊欄 (Lounge)
        setActiveTab("lounge");
      } else if (dx < -50) {
        // 由右往左滑：開啟領主名片/店家詳情面板 (OrderDrawer)
        setShowOrderPanel(true);
      }
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      clickCount.current = 0;
      setLongPressActive(false);
      return;
    }

    // 如果位移過大，視為滑動而非點擊
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      clickCount.current = 0;
      setLongPressActive(false);
      return;
    }

    if (longPressActive) {
      setLongPressActive(false);
      return;
    }
  };

  const handleOrderConfirm = (data: OrderData) => {
    const treasuryFee = data.totalAmount * 0.08;
    const charityFee = data.totalAmount * 0.01;
    const cashback = data.totalAmount * 0.01;
    
    setBalance(prev => prev - data.totalAmount + cashback);
    setCharityPool(prev => prev + charityFee);
    
    // Show confirmation toast or message
    console.log(`Order confirmed: ${data.totalAmount}, Treasury: ${treasuryFee}, Charity: ${charityFee}`);
  };

  return (
    <div 
      className="relative h-[100dvh] w-full bg-black-deep overflow-hidden safe-area-bottom touch-manipulation select-none"
    >
      {/* CEO Header */}
      <header className={`fixed top-0 left-0 w-full z-50 flex flex-col pointer-events-auto transition-opacity duration-700 ${isUiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Top Marquee - Pure Text Style, No Background */}
        <div className="w-full h-6 flex items-center overflow-hidden pointer-events-none bg-black/10 backdrop-blur-[1px]">
          <div className="whitespace-nowrap animate-marquee flex gap-12">
            <span className="text-[11px] font-black text-gold-primary/90 uppercase tracking-[0.2em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              本季結算 {quarterlyProgress}% | 帝國公告：領主 5566 完成交易，8% 稅收已入庫！ 🏛️ 國庫資產已達 ${(charityPool / 1000000).toFixed(1)}M 🏛️
            </span>
            <span className="text-[11px] font-black text-gold-primary/90 uppercase tracking-[0.2em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              本季結算 {quarterlyProgress}% | 帝國公告：領主 5566 完成交易，8% 稅收已入庫！ 🏛️ 國庫資產已達 ${(charityPool / 1000000).toFixed(1)}M 🏛️
            </span>
          </div>
        </div>

        {/* Navigation Row */}
        <div className="flex items-center justify-between px-6 py-2 bg-gradient-to-b from-black/40 to-transparent">
          <div className="flex items-center gap-4">
            {/* Minimalist Menu Button - Only One */}
            <button 
              onClick={(e) => { e.stopPropagation(); resetStealthTimer(true); }}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-gold-primary/30 flex items-center justify-center text-gold-primary hover:bg-gold-primary/20 transition-all active:scale-95"
            >
              <Menu size={18} />
            </button>
            
            {/* Search System - Integrated next to menu */}
            <SearchSystem 
              onExpandChange={(expanded) => {
                setIsSearchExpanded(expanded);
                if (expanded) resetStealthTimer(true);
              }}
              onStoreSelect={(id) => {
                const store = stores.find(s => s.id === id);
                if (store) {
                  setSelectedStore(store);
                  setShowOrderPanel(true);
                  resetStealthTimer(true);
                }
              }}
            />
          </div>
          
          <div className="flex items-center gap-3">
            {/* Right Control Area: [Pause/Play] [Volume] */}
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                resetStealthTimer(true);
                setIsPaused(!isPaused);
                (window as any).isUserPaused = !isPaused;
                setFeedbackType(!isPaused ? 'pause' : 'play');
                setTimeout(() => setFeedbackType(null), 500);
              }}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-gold-primary/30 flex items-center justify-center text-gold-primary hover:bg-gold-primary/20 transition-all active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); resetStealthTimer(true); setIsUserMuted(!isUserMuted); }}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-gold-primary/30 flex items-center justify-center text-gold-primary hover:bg-gold-primary/20 transition-all active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              {isUserMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
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
              className="snap-container h-dvh overflow-y-scroll overflow-x-hidden snap-y snap-mandatory w-full bg-black"
            >
              {loading ? (
                <div className="h-dvh flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-gold-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                sortedStores.map((store) => (
                  <div 
                    key={store.id} 
                    data-id={store.id}
                    className="snap-item relative h-dvh w-full snap-start overflow-hidden pointer-events-auto"
                    onMouseDown={(e) => handleInteractionStart(e, store)}
                    onMouseUp={handleInteractionEnd}
                    onTouchStart={(e) => handleInteractionStart(e, store)}
                    onTouchEnd={handleInteractionEnd}
                  >
                    <VideoPlayer 
                      src={store.video} 
                      poster={store.image} 
                      isActive={activeVideoId === store.id} 
                      isPaused={isPaused && activeVideoId === store.id}
                      muted={isUserMuted}
                      feedbackType={activeVideoId === store.id ? feedbackType : null}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />
                    
                    {/* Info Tags - Bottom Left */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsInfoExpanded(!isInfoExpanded);
                        resetStealthTimer();
                      }}
                      className={`absolute bottom-32 left-6 right-24 space-y-2 pointer-events-auto z-30 transition-all duration-700 ${isUiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                      <div className="flex flex-wrap gap-2 items-center">
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-gold-primary/20 backdrop-blur-md border border-gold-primary/40 rounded-full">
                          <span className="text-[9px] font-black text-gold-primary uppercase tracking-widest">#評價: {store.rating}</span>
                        </div>
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (store.lat && store.lng) {
                              const url = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;
                              window.open(url, '_blank');
                            }
                          }}
                          className={`flex items-center gap-1 px-2 py-0.5 backdrop-blur-md border rounded-full transition-all group ${
                            (store.lat && store.lng) 
                              ? "bg-gold-primary/30 border-gold-primary/50 cursor-pointer hover:bg-gold-primary/50 shadow-[0_0_10px_rgba(212,175,55,0.3)]" 
                              : "bg-white/10 border-white/10 cursor-default"
                          }`}
                        >
                          <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${
                            (store.lat && store.lng) ? "text-gold-light" : "text-white/40"
                          }`}>
                            {(store.lat && store.lng) ? `#距離: ${store.distance}` : "#商圈"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-white drop-shadow-lg italic tracking-tighter">{store.name}</h3>
                      </div>
                      
                      <p className={`text-[11px] text-gray-300 drop-shadow-md font-medium transition-all duration-300 ${isInfoExpanded ? 'line-clamp-none' : 'line-clamp-1'}`}>
                        {store.description}
                      </p>
                      
                      {isInfoExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-2 flex flex-wrap gap-2"
                        >
                          {store.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-black/40 backdrop-blur-md border border-white/10 text-[8px] font-bold text-gold-light rounded-full">
                              {tag}
                            </span>
                          ))}
                        </motion.div>
                      )}
                    </div>

                    {/* Right Sidebar Interaction Chain */}
                    <div className={`absolute right-4 bottom-32 flex flex-col gap-5 items-center z-20 transition-all duration-700 ${isUiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      {/* Dynamic Clock/Calendar Logic */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowOrderPanel(true);
                          resetStealthTimer();
                          updateWeights(store.tags);
                        }}
                        className="flex flex-col items-center gap-1 mb-2 cursor-pointer active:scale-90 transition-transform"
                      >
                        <div className="w-10 h-10 rounded-full bg-gold-primary/20 backdrop-blur-md border border-gold-primary/40 flex items-center justify-center text-gold-primary animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                          {store.serviceMode === 'reserve' ? <Calendar size={18} /> : <Clock size={18} />}
                        </div>
                        <span className="text-[8px] font-black text-gold-primary drop-shadow-md">
                          {store.serviceMode === 'reserve' ? "預約制" : store.queueTime}
                        </span>
                      </div>

                      <InteractionButton 
                        icon={<Heart size={18} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />} 
                        label={likes.toLocaleString()} 
                        onClick={() => {
                          resetStealthTimer();
                          updateWeights(store.tags);
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
                      <InteractionButton icon={<Coins size={18} />} label="贊助" onClick={() => { setShowSupport(true); resetStealthTimer(); updateWeights(store.tags); }} />
                      <InteractionButton icon={<MessageSquare size={18} />} label="留言" onClick={() => { setShowComments(true); resetStealthTimer(); updateWeights(store.tags); }} />
                      <InteractionButton icon={<Share2 size={18} />} label="分享" onClick={() => {
                        resetStealthTimer();
                        updateWeights(store.tags);
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
        pricePerUnit={150}
      />

      {/* Support Panel */}
      <SupportPanel 
        isOpen={showSupport}
        onClose={() => setShowSupport(false)}
        initialAmount={lastDonatedAmount}
        onConfirm={(amount) => {
          setPendingDonationAmount(amount);
          setShowDonationConfirm(true);
          setShowSupport(false);
        }}
      />

      {/* Donation Double Confirmation Modal */}
      <AnimatePresence>
        {showDonationConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] flex items-center justify-center px-6 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm bg-black-matte border border-gold-primary/30 rounded-[2rem] p-8 space-y-6 shadow-[0_0_50px_rgba(212,175,55,0.2)]"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-gold-primary/10 flex items-center justify-center mx-auto mb-4 border border-gold-primary/20">
                  <ShieldCheck className="text-gold-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white italic tracking-tighter">金融安全二次確認</h3>
                <p className="text-sm text-gray-400 font-bold">確定要支持 <span className="text-gold-primary">{pendingDonationAmount} L-Coin</span> 嗎？😏</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 space-y-2 border border-white/5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-500">內含國庫規費 (8%)</span>
                  <span className="text-gold-primary/60">{(pendingDonationAmount * 0.08).toFixed(1)} L</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-500">公益金撥款 (1%)</span>
                  <span className="text-gold-primary/60">{(pendingDonationAmount * 0.01).toFixed(1)} L</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-500">影片主分潤 (1%)</span>
                  <span className="text-gold-primary/60">{(pendingDonationAmount * 0.01).toFixed(1)} L</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowDonationConfirm(false)}
                  className="flex-1 py-4 rounded-xl bg-white/5 text-gray-400 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    setBalance(prev => prev - pendingDonationAmount);
                    setCharityPool(prev => prev + pendingDonationAmount * 0.01);
                    setLastDonatedAmount(pendingDonationAmount);
                    setShowDonationConfirm(false);
                    // Trigger success feedback
                  }}
                  className="flex-1 py-4 rounded-xl bg-gold-primary text-black font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95 transition-all"
                >
                  確定贊助
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
      <nav className={`fixed bottom-0 left-0 w-full z-50 px-6 py-6 bg-gradient-to-t from-black to-transparent transition-opacity duration-700 ${isUiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
        className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:gold-flow-bg group-hover:text-black transition-all cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.05)]"
      >
        {icon}
      </div>
      <span className="text-[9px] font-bold text-white drop-shadow-md opacity-80 group-hover:opacity-100">{label}</span>
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
