import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Heart, Users, Crown, Minus, Plus, ShoppingBag } from "lucide-react";

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  onConfirm: (data: OrderData) => void;
}

export interface OrderData {
  quantity: number;
  recipient: 'me' | 'family' | 'citizen' | 'boss';
  extraQuantity: number;
  totalAmount: number;
}

export default function OrderDrawer({ isOpen, onClose, storeName, onConfirm }: OrderDrawerProps) {
  const [quantity, setQuantity] = useState(1);
  const [extraQuantity, setExtraQuantity] = useState(0);
  const [recipient, setRecipient] = useState<'me' | 'family' | 'citizen' | 'boss'>('me');

  const basePrice = 150; // Mock base price
  const totalQuantity = quantity + extraQuantity;
  const totalAmount = totalQuantity * basePrice;

  const handleConfirm = () => {
    onConfirm({
      quantity,
      recipient,
      extraQuantity,
      totalAmount
    });
    onClose();
  };

  const recipients = [
    { id: 'me', label: '我自己', icon: <User size={16} /> },
    { id: 'family', label: '女友/家人', icon: <Heart size={16} /> },
    { id: 'citizen', label: '現場子民(空投)', icon: <Users size={16} /> },
    { id: 'boss', label: '犒賞老闆(誠信+5)', icon: <Crown size={16} /> },
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
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">自訂下單面板</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-gold-primary"><X size={20} /></button>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white">點餐份數 (我自己)</span>
                  <div className="flex items-center gap-4 bg-black/40 p-1 rounded-full border border-white/10">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gold-primary hover:bg-gold-primary/10"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-black font-mono text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gold-primary hover:bg-gold-primary/10"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white">多帶幾份給他人？</span>
                  <div className="flex items-center gap-4 bg-black/40 p-1 rounded-full border border-white/10">
                    <button 
                      onClick={() => setExtraQuantity(Math.max(0, extraQuantity - 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gold-primary hover:bg-gold-primary/10"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-black font-mono text-white">{extraQuantity}</span>
                    <button 
                      onClick={() => setExtraQuantity(extraQuantity + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gold-primary hover:bg-gold-primary/10"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Recipient Selector */}
              <div className="space-y-3">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">選擇送禮對象</p>
                <div className="grid grid-cols-2 gap-3">
                  {recipients.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRecipient(r.id as any)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${recipient === r.id ? 'bg-gold-primary/20 border-gold-primary text-gold-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                    >
                      <div className={`${recipient === r.id ? 'text-gold-primary' : 'text-gray-500'}`}>
                        {r.icon}
                      </div>
                      <span className="text-xs font-black tracking-tight">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary & Fee Logic */}
              <div className="bg-black/60 p-6 rounded-3xl border border-gold-primary/20 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">預計總額</p>
                    <p className="text-3xl font-black font-mono gold-gradient-text">${totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">規費分配</p>
                    <p className="text-[10px] text-gold-primary/60 font-bold">8% 國庫 | 1% 公益 | 1% 回饋</p>
                  </div>
                </div>
                
                {recipient === 'boss' && (
                  <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                    <Crown size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">此筆交易將增加誠信分 +5</span>
                  </div>
                )}
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
