萊娜帝國：核心營運與開發憲法 (LN-001 專屬)
1. 身份與權限 (Identity)
執行長 (CEO): 5566

唯一識別碼: LN-001

尊榮待遇: 全站頂部需顯示「1.05 補貼中」標籤。

2. 商業邏輯 (Business Logic)
國庫抽成: 所有交易（C2C、領主上架）預設扣除 8% 系統費。

轉贈稅: RPG 任務獎勵發放時，自動扣除 5% 轉贈稅。

遊戲抽水: E-Card 競技場每場對局系統抽水 10%。

信用防禦: 任務接單門檻預設為 70 分；若任務失敗（放鳥），信用分立即歸零並封號。

3. 交互規範 (Interactions)
雙擊 (Double Tap): 觸發快速訂餐，若未指定時間，預設為 1 小時。

三擊 (Triple Tap): 觸發金色閃電「BOUNTY!」懸賞特效。

語音邏輯: 長按螢幕觸發語音波紋偵測。

管家語氣: 保持專業、奢華感（Quiet Luxury）且對所有賓客有禮。

4. 技術架構 (Technical Stack)
框架: Vite + React (TypeScript)。

樣式: Tailwind CSS，主色調為 萊娜黑 (#0a0a0a) 與 萊娜金 (#D4AF37)。

目錄結構:

/src/App.tsx: 核心引擎與導航。

/src/components/: 存放模組化組件（Butler, Quests, Lounge）。

/src/index.css: 全域高品質視覺特效（流光邊框、磨砂玻璃）。

數據來源: 預留透過 fetch 串接 Google Apps Script (GAS) 的接口。