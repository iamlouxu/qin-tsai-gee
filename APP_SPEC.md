# 🌸 沁菜記 (Qin Tsai Gee) - 極簡粉色記帳 Web App 規格書

> 本文件用於記錄「沁菜記」Web App 的產品定位、功能架構、UI/UX 設計規範與技術選型。

---

## 📌 1. 產品核心定位與視覺設計系統

* **產品名稱**：**沁菜記 (Qin Tsai Gee)**
* **產品形態**：**Mobile-First 響應式 Web App**（支援手機瀏覽器全螢幕體驗、PWA 離線安裝、桌面瀏覽器自動以 430px 手機比例置中呈現）。
* **核心定位**：取自「青菜記」台語諧音，象徵無壓力、隨手輕鬆記帳，結合 Mibu 極簡視覺與數據分析的粉色系個人財務管理工具。
* **設計風格與視覺參考**：融合 Dribbble [Mibu - Budget Expense Tracker & Finance App Design (by Girish)](https://dribbble.com/shots/23882234-Mibu-Budget-Expense-Tracker-Finance-App-Design) 之極簡財務指標與粉紅沉浸主題，以及 [MONOX - AI Finances Coach (by Alex Madyar)](https://dribbble.com/shots/27600112-MONOX-AI-Finances-Coach) 之實體圓角白底卡片、規格化圖標容器與 iOS 原生理性字體排版。

### 🎨 設計系統 Tokens：粉紅沉浸主題 (Pink Immersion Theme)
遵循現代 UI/UX 色彩與無障礙規範，讓整個頁面呈現一眼即識的精緻粉紅視覺：

1. **色彩系統 (WCAG 2.1 AA 嚴格對比保證)**：
   * **Page Background (頁面粉紅底色)**：`#FCE7F3` (Tailwind Pink-100) 至 `#FDF2F8` (Pink-50) 柔粉漸層，全頁呈現溫柔飽滿的粉紅氛圍。
   * **Hero Header / Main Card (粉紅漸層焦點卡)**：`linear-gradient(135deg, #FB7185 0%, #F43F5E 100%)` 搭配純白加粗大數字，營造 Mibu 頂部高質感焦點。
   * **Surface / Cards (內容卡片)**：純白毛玻璃 `rgba(255, 255, 255, 0.92)` 搭配 `backdrop-blur-md`，在粉紅底色上自然浮現。
   * **Primary Action 主色按鈕**：`#F43F5E` (Rose-500) / `#EC4899` (Pink-500)，點擊時具有粉光微互動。
   * **On-Primary**：`#FFFFFF` (對比度 > 4.5:1)。
   * **Text Primary (主要文字)**：`#831843` (深酒紅莓果色 Pink-900) 或 `#1E293B` (深石墨黑)，在粉紅底色與白卡上皆具備 **> 7:1 超高對比度**，清晰易讀。
   * **Text Muted (輔助文字)**：`#9D174D` (Pink-700 / 0.7) 與 `#64748B`。
   * **Expense (支出標示)**：`#E11D48` (鮮明玫瑰紅)。
   * **Income (收入標示)**：`#059669` (翡翠綠，高對比易讀)。
   * **Card Border & Dividers**：`#FBCFE8` (Pink-200 / 50%) 柔粉微邊線。
2. **排版系統 (Typography)**：
   * **英文與數字（UI & Metrics）**：`Inter` / `-apple-system` / `SF Pro`（現代 iOS 原生與頂級 Fintech 極簡無襯線，字重 400~800，高 x-height 與精確 tabular-nums 數字對齊，參考 MONOX 設計規範）。
   * **中文字體（繁體中文）**：`PingFang TC`（蘋果蘋方）與 `Noto Sans TC`（思源黑體），提供中英數字混排時最佳的筆劃平衡與字形穩定度。
   * **階層尺度**：Display 32~36px (總餘額大數字)、H1 20px、Body 15px、Caption 12px、Micro 10~11px。
3. **組件與互動規範 (UX & Interaction Standards)**：
   * **收支明細卡片**：採用 MONOX 風格實體白底圓角卡片（`rounded-2xl`，`bg-white` 搭配極致柔和陰影與淡邊線），圖標皆具備規格統一的微灰圓角底座（Icon Squircle Container）。
   * **圓角尺度**：大圓角卡片 `rounded-3xl` (24px)、項目卡片 `rounded-2xl` (16px)。
   * **觸控熱區**：所有按鈕與可點擊元素嚴格維持 **>= 44x44px** (Tab 項目 >= 48px)。
   * **圖示規範**：使用專業 **Lucide SVG 圖示** 與高質感類別 Emoji 容器。
   * **動效反饋**：微互動過渡時間 `150ms ~ 250ms ease-out`，Active 狀態輕微縮放 `scale(0.97)`。
   * **視窗安全區**：適配 iOS Safe Area (`env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`)。
   * **寬度約束**：最大寬度限制在 **430px** 手機比例，桌面瀏覽器下居中並附帶精緻外框與粉色光暈。

---

## 🧩 2. 核心功能模組

### 2.1 📅 自訂日期記帳模組 (Add Transaction)
* **日期自訂與選擇**：
  * 支援「今天」、「昨天」一鍵快捷選取。
  * 支援「日曆選擇器」，可任意補記過去或預約未來的帳目。
  * 支援自訂具體交易時間（時:分）。
* **收支與存錢類型**：
  * 支出 (Expense)
  * 收入 (Income)
  * 存入基金 (Savings Deposit - 專為結婚/目標基金設計)
* **記帳輸入欄位**：
  * 金額（大字體數字鍵盤或自帶計算器）
  * 記帳對象帳本切換（個人帳本 / 共同結婚基金）
  * 分類選擇（網格圖示：飲食、交通、購物、娛樂、居家、婚禮籌劃、蜜月、薪資等）
  * 備註說明（可填寫商家或備忘）
* **記錄者標記 (Contributor Tag)**：共同帳本下自動標註記錄者 Google 頭像與暱稱。

---

### 2.2 🏠 首頁總覽 (Dashboard)
* **頂部帳本切換膠囊 (Ledger Switcher)**：
  * 居中圓潤膠囊：可隨時一鍵切換 `[ 💍 我們的結婚基金 ▾ ]` 與 `[ 👤 我的日常私帳 ▾ ]`。
* **結婚基金存錢進度卡 (Wedding Savings Goal Card - 共同帳本專屬)**：
  * 目標總額（如：`$ 600,000`）、目前累積金額（`$ 380,000`）、達成率百分比（`63.3%`）。
  * 雙方貢獻佔比條（例：👦 培捷 52% · 👧 女友 48%）。
  * 里程碑徽章（如：📸 婚紗照基金達標、✈️ 蜜月機票達標）。
  * 存入時觸發粉色愛心/彩帶慶祝動效。
* **常規財務卡片 (Overview Card - 個人帳本)**：
  * 本月總餘額、本月總支出與總收入對比、預算消耗進度條。
* **支出趨勢微圖表 (Mini Spending Chart)**：
  * 顯示近 7 天 / 本月每週花費平滑曲線或直條圖。
* **近期明細清單 (Recent Transactions)**：
  * 依日期分組排序（如：8月30日 今天、8月29日 昨天）。
  * 單筆明細包含：分類圖示、備註、時間、金額、**記錄者迷你頭像（共同帳本下）**。
  * 支援點擊查看明細、編輯或向左滑動刪除。

---

### 2.3 📊 統計與分析 (Analytics & Reports)
* **視覺與排版風格**：參考極簡 Fintech 財務分析佈局（暗色概念轉化為粉紅沉浸主題），整合自訂互動柱狀圖與雙欄分類卡片。
* **頂部導航與收支切換 (Segmented Capsule)**：
  * 置中標題「財務分析」與兩側極簡圓形按鈕（返回、更多/重設選項）。
  * 支出 (Expenses) / 收入 (Income) 雙切換膠囊，白底高對比圓角滑塊與微陰影。
* **核心趨勢卡片 (Main Trend Card)**：
  * 左上角呈現當期總金額大字體（如 `NT$ 8,411`），右上角提供快速週期下拉選單（`週 (Week) ▾` / `月 (Month)` / `年 (Year)`）。
  * **互動式 7 天柱狀圖 (Interactive 7-Day Bar Chart)**：
    * 週一至週日 (Mon ~ Sun) 7 根長條柱（圓角 `rounded-2xl`）。
    * 支援點擊任一天高亮切換；選中之柱狀套用鮮明粉紅漸層 (`#F43F5E` ~ `#FB7185`)，上方浮動顯示深莓果色金額氣泡 (`NT$ xxx`)。
    * 底端即時顯示選取日期與當日金額。
* **雙欄分類排行卡片 (2-Column Category Grid)**：
  * 呈現前 5 大收支類別 + 其他分類（Other），採雙欄對稱圓角卡片排版。
  * 卡片標示分類名稱、筆數及金額。
  * 點擊任一分類卡片即時聚焦高亮，並於下方展開該類別之交易明細清單（含日期、備註與金額）。
* **情侶共同帳本支援**：後續依此個人版佈局擴充雙方貢獻佔比模式。

---

### 2.4 🎯 預算與分類管理 (Budget & Categories)
* **每月總預算**設定與超支提醒。
* **分類預算**設定（可為特定類別如「餐飲」單獨設限）。
* **自訂分類**：支援新增自訂類別與更換圖示。

---

### 2.5 💍 多帳本與伴侶共編模組 (Multi-Ledger & Collaboration)
* **獨立隔離與共編機制**：
  * **個人帳本**：完全私密，僅限登入者本人讀取與編輯。
  * **共同帳本**：支援雙方即時共同編輯，一人記帳另一人手機即時（Supabase Realtime）同步刷新。
* **超簡易伴侶邀請機制**：
  * 帳本管理內點擊「邀請伴侶」，一鍵生成「專屬邀請連結」或「6 位數邀請碼」。
  * 伴侶透過手機點開連結、登入 Google 帳號後，即可自動加入該共同帳本。
* **角色與權限**：
  * 建立者 (Owner) 與 共同成員 (Member) 均有完整讀寫與記帳權限。

---

## 📱 3. 頁面導航與操作佈局 (Navigation & FAB Layout)

* **右下角懸浮記帳按鈕 (Bottom-Right FAB)**：
  * 位於畫面**右下角（右側）常駐懸浮**的圓形粉色按鈕（`56x56px` 圓形 `rounded-full` 搭配玫瑰粉光暈）。
  * **人體工學優勢**：最符合右手單手操作時大拇指的黃金點擊熱區，隨手一按即可從底部拉起記帳抽屜。
* **底部常駐導航欄 (Bottom Tab Bar)**：
  1. **📊 總覽 (Home)**：帳本切換、存錢目標/財務卡片、走勢圖、近期收支明細
  2. **📈 統計 (Analytics)**：分類圓環圖與週期分析報表（含雙方貢獻分析）
  3. **🎯 目標 (Goals & Budget)**：結婚基金存錢進度細節、各類別預算管理
  4. **⚙️ 設定 (Settings)**：帳本管理（邀請伴侶）、自訂分類、資料備份/清除、幣別設定

```
┌──────────────────────────────────────────────┐
│  430px 手機介面                              │
│                                              │
│  ... (首頁內容 / 存錢進度卡 / 明細清單) ...    │
│                                              │
│                                      ( ➕ )  │  <-- 右側懸浮記帳按鈕 (FAB)
│  ┌────────────────────────────────────────┐  │
│  │   📊 總覽    📈 統計    🎯 目標   ⚙️ 設定 │  │  <-- 底部常駐導航欄
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

---

## 🛠️ 4. 正式技術選型與架構規劃 (Confirmed Tech Stack)

### 4.1 前端核心技術 (Frontend)
* **核心框架**：**React 18/19 + TypeScript + Vite**
* **樣式與設計系統**：**Tailwind CSS**（內建 Pink Immersion Design Tokens 擴充、自訂粉色調與毛玻璃特效）
* **UI 組件庫架構**：**shadcn/ui (基於 Radix UI Primitives)**
  * `Drawer` (Vaul)：原生手機手勢滑動記帳底部抽屜
  * `Calendar` / `Popover`：高彈性自訂記帳日期選擇器（支援今天/昨天快捷鍵與任意日期補記）
  * `Sonner / Toast`：記帳成功的微互動粉色提示通知
  * `Progress` / `Tabs` / `Badge`：結婚基金目標進度條、預算消耗條、收支切換標籤與分類膠囊
* **圖示系統**：**Lucide React**（全站使用一致向量 SVG 圖示）
* **動效與手勢**：**Framer Motion** / CSS Transitions（底部膠囊導航、存錢達標彩帶動效 `canvas-confetti`）

---

### 4.2 數據視覺化與儀表方案 (Charts & Visuals)
* **推薦套件：`recharts` 或 `chart.js` (`react-chartjs-2`)**：
  * 支出趨勢平滑區域圖 (Area Chart)、分類圓環圖 (Donut Chart) 與結婚基金目標進度環。
  * **深度定制主題**：將套件的所有線條、漸層填充、Tooltip 氣泡與背景色全面綁定至粉色 Design Tokens (`#FB7185`, `#FCE7F3`, `#831843`)。

---

### 4.3 後端與資料庫：Supabase
* **認證 (Auth)**：支援 **Google 帳號快速登入 (Google OAuth via Supabase)**，亦提供離線訪客模式。
* **即時同步 (Realtime)**：啟用 Supabase Realtime Channels，伴侶一端記帳，另一端畫面毫秒級自動更新。
* **資料庫 (PostgreSQL Schema)**：
  * `profiles`：用戶資料（Google 頭像、姓名、Email、貨幣偏好）
  * `ledgers`：帳本表（`id`, `name`, `type` ['personal' | 'shared'], `target_amount`, `created_by`）
  * `ledger_members`：帳本成員關聯表（`ledger_id`, `user_id`, `role` ['owner' | 'member'], `joined_at`）
  * `categories`：收支與基金分類（支援系統預設與自訂）
  * `transactions`：記帳明細（`id`, `ledger_id`, `user_id`, `date`, `amount`, `type`, `category_id`, `note`）
  * `budgets`：月度/分類預算設定
* **Row Level Security (RLS)**：
  * 個人帳本：僅限建立者本人讀寫。
  * 共同帳本：只要是 `ledger_members` 中的成員，均享有讀寫權限。
* **離線優先 (Offline-first)**：本地 LocalStorage 優先快取，連網時自動與 Supabase 同步。

---

## 🚀 5. 開發實作里程碑 (Implementation Roadmap)

- [x] **需求與架構規格確立**（Mibu 極簡風 + 粉紅沉浸主題 + 430px 手機尺寸）
- [x] **情侶共編與結婚基金規劃**（多帳本切換、存錢目標卡、伴侶邀請連結、即時同步）
- [x] **技術選型定案**（React + TS + Vite + Tailwind CSS + shadcn/ui + Recharts + Supabase）
- [x] **登入與貨幣確認**（Google OAuth + 新台幣 NT$）
- [ ] **Phase 1: 專案初始化與設計系統**
  - 初始化 Vite + React + TypeScript 專案
  - 配置 Tailwind CSS、shadcn/ui 與 Pink Immersion Design Tokens (`#FCE7F3`, `#FB7185`, `#831843` 等)
  - 建立 430px 手機版外框容器與基礎排版
- [ ] **Phase 2: 核心介面與組件開發 (Mibu 極簡風格 + 帳本切換)**
  - 頂部帳本切換膠囊 (Ledger Switcher: 個人帳本 / 結婚基金)
  - 結婚基金目標進度卡 (Wedding Savings Goal Card) & 常規財務卡片
  - 支出趨勢圖表與分類圓環圖 (Recharts / SVG)
  - 依日期分組的收支明細清單 (含記錄者頭像標記)
  - 底部懸浮膠囊導航欄 (Floating Pill Bottom Bar)
- [ ] **Phase 3: 記帳互動與自訂日期功能**
  - 抽屜式快速記帳 Modal（自訂日期選擇器、今天/昨天快捷鍵、自訂時間）
  - 分類選擇網格（支援一般收支與結婚基金存入）、金額輸入鍵盤與備註
  - 本地離線存取與響應式狀態管理
- [ ] **Phase 4: Supabase 後端串接、Google 登入與情侶共編**
  - 配置 Supabase Client、Database Schema (ledgers / transactions / members) 與 RLS
  - 整合 Google OAuth 登入
  - 實作「伴侶邀請連結 / 邀請碼」與 Supabase Realtime 即時共編同步

