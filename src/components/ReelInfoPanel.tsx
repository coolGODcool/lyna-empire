import React from "react";
import { motion } from "motion/react";
import { X, ShoppingBag, Play, Heart, ShieldCheck, ExternalLink } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface VideoPreview {
  id: string;
  thumbnail: string;
  likes: string;
}

interface ReelInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'merchant' | 'user';
  data: {
    name: string;
    avatar: string;
    description: string;
    isFriendly?: boolean;
    products?: Product[];
    videos?: VideoPreview[];
  };
}

export default function ReelInfoPanel({ isOpen, onClose, type, data }: ReelInfoPanelProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className={`absolute inset-0 z-[150] flex flex-col ${
        data.isFriendly ? "bg-cyan-950/90" : "bg-black/90"
      } backdrop-blur-2xl`}
    >
      {/* Header */}
      <div className="p-6 pt-24 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-primary shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white italic tracking-tighter">{data.name}</h3>
              {data.isFriendly && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/40 rounded-full">
                  <ShieldCheck size={10} className="text-cyan-400" />
                  <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">情義守護</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 font-bold line-clamp-1">{data.description}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        {type === 'merchant' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-gold-primary uppercase tracking-[0.2em]">熱賣商品清單</h4>
              <span className="text-[10px] text-gray-500 font-bold">共 {data.products?.length || 0} 件商品</span>
            </div>
            <div className="grid gap-4">
              {data.products?.map((product) => (
                <div key={product.id} className="flex gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-primary/30 transition-all group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h5 className="text-sm font-black text-white line-clamp-1">{product.name}</h5>
                      <p className="text-lg font-black font-mono text-gold-primary mt-1">${product.price.toLocaleString()}</p>
                    </div>
                    <button className="self-end px-4 py-1.5 bg-gold-primary text-black text-[10px] font-black rounded-lg shadow-[0_0_10px_rgba(212,175,55,0.2)] active:scale-95 transition-all">
                      立即下單
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button className="text-sm font-black text-gold-primary border-b-2 border-gold-primary pb-1">作品集</button>
                <button className="text-sm font-black text-gray-500 hover:text-gray-300 transition-colors pb-1">帶貨榜</button>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                <TrendingUp size={12} className="text-gold-primary" />
                <span className="text-[9px] font-black text-gray-400 uppercase">按讚數排序</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {data.videos?.map((video) => (
                <div key={video.id} className="aspect-[3/4] rounded-xl overflow-hidden relative group cursor-pointer">
                  <img src={video.thumbnail} alt="Video" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
                    <Heart size={10} className="text-white fill-white" />
                    <span className="text-[9px] font-black text-white">{video.likes}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={24} className="text-white fill-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Content - Promotional Videos */}
        <div className="space-y-4 pt-4">
          <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">更多宣傳影片</h4>
          <div className="aspect-video rounded-3xl overflow-hidden relative border border-white/10">
            <img src="https://picsum.photos/seed/promo/800/450" alt="Promo" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-12 h-12 rounded-full bg-gold-primary/20 backdrop-blur-md border border-gold-primary/40 flex items-center justify-center text-gold-primary">
                <Play size={24} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { TrendingUp } from "lucide-react";
