import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Info, Calculator, Store, Phone, MapPin, Clock, Image as ImageIcon, FileText, Gift, RotateCcw } from "lucide-react";

interface JoinEmpireProps {
  onClose: () => void;
  userId: string;
}

const JoinEmpire = ({ onClose, userId }: JoinEmpireProps) => {
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({
    storeName: "",
    category: "餐飲",
    hours: "",
    phone: "",
    address: "",
    imageUrl: "",
    description: "",
    promoCode: "",
    paymentType: "l-coin", // l-coin, cash
    features: {
      phoneAuto: false,
      calendar: false,
      aiService: false,
      dashboard: false,
      marquee: false,
    },
    agreed: false
  });

  const [isStamping, setIsStamping] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // 規費計算邏輯
  const calculateTax = () => {
    let base = formData.paymentType === "l-coin" ? 3.0 : 8.0;
    // 如果是特許價邏輯，初始顯示 4.0% 但 L-Coin 扣減
    // 根據指令：基礎設施包 (必選 4.0%)，L-Coin 特權 3.0%
    let total = base;
    
    if (formData.features.phoneAuto) total += 2.0;
    if (formData.features.calendar) total += 2.0;
    if (formData.features.aiService) total += 3.0;
    if (formData.features.dashboard) total += 2.0;
    if (formData.features.marquee) total += 1.0;
    
    return total.toFixed(1);
  };

  const handleSubmit = () => {
    if (!formData.agreed) return;
    setIsStamping(true);
    
    // 模擬壓印震動與延遲
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    
    setTimeout(() => {
      setStep("success");
      setIsStamping(false);
    }, 1000);
  };

  const shopUrl = `${window.location.origin}/?shopId=${userId}`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1a120b] bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')] overflow-y-auto p-4"
    >
      <AnimatePresence mode="wait">
        {step === "form" ? (
          <motion.div 
            key="form"
            initial={{ y: 100, opacity: 0, rotateX: 45 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: -100, opacity: 0, rotateX: -45 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-full max-w-2xl parchment p-8 md:p-12 my-8 min-h-[80vh] flex flex-col"
          >
            {/* Parchment Burnt Edges Effect */}
            <div className="parchment-edge" />
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-black/20 to-transparent" />
            
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#5d4037] hover:bg-black/5 rounded-full z-20">
              <X size={24} />
            </button>

            <div className="relative z-10 space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-black text-[#5d4037] italic tracking-tighter border-b-2 border-[#5d4037]/20 pb-4">萊娜帝國加盟契約</h2>
                <p className="text-xs text-[#8d6e63] font-bold uppercase tracking-[0.3em]">Imperial Franchise Covenant</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 左側：基本資料 */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#5d4037]/60 uppercase flex items-center gap-1">
                      <Store size={12} /> 店名
                    </label>
                    <input 
                      type="text" 
                      placeholder="您的領地名稱"
                      className="w-full bg-white/20 border-b-2 border-[#d4af37]/30 focus:border-[#d4af37] outline-none py-2 px-1 text-[#5d4037] font-bold placeholder:text-[#5d4037]/30"
                      value={formData.storeName}
                      onChange={e => setFormData({...formData, storeName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#5d4037]/60 uppercase flex items-center gap-1">
                      <FileText size={12} /> 類別
                    </label>
                    <select 
                      className="w-full bg-white/20 border-b-2 border-[#d4af37]/30 focus:border-[#d4af37] outline-none py-2 px-1 text-[#5d4037] font-bold"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      {["餐飲", "美容", "交通", "住宿", "零售", "娛樂"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#5d4037]/60 uppercase flex items-center gap-1">
                      <Clock size={12} /> 營業時間
                    </label>
                    <input 
                      type="text" 
                      placeholder="例: 10:00 - 22:00"
                      className="w-full bg-white/20 border-b-2 border-[#d4af37]/30 focus:border-[#d4af37] outline-none py-2 px-1 text-[#5d4037] font-bold placeholder:text-[#5d4037]/30"
                      value={formData.hours}
                      onChange={e => setFormData({...formData, hours: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#5d4037]/60 uppercase flex items-center gap-1">
                      <Phone size={12} /> 聯絡電話
                    </label>
                    <input 
                      type="tel" 
                      placeholder="領主聯絡專線"
                      className="w-full bg-white/20 border-b-2 border-[#d4af37]/30 focus:border-[#d4af37] outline-none py-2 px-1 text-[#5d4037] font-bold placeholder:text-[#5d4037]/30"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                {/* 右側：進階資料 */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#5d4037]/60 uppercase flex items-center gap-1">
                      <MapPin size={12} /> 地址
                    </label>
                    <input 
                      type="text" 
                      placeholder="領地座標"
                      className="w-full bg-white/20 border-b-2 border-[#d4af37]/30 focus:border-[#d4af37] outline-none py-2 px-1 text-[#5d4037] font-bold placeholder:text-[#5d4037]/30"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#5d4037]/60 uppercase flex items-center gap-1">
                      <ImageIcon size={12} /> 點擊上傳或拍照店面形象圖
                    </label>
                    <div className="relative group mt-1">
                      {formData.imageUrl ? (
                        <div className="relative w-full h-24 rounded-lg overflow-hidden border-2 border-[#d4af37]/40 shadow-inner">
                          <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setFormData({ ...formData, imageUrl: "" })}
                            className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                            title="重新上傳"
                          >
                            <RotateCcw size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#d4af37]/30 rounded-lg cursor-pointer hover:bg-[#d4af37]/5 transition-all group">
                          <ImageIcon size={20} className="text-[#d4af37]/50 mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] font-bold text-[#5d4037]/40">選擇圖片或開啟相機</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#5d4037]/60 uppercase flex items-center gap-1">
                      <Gift size={12} /> 早鳥優惠碼
                    </label>
                    <input 
                      type="text" 
                      placeholder="輸入 CEO5566 解鎖福利"
                      className="w-full bg-white/20 border-b-2 border-[#d4af37]/30 focus:border-[#d4af37] outline-none py-2 px-1 text-[#5d4037] font-bold placeholder:text-[#5d4037]/30"
                      value={formData.promoCode}
                      onChange={e => setFormData({...formData, promoCode: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#5d4037]/60 uppercase flex items-center gap-1">
                      <FileText size={12} /> 菜單簡介
                    </label>
                    <textarea 
                      placeholder="描述您的特色菜單..."
                      className="w-full bg-white/20 border border-[#d4af37]/30 rounded p-2 focus:border-[#d4af37] outline-none text-[#5d4037] font-medium text-xs h-16"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* 核心商業規則：規費邏輯 */}
              <div className="bg-[#5d4037]/5 p-6 rounded-xl border-2 border-[#d4af37]/20 space-y-4">
                <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="text-[#d4af37]" />
                    <h3 className="font-black text-[#5d4037]">開國特許規費計算</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#8d6e63]">預計規費</p>
                    <p className="text-3xl font-black text-[#d4af37]">{calculateTax()}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-white/40 rounded-lg border border-[#d4af37]/30">
                    <p className="text-xs font-black text-[#5d4037] flex items-center justify-between">
                      <span>基礎設施包 (必選 4.0%)</span>
                      <span className="text-[10px] bg-[#d4af37] text-white px-2 py-0.5 rounded">開國特許價</span>
                    </p>
                    <p className="text-[9px] text-[#8d6e63] mt-1">內含：AI八國翻譯、語音報單、L-Coin結算、國際換匯</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setFormData({...formData, paymentType: 'l-coin'})}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${formData.paymentType === 'l-coin' ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-[#d4af37]/20 opacity-60'}`}
                    >
                      <p className="text-[10px] font-black text-[#5d4037]">L-Coin 支付特權</p>
                      <p className="text-xs font-bold text-[#d4af37]">規費僅 3.0%</p>
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, paymentType: 'cash'})}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${formData.paymentType === 'cash' ? 'border-[#5d4037] bg-[#5d4037]/10' : 'border-[#5d4037]/20 opacity-60'}`}
                    >
                      <p className="text-[10px] font-black text-[#5d4037]">現金/第三方支付</p>
                      <p className="text-xs font-bold text-[#8d6e63]">規費 8.0%</p>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-[#5d4037]/60 uppercase tracking-widest">自由選配模組</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <FeatureCheckbox 
                        label="電話自動接單 (+2.0%)" 
                        checked={formData.features.phoneAuto} 
                        onChange={v => setFormData({...formData, features: {...formData.features, phoneAuto: v}})} 
                      />
                      <FeatureCheckbox 
                        label="雙向日曆同步 (+2.0%)" 
                        checked={formData.features.calendar} 
                        onChange={v => setFormData({...formData, features: {...formData.features, calendar: v}})} 
                      />
                      <FeatureCheckbox 
                        label="AI 智能客服 (+3.0%)" 
                        checked={formData.features.aiService} 
                        onChange={v => setFormData({...formData, features: {...formData.features, aiService: v}})} 
                      />
                      <FeatureCheckbox 
                        label="經營戰情室 (+2.0%)" 
                        checked={formData.features.dashboard} 
                        onChange={v => setFormData({...formData, features: {...formData.features, dashboard: v}})} 
                      />
                      <FeatureCheckbox 
                        label="黑金會員/跑馬燈 (+1.0%)" 
                        checked={formData.features.marquee} 
                        onChange={v => setFormData({...formData, features: {...formData.features, marquee: v}})} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 誠信條款與提交 */}
              <div className="pt-6 space-y-6 flex flex-col items-center">
                <label className="flex items-start gap-3 cursor-pointer group max-w-md">
                  <input 
                    type="checkbox" 
                    className="mt-1 accent-[#5d4037]"
                    checked={formData.agreed}
                    onChange={e => setFormData({...formData, agreed: e.target.checked})}
                  />
                  <span className="text-[10px] leading-tight text-[#5d4037] font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    我在此宣誓效忠萊娜帝國，並承諾誠實申報所有營業額。若有欺瞞，願受帝國法律裁決並永久撤銷領主資格。
                  </span>
                </label>

                <div className="relative">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSubmit}
                    disabled={!formData.agreed || isStamping}
                    className={`wax-seal-btn ${formData.agreed ? 'opacity-100' : 'opacity-30 grayscale cursor-not-allowed'}`}
                  >
                    <div className="wax-seal-inner">
                      <span className="text-[#f4e4bc] font-black text-xl tracking-tighter">萊娜</span>
                      <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                    </div>
                  </motion.button>
                  {isStamping && (
                    <motion.div 
                      initial={{ scale: 2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 bg-[#b71c1c] rounded-full blur-xl"
                    />
                  )}
                </div>
                <p className="text-[10px] font-black text-[#5d4037] uppercase tracking-widest">點擊封蠟以完成壓印</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="parchment p-12 max-w-md text-center space-y-8 relative"
          >
            <div className="parchment-edge" />
            <div className="space-y-4">
              <div className="w-20 h-20 bg-green-800/20 rounded-full flex items-center justify-center mx-auto border-2 border-green-800/40">
                <Check size={40} className="text-green-800" />
              </div>
              <h2 className="text-3xl font-black text-[#5d4037] italic">契約已生效</h2>
              <p className="text-sm text-[#8d6e63] font-bold">恭喜領主，您的領地已正式納入萊娜帝國版圖。</p>
            </div>

            <div className="space-y-4 p-6 bg-white/40 rounded-2xl border-2 border-[#d4af37]/30">
              <p className="text-xs font-black text-[#5d4037] uppercase tracking-widest">您的專屬領地 QR Code</p>
              <div className="relative p-4 bg-white rounded-xl shadow-inner flex justify-center items-center">
                {/* 金色發光外框 */}
                <div className="absolute inset-0 border-4 border-[#d4af37] rounded-xl animate-pulse pointer-events-none" />
                <div className="relative">
                  <img 
                    src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(shopUrl)}&choe=UTF-8`}
                    alt="Shop QR Code"
                    className="w-[200px] h-[200px]"
                  />
                  {/* 中央頭像 */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 bg-white p-0.5 rounded-lg border-2 border-[#d4af37] overflow-hidden shadow-lg">
                      <img 
                        src="/IMG_4166.PNG" 
                        alt="Lyna" 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-[#8d6e63] break-all">{shopUrl}</p>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-4 bg-[#5d4037] text-[#f4e4bc] font-black rounded-xl shadow-lg active:scale-95 transition-all"
            >
              返回帝國大廳
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .parchment {
          background-color: #f4e4bc;
          background-image: url('https://www.transparenttextures.com/patterns/old-map.png');
          border: 12px border-[#8d6e63] border-double;
          box-shadow: 0 0 50px rgba(0,0,0,0.5);
          border-style: double;
          border-width: 12px;
          border-color: #8d6e63;
        }
        .parchment-edge {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border: 20px solid transparent;
          border-image: radial-gradient(circle, transparent 70%, rgba(60,40,20,0.2) 100%) 30;
          filter: blur(2px);
        }
        .wax-seal-btn {
          width: 100px;
          height: 100px;
          background: #b71c1c;
          border-radius: 50%;
          padding: 6px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
          border: 4px solid #880e4f;
          transition: all 0.2s;
        }
        .wax-seal-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 30% 30%, #d32f2f, #b71c1c);
          position: relative;
        }
      `}</style>
    </motion.div>
  );
};

const FeatureCheckbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
  <label className="flex items-center gap-2 cursor-pointer group">
    <div 
      onClick={() => onChange(!checked)}
      className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${checked ? 'bg-[#5d4037] border-[#5d4037]' : 'border-[#5d4037]/30 bg-white/20'}`}
    >
      {checked && <Check size={10} className="text-[#f4e4bc]" />}
    </div>
    <span className={`text-[10px] font-bold transition-colors ${checked ? 'text-[#5d4037]' : 'text-[#5d4037]/50'}`}>{label}</span>
  </label>
);

export default JoinEmpire;
