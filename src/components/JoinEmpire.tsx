import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Info, Calculator, Store, Phone, MapPin, Clock, Image as ImageIcon, FileText, RotateCcw } from "lucide-react";

interface JoinEmpireProps {
  onClose: () => void;
  userId: string;
}

const JoinEmpire = ({ onClose, userId }: JoinEmpireProps) => {
  const [step, setStep] = useState<"form" | "success">("form");
  const [showTerms, setShowTerms] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    category: "餐飲",
    operatingDays: ["一", "二", "三", "四", "五"],
    hours: "10:00 - 22:00",
    phone: "",
    address: "",
    businessDistrict: "鳳山維新路",
    customDistrict: "",
    imageUrl: "",
    description: "",
    features: {
      lcoinPrivilege: true,
      invoice: false,
      phoneAuto: false,
      aiService: false,
      dashboard: false,
      design: false,
      marquee: false,
    },
    privileges: [] as string[],
    agreed: false
  });

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      operatingDays: prev.operatingDays.includes(day)
        ? prev.operatingDays.filter(d => d !== day)
        : [...prev.operatingDays, day]
    }));
  };

  const togglePrivilege = (priv: string) => {
    setFormData(prev => ({
      ...prev,
      privileges: prev.privileges.includes(priv)
        ? prev.privileges.filter(p => p !== priv)
        : [...prev.privileges, priv]
    }));
  };

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

  // 規費計算邏輯 (6/4 法則)
  const calculateTax = () => {
    // 基礎服務使用費：6.0% (含 AI 選單、雲端語音報單)
    // L-Coin 支付特權：勾選後降至 4.0%
    let base = formData.features.lcoinPrivilege ? 4.0 : 6.0;
    let total = base;
    
    if (formData.features.invoice) total += 3.0;
    if (formData.features.phoneAuto) total += 2.0;
    if (formData.features.aiService) total += 3.0;
    if (formData.features.dashboard) total += 2.0;
    if (formData.features.design) total += 2.0;
    if (formData.features.marquee) total += 1.0;
    
    return total.toFixed(1);
  };

  const handleSubmit = () => {
    if (!formData.agreed) return;
    setIsStamping(true);
    
    // 模擬壓印震動與延遲
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    
    setTimeout(() => {
      setStep("success");
      setIsStamping(false);
    }, 1200);
  };

  const shopUrl = `${window.location.origin}/?shopId=${userId}`;

  const days = ["一", "二", "三", "四", "五", "六", "日"];
  const districts = ["鳳山維新路", "青年夜市", "中華街觀光夜市", "其他 (自定義)"];
  const privilegeGroups = [
    ["接受預約訂位", "接受現場排隊", "支援自主外送", "支援客製化要求"],
    ["寵物友善", "設有專屬停車位", "鄰近公有停車位", "設有洗手間"],
    ["提供內用座位", "提供兒童座椅", "提供插座借用", "提供免費 Wi-Fi"]
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#1a120b] bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')] overflow-y-auto p-4 flex justify-center"
    >
      <AnimatePresence mode="wait">
        {step === "form" ? (
          <motion.div 
            key="form"
            initial={{ y: 100, opacity: 0, rotateX: 45 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: -100, opacity: 0, rotateX: -45 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-full max-w-3xl parchment p-8 md:p-12 my-8 min-h-fit flex flex-col"
          >
            {/* Parchment Burnt Edges Effect */}
            <div className="parchment-edge" />
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-black/20 to-transparent" />
            
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#5d4037] hover:bg-black/5 rounded-full z-20">
              <X size={24} />
            </button>

            <div className="relative z-10 space-y-8">
              {/* Soul Logo */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-center py-4"
              >
                <h1 className="soul-logo text-5xl md:text-6xl font-bold tracking-[0.2em]">
                  以誠為本 逆天改命
                </h1>
              </motion.div>

              <div className="text-center space-y-2">
                <h2 className="text-4xl font-black text-[#5d4037] italic tracking-tighter border-b-2 border-[#5d4037]/20 pb-4">萊娜帝國加盟契約</h2>
                <p className="text-xs text-[#8d6e63] font-bold uppercase tracking-[0.3em]">Imperial Franchise Covenant</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 左側：基本資料 */}
                <div className="space-y-6">
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

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#5d4037]/60 uppercase flex items-center gap-1">
                      <Clock size={12} /> 營業時段 (週一至週日)
                    </label>
                    <div className="flex gap-1 mb-2">
                      {days.map(day => (
                        <button
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`w-8 h-8 rounded-full text-[10px] font-black transition-all border ${
                            formData.operatingDays.includes(day)
                              ? "bg-[#5d4037] text-[#f4e4bc] border-[#5d4037]"
                              : "bg-white/20 text-[#5d4037]/40 border-[#5d4037]/20 hover:border-[#5d4037]/40"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      placeholder="每日固定營業時段 (例: 10:00 - 22:00)"
                      className="w-full bg-white/20 border-b-2 border-[#d4af37]/30 focus:border-[#d4af37] outline-none py-2 px-1 text-[#5d4037] font-bold placeholder:text-[#5d4037]/30"
                      value={formData.hours}
                      onChange={e => setFormData({...formData, hours: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#5d4037]/60 uppercase flex items-center gap-1">
                      <MapPin size={12} /> 所屬商圈
                    </label>
                    <select 
                      className="w-full bg-white/20 border-b-2 border-[#d4af37]/30 focus:border-[#d4af37] outline-none py-2 px-1 text-[#5d4037] font-bold mb-2"
                      value={formData.businessDistrict}
                      onChange={e => setFormData({...formData, businessDistrict: e.target.value})}
                    >
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {formData.businessDistrict === "其他 (自定義)" && (
                      <input 
                        type="text" 
                        placeholder="請輸入商圈名稱"
                        className="w-full bg-white/20 border-b-2 border-[#d4af37]/30 focus:border-[#d4af37] outline-none py-2 px-1 text-[#5d4037] font-bold placeholder:text-[#5d4037]/30"
                        value={formData.customDistrict}
                        onChange={e => setFormData({...formData, customDistrict: e.target.value})}
                      />
                    )}
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
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#5d4037]/60 uppercase flex items-center gap-1">
                      <MapPin size={12} /> 詳細地址
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
                      <FileText size={12} /> 領地簡介
                    </label>
                    <textarea 
                      placeholder="描述您的領地特色..."
                      className="w-full bg-white/20 border border-[#d4af37]/30 rounded p-2 focus:border-[#d4af37] outline-none text-[#5d4037] font-medium text-xs h-24"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* 領地服務特權 */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#5d4037]/60 uppercase tracking-widest flex items-center gap-2">
                  <Check size={14} className="text-[#d4af37]" /> 領地服務特權 (可複選)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/10 p-4 rounded-xl border border-[#d4af37]/20">
                  {privilegeGroups.map((group, idx) => (
                    <div key={idx} className="space-y-2">
                      {group.map(priv => (
                        <FeatureCheckbox 
                          key={priv}
                          label={priv}
                          checked={formData.privileges.includes(priv)}
                          onChange={() => togglePrivilege(priv)}
                        />
                      ))}
                    </div>
                  ))}
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
                      <span>基礎規費 (6.0%)</span>
                      <span className="text-[10px] bg-[#d4af37] text-white px-2 py-0.5 rounded">
                        開國特許價
                      </span>
                    </p>
                    <p className="text-[9px] text-[#8d6e63] mt-1">內含：AI 全球語系動態選單、雲端語音報單系統</p>
                    <p className="text-[9px] font-black text-[#5d4037] mt-1 italic">※ 優先推廣 L-Coin 支付可享優惠規費 4.0%</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-[#5d4037]/60 uppercase tracking-widest">加值功能選配</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <FeatureCheckbox 
                        label="L-Coin 支付特權 (規費降至 4.0%)" 
                        checked={formData.features.lcoinPrivilege} 
                        onChange={v => setFormData({...formData, features: {...formData.features, lcoinPrivilege: v}})} 
                        highlight
                      />
                      <FeatureCheckbox 
                        label="電子發票代開 (+3.0%)" 
                        checked={formData.features.invoice} 
                        onChange={v => setFormData({...formData, features: {...formData.features, invoice: v}})} 
                      />
                      <FeatureCheckbox 
                        label="電話自動接單 (+2.0%)" 
                        checked={formData.features.phoneAuto} 
                        onChange={v => setFormData({...formData, features: {...formData.features, phoneAuto: v}})} 
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
                        label="視覺美編優化 (+2.0%)" 
                        checked={formData.features.design} 
                        onChange={v => setFormData({...formData, features: {...formData.features, design: v}})} 
                      />
                      <FeatureCheckbox 
                        label="黑金會員/跑馬燈 (+1.0%)" 
                        checked={formData.features.marquee} 
                        onChange={v => setFormData({...formData, features: {...formData.features, marquee: v}})} 
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-white/40 border border-[#d4af37]/30 rounded-lg space-y-2">
                    <p className="text-[11px] font-black text-[#5d4037] flex items-center gap-2">
                      <Calculator size={14} className="text-[#d4af37]" />
                      提現出口匯率 (L-Coin Exit Rate)
                    </p>
                    <p className="text-[10px] text-[#8d6e63] leading-relaxed">
                      領主結算權利：領主可隨時申請將帳戶內累積之 L-Coin 結算為新台幣，結算匯率統一為 <span className="font-black text-[#5d4037]">1 : 0.9</span>（例：1,000 L-Coin 可換回 900 元新台幣）。
                    </p>
                    <p className="text-[9px] font-bold text-[#5d4037] italic opacity-80 pt-1 border-t border-[#d4af37]/10">
                      本帝國透過入口 1.05 與出口 0.9 之匯率調控，確保領地生態系之價值穩定與營運維護。
                    </p>
                  </div>

                  <div className="mt-4 p-3 bg-red-900/5 border border-red-900/20 rounded-lg">
                    <p className="text-[10px] font-bold text-red-900 leading-relaxed flex gap-2">
                      <Info size={14} className="shrink-0" />
                      <span>第三方金流（LINE Pay/信用卡）之手續費由領主負擔，萊娜服務費僅為系統使用規費。</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 誠信條款與提交 */}
              <div className="pt-6 space-y-6 flex flex-col items-center">
                <div className="space-y-4 text-center max-w-md">
                  <div className="flex flex-col items-center gap-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="mt-1 accent-[#5d4037]"
                        checked={formData.agreed}
                        onChange={e => setFormData({...formData, agreed: e.target.checked})}
                      />
                      <span className="text-[10px] leading-tight text-[#5d4037] font-black opacity-90 group-hover:opacity-100 transition-opacity">
                        我已閱讀並同意加盟服務條款，承諾誠實經營並確保品質。
                      </span>
                    </label>
                    <button 
                      onClick={() => setShowTerms(true)}
                      className="text-[10px] font-black text-[#d4af37] underline decoration-dotted underline-offset-4 hover:text-[#5d4037] transition-colors"
                    >
                      查看詳細條文
                    </button>
                  </div>
                  <p className="text-[9px] text-red-900 font-bold italic opacity-70">
                    ⚠️ 萊娜帝國以誠信為本。凡蓄意欺瞞營業額者，本帝國保有最終裁決權，得永久撤銷其領主資格。
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <p className="text-xs font-black text-[#5d4037] tracking-widest">
                    提現匯率：<span className="text-lg text-[#5d4037]">1 : 0.9</span>
                  </p>
                  <div className="relative">
                    <motion.button 
                      animate={isStamping ? {
                        x: [0, -5, 5, -5, 5, 0],
                        y: [0, 5, -5, 5, -5, 0],
                        scale: [1, 0.9, 1.1, 0.9, 1]
                      } : {}}
                      transition={isStamping ? { duration: 0.2, repeat: 3 } : {}}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.7, rotate: -10 }}
                      onClick={handleSubmit}
                      disabled={!formData.agreed || isStamping}
                      className={`wax-seal-btn ${formData.agreed ? 'opacity-100' : 'opacity-30 grayscale cursor-not-allowed'}`}
                    >
                      <div className="wax-seal-inner shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
                        <span className="text-[#f4e4bc] font-black text-xl tracking-tighter drop-shadow-md">萊娜</span>
                        <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                      </div>
                    </motion.button>
                    {isStamping && (
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-[#b71c1c] rounded-full blur-3xl"
                      />
                    )}
                  </div>
                  <p className="text-[10px] font-black text-[#5d4037] uppercase tracking-widest">點擊封蠟以完成壓印</p>
                </div>
              </div>
            </div>

            {/* Detailed Terms Dialog */}
            <AnimatePresence>
              {showTerms && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                >
                  <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="parchment max-w-lg w-full p-8 relative max-h-[80vh] overflow-y-auto"
                  >
                    <button 
                      onClick={() => setShowTerms(false)}
                      className="absolute top-4 right-4 p-2 text-[#5d4037] hover:bg-black/5 rounded-full"
                    >
                      <X size={20} />
                    </button>
                    
                    <div className="space-y-6 text-[#5d4037]">
                      <h3 className="text-2xl font-black italic border-b-2 border-[#5d4037]/20 pb-2">領主加盟服務條約</h3>
                      
                      <div className="space-y-4 text-xs font-bold leading-relaxed">
                        <section className="space-y-2">
                          <p className="text-sm font-black text-[#d4af37]">第一條：領主身分與義務</p>
                          <p>● 身分定義：簽署本契約後，您將正式成為萊娜帝國之「領主」，擁有在其領地（店面）內使用萊娜系統、發放與收受 L-Coin 之權利。</p>
                          <p>● 數據誠信：領主承諾所有透過萊娜系統產生之交易（含現金、L-Coin、第三方支付）皆須如實申報。</p>
                          <p>● 品質保證：領主須確保食材品質、環境衛生及服務態度，不得損害帝國形象。</p>
                        </section>

                        <section className="space-y-2">
                          <p className="text-sm font-black text-[#d4af37]">第二條：規費與金流結算</p>
                          <p>● 系統使用費：基礎服務規費為 6.0%（包含 AI 全球語系選單、雲端語音報單、領主戰情室服務）。</p>
                          <p>● L-Coin 獎勵匯率：為鼓勵貨幣循環，凡子民使用 L-Coin 支付之交易，該筆規費自動調降至 4.0%。</p>
                          <p>● 第三方金流成本：使用 LINE Pay、信用卡等產生之金流平台手續費（約 3%-3.5%）由領主自行承擔。</p>
                          <p>● 提現出口匯率：領主申請將累積之 L-Coin 兌換為新台幣（TWD）時，統一採 1 : 0.9 之出口匯率結算。</p>
                        </section>

                        <section className="space-y-2">
                          <p className="text-sm font-black text-[#d4af37]">第三條：帝國裁決與違約處分</p>
                          <p>● 終極裁決權：萊娜帝國保有對系統規費、匯率調整及條文之最終解釋權。</p>
                          <p>● 誠信判定：若經系統偵測或子民舉報，確認領主有「刻意漏報金額」、「私下回兌現金」或「欺瞞子民」之行為，執行長保有一鍵撤銷領主資格之權力。</p>
                          <p>● 永久除名：凡違約被撤職者，該領地、UID 將永久黑名單化，且帝國得追究其規費損失之 10 倍損害賠償。</p>
                        </section>
                      </div>

                      <button 
                        onClick={() => setShowTerms(false)}
                        className="w-full py-3 bg-[#5d4037] text-[#f4e4bc] font-black rounded-xl"
                      >
                        我已充分知悉
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
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
        .soul-logo {
          font-family: "Kaiti", "STKaiti", "BiauKai", serif;
          background: linear-gradient(to bottom, #d4af37 22%, #f4e4bc 45%, #d4af37 50%, #8d6e63 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.4));
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
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

interface FeatureCheckboxProps {
  key?: string;
  label: string;
  checked: boolean;
  onChange: (v?: boolean) => void;
  highlight?: boolean;
}

const FeatureCheckbox = ({ label, checked, onChange, highlight }: FeatureCheckboxProps) => (
  <label className="flex items-center gap-2 cursor-pointer group">
    <div 
      onClick={() => onChange(!checked)}
      className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${checked ? 'bg-[#5d4037] border-[#5d4037]' : 'border-[#5d4037]/30 bg-white/20'}`}
    >
      {checked && <Check size={10} className="text-[#f4e4bc]" />}
    </div>
    <span className={`text-[10px] font-bold transition-colors ${checked ? 'text-[#5d4037]' : 'text-[#5d4037]/50'} ${highlight ? 'text-[#d4af37]' : ''}`}>{label}</span>
  </label>
);

export default JoinEmpire;
