import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp, DollarSign, PieChart, Gamepad2 } from 'lucide-react';

/**
 * Lounge.tsx - 交誼廳與戰情室
 * 包含子民模式 (社交/遊戲) 與 領主模式 (數據分析)
 */
export const LoungeTab = () => {
  const [mode, setMode] = useState('citizen'); // 'citizen' | 'lord'

  return (
    <div className="h-full pt-20 pb-24 px-4 bg-lyna-black overflow-y-auto custom-scroll">
      {/* 模式切換 */}
      <div className="flex frosted p-1 rounded-xl mb-8 border-lyna-gold/20">
        <button 
          onClick={() => setMode('citizen')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'citizen' ? 'bg-lyna-gold text-black' : 'text-gray-500'}`}
        >
          子民模式
        </button>
        <button 
          onClick={() => setMode('lord')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'lord' ? 'bg-lyna-gold text-black' : 'text-gray-500'}`}
        >
          領主戰情室
        </button>
      </div>

      {mode === 'citizen' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="frosted p-6 rounded-2xl flex flex-col items-center gap-3 border-lyna-gold/10">
              <Users className="text-lyna-gold" size={28} />
              <span className="text-xs font-bold">帝國社團</span>
            </div>
            <div className="frosted p-6 rounded-2xl flex flex-col items-center gap-3 border-lyna-gold/10 relative overflow-hidden group">
              <Gamepad2 className="text-lyna-gold" size={28} />
              <span className="text-xs font-bold">E-Card 對決</span>
              <div className="absolute top-0 right-0 bg-lyna-gold text-black text-[8px] px-2 py-0.5 font-black">抽水 10%</div>
            </div>
          </div>
          
          <div className="frosted p-5 rounded-2xl border-lyna-gold/10">
            <h4 className="text-lyna-gold text-sm font-bold mb-3 italic">熱門討論</h4>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="text-[11px] text-gray-400 border-b border-white/5 pb-2">
                  <span className="text-white">@子民_00{i}:</span> 這次的黑金和牛真的絕了...
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            <div className="frosted p-3 rounded-xl text-center">
              <DollarSign size={16} className="text-lyna-gold mx-auto mb-1" />
              <div className="text-[10px] text-gray-500">總營收</div>
              <div className="text-xs font-bold text-lyna-gold">12.5k</div>
            </div>
            <div className="frosted p-3 rounded-xl text-center">
              <Users size={16} className="text-lyna-gold mx-auto mb-1" />
              <div className="text-[10px] text-gray-500">回頭客</div>
              <div className="text-xs font-bold text-lyna-gold">88%</div>
            </div>
            <div className="frosted p-3 rounded-xl text-center">
              <PieChart size={16} className="text-lyna-gold mx-auto mb-1" />
              <div className="text-[10px] text-gray-500">L-Coin</div>
              <div className="text-xs font-bold text-lyna-gold">4.2k</div>
            </div>
          </div>

          <div className="frosted p-6 rounded-2xl border-lyna-gold/20">
            <h3 className="text-lyna-gold font-bold mb-6 italic flex items-center gap-2">
              <TrendingUp size={18} /> 領地實時戰報
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] mb-2">
                  <span className="text-gray-400">子民活躍度</span>
                  <span className="text-lyna-gold">92%</span>
                </div>
                <div className="h-1.5 bg-lyna-gray rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-lyna-gold" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-2">
                  <span className="text-gray-400">國庫抽成 (8%)</span>
                  <span className="text-lyna-gold">1,024 LC</span>
                </div>
                <div className="h-1.5 bg-lyna-gray rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-lyna-gold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
