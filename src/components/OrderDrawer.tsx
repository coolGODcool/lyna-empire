// 預約與訂餐抽屜面板，處理單擊影片後的下單邏輯。
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Heart, Users, Minus, Plus, ShoppingBag, Search, MapPin } from "lucide-react";

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  onConfirm: (data: OrderData) => void;
}

export interface OrderData {
  quantity: number;
  recipient: 'family' | 'citizen' | 'id';
  recipientId?: string;
  totalAmount: number;
}

export default function OrderDrawer({ isOpen, onClose, storeName, onConfirm }: OrderDrawerProps) {
  const [quantity, setQuantity] = useState(1);
  const [recipient, setRecipient] = useState<'family' | 'citizen' | 'id'>('family');
  const [recipientId, setRecipientId] = useState('');

  const basePrice = 150; // Mock base price
  const totalAmount = quantity * basePrice;

  const handleConfirm = () => {
    onConfirm({
      quantity,
      recipient,
      recipientId: recipient === 'id' ? recipientId : undefined,
      totalAmount
    });
    onClose();
  };

  const recipients = [
    { id: 'family', label: '送給家人/好友', icon: <Heart size={16} /> },
    { id: 'citizen', label: '在地空投', icon: <MapPin size={16} /> },
    { id: 'id', label: '定向送禮', icon: <Search size={16} /> },
  ];

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
            className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-gold-primary/30 rounded-t-[2.5rem] z-[301] p-8 pb-12"
          >
            <div className="max-w-md mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black gold-gradient-text italic tracking-tighter">{storeName}</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">下單與送禮面板</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-gold-primary"><X size={20} /></button>
              </div>

              {/* Quantity Selector */}
              <div className="bg-black/40 p-6 rounded-3xl border border-white/10 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white">點餐份數</span>
                  <p className="text-[10px] text-gray-500 uppercase">每份 ${basePrice} L-Coin</p>
                </div>
                <div className="flex items-center gap-6 bg-zinc-800 p-2 rounded-2xl border border-white/5">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-gold-primary hover:bg-gold-primary/20 transition-all"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-8 text-center font-black font-mono text-xl text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-gold-primary hover:bg-gold-primary/20 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Recipient Selector */}
              <div className="space-y-4">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">選擇送禮對象</p>
                <div className="grid grid-cols-3 gap-3">
                  {recipients.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRecipient(r.id as any)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${recipient === r.id ? 'bg-gold-primary/20 border-gold-primary text-gold-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                    >
                      <div className={`${recipient === r.id ? 'text-gold-primary' : 'text-gray-500'}`}>
                        {r.icon}
                      </div>
                      <span className="text-[10px] font-black tracking-tight">{r.label}</span>
                    </button>
                  ))}
                </div>

                {recipient === 'id' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    <input 
                      type="text"
                      placeholder="輸入帝國編號 (如 L-001)"
                      value={recipientId}
                      onChange={(e) => setRecipientId(e.target.value)}
                      className="w-full bg-black/40 border border-gold-primary/30 rounded-xl py-4 px-12 text-sm text-white focus:border-gold-primary outline-none transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-primary/40" size={18} />
                  </motion.div>
                )}

                {recipient === 'citizen' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gold-primary/5 border border-gold-primary/20 rounded-xl flex items-center gap-3"
                  >
                    <Users size={18} className="text-gold-primary" />
                    <p className="text-[10px] text-gold-primary font-bold uppercase tracking-widest">已自動鎖定商圈內 12 位活躍用戶</p>
                  </motion.div>
                )}
              </div>

              {/* Summary */}
              <div className="bg-black/60 p-6 rounded-3xl border border-gold-primary/20 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">預計總額</p>
                  <p className="text-3xl font-black font-mono gold-gradient-text">${totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">規費分配</p>
                  <p className="text-[10px] text-gold-primary/60 font-bold">8% 國庫 | 1% 公益 | 1% 回饋</p>
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                className="w-full py-5 bg-gradient-to-r from-gold-dark via-gold-primary to-gold-dark text-black font-black text-lg uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <ShoppingBag size={20} />
                確認下單
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
