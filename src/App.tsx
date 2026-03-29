import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Crown, 
  Utensils, 
  Target,
  Zap,
  Scroll,
  Club,
  MessageSquare
} from "lucide-react";
import Butler from "./components/Butler";
import Quests from "./components/Quests";
import Lounge from "./components/Lounge";

// Custom "L" Icon for Home
function LynaLIcon({ active }: { active: boolean }) {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-gradient-to-br from-gold-light via-gold-primary to-gold-dark border-2 border-white/20 shadow-[0_0_15px_rgba(212,175,55,0.6)]' : 'border-2 border-gold-primary/30'}`}>
      <span className={`text-xl font-black italic tracking-tighter ${active ? 'text-black' : 'gold-gradient-text'}`}>L</span>
    </div>
  );
}

// Custom AI Butler Icon
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

// Types
type Tab = "home" | "butler" | "plus" | "announcements" | "lounge";

interface Store {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBounty, setShowBounty] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch stores from GAS (Mocked for now, but ready for real URL)
  useEffect(() => {
    const fetchStores = async () => {
      try {
        // Replace with your real Google Apps Script URL
        // const response = await fetch('YOUR_GAS_URL');
        // const data = await response.json();
        
        // Mock data
        const mockData: Store[] = [
          { 
            id: "1", 
            name: "萊娜精品咖啡", 
            description: "帝國首席烘焙師親手調製，感受黑金般的絲滑質感。", 
            image: "https://picsum.photos/seed/coffee/800/1200",
            category: "飲品"
          },
          { 
            id: "2", 
            name: "五五六六和牛燒肉", 
            description: "執行長最愛。頂級 A5 和牛，入口即化的尊榮體驗。", 
            image: "https://picsum.photos/seed/meat/800/1200",
            category: "美食"
          },
          { 
            id: "3", 
            name: "帝國戰情酒吧", 
            description: "在微醺中商議大計，這裡是領主們的秘密基地。", 
            image: "https://picsum.photos/seed/bar/800/1200",
            category: "夜生活"
          }
        ];
        
        setStores(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleInteraction = (storeId: string) => {
    clickCount.current += 1;

    if (clickTimer.current) clearTimeout(clickTimer.current);

    clickTimer.current = setTimeout(() => {
      if (clickCount.current === 2) {
        // Double Click: Order Food
        setOrderStatus(`訂單已送出！預計等待 1 小時。店家 ID: ${storeId}`);
        setTimeout(() => setOrderStatus(null), 3000);
      } else if (clickCount.current >= 3) {
        // Triple Click: Bounty Effect
        setShowBounty(true);
        setTimeout(() => setShowBounty(false), 2000);
      }
      clickCount.current = 0;
    }, 300);
  };

  return (
    <div className="relative h-[100dvh] w-full bg-black-deep overflow-hidden">
      {/* CEO Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full gold-border-glow flex items-center justify-center bg-black-matte">
            <Crown className="text-gold-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-black gold-gradient-text tracking-tighter">萊娜帝國 LYNA EMPIRE</h1>
            <p className="text-[10px] text-gold-primary/80 font-bold uppercase tracking-widest">執行長 5566 | 1.05 補貼中</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] font-bold px-2 py-1 rounded border border-gold-primary/30 text-gold-primary"
          >
            國庫: $8.2M
          </motion.div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="h-full w-full pb-32 overflow-y-auto">
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
                    className="snap-item relative"
                    onClick={() => handleInteraction(store.id)}
                  >
                    <img 
                      src={store.image} 
                      alt={store.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                    
                    <div className="absolute bottom-32 left-6 right-20 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-gold-primary text-black text-[10px] font-bold rounded">
                          {store.category}
                        </span>
                        <h3 className="text-2xl font-black text-white drop-shadow-lg">{store.name}</h3>
                      </div>
                      <p className="text-sm text-gray-200 line-clamp-2 drop-shadow-md">
                        {store.description}
                      </p>
                    </div>

                    {/* Interaction Overlay */}
                    <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center">
                      <InteractionButton icon={<Utensils size={24} />} label="訂餐" />
                      <InteractionButton icon={<Target size={24} />} label="懸賞" />
                      <InteractionButton icon={<MessageSquare size={24} />} label="評論" />
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "butler" && (
            <motion.div key="butler" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="pt-24 pb-32 h-full overflow-y-auto">
              <Butler />
            </motion.div>
          )}

          {activeTab === "announcements" && (
            <motion.div key="quests" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="pt-24 pb-32 h-full overflow-y-auto">
              <Quests />
            </motion.div>
          )}

          {activeTab === "lounge" && (
            <motion.div key="lounge" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="pt-24 pb-32 h-full overflow-y-auto">
              <Lounge />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bounty Effect Overlay */}
      <AnimatePresence>
        {showBounty && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center">
              <Zap size={120} className="text-gold-primary fill-gold-primary filter drop-shadow-[0_0_20px_#D4AF37]" />
              <h2 className="text-4xl font-black italic gold-gradient-text mt-4">BOUNTY!</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Status Toast */}
      <AnimatePresence>
        {orderStatus && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-gold-primary text-black px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
          >
            <Utensils size={18} />
            {orderStatus}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 px-6 py-6 bg-gradient-to-t from-black to-transparent">
        <div className="glass-card flex justify-between items-center px-6 py-3 border-gold-primary/20">
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
          <div className="relative -top-8">
            <button 
              onClick={() => setActiveTab("plus")}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-light via-gold-primary to-gold-dark text-black flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-110 active:scale-95 transition-all vibrate-on-click"
            >
              <Plus size={36} strokeWidth={3} />
            </button>
          </div>
          <NavIcon 
            icon={<Scroll className={activeTab === "announcements" ? "text-gold-light" : "text-gold-primary/60"} />} 
            active={activeTab === "announcements"} 
            onClick={() => setActiveTab("announcements")} 
          />
          <NavIcon 
            icon={<Club className={activeTab === "lounge" ? "text-gold-light" : "text-gold-primary/60"} />} 
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
    <div className="flex flex-col items-center gap-1">
      <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-gold-primary hover:text-black transition-all cursor-pointer">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-white drop-shadow-md">{label}</span>
    </div>
  );
}
