import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  User, 
  Skull, 
  Coins, 
  Swords, 
  RotateCcw, 
  Trophy, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Info,
  Bike,
  Code,
  GlassWater,
  Sparkles,
  ShoppingBag,
  GanttChartSquare,
  X,
  Loader2,
  Infinity as InfinityIcon,
  FileText,
  Printer,
  Zap as ZapIcon,
  Flame,
  Hammer
} from "lucide-react";

/**
 * 萊娜帝國：E-Card 階級叛亂 (Class Rebellion) - 台灣限定版
 * 
 * 階級設定：
 * 1. 天龍精英 (MANAGER/Emperor): 1張天龍精英 + 4張肝苦工程師
 * 2. 89 猴外送員 (SERF/Slave): 1張 89 猴外送員 + 4張肝苦工程師
 * 3. 肝苦工程師 (SALARYMAN): 中間階級
 */

type CardType = "MANAGER" | "SALARYMAN" | "SERF";

interface Skin {
  id: string;
  name: string;
  type: CardType;
  description: string;
  rarity: "COMMON" | "RARE" | "LEGENDARY";
}

const SKINS: Skin[] = [
  { id: "default_serf", name: "89 猴外送員", type: "SERF", description: "刺青、夾腳拖、改裝車，外送界的傳說。", rarity: "COMMON" },
  { id: "default_salaryman", name: "肝苦工程師", type: "SALARYMAN", description: "黑眼圈、連帽衫、大杯咖啡，代碼就是生命。", rarity: "COMMON" },
  { id: "default_manager", name: "天龍精英", type: "MANAGER", description: "訂製西裝、紅酒杯、頂樓景觀，俯瞰眾生。", rarity: "COMMON" },
  { id: "cyber_serf", name: "賽博外送員", type: "SERF", description: "霓虹刺青、反重力滑板，送餐到月球。", rarity: "RARE" },
  { id: "gold_manager", name: "黃金領主", type: "MANAGER", description: "純金打造的權威，每一口紅酒都是金幣。", rarity: "LEGENDARY" },
];

interface Card {
  id: number;
  type: CardType;
  isUsed: boolean;
  skinId: string;
}

type GameSide = "MANAGER_SIDE" | "SERF_SIDE";
type GameState = "SIDE_SELECTION" | "BETTING" | "PLAYING" | "REVEALING" | "ROUND_RESULT" | "GAME_OVER";

export default function ECardArena() {
  // 遊戲狀態
  const [gameState, setGameState] = useState<GameState>("SIDE_SELECTION");
  const [playerSide, setPlayerSide] = useState<GameSide>("SERF_SIDE");
  const [bet, setBet] = useState(10);
  const [round, setRound] = useState(1);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [aiHand, setAiHand] = useState<Card[]>([]);
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [playerPlayedCard, setPlayerPlayedCard] = useState<Card | null>(null);
  const [aiPlayedCard, setAiPlayedCard] = useState<Card | null>(null);
  const [roundWinner, setRoundWinner] = useState<"PLAYER" | "AI" | "DRAW" | null>(null);
  const [lCoinBalance, setLCoinBalance] = useState(12850); 
  const [message, setMessage] = useState("");
  const [showGacha, setShowGacha] = useState(false);
  const [battleEffect, setBattleEffect] = useState<"DRAW" | "ENGINEER_WIN" | "EPIC_WIN" | "MANAGER_WIN" | "LOSE_HOLE" | null>(null);
  const [ownedSkins, setOwnedSkins] = useState<string[]>(["default_serf", "default_salaryman", "default_manager"]);
  const [equippedSkins, setEquippedSkins] = useState<Record<CardType, string>>({
    SERF: "default_serf",
    SALARYMAN: "default_salaryman",
    MANAGER: "default_manager"
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // 初始化手牌
  const initHands = (side: GameSide) => {
    const managerCards: Card[] = [
      { id: 1, type: "MANAGER", isUsed: false, skinId: equippedSkins.MANAGER },
      { id: 2, type: "SALARYMAN", isUsed: false, skinId: equippedSkins.SALARYMAN },
      { id: 3, type: "SALARYMAN", isUsed: false, skinId: equippedSkins.SALARYMAN },
      { id: 4, type: "SALARYMAN", isUsed: false, skinId: equippedSkins.SALARYMAN },
      { id: 5, type: "SALARYMAN", isUsed: false, skinId: equippedSkins.SALARYMAN },
    ];
    const serfCards: Card[] = [
      { id: 1, type: "SERF", isUsed: false, skinId: equippedSkins.SERF },
      { id: 2, type: "SALARYMAN", isUsed: false, skinId: equippedSkins.SALARYMAN },
      { id: 3, type: "SALARYMAN", isUsed: false, skinId: equippedSkins.SALARYMAN },
      { id: 4, type: "SALARYMAN", isUsed: false, skinId: equippedSkins.SALARYMAN },
      { id: 5, type: "SALARYMAN", isUsed: false, skinId: equippedSkins.SALARYMAN },
    ];

    if (side === "MANAGER_SIDE") {
      setPlayerHand(managerCards);
      setAiHand(serfCards);
    } else {
      setPlayerHand(serfCards);
      setAiHand(managerCards);
    }
  };

  // 選擇陣營
  const handleSelectSide = (side: GameSide) => {
    setPlayerSide(side);
    initHands(side);
    setGameState("BETTING");
  };

  // 開始遊戲
  const handleStartGame = () => {
    const totalBet = playerSide === "SERF_SIDE" ? bet : bet * 5;
    if (lCoinBalance < totalBet) {
      setMessage("L-Coin 餘額不足以支付規費！");
      return;
    }
    setLCoinBalance(prev => prev - totalBet);
    setGameState("PLAYING");
    setMessage("請選擇一張卡片進入角力場...");
  };

  // 觸覺反饋
  const triggerHaptic = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  };

  // 戰鬥邏輯
  const resolveBattle = (pCard: Card, aCard: Card) => {
    if (pCard.type === aCard.type) return "DRAW";

    if (pCard.type === "MANAGER") {
      return aCard.type === "SALARYMAN" ? "PLAYER" : "AI";
    }
    if (pCard.type === "SALARYMAN") {
      return aCard.type === "SERF" ? "PLAYER" : "AI";
    }
    if (pCard.type === "SERF") {
      return aCard.type === "MANAGER" ? "PLAYER" : "AI";
    }
    return "DRAW";
  };

  // 出牌
  const handlePlayCard = (idx: number) => {
    if (gameState !== "PLAYING") return;
    triggerHaptic();
    
    const pCard = playerHand[idx];
    if (pCard.isUsed) return;

    // AI 隨機出一張沒用過的牌
    const availableAiCards = aiHand.filter(c => !c.isUsed);
    const aCard = availableAiCards[Math.floor(Math.random() * availableAiCards.length)];

    setPlayerPlayedCard(pCard);
    setAiPlayedCard(aCard);
    setGameState("REVEALING");

    // 3秒縮放旋轉動畫後揭曉
    setTimeout(() => {
      const winner = resolveBattle(pCard, aCard);
      setRoundWinner(winner);
      
      // 觸發音效震動
      triggerHaptic();
      
      // 更新手牌狀態
      setPlayerHand(prev => prev.map((c, i) => i === idx ? { ...c, isUsed: true } : c));
      setAiHand(prev => prev.map(c => c.id === aCard.id ? { ...c, isUsed: true } : c));

      if (winner !== "DRAW") {
        // 判斷特殊獲勝特效
        if (winner === "PLAYER") {
          if (pCard.type === "SERF" && aCard.type === "MANAGER") {
            setBattleEffect("EPIC_WIN");
            if (window.navigator.vibrate) window.navigator.vibrate([500, 100, 200, 100, 200]); // 斬擊與噴錢
          } else if (pCard.type === "SALARYMAN" && aCard.type === "SERF") {
            setBattleEffect("ENGINEER_WIN");
            if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
          } else if (pCard.type === "MANAGER" && aCard.type === "SALARYMAN") {
            setBattleEffect("MANAGER_WIN");
            if (window.navigator.vibrate) window.navigator.vibrate([200, 200, 200, 200, 200]); // 帳單重壓
          }
        } else {
          // 玩家輸了，觸發黑洞特效
          setBattleEffect("LOSE_HOLE");
          if (window.navigator.vibrate) window.navigator.vibrate([400]);
        }
        
        setGameState("GAME_OVER");
        handleGameEnd(winner);
      } else {
        // 平局特效
        if (pCard.type === "SALARYMAN") {
          setBattleEffect("DRAW");
          if (window.navigator.vibrate) window.navigator.vibrate([30, 50, 30]);
        }
        
        setGameState("ROUND_RESULT");
        setTimeout(() => {
          setRound(prev => prev + 1);
          setPlayerPlayedCard(null);
          setAiPlayedCard(null);
          setRoundWinner(null);
          setBattleEffect(null);
          setGameState("PLAYING");
        }, 3000);
      }
    }, 3000); // 延長至 3 秒
  };

  // 結算
  const handleGameEnd = (winner: "PLAYER" | "AI") => {
    let profit = 0;
    let stake = playerSide === "SERF_SIDE" ? bet : bet * 5;
    let opponentBet = playerSide === "SERF_SIDE" ? bet * 5 : bet;

    if (winner === "PLAYER") {
      // 贏家獲得：自己的本金 + (對手的下注 * 90%)
      profit = Math.floor(opponentBet * 0.9);
      const totalPayout = stake + profit;
      
      if (playerSide === "MANAGER_SIDE") {
        setMessage(`階級壓制成功！回收本金並贏得 ${profit} L-Coin (已扣 10% 國庫稅)`);
      } else {
        setMessage(`奇蹟發生！逆天改命成功！贏得 ${profit} L-Coin (已扣 10% 國庫稅)`);
      }
      setLCoinBalance(prev => prev + totalPayout);
    } else {
      setMessage(playerSide === "MANAGER_SIDE" ? "被 89 猴反殺，國庫蒙羞！" : "階級壓制... 革命尚未成功。");
    }
  };

  const resetGame = () => {
    setGameState("SIDE_SELECTION");
    setRound(1);
    setPlayerPlayedCard(null);
    setAiPlayedCard(null);
    setRoundWinner(null);
    setBattleEffect(null);
    setMessage("");
  };

  // 渲染卡片組件
  const RenderCard = ({ card, side, isHidden = false, isLarge = false }: { card: Card, side: GameSide, isHidden?: boolean, isLarge?: boolean }) => {
    const isManager = card.type === "MANAGER";
    const isSerf = card.type === "SERF";
    const isSalaryman = card.type === "SALARYMAN";
    const skin = SKINS.find(s => s.id === card.skinId) || SKINS[0];

    return (
      <motion.div
        whileHover={!card.isUsed && !isHidden ? { scale: 1.05, y: -10 } : {}}
        className={`relative ${isLarge ? 'w-48 h-72' : 'w-28 h-40'} rounded-xl border-2 flex flex-col items-center justify-center overflow-hidden shadow-2xl transition-all duration-500
          ${card.isUsed ? 'opacity-30 grayscale' : 'opacity-100'}
          ${isManager ? 'border-yellow-500 bg-gradient-to-br from-yellow-900/80 to-black shadow-[0_0_20px_rgba(234,179,8,0.4)]' : ''}
          ${isSerf ? 'border-red-600 bg-gradient-to-br from-red-950/80 to-black shadow-[0_0_20px_rgba(220,38,38,0.4)]' : ''}
          ${isSalaryman ? 'border-blue-400 bg-gradient-to-br from-blue-900/80 to-black shadow-[0_0_20px_rgba(96,165,250,0.4)]' : ''}
          ${isHidden ? 'border-zinc-700 bg-zinc-900' : ''}
        `}
      >
        {isHidden ? (
          /* 鎖定狀態：顯示護盾 */
          <div className="flex flex-col items-center gap-4">
            <Shield className="text-zinc-700" size={isLarge ? 64 : 32} />
            <div className="w-24 h-1 bg-zinc-800 animate-pulse rounded-full" />
          </div>
        ) : (
          /* 揭曉狀態：顯示階級造型 */
          <>
            <div className={`absolute top-2 left-2 text-[10px] font-black uppercase tracking-widest z-20 ${isManager ? 'text-yellow-500' : isSerf ? 'text-red-500' : 'text-blue-400'}`}>
              {card.type === "MANAGER" ? "天龍 Elite" : card.type === "SERF" ? "89 牛馬" : "肝苦工程師"}
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              {isManager && <GlassWater className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" size={isLarge ? 80 : 40} />}
              {isSerf && <Bike className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]" size={isLarge ? 80 : 40} />}
              {isSalaryman && <Code className="text-blue-400" size={isLarge ? 80 : 40} />}
              
              <div className="mt-4 text-center px-2">
                <p className={`text-xs font-black tracking-tighter ${isManager ? 'text-yellow-200' : isSerf ? 'text-red-200' : 'text-blue-100'}`}>
                  {skin.name}
                </p>
                {isLarge && (
                  <p className="text-[8px] mt-2 text-white/40 leading-tight italic">
                    {skin.description}
                  </p>
                )}
              </div>
            </div>

            {/* 揭曉瞬間的文字噴發效果 */}
            {isLarge && gameState === "ROUND_RESULT" && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
              >
                <span className={`text-3xl font-black italic uppercase tracking-widest drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] ${isManager ? 'text-yellow-400' : isSerf ? 'text-red-500' : 'text-blue-400'}`}>
                  {isManager ? "Clink!🍷" : isSerf ? "VROOOM!🛵" : "Click-clack!⌨️"}
                </span>
              </motion.div>
            )}

            <div className={`absolute bottom-0 left-0 w-full h-1 ${isManager ? 'bg-yellow-500' : isSerf ? 'bg-red-600' : 'bg-blue-400'}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </>
        )}
      </motion.div>
    );
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#0a0a0c] text-white font-sans">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
        {/* 霓虹燈光 */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-red-600/10 blur-[120px] rounded-full" />
      </div>

      {/* 頂部資訊 */}
      <div className="relative z-10 p-4 flex items-center justify-between bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold-primary/20 rounded-lg border border-gold-primary/30">
            <Swords className="text-gold-primary" size={20} />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest uppercase text-gold-light">E-Card 角力場</h1>
            <p className="text-[10px] text-white/40 font-bold uppercase">Class Rebellion</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowGacha(true)}
            className="p-2 bg-white/5 border border-white/10 rounded-lg text-gold-primary hover:bg-white/10 transition-colors"
          >
            <ShoppingBag size={20} />
          </button>
          <div className="flex items-center gap-2 bg-gold-primary/10 px-3 py-1.5 rounded-full border border-gold-primary/30">
            <Coins size={16} className="text-gold-primary" />
            <span className="text-sm font-black text-gold-primary">{lCoinBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 遊戲主體 */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* 陣營選擇介面 */}
        {gameState === "SIDE_SELECTION" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-6 space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tighter">選擇您的命運</h2>
              <p className="text-xs text-white/40">在帝國的棋盤上，您想扮演什麼角色？</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectSide("MANAGER_SIDE")}
                className="group relative aspect-[3/4] bg-gradient-to-b from-yellow-900/40 to-black border-2 border-yellow-500/30 rounded-3xl p-6 flex flex-col items-center justify-between overflow-hidden"
              >
                <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />
                <GlassWater size={48} className="text-yellow-500" />
                <div className="text-center">
                  <p className="text-lg font-black text-yellow-500 uppercase">天龍精英</p>
                  <p className="text-[10px] text-yellow-200/60">1x 天龍精英 + 4x 肝苦工程師</p>
                </div>
                <div className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-1 rounded-full">下注倍率: 5x</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectSide("SERF_SIDE")}
                className="group relative aspect-[3/4] bg-gradient-to-b from-red-950/40 to-black border-2 border-red-600/30 rounded-3xl p-6 flex flex-col items-center justify-between overflow-hidden"
              >
                <div className="absolute inset-0 bg-red-600/5 group-hover:bg-red-600/10 transition-colors" />
                <Bike size={48} className="text-red-600" />
                <div className="text-center">
                  <p className="text-lg font-black text-red-600 uppercase">89 猴外送員</p>
                  <p className="text-[10px] text-red-200/60">1x 89 猴 + 4x 肝苦工程師</p>
                </div>
                <div className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-1 rounded-full">下注倍率: 1x</div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* 下注介面 */}
        {gameState === "BETTING" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-xl font-black text-white uppercase tracking-widest">設定賭注</h2>
              <p className="text-xs text-white/40">最低下注 10 L-Coin，必須為 10 的倍數</p>
            </div>

            <div className="w-full max-w-xs space-y-6">
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
                <button onClick={() => setBet(Math.max(10, bet - 10))} className="p-2 text-gold-primary hover:bg-white/5 rounded-lg"><ChevronLeft /></button>
                <div className="text-center">
                  <p className="text-2xl font-black text-white">{bet}</p>
                  <p className="text-[10px] text-white/40 font-bold uppercase">Base Bet</p>
                </div>
                <button onClick={() => setBet(bet + 10)} className="p-2 text-gold-primary hover:bg-white/5 rounded-lg"><ChevronRight /></button>
              </div>

              <div className="bg-gold-primary/5 border border-gold-primary/20 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/60">您的總下注:</span>
                  <span className="text-gold-primary">{playerSide === "SERF_SIDE" ? bet : bet * 5} L-Coin</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/60">對手跟注:</span>
                  <span className="text-gold-primary">{playerSide === "SERF_SIDE" ? bet * 5 : bet} L-Coin</span>
                </div>
                <div className="pt-2 border-t border-gold-primary/10 flex justify-between text-sm font-black">
                  <span className="text-gold-light">預計純利:</span>
                  <span className="text-gold-primary">
                    {playerSide === "SERF_SIDE" ? Math.floor(bet * 5 * 0.9) : Math.floor(bet * 0.9)} L-Coin
                  </span>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                className="w-full py-4 bg-gold-primary text-black font-black rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 transition-transform"
              >
                進入角力場
              </button>
              <button onClick={() => setGameState("SIDE_SELECTION")} className="w-full text-xs font-bold text-white/40 hover:text-white transition-colors">重新選擇陣營</button>
            </div>
          </motion.div>
        )}

        {/* 遊戲進行中 */}
        {(gameState === "PLAYING" || gameState === "REVEALING" || gameState === "ROUND_RESULT" || gameState === "GAME_OVER") && (
          <div className="flex-1 flex flex-col justify-between py-4">
            
            {/* AI 區 */}
            <div className="px-4 flex flex-col items-center gap-4">
              <div className="flex gap-2 opacity-60 scale-75">
                {aiHand.map((card) => (
                  <div key={card.id} className={`w-12 h-16 rounded-md border border-white/20 ${card.isUsed ? 'bg-transparent' : 'bg-zinc-800'}`} />
                ))}
              </div>
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Imperial AI Opponent</div>
            </div>

            {/* 戰鬥中央區 */}
            <div className="relative flex-1 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {gameState === "REVEALING" || gameState === "ROUND_RESULT" || gameState === "GAME_OVER" ? (
                  <div className="flex items-center gap-8">
                    {/* AI 出牌 */}
                    <motion.div
                      initial={{ y: -200, opacity: 0, rotateY: 180, scale: 0.5 }}
                      animate={gameState === "REVEALING" 
                        ? { y: 0, opacity: 1, rotateY: [180, 360, 540], scale: 1.2, rotate: [0, 10, -10, 0] }
                        : { y: 0, opacity: 1, rotateY: 0, scale: 1 }
                      }
                      transition={gameState === "REVEALING" 
                        ? { duration: 3, ease: "easeInOut" }
                        : { duration: 0.5 }
                      }
                    >
                      <RenderCard card={aiPlayedCard!} side={playerSide === "SERF_SIDE" ? "MANAGER_SIDE" : "SERF_SIDE"} isHidden={gameState === "REVEALING"} isLarge />
                    </motion.div>

                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-4xl font-black italic text-gold-primary drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                    >
                      VS
                    </motion.div>

                    {/* 玩家出牌 */}
                    <motion.div
                      initial={{ y: 200, opacity: 0, rotateY: 0, scale: 0.5 }}
                      animate={gameState === "REVEALING"
                        ? { y: 0, opacity: 1, rotateY: [0, 180, 360], scale: 1.2, rotate: [0, -10, 10, 0] }
                        : { y: 0, opacity: 1, rotateY: 0, scale: 1 }
                      }
                      transition={gameState === "REVEALING"
                        ? { duration: 3, ease: "easeInOut" }
                        : { duration: 0.5 }
                      }
                    >
                      <RenderCard card={playerPlayedCard!} side={playerSide} isLarge />
                    </motion.div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className="text-4xl font-black text-white/5 uppercase tracking-[0.5em] select-none">Battle Arena</div>
                    <p className="text-gold-light/60 font-bold animate-pulse">{message}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 1. 平局特效：【爆肝循環】 */}
              <AnimatePresence>
                {battleEffect === "DRAW" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[150] flex items-center justify-center pointer-events-none overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-green-900/10 backdrop-blur-[2px] mix-blend-overlay" />
                    {/* 程式碼雨 */}
                    <div className="absolute inset-0 opacity-20 flex justify-around">
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ y: -100 }}
                          animate={{ y: 800 }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: "linear" }}
                          className="text-[8px] font-mono text-green-500 writing-vertical"
                        >
                          {Math.random().toString(2).substring(2, 15)}
                        </motion.div>
                      ))}
                    </div>
                    <div className="relative flex flex-col items-center gap-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <InfinityIcon size={64} className="text-zinc-400 drop-shadow-[0_0_15px_rgba(161,161,170,0.5)]" />
                      </motion.div>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-black text-zinc-400 italic tracking-widest uppercase"
                      >
                        無效加班... 回合重來
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 2. 肝苦工程師 壓制 89牛馬：【階級馬力測試】 */}
              <AnimatePresence>
                {battleEffect === "ENGINEER_WIN" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[150] flex items-center justify-center pointer-events-none overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" />
                    
                    {/* BMW 雙腎燈強光 */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: [0, 1, 0.5, 1], scale: [0.5, 1.2, 1] }}
                      className="absolute inset-0 flex justify-around items-center px-20"
                    >
                      <div className="w-32 h-20 bg-white blur-[40px] rounded-full opacity-80" />
                      <div className="w-32 h-20 bg-white blur-[40px] rounded-full opacity-80" />
                    </motion.div>

                    {/* 輪胎輾過動態模糊 */}
                    <motion.div 
                      initial={{ x: -1000 }}
                      animate={{ x: 1000 }}
                      transition={{ duration: 0.6, ease: "circIn" }}
                      className="absolute w-full h-40 bg-zinc-800/40 skew-x-12 blur-md"
                    />

                    {/* BWS 零件散落 */}
                    <div className="absolute inset-0">
                      {[...Array(15)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: 0, y: 0, rotate: 0 }}
                          animate={{ 
                            x: (Math.random() - 0.5) * 800, 
                            y: (Math.random() - 0.5) * 800,
                            rotate: 360,
                            opacity: 0
                          }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="absolute text-zinc-400"
                        >
                          <Hammer size={24} />
                        </motion.div>
                      ))}
                    </div>

                    <motion.div 
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="relative z-10 text-center"
                    >
                      <h2 className="text-4xl font-black text-blue-400 italic drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] mb-2">
                        階級馬力測試
                      </h2>
                      <p className="bg-black/80 px-4 py-2 border-l-4 border-blue-500 text-blue-100 font-bold tracking-tighter">
                        「馬力與學歷，總要有一個在路上。」
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3. 89牛馬 逆襲 天龍人：【階級斬殺】 */}
              <AnimatePresence>
                {battleEffect === "EPIC_WIN" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
                  >
                    {/* Phase 1: 時間凝結 (The Void) */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-red-950/90 flex items-center justify-center"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(220,38,38,0.4)_0%,transparent_70%)] animate-pulse" />
                      
                      {/* 裂痕預警 */}
                      <motion.div 
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.1, opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="absolute text-yellow-500/20"
                      >
                        <GlassWater size={300} />
                      </motion.div>
                    </motion.div>

                    {/* Phase 2: 89 斬擊 (The 89 Slash) */}
                    <motion.div 
                      initial={{ x: -1000, skewX: -45 }}
                      animate={{ x: 1000 }}
                      transition={{ delay: 1, duration: 0.3, ease: "circIn" }}
                      className="absolute w-full h-2 bg-red-500 shadow-[0_0_30px_#ef4444] z-10"
                    />
                    
                    {/* 噴發的 L-Coin (代替血) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[...Array(40)].map((_, i) => (
                        <motion.div
                          key={`slash-coin-${i}`}
                          initial={{ x: 0, y: 0, opacity: 0 }}
                          animate={{ 
                            x: (Math.random() - 0.5) * 600, 
                            y: (Math.random() - 0.5) * 600,
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0]
                          }}
                          transition={{ duration: 0.5, delay: 1.2 }}
                          className="absolute text-yellow-400"
                        >
                          <Coins size={24} fill="currentColor" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Phase 3: 金幣噴泉 (L-Coin Eruption) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[...Array(80)].map((_, i) => (
                        <motion.div
                          key={`fountain-coin-${i}`}
                          initial={{ scale: 0, x: 0, y: 0 }}
                          animate={{ 
                            scale: [0, 1.2, 0.8], 
                            x: (Math.random() - 0.5) * 1200, 
                            y: [0, -600, 1000],
                            rotate: 1080
                          }}
                          transition={{ 
                            duration: 2, 
                            delay: 1.5 + Math.random() * 0.5,
                            ease: "backOut"
                          }}
                          className="absolute text-yellow-400 blur-[0.5px]"
                        >
                          <Coins size={40} fill="currentColor" className="drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* 特寫文字：毛筆字特效 */}
                    <motion.div
                      initial={{ scale: 5, opacity: 0, rotate: -20 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 12, delay: 1.8 }}
                      className="relative z-50 text-center"
                    >
                      <h2 className="text-8xl font-black text-white italic drop-shadow-[0_0_40px_rgba(255,0,0,1)] tracking-tighter mb-4">
                        逆 天 改 命
                      </h2>
                      <div className="space-y-4">
                        <p className="text-yellow-400 text-3xl font-black uppercase tracking-[0.2em] bg-black/60 px-6 py-2 rounded-full inline-block border-2 border-yellow-500">
                          贏要衝，輸要縮。今天換我收租！
                        </p>
                        <motion.p 
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.5 }}
                          className="text-green-400 text-xl font-black"
                        >
                          收錢速度加快中 ^^
                        </motion.p>
                      </div>
                      <button 
                        onClick={resetGame}
                        className="mt-12 px-16 py-5 bg-white text-red-600 font-black text-2xl rounded-full shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:scale-110 transition-transform"
                      >
                        收下賞金
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 4. 天龍人 壓制 肝苦工程師：【資產五指山】 */}
              <AnimatePresence>
                {battleEffect === "MANAGER_WIN" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[150] flex items-center justify-center pointer-events-none overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-yellow-900/20 backdrop-blur-md" />
                    
                    {/* 落下帳單 */}
                    <div className="absolute inset-0">
                      {[...Array(30)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ y: -500, x: (Math.random() - 0.5) * 400, rotate: Math.random() * 360 }}
                          animate={{ y: 200 + i * 5, rotate: Math.random() * 20 }}
                          transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                          className="absolute w-32 h-40 bg-white border border-zinc-300 shadow-lg flex flex-col p-2 text-black"
                        >
                          <div className="text-[8px] font-black border-b border-black mb-1">
                            {i % 3 === 0 ? "房貸合約" : i % 3 === 1 ? "車貸帳單" : "稅務催繳單"}
                          </div>
                          <div className="flex-1 bg-zinc-100 flex items-center justify-center">
                            <span className="text-xs font-serif opacity-20">OFFICIAL</span>
                          </div>
                          <div className="text-[10px] font-black text-right mt-1 text-red-600">$99,999,999</div>
                        </motion.div>
                      ))}
                    </div>

                    {/* 紅酒杯蓋章 */}
                    <motion.div
                      initial={{ scale: 5, opacity: 0, y: -200 }}
                      animate={{ scale: 1.5, opacity: 0.4, y: 0 }}
                      transition={{ delay: 1.8, duration: 0.5, type: "spring" }}
                      className="absolute text-yellow-500"
                    >
                      <GlassWater size={200} />
                    </motion.div>

                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 2.2 }}
                      className="relative z-10 bg-black border-2 border-yellow-500 p-6 text-center shadow-[0_0_50px_rgba(234,179,8,0.5)]"
                    >
                      <h2 className="text-2xl font-black text-yellow-500 tracking-widest uppercase mb-2">
                        資產五指山
                      </h2>
                      <p className="text-white font-serif italic text-lg">
                        「你的努力，只是我的利息。」
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 5. 失敗懲罰：【底層重練】 */}
              <AnimatePresence>
                {battleEffect === "LOSE_HOLE" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[150] flex items-center justify-center pointer-events-none"
                  >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                    
                    {/* 黑洞漩渦 */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute w-80 h-80 rounded-full border-t-4 border-r-4 border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.1)]"
                    />

                    <div className="relative z-10 text-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="mb-6"
                      >
                        <Skull size={80} className="text-white/20 mx-auto" />
                      </motion.div>
                      <h2 className="text-3xl font-black text-white tracking-tighter mb-2">
                        帳號重練中...
                      </h2>
                      <div className="flex items-center justify-center gap-2 text-white/40 font-mono text-sm">
                        <Loader2 className="animate-spin" size={16} />
                        <span>正在回收剩餘價值...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 舊有的結果覆蓋層 (僅在非特殊特效時顯示) */}
              <AnimatePresence>
                {gameState === "GAME_OVER" && !battleEffect && (
                  <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 p-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.8, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-zinc-900 border-2 border-gold-primary/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-xs w-full"
                    >
                      <div className="mb-6">
                        {roundWinner === 'PLAYER' ? (
                          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500/50">
                            <Sparkles className="text-green-500" size={40} />
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500/50">
                            <Info className="text-red-500" size={40} />
                          </div>
                        )}
                        <h2 className={`text-3xl font-black uppercase tracking-tighter ${roundWinner === 'PLAYER' ? 'text-green-400' : 'text-red-400'}`}>
                          {roundWinner === 'PLAYER' ? '勝利' : '落敗'}
                        </h2>
                        <p className="text-white/40 text-xs font-bold mt-1">
                          {roundWinner === 'PLAYER' ? '帝國子民的榮耀' : '再接再厲，逆天改命'}
                        </p>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/60">結算金額</span>
                          <span className={`font-black ${roundWinner === 'PLAYER' ? 'text-green-400' : 'text-red-400'}`}>
                            {roundWinner === 'PLAYER' ? '+' : '-'}{bet} L-Coin
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={resetGame}
                        className="w-full py-4 bg-gold-primary text-black font-black rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                      >
                        返回角力場
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 玩家手牌區 */}
            <div className="space-y-4">
              <div className="px-4 flex items-center justify-between">
                <div className="text-[10px] font-black text-gold-primary uppercase tracking-widest">Round {round} / 5</div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-white/40">
                  <Info size={12} />
                  <span>左右滑動選擇卡片</span>
                </div>
              </div>

              <div 
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto px-8 pb-8 scrollbar-hide snap-x"
                onScroll={triggerHaptic}
              >
                {playerHand.map((card, idx) => (
                  <div 
                    key={card.id} 
                    className="snap-center shrink-0"
                    onClick={() => handlePlayCard(idx)}
                  >
                    <RenderCard card={card} side={playerSide} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 全域特效 */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold-primary/20 animate-scanline" />
      </div>

      {/* Skin/Gacha Modal */}
      <AnimatePresence>
        {showGacha && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-zinc-900 border border-gold-primary/30 rounded-3xl p-6 space-y-6"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-gold-primary" />
                  <h2 className="text-xl font-black text-gold-primary tracking-widest uppercase">帝國皮膚拍賣行</h2>
                </div>
                <button onClick={() => setShowGacha(false)} className="p-2 text-white/40 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                {SKINS.map(skin => (
                  <div 
                    key={skin.id} 
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      equippedSkins[skin.type] === skin.id 
                        ? 'bg-gold-primary/20 border-gold-primary' 
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-white">{skin.name}</p>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${
                          skin.rarity === 'LEGENDARY' ? 'bg-yellow-500 text-black' : 
                          skin.rarity === 'RARE' ? 'bg-purple-500 text-white' : 'bg-zinc-700 text-zinc-300'
                        }`}>
                          {skin.rarity}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/40 mt-1">{skin.description}</p>
                    </div>
                    
                    {ownedSkins.includes(skin.id) ? (
                      <button 
                        onClick={() => setEquippedSkins(prev => ({ ...prev, [skin.type]: skin.id }))}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          equippedSkins[skin.type] === skin.id 
                            ? 'bg-gold-primary text-black' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {equippedSkins[skin.type] === skin.id ? "已裝備" : "裝備"}
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-zinc-800 text-zinc-500 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
                        未獲得
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  if (lCoinBalance >= 500) {
                    setLCoinBalance(prev => prev - 500);
                    const unowned = SKINS.filter(s => !ownedSkins.includes(s.id));
                    if (unowned.length > 0) {
                      const won = unowned[Math.floor(Math.random() * unowned.length)];
                      setOwnedSkins(prev => [...prev, won.id]);
                      alert(`恭喜獲得：${won.name}！`);
                    } else {
                      alert("您已擁有所有皮膚！");
                    }
                  } else {
                    alert("L-Coin 不足！(需要 500)");
                  }
                }}
                className="w-full py-4 bg-gradient-to-r from-gold-dark via-gold-primary to-gold-dark text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                抽取新皮膚 (500 L-Coin)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .clip-path-shards {
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        }
        .writing-vertical {
          writing-mode: vertical-rl;
        }
      `}</style>
    </div>
  );
}

function CrownIcon({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      className={className} 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
