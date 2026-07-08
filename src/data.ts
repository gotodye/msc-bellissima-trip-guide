import { ReactNode } from 'react';

export type Lang = 'zh' | 'en' | 'id' | 'th';

export const targetDateStr = '2026-07-09T11:30:00+08:00';

// ─── Image URLs (real MSC Bellissima photos + Unsplash) ─────────────────────────
const IMG = {
  // 真實 MSC Bellissima 現場照片 (from cruisedeckplans.com)
  crystal:    '/crystal-staircase.jpg',   // 奧地利水晶旋轉樓梯   // 水晶大廳
  galleria:   '/galleria.jpg',   // 香榭麗舍榮耀大道 LED 天幕
  lighthouse: '/lighthouse.jpg',   // 主餐廳龍蝦
  buffet:     '/buffet.jpg',   // 15F 市集自助餐廳
  waterpark:  'https://www.cruisedeckplans.com/DP/deckpictures/165/org/MSCDec-77442-1676645380.jpg',   // 亞利桑那水上樂園
  spa:        'https://www.cruisedeckplans.com/DP/deckpictures/133/org/MSCDec-74883-1633026056.jpg',   // Aurea SPA

  // Unsplash 補充照片
  steak:      '/steak.jpg',   // 付費特色餐廳
  chocolate:  'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=800',
  broadway:   '/broadway.jpg',
  f1:         '/f1.jpg',
  track:      'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=800',
  cocktail:   'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800',

  // 行前/規則/APP/下船 tabs 照片
  passport:   'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80&w=800',
  luggage:    'https://images.unsplash.com/photo-1552858725-2758b5fb1286?auto=format&fit=crop&q=80&w=800',
  phone:      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
  calendar:   'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800',
  show:       'https://images.unsplash.com/photo-1507676184212-d0330a15673c?auto=format&fit=crop&q=80&w=800',
  coffee:     'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=800',
  camera:     'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
  food:       'https://images.unsplash.com/photo-1414235077428-338988a2e8c0?auto=format&fit=crop&q=80&w=800',
  ship:       'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800',
};

// ─── Shared Bingo Cells (emoji + short label + description) ─────────────────
// Index 12 (center) is always FREE
const BINGO_ZH = [
  { emoji: '🌅', text: '看日出',   desc: '在甲板迎接海上日出' },
  { emoji: '💎', text: '水晶樓梯', desc: '在水晶樓梯拍到空曠美照' },
  { emoji: '🦞', text: '龍蝦尾',   desc: '主餐廳點到龍蝦尾' },
  { emoji: '🍕', text: '深夜披薩', desc: '嚐到自助餐廳深夜現烤披薩' },
  { emoji: '🎭', text: '大秀演出', desc: '坐進倫敦大劇院看完一場表演' },
  { emoji: '🛍️', text: '那霸購物', desc: '在國際通買到伴手禮' },
  { emoji: '⬜', text: '白色派對', desc: '穿全白服裝參加白色派對' },
  { emoji: '🌊', text: '玩滑水道', desc: '在亞利桑那水上樂園玩滑水道' },
  { emoji: '🌙', text: '甲板夜景', desc: '在甲板欣賞海上夜景' },
  { emoji: '💍', text: '免稅掃貨', desc: '在香榭麗舍免稅店購物' },
  { emoji: '🥂', text: '正裝晚餐', desc: '穿正裝在主餐廳用晚餐' },
  { emoji: '🧀', text: '現做起司', desc: '找到並嚐到手工莫扎瑞拉起司' },
  { emoji: '⚓', text: 'FREE',      desc: '登船成功！你已經贏了！' },
  { emoji: '🏎️', text: 'F1賽車',   desc: '試玩F1模擬賽車' },
  { emoji: '🥐', text: '陽台早餐', desc: '享用陽台房免費外送早餐' },
  { emoji: '📱', text: 'APP搶票',   desc: '成功在APP搶到大秀門票' },
  { emoji: '📸', text: '同事合照', desc: '和公司同事拍一張大合照' },
  { emoji: '🏃', text: '健步道',   desc: '在船頂健步道跑步或散步一圈' },
  { emoji: '🍹', text: '喝調酒',   desc: '在特色酒吧點一杯調酒' },
  { emoji: '⛩️', text: '那霸神社', desc: '參觀波上宮神社' },
  { emoji: '👨‍✈️', text: '遇到船長', desc: '在船上遇見或拍到船長' },
  { emoji: '🇮🇹', text: '義大利夜', desc: '盛裝打扮參加義大利主題夜' },
  { emoji: '🥽', text: '試玩VR',   desc: '體驗VR射擊等虛擬實境遊戲' },
  { emoji: '🍫', text: '巧克力屋', desc: '光顧Jean-Philippe的巧克力工坊' },
  { emoji: '🎊', text: '平安返台', desc: '安全完成這趟美好旅程！' },
];

const BINGO_EN = [
  { emoji: '🌅', text: 'Sunrise',      desc: 'Watch the sunrise from the deck' },
  { emoji: '💎', text: 'Crystal Stair',desc: 'Get an empty-staircase photo' },
  { emoji: '🦞', text: 'Lobster',      desc: 'Order lobster tail at main restaurant' },
  { emoji: '🍕', text: 'Night Pizza',  desc: 'Taste the late-night fresh-baked pizza' },
  { emoji: '🎭', text: 'Live Show',    desc: 'Watch a full show at London Theatre' },
  { emoji: '🛍️', text: 'Naha Shop',   desc: 'Buy a souvenir on Kokusai Dori' },
  { emoji: '⬜', text: 'White Party',  desc: 'Join the White Party in all-white outfit' },
  { emoji: '🌊', text: 'Water Slide',  desc: 'Ride Arizona Water Park slides' },
  { emoji: '🌙', text: 'Night Deck',   desc: 'Enjoy the ocean night view from deck' },
  { emoji: '💍', text: 'Duty Free',    desc: 'Shop at the Galleria duty-free stores' },
  { emoji: '🥂', text: 'Formal Night', desc: 'Dress formally for the main restaurant' },
  { emoji: '🧀', text: 'Mozzarella',   desc: 'Find & taste the handmade mozzarella' },
  { emoji: '⚓', text: 'FREE',          desc: 'You\'re on board — you already won!' },
  { emoji: '🏎️', text: 'F1 Race',     desc: 'Try the F1 simulator' },
  { emoji: '🥐', text: 'Balcony Bfast',desc: 'Enjoy complimentary balcony breakfast' },
  { emoji: '📱', text: 'Book Show',    desc: 'Successfully book a show via app' },
  { emoji: '📸', text: 'Team Photo',   desc: 'Take a group photo with colleagues' },
  { emoji: '🏃', text: 'Track Run',    desc: 'Walk/run the top-deck promenade' },
  { emoji: '🍹', text: 'Cocktail',     desc: 'Order a cocktail at a specialty bar' },
  { emoji: '⛩️', text: 'Naminoue',    desc: 'Visit Naminoue Shrine in Naha' },
  { emoji: '👨‍✈️', text: 'Captain',   desc: 'Spot or meet the ship\'s captain' },
  { emoji: '🇮🇹', text: 'Italian Nite',desc: 'Dress up for Italian Night' },
  { emoji: '🥽', text: 'Try VR',       desc: 'Try VR shooting or other VR games' },
  { emoji: '🍫', text: 'Chocolate',    desc: 'Visit Jean-Philippe\'s chocolate café' },
  { emoji: '🎊', text: 'Safe Home',    desc: 'Complete this wonderful journey safely!' },
];

const BINGO_ID = [
  { emoji: '🌅', text: 'Lihat Sunrise',  desc: 'Saksikan matahari terbit dari dek' },
  { emoji: '💎', text: 'Tangga Kristal', desc: 'Foto di tangga Swarovski saat sepi' },
  { emoji: '🦞', text: 'Lobster',        desc: 'Pesan lobster di restoran utama' },
  { emoji: '🍕', text: 'Pizza Malam',    desc: 'Cicipi pizza panggang tengah malam' },
  { emoji: '🎭', text: 'Live Show',      desc: 'Nonton pertunjukan di London Theatre' },
  { emoji: '🛍️', text: 'Belanja Naha',  desc: 'Beli oleh-oleh di Kokusai Dori' },
  { emoji: '⬜', text: 'White Party',    desc: 'Ikuti pesta serba putih' },
  { emoji: '🌊', text: 'Water Slide',    desc: 'Main seluncuran di Arizona Water Park' },
  { emoji: '🌙', text: 'Pemandangan',    desc: 'Nikmati pemandangan malam di dek' },
  { emoji: '💍', text: 'Duty Free',      desc: 'Belanja di toko bebas bea Galleria' },
  { emoji: '🥂', text: 'Makan Formal',   desc: 'Makan malam dengan pakaian formal' },
  { emoji: '🧀', text: 'Mozzarella',     desc: 'Cari & cicipi mozzarella buatan tangan' },
  { emoji: '⚓', text: 'FREE',            desc: 'Kamu sudah naik kapal — kamu menang!' },
  { emoji: '🏎️', text: 'Balapan F1',   desc: 'Coba simulator F1' },
  { emoji: '🥐', text: 'Sarapan Balkoni',desc: 'Nikmati sarapan gratis di balkon' },
  { emoji: '📱', text: 'Pesan Show',     desc: 'Berhasil pesan tiket show lewat app' },
  { emoji: '📸', text: 'Foto Bersama',   desc: 'Foto bareng rekan-rekan kantor' },
  { emoji: '🏃', text: 'Jalan Track',    desc: 'Jalan/lari di promenade atas kapal' },
  { emoji: '🍹', text: 'Minum Cocktail', desc: 'Pesan cocktail di bar spesial' },
  { emoji: '⛩️', text: 'Kuil Naminoue', desc: 'Kunjungi Kuil Naminoue di Naha' },
  { emoji: '👨‍✈️', text: 'Ketemu Kapten',desc: 'Temui atau foto dengan kapten kapal' },
  { emoji: '🇮🇹', text: 'Malam Italia',  desc: 'Berdandan untuk Malam Italia' },
  { emoji: '🥽', text: 'Coba VR',        desc: 'Coba game VR shooting atau lainnya' },
  { emoji: '🍫', text: 'Cokelat',        desc: 'Kunjungi kafe cokelat Jean-Philippe' },
  { emoji: '🎊', text: 'Pulang Selamat', desc: 'Selesaikan perjalanan indah ini!' },
];

const BINGO_TH = [
  { emoji: '🌅', text: 'ชมพระอาทิตย์',     desc: 'ชมพระอาทิตย์ขึ้นบนดาดฟ้า' },
  { emoji: '💎', text: 'บันไดคริสตัล',     desc: 'ถ่ายรูปบันไดตอนไม่มีคน' },
  { emoji: '🦞', text: 'กุ้งล็อบสเตอร์',   desc: 'สั่งหางกุ้งล็อบสเตอร์ที่ห้องอาหาร' },
  { emoji: '🍕', text: 'พิซซ่าดึก',        desc: 'ชิมพิซซ่าอบสดตอนดึก' },
  { emoji: '🎭', text: 'ดูโชว์',            desc: 'ดูการแสดงที่ London Theatre ครบ' },
  { emoji: '🛍️', text: 'ช้อปนาฮะ',         desc: 'ซื้อของฝากที่ Kokusai Dori' },
  { emoji: '⬜', text: 'ปาร์ตี้ขาว',       desc: 'ร่วม White Party ชุดขาวล้วน' },
  { emoji: '🌊', text: 'สไลเดอร์น้ำ',      desc: 'เล่นสไลเดอร์ที่ Arizona Water Park' },
  { emoji: '🌙', text: 'ชมวิวกลางคืน',     desc: 'ชมวิวทะเลตอนกลางคืนบนดาดฟ้า' },
  { emoji: '💍', text: 'ช้อปปลอดภาษี',     desc: 'ช้อปที่ร้าน Duty Free Galleria' },
  { emoji: '🥂', text: 'มื้อค่ำฟอร์มัล',   desc: 'แต่งตัวฟอร์มัลทานข้าวที่ห้องอาหาร' },
  { emoji: '🧀', text: 'ชีสมอสซาเรลล่า',   desc: 'หาและชิมชีสทำมือสด' },
  { emoji: '⚓', text: 'FREE',              desc: 'คุณขึ้นเรือแล้ว — คุณชนะแล้ว!' },
  { emoji: '🏎️', text: 'รถ F1',            desc: 'ลองซิมูเลเตอร์ F1' },
  { emoji: '🥐', text: 'อาหารเช้าระเบียง', desc: 'สั่งอาหารเช้าฟรีที่ระเบียง' },
  { emoji: '📱', text: 'จองโชว์',           desc: 'จองตั๋วโชว์สำเร็จผ่านแอป' },
  { emoji: '📸', text: 'ถ่ายรูปทีม',       desc: 'ถ่ายรูปหมู่กับเพื่อนร่วมงาน' },
  { emoji: '🏃', text: 'วิ่งบนดาดฟ้า',     desc: 'เดิน/วิ่งบน promenade ดาดฟ้า' },
  { emoji: '🍹', text: 'ดื่มค็อกเทล',      desc: 'สั่งค็อกเทลที่บาร์พิเศษ' },
  { emoji: '⛩️', text: 'ศาลเจ้านามิโนะ',  desc: 'เยี่ยมชม Naminoue Shrine ในนาฮะ' },
  { emoji: '👨‍✈️', text: 'เจอกัปตัน',    desc: 'เจอหรือถ่ายรูปกับกัปตันเรือ' },
  { emoji: '🇮🇹', text: 'คืนอิตาลี',       desc: 'แต่งตัวร่วมงาน Italian Night' },
  { emoji: '🥽', text: 'ลอง VR',            desc: 'ลองเกม VR ยิงปืนหรืออื่นๆ' },
  { emoji: '🍫', text: 'ช็อกโกแลต',        desc: 'แวะร้านช็อกโกแลตของ Jean-Philippe' },
  { emoji: '🎊', text: 'กลับบ้านปลอดภัย',  desc: 'เสร็จสิ้นการเดินทางที่สวยงาม!' },
];

export const dictionary: Record<Lang, any> = {
  zh: {
    header: "MSC 榮耀號 專屬指南",
    date: "2026 / 07 / 09 - 07 / 12",
    countdownTitle: "距離登船倒數",
    timeUnits: ["天", "時", "分", "秒"],
    todayHighlightsTitle: "今日行程重點",
    todayNoEvents: "今天沒有安排的大事件，好好放鬆吧！",
    reminderTitle: "大秀預約提醒",
    reminderDesc: "每天午夜 00:00 開放預約隔天大秀，強烈建議自己設定手機鬧鐘或行事曆提醒（23:55），以免向隅！",
    tabs: [
      { id: 'depart',   label: "📋 出發前" },
      { id: 'onboard',  label: "🚢 船上" },
      { id: 'hacks',    label: "✨ 密技" },
      { id: 'social',   label: "⚓ 航海日誌" },
      { id: 'bingo',    label: "🎴 賓果" },
    ],
    // ── Together (Bingo + Quick Share) ───────────────────────────────────────
    together: {
      bingoTitle: "航程賓果挑戰卡",
      bingoDesc: "打勾完成5格連線就是 BINGO！截圖傳給同事，看誰最先連線 🎊",
      bingoWinText: "🎉 BINGO！恭喜達成連線！快截圖傳給大家！",
      progressUnit: "項已達成（含FREE）",
      resetBtn: "重新挑戰",
      shareTitle: "一鍵召喚同事",
      shareDesc: "選你目前所在地點，複製訊息後貼到 LINE 群組召喚大家！",
      shareButton: "📋 複製召喚訊息",
      shareCopied: "✅ 已複製！快貼到 LINE！",
      shareTemplate: "📍 我現在在 MSC 榮耀號的【{location}】！快來找我！🚢\n（此訊息由榮耀號同事APP生成）",
      locations: [
        "15F 自助餐廳 🍕",
        "6F 水晶樓梯 💎",
        "15F 水上樂園 🌊",
        "7F 老船長酒吧 🍺",
        "6–7F 香榭麗舍大道 🛍️",
        "5F 服務台 ℹ️",
        "6F 主餐廳 🍽️",
        "甲板觀景台 🌅",
      ],
      bingoCells: BINGO_ZH,
    },
    sections: {
      pre: [
        {
          icon: 'AlertTriangle', title: "【颱風「巴威」航程異動通知】", highlight: true,
          text: "受第9號颱風「巴威」影響，船長基於安全考量調整航程：Day2（7/10）、Day3（7/11）那霸/沖繩停靠港取消，改為航海日；基隆出發（7/9 17:30）與返回基隆（7/12 07:00）維持不變。\n💰 船上消費金補償：每艙第1、2位每人50美金、第3、4位每人25美金，直接存入船卡（不可提現、航程結束未用完不予退還）。已預訂的付費岸上觀光費用會自動退回船卡帳戶。\n⚠️ 此為目前預估航程，船長仍可能依實際氣象狀況進一步調整，請以船上最新公告為準。"
        },
        {
          icon: 'Sparkles', title: "【接送集合事項】", highlight: true,
          text: "請於 7/9 11:45-12:00 至「台北火車站東三門」集合，東南工作人員（藍色背心）將協助點名，12:00 準時發車前往基隆港!"
        },
        { 
          image: IMG.passport,
          icon: 'AlertTriangle', title: "本國籍 & 外籍護照規範", highlight: true, 
          text: "務必攜帶：護照正本、2份1:1的A4護照影本、以及日本海關申報單（同一家庭只需填寫一張）。\n護照正本登船時會被收走代為保管，因此「護照影本」在整趟旅程中等同於您的身分證，會貼上船舶觀光許可證，上下船通關全靠它，絕對不能遺失！\n外籍同仁：必須攜帶台灣居留證（ARC）。" 
        },
        {
          icon: 'CheckSquare', title: "出門前最後檢查，隨身行李 (點擊打勾)",
          checklist: [
            "手機",
            "船票 / 登船證",
            "護照正本 (效期需大於6個月)",
            "護照影本 (2份A4比例1:1)",
            "台灣居留證 ARC (外籍同仁必備)",
            "錢包 (信用卡、現金)、少量外幣 (日幣、美金)",
            "個人藥品 (暈船藥、腸胃藥、感冒藥)",
            "防曬用品 (太陽眼鏡、防曬乳、帽子)",
            "雨具 (摺疊傘、輕便雨衣)"
          ]
        },
        { 
          image: IMG.luggage,
          icon: 'CheckSquare', title: "行李打包清單，先把行李條綁好(點擊打勾)", 
          checklist: [
            "個人保養品與化妝品",
            "牙膏、牙刷 (船上響應環保不主動提供)", 
            "室內拖鞋", 
            "手機充電線與多孔充電頭",
            "正式服裝 (正式之夜與水晶樓梯拍照必備)", 
            "運動服與運動鞋 (高空健身房嚴格要求著運動服裝)", 
            "防風薄外套 (甲板風大、室內冷氣較冷)",
            "泳具與打氣筒 (船上無打氣設備)",
            "白色衣物或紅/白/綠色系衣服 (白色派對與義大利之夜必備)"
          ] 
        },
        { 
          icon: 'ShieldAlert', title: "違禁與限帶物品清單", 
          text: "【絕對禁止】延長線、電棒捲、熨斗、對講機、生鮮肉品、新鮮蔬果。安檢極其嚴格，違禁品將直接沒收，不會歸還。\n【暫時保管】酒類、飲料會由海關保管，下船後歸還。\n【可以攜帶】礦泉水、素食泡麵。" 
        }
      ],
      rules: [
      ],
      app: [
        {
          image: IMG.phone,
          icon: 'Smartphone', title: "步驟一：下載與連線",
          text: "強烈建議在「上船前」就下載好『MSC for Me』APP。登船後，請開啟飛航模式，並連上船上的免費 Wi-Fi。不需要購買付費網路，只要連上內網即可使用 APP 所有功能！"
        },
        {
          icon: 'MessageCircle', title: "步驟二：免費內網聊天室",
          text: "利用 APP 內的 Chat 功能，即使沒有購買船上網路，連上船上內網後也能使用 APP 的聊天功能與家人聯絡。"
        },
        {
          image: IMG.calendar,
          icon: 'Calendar', title: "步驟三：每日行程與地圖",
          text: "APP 內有詳細的每日活動時刻表（Daily Program）與船層平面圖。看到想參加的派對或表演，可以直接點擊愛心加入個人行程表。"
        }
      ],
      onboard: [
        {
          icon: 'Globe', title: "船上重要須知", list: [
            "護照正本若登船後未發還，請至 5F 服務櫃台領取。",
            "持非台灣護照的同仁，請務必於回國前三天完成線上入境資料申請。"
          ]
        },
        { 
          icon: 'Ship', title: "登船必做的兩件大事", list: [
            "1. 安全演習：回房間看電視安全宣導影片 → 用房內電話撥打 881 → 帶著房卡前往指定的緊急集合點 (Assembly Station) 刷卡報到。",
            "2. 房卡連結信用卡：拿房卡去5樓或6樓的自助機器綁定信用卡，避開大廳人擠人的機台，多走幾步找角落的機台完全免排隊。小朋友的房卡必須依附大人的信用卡綁定，若機台操作失敗，請至5樓服務櫃檯人工處理。"
          ] 
        },
        { 
          icon: 'Globe', title: "外語與服務支援", 
          text: "外籍同仁可至 5 樓服務台索取英文版 Daily Program (每日報紙) 以及主餐廳的英文菜單。" 
        }
      ],
      // ── HACKS TAB: Blogger Insider Tips ──────────────────────────────────
      hacks: [
        {
          category: "🎉 限時優惠",
          categoryColor: "purple",
          title: "颱風航海日限定：船上優惠比原行程更划算",
          tips: [
            "🍹 家庭/兒童健康飲品限時8折",
            "🍺 老船長酒吧小食＋啤酒套餐限時優惠",
            "🍶 SKY Lounge 天空酒廊燒酒、清酒限時8折",
            "🎤 TV Studio 演播廳家庭卡拉OK雞尾酒買一送一",
            "🍫 巧克力工坊可麗餅與聖代限時8折",
            "🛍️ 第一航海日 Guess 低至5折、第二航海日 Valentino 低至7折，消費即可抽獎",
            "💆 水療美容中心：皮膚、髮質免費檢測諮詢",
            "🎬 幕後之旅專屬特惠：登船日與第二航海日限時特價"
          ]
        },
        {
          category: "📸 拍照聖地",
          categoryColor: "rose",
          image: IMG.crystal,
          title: "奧地利水晶旋轉樓梯：拍出空曠仙照的秘密時段",
          tips: [
            "🕕 黃金時段①：晚上 6:30–7:00 主餐廳第一輪開放，人潮全部湧入餐廳，樓梯瞬間清空",
            "🌙 黃金時段②：深夜 12:00 後，燈光最夢幻、人潮最少，是最多網紅選擇的時間",
            "⬆️ 構圖密技：站在頂層（約6F）往下俯拍，61,440 顆水晶倒影視覺最震撼",
            "👗 服裝建議：正裝或飄逸長裙效果最好，與歐式奢華風格最搭",
            "⏰ 最雷時段：早餐後 09:00–11:00、午餐後 13:00–15:00 人最多，完全避開"
          ]
        },
        {
          category: "📸 拍照聖地",
          categoryColor: "rose",
          image: IMG.galleria,
          title: "香榭麗舍榮耀大道：80M 天幕光影秀與主題派對",
          tips: [
            "🌟 80公尺超長LED天幕每天有不同的光影節目，完全免費欣賞",
            "📷 最強構圖：直接躺在地板朝天花板仰拍（很多網紅這樣做，真的超震撼）",
            "🎪 派對重地：白色派對、義大利之夜等所有主題派對都在這裡舉辦，提前來卡好位",
            "🛍️ 250+ 品牌免稅店集中在此，建議下午 14:00–16:00 人潮最少時逛"
          ]
        },
        {
          category: "🍽️ 美食密技",
          categoryColor: "amber",
          image: IMG.lighthouse,
          title: "主餐廳攻略：龍蝦尾免費無限點 × 聰明點菜法",
          tips: [
            "🦞 必知密技：龍蝦尾通常在【第二天晚餐】出現在菜單，許多人不知道可以無限加點！",
            "⏱️ 加點等待約 20 分鐘，達人做法：入座後立刻把前菜、主菜、甜點「一次全部點齊」",
            "👔 著裝規定：休閒正裝以上（不能穿拖鞋短褲），正式之夜建議完整正裝出席",
            "🪑 固定座位制：整趟旅程都是同一位服務生，對他/她好一點，服務會更貼心",
            "🍽️ 多間主餐廳（櫻桃、燈塔、海王）菜色完全相同，選離房間近的最方便"
          ]
        },
        {
          category: "🍽️ 美食密技",
          categoryColor: "amber",
          image: IMG.buffet,
          title: "15F 市集自助餐廳：隱藏版美食完全攻略",
          tips: [
            "🍕 隱藏必吃①：深夜現烤薄脆披薩（約晚上 23:00 後出爐），無數旅遊部落格推薦，免費",
            "🧀 隱藏必吃②：手工現捏莫扎瑞拉起司（每天新鮮製作，撕開牛奶香四溢，絕對要找），免費",
            "🍱 驚喜台灣角落：蘿蔔糕、包子等台灣美食不定期出現，出現時一定要吃",
            "💺 找座位訣竅：絕對不要擠在入口，往餐廳後半段走，位子超多又超安靜",
            "⏰ 全天 20 小時不打烊，凌晨 3 點肚子餓也有東西吃！"
          ]
        },
        {
          category: "🍽️ 美食密技",
          categoryColor: "amber",
          image: IMG.steak,
          title: "付費特色餐廳：登船第一天就要衝去預約",
          tips: [
            "🥩 首選：美式牛排屋（7F）— 大師級牛排，黃金年代美國餐廳氛圍，CP值最高",
            "🍣 強推：海渡鐵板燒＆壽司吧（7F）— 現場鐵板料理秀，視覺與味覺雙重享受",
            "🚨 最重要：登船當天（7/9）下午立刻用APP預約！拖到隔天通常就沒位置了",
            "💡 大多數人忽略這件事：預約特色餐廳比搶大秀門票更緊急！先預約餐廳再搶票"
          ]
        },
        {
          category: "🍽️ 美食密技",
          categoryColor: "amber",
          image: IMG.chocolate,
          title: "Jean-Philippe 巧克力工坊＆咖啡屋：法式甜蜜不能錯過",
          tips: [
            "🍫 世界甜品大師 Jean-Philippe Maury 監製，超過千款法式手工巧克力",
            "☕ 提供精品咖啡和法式甜點，是船上最適合下午小憩的地方",
            "🎁 巧克力可當伴手禮，精美包裝送禮非常體面",
            "💡 此為付費項目，但單價不高，人均消費約 5–15 美元"
          ]
        },
        {
          category: "🎭 娛樂搶攻",
          categoryColor: "purple",
          image: IMG.broadway,
          title: "倫敦大劇院大秀：5 分鐘秒殺的正確搶票方式",
          tips: [
            "⏰ 核心規則：每天【午夜 00:00】才開放預約「隔天」的表演，早一秒都沒用",
            "⚡ 速度警告：根據大量旅客回報，名額通常在 5 分鐘內全部搶完，不誇張",
            "🔔 立刻行動：自己設定手機鬧鐘或行事曆提醒 23:55，準時守候搶票",
            "🎭 兩場次策略：通常一天有早晚兩個場次，兩個都去搶，搶到任何一場都算贏",
            "📱 注意事項：必須在飛航模式 + 船上內網的狀態下用 APP，確認已連上內網再開始搶"
          ]
        },
        {
          category: "🎭 娛樂搶攻",
          categoryColor: "purple",
          image: IMG.f1,
          title: "付費遊樂設施：儲值套餐省 20–30%",
          tips: [
            "🏎️ 可玩項目：F1 模擬賽車、VR 射擊、保齡球、電子遊樂區（全部需另外付費）",
            "💡 必買建議：直接購買儲值套餐（例如儲值 70 美元送 20 美元額度），比單次購買省很多",
            "⏱️ 最佳時段：7/10 那霸靠岸當天，大家都下船觀光，設施幾乎沒人，排隊時間為零！",
            "👨‍👩‍👧 親子分流建議：10歲以下孩子去免費樂高俱樂部，大孩子與大人衝 F1 和 VR"
          ]
        },
        {
          category: "💡 省錢省力",
          categoryColor: "emerald",
          image: IMG.waterpark,
          title: "亞利桑那水上樂園：完全不用排隊的 3 個黃金時段",
          tips: [
            "🏊 黃金時段①：早上 10:00 前 — 陽光不烈、人超少，滑水道幾乎可以連續玩",
            "🌆 黃金時段②：下午 17:00 後 — 夕陽配泳池，拍照超美，人也少",
            "⚡ 超強密技：7/10 那霸靠岸當天，大部分旅客都下船，水上樂園幾乎是「包場」狀態！",
            "🩱 必備裝備：泳衣、防水手機套、防曬乳（建議防水款）",
            "⚠️ 千萬記得：泳圈、浮圈、充氣玩具要自己帶，船上沒有打氣筒！"
          ]
        },
        {
          category: "💡 省錢省力",
          categoryColor: "emerald",
          image: IMG.track,
          title: "船上免費資源完全指南：你沒想到的都可以免費拿",
          tips: [
            "💧 飲水神招：海水淡化水偏鹹，帶保溫瓶去 15F 自助餐廳裝熱水，放涼後完全無鹹味",
            "💊 暈船藥免費：5F 服務台直接索取，不需處方箋，說「I need seasickness medicine」就好",
            "🍊 天然止暈：5F 服務台旁或自助餐廳的青蘋果，是許多資深旅客私藏的天然止暈秘方",
            "🌙 深夜宵夜：15F 自助餐廳接近 24 小時開放，凌晨也有東西吃",
            "🛁 陽台房限定：前一晚把早餐卡掛在門外，隔天在陽台看海吃早餐，完全免費"
          ]
        },
        {
          category: "🎪 主題派對",
          categoryColor: "sky",
          image: IMG.cocktail,
          title: "白色派對 & 義大利之夜：萬全準備才能拍出最美照",
          tips: [
            "⬜ 白色派對：全身白色服裝（愈白愈純正愈好），是許多人認為全程最開心的夜晚",
            "🇮🇹 義大利之夜：穿紅、白、綠三色系（義大利國旗色），船上最熱鬧的派對沒有之一",
            "📍 重要地點：活動都在 6–7F 香榭麗舍榮耀大道舉行，中間區域視野和氣氛最好",
            "🎯 卡位攻略：活動開始前至少 30 分鐘先到場，在中央區域搶好位子",
            "📸 最佳拍照時機：派對進行到高潮時（通常開始後 30–45 分鐘），背景最熱鬧、氣氛最好"
          ]
        },
        {
          category: "🌸 水療 & 放鬆",
          categoryColor: "pink",
          image: IMG.spa,
          title: "MSC 水療美容中心：峇厘島理療師的奢華體驗",
          tips: [
            "💆 超過 160 項身體及面部護理，由峇厘島專業理療師服務",
            "💡 省錢時機：第一天登船後通常有「登船特惠」優惠方案，比後幾天便宜許多",
            "🎁 送禮絕佳：幫另一半預約一個下午的水療，是最有質感的郵輪情人節",
            "📅 強烈建議提前預約（APP 或 5F 服務台），熱門時段容易客滿"
          ]
        },
      ],
      local: [
        {
          image: IMG.okinawa,
          icon: 'MapPin', title: "日本面試通關程序", 
          text: "所有人（不論是否下船）均須攜帶「護照影本」與「房卡」在船上接受日本官員面試。影本背後會貼上「上陸許可書」，在日本期間此影本等同身分證，切勿遺失！" 
        },
        {
          image: IMG.naha,
          icon: 'MapPin', title: "那霸 (沖繩) 推薦行程", 
          list: [
            "國際通 (Kokusai Dori)：車程約 10 分鐘。購物、藥妝、免稅店集中地，必吃黑毛和牛與牧志公設市場海鮮。",
            "波上宮 & 波之上海灘：車程約 10 分鐘。沖繩八社之首，懸崖上的神宮，旁邊就是絕美沙灘，最適合快閃拍照！",
            "首里城公園：車程約 20 分鐘。體驗琉球王國世界文化遺產，適合喜歡歷史文化的旅客。"
          ]
        },
        { 
          icon: 'Sparkles', title: "【公司專屬：優先下船特權】", highlight: true, 
          text: "一般旅客下船需大排長龍，但本公司享有「優先登陸下船」特權！請依循專屬指示快速通關，直接銜接我們安排好的【專屬包車】。無需頂著盛夏烈日排隊，為您省下 1-2 小時以上的寶貴旅遊時間！" 
        },
        { 
          icon: 'Clock', title: "絕對準時的時間觀念", 
          text: "【切記預留塞車時間】回船安檢需預留 1 小時排隊，請務必比「啟航時間」提早至少 1.5 小時啟程回碼頭。郵輪極度準時，逾時絕對不候！" 
        },
        { 
          icon: 'ShoppingBag', title: "日本購物與海關限制", 
          text: "藥妝、電器不限重量。但【絕對禁止】攜帶日本當地的肉類、水果、生鮮食品上船，更不可帶回台灣，違者將面臨鉅額罰款！" 
        }
      ],
      together: [], // rendered via content.together
    }
  },

  en: {
    header: "MSC Bellissima Exclusive Guide",
    date: "2026 / 07 / 09 - 07 / 12",
    countdownTitle: "Countdown to Boarding",
    timeUnits: ["Days", "Hrs", "Min", "Sec"],
    todayHighlightsTitle: "Today's Highlights",
    todayNoEvents: "No big events scheduled today — kick back and relax!",
    reminderTitle: "Show Booking Reminder",
    reminderDesc: "Show bookings open at 00:00 midnight daily. We strongly suggest setting your own phone alarm or calendar reminder (23:55) to secure your seats!",
    tabs: [
      { id: 'depart',   label: "📋 Before" },
      { id: 'onboard',  label: "🚢 Onboard" },
      { id: 'hacks',    label: "✨ Hacks" },
      { id: 'social',   label: "⚓ Time-Sail" },
      { id: 'bingo',    label: "🎴 Bingo" },
    ],
    together: {
      bingoTitle: "Trip Bingo Challenge",
      bingoDesc: "Check off 5 in a row for BINGO! Screenshot and share with colleagues 🎊",
      bingoWinText: "🎉 BINGO! Screenshot it and share with everyone!",
      progressUnit: "completed (incl. FREE)",
      resetBtn: "Reset Card",
      shareTitle: "Quick Summon",
      shareDesc: "Pick your current location and copy a message to send in the group chat!",
      shareButton: "📋 Copy Message",
      shareCopied: "✅ Copied! Paste it in the group chat!",
      shareTemplate: "📍 I'm at the MSC Bellissima【{location}】! Come find me! 🚢",
      locations: [
        "Deck 15 Buffet 🍕",
        "Deck 6 Crystal Stairs 💎",
        "Deck 15 Water Park 🌊",
        "Deck 7 Captain's Bar 🍺",
        "Decks 6–7 Galleria 🛍️",
        "Deck 5 Reception ℹ️",
        "Main Restaurant 🍽️",
        "Observation Deck 🌅",
      ],
      bingoCells: BINGO_EN,
    },
    sections: {
      pre: [
        {
          icon: 'AlertTriangle', title: "[Typhoon Bawi Itinerary Change Notice]", highlight: true,
          text: "Due to Super Typhoon Bawi (No. 9), the Captain has adjusted the itinerary for safety: Day 2 (7/10) and Day 3 (7/11) port calls at Naha/Okinawa are cancelled and become sea days; Keelung departure (7/9 17:30) and return (7/12 07:00) are unchanged.\n💰 Onboard credit compensation: USD 50/person for the first 2 guests per cabin, USD 25/person for the 3rd/4th guest, credited directly to your cruise card (non-refundable cash, unused balance forfeited at end of voyage). Prepaid Naha/Okinawa shore excursions will be automatically refunded to your onboard account.\n⚠️ This is the currently estimated itinerary — the Captain may make further adjustments based on actual weather. Please follow the latest onboard announcements."
        },
        {
          icon: 'Sparkles', title: "【Pickup & Gathering Arrangements】", highlight: true,
          text: "Please gather at Taipei Main Station East Gate 3 between 11:45-12:00 on July 9th. Southeast Travel staff (blue vests) will help with roll call — the bus departs promptly at 12:00 for Keelung Port!"
        },
        { 
          image: IMG.passport,
          icon: 'AlertTriangle', title: "Passport & Expat Regulations", highlight: true, 
          text: "Taiwanese: Original Passport (valid > 6 months) + 2 Copies.\nExpats: MUST bring your Taiwan ARC. Please verify with the travel agency immediately if your nationality requires a Japan visa. No visa = No boarding!" 
        },
        {
          icon: 'CheckSquare', title: "Pre-departure Checks, Personal Carry Items (Click to check)",
          checklist: [
            "Mobile Phone",
            "Original Passport (Valid > 6 months)",
            "Passport Copies (2 copies, A4 1:1 ratio)",
            "Taiwan ARC (For foreign colleagues)",
            "Wallet (Credit cards, Cash) & Small amount of foreign currency (JPY, USD)",
            "Personal medications (seasickness, stomach, cold)",
            "Sun protection (sunglasses, sunscreen, hat)",
            "Rain gear (umbrella, raincoat)"
          ]
        },
        { 
          image: IMG.luggage,
          icon: 'CheckSquare', title: "Packing List, Tie Your Luggage Tag First (Click to check)", 
          checklist: [
            "Personal skincare & cosmetics",
            "Toothbrush & Toothpaste", 
            "Indoor Slippers", 
            "Phone charging cables & multi-port charger",
            "Formal Wear (for formal nights)", 
            "Sportswear & Sneakers (strictly required for the gym)", 
            "Windbreaker/Light Jacket",
            "Swimwear (no air pumps on ship!)",
            "White outfit OR red/white/green for theme nights"
          ] 
        },
        { 
          icon: 'ShieldAlert', title: "Prohibited & Restricted Items", 
          text: "【Strictly Prohibited】Extension cords, curling irons, irons, walkie-talkies, raw meat, fresh fruits & vegetables. Security is very strict — prohibited items will be confiscated permanently.\n【Held by Customs】Alcohol & drinks will be held by customs and returned when you disembark.\n【Allowed】Bottled water, vegetarian instant noodles." 
        }
      ],
      rules: [
      ],
      app: [
        {
          image: IMG.phone,
          icon: 'Smartphone', title: "Step 1: Download & Connect",
          text: "Download 'MSC for Me' BEFORE boarding. Once onboard, turn on airplane mode and connect to the ship's free Wi-Fi. You don't need a paid internet package to use the app!"
        },
        {
          icon: 'MessageCircle', title: "Step 2: Free Intranet Chat",
          text: "Use the built-in Chat feature to add colleagues. Stay connected at sea without spending a dime on internet."
        },
        {
          image: IMG.calendar,
          icon: 'Calendar', title: "Step 3: Daily Program",
          text: "View all daily activities and ship maps. Heart your favorite shows and parties to add them to your personal agenda."
        }
      ],
      onboard: [
        {
          icon: 'Globe', title: "Important Onboard Notes", list: [
            "If your original passport isn't returned after boarding, collect it at the 5F service desk.",
            "Non-Taiwanese passport holders must complete online arrival registration 3 days before returning to Taiwan."
          ]
        },
        { 
          icon: 'Ship', title: "Two Essential Tasks Upon Boarding", list: [
            "1. Safety Drill: Watch the safety video in your cabin → Dial 881 → Bring your cruise card to your designated Assembly Station to swipe in.",
            "2. Link Cruise Card: Link a credit card at the atrium kiosks. Expats without credit cards can deposit USD cash at Deck 5 Reception."
          ] 
        },
        { 
          icon: 'Globe', title: "Language Support", 
          text: "Expats can request the English 'Daily Program' and English menus at the Deck 5 Reception." 
        }
      ],
      hacks: [
        {
          category: "🎉 Limited-Time Deals",
          categoryColor: "purple",
          title: "Typhoon Sea-Day Special: Better Onboard Deals Than the Original Itinerary",
          tips: [
            "🍹 20% off family/kids' health drinks for a limited time",
            "🍺 Special discount on Captain's Bar snacks + beer combo",
            "🍶 20% off shochu and sake at SKY Lounge",
            "🎤 Buy-one-get-one on family karaoke cocktails at TV Studio Lounge",
            "🍫 20% off crepes and sundaes at the Chocolate Workshop",
            "🛍️ Guess up to 50% off on the 1st sea day, Valentino up to 30% off on the 2nd — any purchase enters you into a free raffle",
            "💆 Free skin & hair consultation at the spa",
            "🎬 Behind-the-Scenes Tour special pricing on embarkation day and the 2nd sea day"
          ]
        },
        {
          category: "📸 Photo Spots",
          categoryColor: "rose",
          image: IMG.crystal,
          title: "Swarovski Crystal Staircase: Best Times for Empty Shots",
          tips: [
            "🕕 Golden window #1: 6:30–7:00 PM — first-seating diners head to the restaurant and the staircase empties instantly",
            "🌙 Golden window #2: After midnight — dreamier lighting and virtually nobody around",
            "⬆️ Pro shot: Stand at the top and shoot downward; 61,440 crystals create an awe-inspiring mirror effect below",
            "👗 Outfit tip: Formal wear or flowy dresses look best against the ornate European backdrop",
            "⏰ Worst times: After breakfast (9–11 AM) and after lunch (1–3 PM) are peak crowd hours"
          ]
        },
        {
          category: "📸 Photo Spots",
          categoryColor: "rose",
          image: IMG.galleria,
          title: "The Galleria LED Canopy: Free IMAX-Level Light Show",
          tips: [
            "🌟 The 80-meter LED canopy features different visual shows throughout the day",
            "📷 Viral shot: Lie flat on the floor and shoot straight up — it looks like a movie poster",
            "🎪 Event hub: White Party, Italian Night, and all themed events are held here",
            "🛍️ 250+ duty-free brands — best browsed in the quiet 2–4 PM window"
          ]
        },
        {
          category: "🍽️ Food Hacks",
          categoryColor: "amber",
          image: IMG.lighthouse,
          title: "Main Restaurant: Lobster & The Order-Everything-At-Once Hack",
          tips: [
            "🦞 Lobster Tip: It usually appears on Day 2 dinner — and you can re-order it as many times as you want!",
            "⏱️ Each re-order takes ~20 min. Pro move: order all courses simultaneously when you first sit down",
            "👔 Dress code: Smart casual minimum (no flip-flops or shorts); formal nights require formal attire",
            "🪑 Fixed seating all cruise — same waiter every night. Tip them well for exceptional service"
          ]
        },
        {
          category: "🍽️ Food Hacks",
          categoryColor: "amber",
          image: IMG.buffet,
          title: "Deck 15 Buffet: Hidden Gems Nobody Advertises",
          tips: [
            "🍕 Must-try #1: Late-night thin-crust pizza (fresh from the oven after 11 PM) — many travelers say it's the best food on the ship, and it's free",
            "🧀 Must-try #2: Handmade fresh mozzarella crafted daily onboard — tear it apart and you'll smell the milk",
            "🍱 Taiwan corner: Turnip cake, buns, and other Taiwanese foods appear randomly — worth hunting for",
            "💺 Seating hack: Don't crowd the entrance; walk to the back half of the buffet for spacious, quiet tables"
          ]
        },
        {
          category: "🍽️ Food Hacks",
          categoryColor: "amber",
          image: IMG.steak,
          title: "Specialty Restaurants: Book on Day 1 or You'll Miss Out",
          tips: [
            "🥩 Top pick: Butcher's Cut Steakhouse (Deck 7) — premium steaks in a golden age American setting",
            "🍣 Strong recommend: Kaito Teppanyaki & Sushi Bar (Deck 7) — live teppanyaki show + exquisite Japanese food",
            "🚨 Critical: Open the app on the afternoon of July 9th and book immediately — these fill up fast",
            "💡 Many passengers skip this step. Booking specialty restaurants is MORE urgent than booking shows!"
          ]
        },
        {
          category: "🍽️ Food Hacks",
          categoryColor: "amber",
          image: IMG.chocolate,
          title: "Jean-Philippe Chocolate & Café: French Sweets You Can't Skip",
          tips: [
            "🍫 Curated by world dessert master Jean-Philippe Maury — over a thousand handcrafted French chocolates",
            "☕ Premium coffee and French pastries — the best spot for a relaxed afternoon break",
            "🎁 Great for gifting — beautifully packaged chocolates make a classy souvenir",
            "💡 This is a paid venue, but prices are reasonable — around $5–15 per person"
          ]
        },
        {
          category: "🎭 Entertainment",
          categoryColor: "purple",
          image: IMG.broadway,
          title: "London Theatre: The 5-Minute Booking Sprint",
          tips: [
            "⏰ Bookings open at EXACTLY 00:00 midnight for the following day's shows",
            "⚡ Speed alert: Spots typically sell out within 5 minutes — this is not an exaggeration",
            "🔔 Set it now: Set your own phone alarm or calendar reminder for 23:55",
            "🎭 Two showtimes daily: go for both time slots at midnight; accept whichever one you land",
            "📱 Must be on airplane mode + ship Wi-Fi when you try — confirm your connection first"
          ]
        },
        {
          category: "🎭 Entertainment",
          categoryColor: "purple",
          image: IMG.f1,
          title: "Paid Attractions: The Credit Bundle Saves 20–30%",
          tips: [
            "🏎️ Options: F1 simulator, VR shooting, bowling, and an arcade zone",
            "💡 Must-buy: Credit bundle deals (e.g., pay $70, get $90 in credits) are much better value than paying per game",
            "⏱️ Queue hack: On Naha port day (July 10th), most passengers disembark and the attractions are almost empty",
            "👨‍👩‍👧 Kids split: Under-10s go to the free LEGO Club; older kids and adults should try F1 and VR"
          ]
        },
        {
          category: "💡 Money Savers",
          categoryColor: "emerald",
          image: IMG.waterpark,
          title: "Arizona Water Park: 3 Queue-Free Windows",
          tips: [
            "🏊 Best window #1: Before 10:00 AM — cool breeze, barely anyone there",
            "🌆 Best window #2: After 5:00 PM — golden hour photography and cooler temperatures",
            "⚡ Ultimate hack: On Naha port day (July 10th), the water park is essentially a private pool for those who stay aboard",
            "🩱 Pack: Swimwear, waterproof phone case, sunscreen",
            "⚠️ Must bring: Your own inflatables — there are NO air pumps on the ship!"
          ]
        },
        {
          category: "💡 Money Savers",
          categoryColor: "emerald",
          image: IMG.track,
          title: "Free Onboard Resources Most Passengers Never Use",
          tips: [
            "💧 Water trick: Desalinated water tastes slightly salty. Fill a thermos with hot water from Deck 15 Buffet, let it cool — perfectly drinkable and free",
            "💊 Free seasickness pills: Available at Deck 5 Reception, no prescription needed — just ask",
            "🍊 Natural remedy: Green apples at the buffet are an old crew secret for seasickness",
            "🌙 Late night food: Buffet runs nearly 24/7 — there's always something to eat",
            "🛁 Balcony cabin perk: Room service breakfast is FREE — hang the breakfast card on your door the night before"
          ]
        },
        {
          category: "🎪 Theme Parties",
          categoryColor: "sky",
          image: IMG.cocktail,
          title: "White Party & Italian Night: Full Party Playbook",
          tips: [
            "⬜ White Party: Wear head-to-toe white — the purer the better. This is consistently voted the best night of the cruise",
            "🇮🇹 Italian Night: Wear red, white, or green (Italian flag colors) — the most festive night of the voyage",
            "📍 Location: Galleria (Decks 6–7) — center of the ship, best atmosphere and stage view",
            "🎯 Position: Arrive 30 minutes early and claim a spot in the middle of the Galleria",
            "📸 Photo moment: Shoot 30–45 minutes into the party when the crowd energy peaks"
          ]
        },
        {
          category: "🌸 Spa & Wellness",
          categoryColor: "pink",
          image: IMG.spa,
          title: "MSC Aurea Spa: Bali Therapists & Day-1 Deals",
          tips: [
            "💆 160+ body and facial treatments by specialist Balinese therapists",
            "💡 Boarding day deal: Check for first-day promotional packages — always cheaper than later in the voyage",
            "🎁 Gift idea: Book a couples treatment or surprise your travel partner with a spa afternoon",
            "📅 Book early via the app or at Deck 5 Reception — popular slots fill up fast"
          ]
        },
      ],
      local: [
        {
          image: IMG.okinawa,
          icon: 'MapPin', title: "Japan Immigration Face-to-Face", 
          text: "Everyone must bring a passport copy and cruise card for a face-to-face inspection onboard. Do not lose your stamped copy in Japan!" 
        },
        {
          image: IMG.naha,
          icon: 'MapPin', title: "Naha (Okinawa) Guide", 
          list: [
            "Kokusai Dori: 10 mins by taxi. The main shopping street for tax-free goods, cosmetics, and Wagyu beef.",
            "Naminoue Shrine & Beach: 10 mins by taxi. A beautiful clifftop shrine with an adjacent beach. Perfect for quick photos!",
            "Shuri Castle Park: 20 mins by taxi. Explore the history and culture of the Ryukyu Kingdom."
          ]
        },
        { 
          icon: 'Sparkles', title: "[VIP Priority Disembarkation]", highlight: true, 
          text: "While regular passengers wait in long lines, our company enjoys VIP Priority Disembarkation! Follow the exclusive signs to clear customs quickly and board our private chartered buses. This saves you 1-2 hours of waiting!" 
        },
        { 
          icon: 'Clock', title: "Strict Punctuality", 
          text: "Account for traffic! You MUST head back 1.5 hours before the official departure time. The ship waits for no one." 
        },
        { 
          icon: 'ShoppingBag', title: "Shopping & Customs", 
          text: "STRICTLY FORBIDDEN to bring raw meat, fruit, or fresh food onboard or back to Taiwan. Severe fines apply!" 
        }
      ],
      together: [],
    }
  },

  id: {
    header: "Panduan Eksklusif MSC Bellissima",
    date: "2026 / 07 / 09 - 07 / 12",
    countdownTitle: "Hitung Mundur Naik Kapal",
    timeUnits: ["Hari", "Jam", "Mnt", "Dtk"],
    todayHighlightsTitle: "Sorotan Hari Ini",
    todayNoEvents: "Tidak ada acara besar hari ini — bersantailah!",
    reminderTitle: "Pengingat Pemesanan Pertunjukan",
    reminderDesc: "Pemesanan dibuka jam 00:00 tengah malam. Sangat disarankan untuk mengatur alarm HP atau pengingat kalender Anda sendiri (23:55) agar tidak kehabisan tempat!",
    tabs: [
      { id: 'depart',   label: "📋 Sebelum" },
      { id: 'onboard',  label: "🚢 Di Kapal" },
      { id: 'hacks',    label: "✨ Tips" },
      { id: 'social',   label: "⚓ Catatan Pelayaran" },
      { id: 'bingo',    label: "🎴 Bingo" },
    ],
    together: {
      bingoTitle: "Tantangan Bingo Pelayaran",
      bingoDesc: "Centang 5 kotak dalam satu baris untuk BINGO! Screenshot dan bagikan ke kolega 🎊",
      bingoWinText: "🎉 BINGO! Screenshot dan bagikan ke semua orang!",
      progressUnit: "selesai (termasuk FREE)",
      resetBtn: "Reset Kartu",
      shareTitle: "Panggil Kolega Sekarang",
      shareDesc: "Pilih lokasi Anda dan salin pesan untuk dikirim ke grup chat!",
      shareButton: "📋 Salin Pesan",
      shareCopied: "✅ Tersalin! Paste ke grup!",
      shareTemplate: "📍 Saya sekarang di MSC Bellissima【{location}】! Ayo ke sini! 🚢",
      locations: [
        "Dek 15 Buffet 🍕",
        "Dek 6 Tangga Kristal 💎",
        "Dek 15 Water Park 🌊",
        "Dek 7 Captain's Bar 🍺",
        "Dek 6–7 Galleria 🛍️",
        "Dek 5 Resepsionis ℹ️",
        "Restoran Utama 🍽️",
        "Dek Observasi 🌅",
      ],
      bingoCells: BINGO_ID,
    },
    sections: {
      pre: [
        {
          icon: 'AlertTriangle', title: "[Pemberitahuan Perubahan Rute Topan Bawi]", highlight: true,
          text: "Akibat Topan Super Bawi (No. 9), Kapten telah menyesuaikan rute demi keselamatan: Hari 2 (7/10) dan Hari 3 (7/11) singgah di Naha/Okinawa dibatalkan dan menjadi hari berlayar; keberangkatan Keelung (7/9 17:30) dan kepulangan (7/12 07:00) tidak berubah.\n💰 Kompensasi kredit kapal: USD 50/orang untuk 2 tamu pertama per kabin, USD 25/orang untuk tamu ke-3/4, langsung masuk ke kartu kapal Anda (tidak bisa dicairkan tunai, sisa yang tidak terpakai hangus di akhir pelayaran). Tur darat Naha/Okinawa yang sudah dibayar akan otomatis dikembalikan ke akun kapal Anda.\n⚠️ Ini adalah rute perkiraan saat ini — Kapten mungkin melakukan penyesuaian lebih lanjut berdasarkan kondisi cuaca aktual. Mohon ikuti pengumuman terbaru di kapal."
        },
        {
          icon: 'Sparkles', title: "【Pengaturan Jemputan & Titik Kumpul】", highlight: true,
          text: "Harap berkumpul di Stasiun Taipei Gerbang Timur 3 pukul 11:45-12:00 pada 9 Juli. Staf Southeast Travel (rompi biru) akan membantu absensi — bus berangkat tepat jam 12:00 menuju Pelabuhan Keelung!"
        },
        { 
          image: IMG.passport,
          icon: 'AlertTriangle', title: "Peraturan Paspor & Ekspatriat", highlight: true, 
          text: "Warga Taiwan: Paspor Asli + 2 Fotokopi.\nEkspatriat: WAJIB bawa ARC Taiwan Anda. Harap verifikasi visa Jepang. Tanpa visa = Tidak bisa naik!" 
        },
        {
          icon: 'CheckSquare', title: "Pemeriksaan Sebelum Berangkat, Barang Bawaan (Klik untuk centang)",
          checklist: [
            "Ponsel",
            "Paspor Asli (Masa berlaku > 6 bulan)",
            "Fotokopi Paspor (2 lembar, rasio A4 1:1)",
            "Taiwan ARC (Untuk rekan asing)",
            "Dompet (Kartu kredit, Uang tunai) & Sedikit uang asing (JPY, USD)",
            "Obat-obatan pribadi (mabuk laut, sakit perut, flu)",
            "Perlindungan matahari (kacamata hitam, tabir surya, topi)",
            "Jas hujan / Payung lipat"
          ]
        },
        { 
          image: IMG.luggage,
          icon: 'CheckSquare', title: "Daftar Barang Bawaan, Ikat Label Bagasi Dulu (Klik untuk centang)", 
          checklist: [
            "Perawatan kulit & kosmetik",
            "Sikat Gigi & Pasta Gigi", 
            "Sandal Dalam Ruangan", 
            "Kabel charger & kepala charger multi-port",
            "Pakaian Formal", 
            "Pakaian Olahraga & Sepatu Kets", 
            "Jaket Ringan/Tahan Angin",
            "Baju Renang (tidak ada pompa angin di kapal!)",
            "Baju putih atau warna merah/putih/hijau untuk pesta bertema"
          ] 
        },
        { 
          icon: 'ShieldAlert', title: "Barang Terlarang & Dibatasi", 
          text: "【Dilarang Keras】Kabel roll, catokan rambut, setrika, walkie-talkie, daging mentah, buah & sayur segar. Pemeriksaan keamanan sangat ketat — barang terlarang akan disita permanen.\n【Ditahan Bea Cukai】Minuman beralkohol akan ditahan bea cukai dan dikembalikan saat turun kapal.\n【Boleh Dibawa】Air mineral, mi instan vegetarian." 
        }
      ],
      rules: [
      ],
      app: [
        {
          image: IMG.phone,
          icon: 'Smartphone', title: "Langkah 1: Unduh & Hubungkan",
          text: "Unduh 'MSC for Me' SEBELUM naik kapal. Nyalakan mode pesawat dan gunakan Wi-Fi kapal gratis untuk semua fitur aplikasi!"
        },
        {
          icon: 'MessageCircle', title: "Langkah 2: Chat Gratis",
          text: "Gunakan fitur Chat untuk menghubungi rekan kerja tanpa perlu paket internet berbayar."
        },
        {
          image: IMG.calendar,
          icon: 'Calendar', title: "Langkah 3: Jadwal Harian",
          text: "Lihat jadwal harian dan simpan aktivitas favorit Anda di agenda pribadi."
        }
      ],
      onboard: [
        {
          icon: 'Globe', title: "Catatan Penting di Kapal", list: [
            "Jika paspor asli Anda tidak dikembalikan setelah naik kapal, ambil di meja layanan 5F.",
            "Pemegang paspor non-Taiwan wajib menyelesaikan pendaftaran kedatangan online 3 hari sebelum kembali ke Taiwan."
          ]
        },
        { 
          icon: 'Ship', title: "Dua Hal Penting Saat Naik", list: [
            "1. Latihan Keselamatan: Tonton video → Tekan 881 → Bawa kartu pesiar ke Assembly Station.",
            "2. Tautkan Kartu Kredit: Di kios di atrium. Ekspatriat tanpa kartu kredit bisa deposit uang tunai USD di Dek 5."
          ] 
        },
        { 
          icon: 'Globe', title: "Layanan Bahasa", 
          text: "Ekspatriat dapat meminta 'Daily Program' bahasa Inggris di Resepsionis Dek 5." 
        }
      ],
      hacks: [
        {
          category: "🎉 Promo Terbatas",
          categoryColor: "purple",
          title: "Spesial Hari Berlayar Akibat Topan: Promo Kapal Lebih Untung dari Rencana Awal",
          tips: [
            "🍹 Diskon 20% minuman sehat keluarga/anak untuk waktu terbatas",
            "🍺 Diskon spesial camilan + paket bir di Captain's Bar",
            "🍶 Diskon 20% shochu dan sake di SKY Lounge",
            "🎤 Beli 1 gratis 1 koktail karaoke keluarga di TV Studio Lounge",
            "🍫 Diskon 20% crepe dan sundae di Chocolate Workshop",
            "🛍️ Guess diskon hingga 50% di hari berlayar pertama, Valentino hingga 30% di hari kedua — belanja langsung ikut undian gratis",
            "💆 Konsultasi kulit & rambut gratis di spa",
            "🎬 Harga spesial Behind-the-Scenes Tour di hari embarkasi dan hari berlayar kedua"
          ]
        },
        {
          category: "📸 Spot Foto",
          categoryColor: "rose",
          image: IMG.crystal,
          title: "Tangga Kristal Swarovski: Waktu Terbaik untuk Foto Sepi",
          tips: [
            "🕕 Jam emas #1: Pukul 18:30–19:00 saat tamu makan malam, tangga langsung sepi",
            "🌙 Jam emas #2: Setelah tengah malam — pencahayaan lebih dramatis, hampir tidak ada orang",
            "⬆️ Tips foto: Berdiri di atas dan potret ke bawah, 61.440 kristal membentuk refleksi memukau",
            "👗 Pilihan baju: Pakaian formal atau gaun mengalir paling cocok dengan estetika tangga ini",
            "⏰ Hindari: Pagi setelah sarapan dan sore setelah makan siang — saat paling ramai"
          ]
        },
        {
          category: "📸 Spot Foto",
          categoryColor: "rose",
          image: IMG.galleria,
          title: "Galleria Kanopi LED: Pertunjukan Cahaya Gratis Setara IMAX",
          tips: [
            "🌟 Kanopi LED 80 meter menampilkan pertunjukan visual berbeda sepanjang hari",
            "📷 Foto viral: Berbaring di lantai dan potret ke atas — hasilnya seperti poster film",
            "🎪 Pusat acara: Pesta Putih, Malam Italia, dan semua acara bertema diadakan di sini",
            "🛍️ 250+ merek bebas pajak — waktu terbaik menjelajah pukul 14:00–16:00 saat sepi"
          ]
        },
        {
          category: "🍽️ Tips Makanan",
          categoryColor: "amber",
          image: IMG.buffet,
          title: "Buffet Dek 15: Makanan Tersembunyi yang Tidak Banyak Diketahui",
          tips: [
            "🍕 Wajib coba #1: Pizza tipis panggang segar setelah pukul 23:00 — gratis dan luar biasa enak",
            "🧀 Wajib coba #2: Mozzarella buatan tangan segar setiap hari — robek dan cium aromanya",
            "💺 Tips tempat duduk: Jangan berdesakan di pintu masuk, jalan ke bagian belakang yang lebih lega",
            "⏰ Buka hampir 20 jam sehari — selalu ada makanan bahkan tengah malam"
          ]
        },
        {
          category: "🍽️ Tips Makanan",
          categoryColor: "amber",
          image: IMG.lighthouse,
          title: "Restoran Utama: Lobster Gratis Tak Terbatas",
          tips: [
            "🦞 Lobster biasanya muncul di menu makan malam Hari ke-2 — bisa dipesan ulang tak terbatas!",
            "💡 Trik jitu: Pesan semua kursus sekaligus di awal — tidak perlu menunggu lama",
            "👔 Kode berpakaian: Smart casual minimum; malam formal memerlukan pakaian formal"
          ]
        },
        {
          category: "🍽️ Tips Makanan",
          categoryColor: "amber",
          image: IMG.steak,
          title: "Restoran Spesial: Pesan di Hari Pertama atau Kehabisan",
          tips: [
            "🥩 Pilihan utama: Butcher's Cut Steakhouse (Dek 7) — steak premium dengan suasana Amerika klasik",
            "🍣 Sangat direkomendasikan: Kaito Teppanyaki & Sushi Bar (Dek 7) — pertunjukan teppanyaki langsung + makanan Jepang lezat",
            "🚨 Penting: Buka aplikasi sore hari 9 Juli dan langsung pesan — cepat penuh!",
            "💡 Banyak yang melewatkan ini. Pesan restoran spesial lebih penting daripada pesan tiket pertunjukan!"
          ]
        },
        {
          category: "🍽️ Tips Makanan",
          categoryColor: "amber",
          image: IMG.chocolate,
          title: "Jean-Philippe Chocolate & Café: Manisnya Prancis yang Wajib Coba",
          tips: [
            "🍫 Diracik oleh maestro dessert dunia Jean-Philippe Maury — lebih dari seribu jenis cokelat Prancis buatan tangan",
            "☕ Tersedia kopi premium dan dessert Prancis — tempat terbaik untuk santai sore hari",
            "🎁 Cokelat cocok jadi oleh-oleh — kemasannya elegan",
            "💡 Ini item berbayar, tapi harganya terjangkau, sekitar $5–15 per orang"
          ]
        },
        {
          category: "🎭 Hiburan",
          categoryColor: "purple",
          image: IMG.broadway,
          title: "London Theatre: Cara Dapat Tiket dalam 5 Menit",
          tips: [
            "⏰ Pemesanan dibuka tepat pukul 00:00 untuk pertunjukan keesokan harinya",
            "⚡ Tiket habis dalam 5 menit — ini bukan lebay, ini fakta",
            "🔔 Segera: Atur alarm HP atau pengingat kalender Anda sendiri untuk 23:55",
            "📱 Harus dalam mode pesawat + Wi-Fi kapal saat mencoba"
          ]
        },
        {
          category: "🎭 Hiburan",
          categoryColor: "purple",
          image: IMG.f1,
          title: "Wahana Berbayar: Paket Kredit Hemat 20–30%",
          tips: [
            "🏎️ Pilihan: Simulator F1, VR shooting, bowling, dan zona arcade",
            "💡 Wajib beli: Paket kredit (misal isi $70 dapat $90) jauh lebih hemat daripada bayar per permainan",
            "⏱️ Waktu terbaik: Saat berlabuh di Naha (10 Juli), sebagian besar turun kapal — wahana nyaris kosong!",
            "👨‍👩‍👧 Pembagian anak: Di bawah 10 tahun ke LEGO Club gratis; anak besar dan dewasa coba F1 dan VR"
          ]
        },
        {
          category: "💡 Hemat",
          categoryColor: "emerald",
          image: IMG.waterpark,
          title: "Water Park Arizona: Waktu Tanpa Antrian",
          tips: [
            "🏊 Terbaik: Sebelum pukul 10:00 atau setelah pukul 17:00",
            "⚡ Trik utama: Saat berlabuh di Naha (10 Juli), hampir semua orang turun — water park nyaris kosong!",
            "⚠️ Ingat: Bawa pelampung sendiri — tidak ada pompa angin di kapal!"
          ]
        },
        {
          category: "💡 Hemat",
          categoryColor: "emerald",
          image: IMG.track,
          title: "Panduan Lengkap Fasilitas Gratis di Kapal",
          tips: [
            "💧 Trik air: Air desalinasi terasa sedikit asin. Bawa termos, isi air panas di Buffet Dek 15, biarkan dingin — bebas rasa asin dan gratis",
            "💊 Obat mabuk laut gratis: Tersedia di Resepsionis Dek 5, tanpa resep — tinggal minta",
            "🍊 Obat alami: Apel hijau di buffet adalah rahasia awak kapal untuk mabuk laut",
            "🌙 Makan malam larut: Buffet buka hampir 24 jam — selalu ada makanan",
            "🛁 Keuntungan kabin balkon: Sarapan layanan kamar GRATIS — gantung kartu sarapan di pintu malam sebelumnya"
          ]
        },
        {
          category: "🎪 Pesta Tema",
          categoryColor: "sky",
          image: IMG.cocktail,
          title: "Pesta Putih & Malam Italia: Panduan Lengkap",
          tips: [
            "⬜ Pesta Putih: Pakaian serba putih — semakin putih semakin bagus",
            "🇮🇹 Malam Italia: Pakai merah, putih, atau hijau (warna bendera Italia)",
            "📍 Lokasi: Galleria (Dek 6–7) — datang 30 menit lebih awal untuk posisi terbaik"
          ]
        },
        {
          category: "🌸 Spa & Relaksasi",
          categoryColor: "pink",
          image: IMG.spa,
          title: "MSC Aurea Spa: Terapis Bali & Promo Hari Pertama",
          tips: [
            "💆 160+ perawatan tubuh dan wajah oleh terapis profesional Bali",
            "💡 Promo hari pertama: Biasanya ada paket promosi hari pertama — lebih murah dari hari-hari berikutnya",
            "🎁 Ide hadiah: Pesan perawatan berdua dengan pasangan, momen romantis di kapal pesiar",
            "📅 Sangat disarankan pesan lebih awal (via aplikasi atau Resepsionis Dek 5) — slot populer cepat penuh"
          ]
        },
      ],
      local: [
        {
          image: IMG.okinawa,
          icon: 'MapPin', title: "Imigrasi Jepang", 
          text: "Wajib bawa fotokopi paspor dan kartu pesiar untuk inspeksi di atas kapal. Jangan hilangkan fotokopi yang sudah dicap!" 
        },
        {
          image: IMG.naha,
          icon: 'MapPin', title: "Tur Naha (Okinawa)", 
          list: [
            "Kokusai Dori: 10 menit taksi. Jalan perbelanjaan utama untuk kosmetik, barang bebas pajak, dan daging Wagyu.",
            "Kuil Naminoue & Pantai: 10 menit taksi. Kuil di atas tebing dengan pantai cantik di sebelahnya — spot foto!",
            "Taman Kastil Shuri: 20 menit taksi. Jelajahi sejarah Kerajaan Ryukyu."
          ]
        },
        { 
          icon: 'Sparkles', title: "[Prioritas Turun Kapal VIP]", highlight: true, 
          text: "Perusahaan kita mendapat Prioritas Turun Kapal VIP! Langsung keluar menuju bus pribadi kita. Hemat 1-2 jam!" 
        },
        { 
          icon: 'Clock', title: "Ketepatan Waktu", 
          text: "Perhitungkan macet! Kembali ke kapal 1.5 jam sebelum waktu keberangkatan. Kapal tidak menunggu!" 
        },
        { 
          icon: 'ShoppingBag', title: "Bea Cukai", 
          text: "DILARANG KERAS membawa daging mentah, buah, atau makanan segar Jepang ke kapal atau kembali ke Taiwan!" 
        }
      ],
      together: [],
    }
  },

  th: {
    header: "คู่มือพิเศษ MSC Bellissima",
    date: "2026 / 07 / 09 - 07 / 12",
    countdownTitle: "นับถอยหลังขึ้นเรือ",
    timeUnits: ["วัน", "ชม", "นาที", "วินาที"],
    todayHighlightsTitle: "ไฮไลต์วันนี้",
    todayNoEvents: "วันนี้ไม่มีกิจกรรมใหญ่ พักผ่อนให้เต็มที่!",
    reminderTitle: "เตือนการจองโชว์",
    reminderDesc: "จองการแสดงเปิดเวลา 00:00 น. แนะนำให้ตั้งนาฬิกาปลุกหรือการแจ้งเตือนในปฏิทินของคุณเอง (23:55) เพื่อไม่ให้พลาด!",
    tabs: [
      { id: 'depart',   label: "📋 ก่อนออก" },
      { id: 'onboard',  label: "🚢 บนเรือ" },
      { id: 'hacks',    label: "✨ เคล็ดลับ" },
      { id: 'social',   label: "⚓ บันทึกการเดินเรือ" },
      { id: 'bingo',    label: "🎴 บิงโก" },
    ],
    together: {
      bingoTitle: "บิงโกท้าทายการเดินทาง",
      bingoDesc: "ทำเครื่องหมาย 5 ช่องในแนวเดียวกันเพื่อ BINGO! ถ่ายหน้าจอแชร์ให้เพื่อนร่วมงาน 🎊",
      bingoWinText: "🎉 BINGO! ถ่ายหน้าจอและแชร์ให้ทุกคน!",
      progressUnit: "สำเร็จแล้ว (รวม FREE)",
      resetBtn: "รีเซ็ตการ์ด",
      shareTitle: "เรียกเพื่อนร่วมงานด่วน",
      shareDesc: "เลือกตำแหน่งของคุณและคัดลอกข้อความส่งในกลุ่มแชท!",
      shareButton: "📋 คัดลอกข้อความ",
      shareCopied: "✅ คัดลอกแล้ว! วางในแชทกลุ่มได้เลย!",
      shareTemplate: "📍 ตอนนี้ฉันอยู่ที่ MSC Bellissima【{location}】! มาหาฉันเร็วๆ! 🚢",
      locations: [
        "ดาดฟ้า 15 บุฟเฟ่ต์ 🍕",
        "ดาดฟ้า 6 บันไดคริสตัล 💎",
        "ดาดฟ้า 15 วอเตอร์พาร์ค 🌊",
        "ดาดฟ้า 7 แคปเทนบาร์ 🍺",
        "ดาดฟ้า 6–7 Galleria 🛍️",
        "ดาดฟ้า 5 เคาน์เตอร์บริการ ℹ️",
        "ห้องอาหารหลัก 🍽️",
        "ดาดฟ้าชมวิว 🌅",
      ],
      bingoCells: BINGO_TH,
    },
    sections: {
      pre: [
        {
          icon: 'AlertTriangle', title: "[ประกาศเปลี่ยนแปลงเส้นทาง ไต้ฝุ่น \"บาวี\"]", highlight: true,
          text: "เนื่องจากซูเปอร์ไต้ฝุ่นบาวี (ลูกที่ 9) กัปตันได้ปรับเส้นทางเดินเรือเพื่อความปลอดภัย: วันที่ 2 (10 ก.ค.) และวันที่ 3 (11 ก.ค.) การแวะจอดที่นาฮะ/โอกินาว่าถูกยกเลิกและเปลี่ยนเป็นวันล่องทะเล ส่วนการออกเดินทางจากจีหลง (9 ก.ค. 17:30 น.) และกลับถึงจีหลง (12 ก.ค. 07:00 น.) ไม่มีการเปลี่ยนแปลง\n💰 เงินชดเชยเครดิตบนเรือ: 50 ดอลลาร์สหรัฐ/คน สำหรับผู้โดยสาร 2 ท่านแรกต่อห้อง, 25 ดอลลาร์สหรัฐ/คน สำหรับท่านที่ 3/4 เข้าบัตรเรือโดยตรง (ไม่สามารถถอนเป็นเงินสดได้ ยอดที่ใช้ไม่หมดจะไม่ได้รับคืนเมื่อสิ้นสุดการเดินทาง) ทัวร์บนฝั่งที่นาฮะ/โอกินาว่าที่จองไว้จะได้รับเงินคืนเข้าบัญชีบนเรือโดยอัตโนมัติ\n⚠️ นี่คือเส้นทางโดยประมาณในปัจจุบัน กัปตันอาจปรับเปลี่ยนเพิ่มเติมตามสภาพอากาศจริง โปรดติดตามประกาศล่าสุดบนเรือ"
        },
        {
          icon: 'Sparkles', title: "【การรับส่งและจุดนัดพบ】", highlight: true,
          text: "โปรดมารวมตัวกันที่สถานีรถไฟไทเป ประตูตะวันออก 3 เวลา 11:45-12:00 น. วันที่ 9 กรกฎาคม เจ้าหน้าที่ Southeast Travel (เสื้อกั๊กสีน้ำเงิน) จะช่วยเช็คชื่อ รถจะออกเวลา 12:00 น. ตรง มุ่งหน้าท่าเรือจีหลง!"
        },
        { 
          image: IMG.passport,
          icon: 'AlertTriangle', title: "ระเบียบพาสปอร์ต & ชาวต่างชาติ", highlight: true, 
          text: "ไต้หวัน: พาสปอร์ตตัวจริง + สำเนา 2 ใบ\nชาวต่างชาติ: ต้องนำบัตร ARC ไต้หวันมาด้วย โปรดตรวจสอบเรื่องวีซ่าญี่ปุ่น หากไม่มีวีซ่าจะถูกปฏิเสธไม่ให้ขึ้นเรือ!" 
        },
        {
          icon: 'CheckSquare', title: "ตรวจสอบก่อนออกเดินทาง สิ่งของติดตัว (คลิกเพื่อทำเครื่องหมาย)",
          checklist: [
            "โทรศัพท์มือถือ",
            "พาสปอร์ตตัวจริง (อายุ > 6 เดือน)",
            "สำเนาพาสปอร์ต (2 ฉบับ ขนาด A4 1:1)",
            "ARC ไต้หวัน (สำหรับพนักงานต่างชาติ)",
            "กระเป๋าสตางค์ (บัตรเครดิต, เงินสด) & เงินสดสกุลต่างประเทศเล็กน้อย (เยน, ดอลลาร์สหรัฐ)",
            "ยาประจำตัว (ยาแก้เมารถ, ยาแก้ปวดท้อง, ยาแก้หวัด)",
            "อุปกรณ์กันแดด (แว่นกันแดด, ครีมกันแดด, หมวก)",
            "อุปกรณ์กันฝน (ร่มพับ, เสื้อกันฝน)"
          ]
        },
        { 
          image: IMG.luggage,
          icon: 'CheckSquare', title: "รายการสัมภาระ มัดป้ายกระเป๋าก่อน (คลิกเพื่อทำเครื่องหมาย)", 
          checklist: [
            "ผลิตภัณฑ์ดูแลผิวและเครื่องสำอาง",
            "แปรงสีฟัน & ยาสีฟัน", 
            "รองเท้าแตะใส่ในห้อง", 
            "สายชาร์จโทรศัพท์และหัวชาร์จแบบหลายพอร์ต",
            "ชุดทางการ", 
            "ชุดกีฬา & รองเท้าผ้าใบ", 
            "เสื้อกันลม/แจ็คเก็ตบาง",
            "ชุดว่ายน้ำ (ไม่มีที่สูบลมบนเรือ!)",
            "ชุดสีขาว หรือชุดสีแดง/ขาว/เขียว สำหรับปาร์ตี้ธีม"
          ] 
        },
        { 
          icon: 'ShieldAlert', title: "สิ่งของต้องห้ามและจำกัด", 
          text: "【ห้ามเด็ดขาด】ปลั๊กพ่วง เครื่องม้วนผม เตารีด วอล์คกี้ทอล์คกี้ เนื้อสัตว์สด ผักผลไม้สด ตรวจเข้มงวดมาก ของต้องห้ามจะถูกยึดถาวร\n【ศุลกากรเก็บรักษา】เครื่องดื่มแอลกอฮอล์จะถูกศุลกากรเก็บรักษาไว้ และคืนให้เมื่อลงเรือ\n【นำขึ้นเรือได้】น้ำแร่ บะหมี่กึ่งสำเร็จรูปมังสวิรัติ" 
        }
      ],
      rules: [
      ],
      app: [
        {
          image: IMG.phone,
          icon: 'Smartphone', title: "ขั้นตอน 1: ดาวน์โหลดแอป",
          text: "ดาวน์โหลด 'MSC for Me' ก่อนขึ้นเรือ เชื่อมต่อ Wi-Fi อินทราเน็ตฟรีเพื่อใช้งานแอปทุกฟีเจอร์!"
        },
        {
          icon: 'MessageCircle', title: "ขั้นตอน 2: แชทฟรี",
          text: "ใช้ฟีเจอร์ Chat เพื่อติดต่อเพื่อนร่วมงานได้ฟรี ไม่ต้องซื้อแพ็กเกจอินเทอร์เน็ต"
        },
        {
          image: IMG.calendar,
          icon: 'Calendar', title: "ขั้นตอน 3: ตารางกิจกรรม",
          text: "ดูกิจกรรมและโชว์ที่คุณชื่นชอบ บันทึกลงในตารางส่วนตัวได้เลย"
        }
      ],
      onboard: [
        {
          icon: 'Globe', title: "ข้อควรรู้สำคัญบนเรือ", list: [
            "หากพาสปอร์ตตัวจริงไม่ได้คืนหลังขึ้นเรือ ให้ไปรับที่เคาน์เตอร์บริการชั้น 5F",
            "ผู้ถือพาสปอร์ตที่ไม่ใช่ไต้หวัน ต้องลงทะเบียนเข้าประเทศออนไลน์ล่วงหน้า 3 วันก่อนเดินทางกลับไต้หวัน"
          ]
        },
        { 
          icon: 'Ship', title: "สองสิ่งที่ต้องทำเมื่อขึ้นเรือ", list: [
            "1. ฝึกซ้อมความปลอดภัย: ดูวิดีโอ → กด 881 → นำบัตรไปรูดที่จุดรวมพล",
            "2. เชื่อมบัตรเครดิตที่ตู้บริเวณโถงกลาง"
          ] 
        },
        { 
          icon: 'Globe', title: "การสนับสนุนด้านภาษา", 
          text: "ขอรับตารางกิจกรรมประจำวันภาษาอังกฤษได้ที่เคาน์เตอร์ชั้น 5" 
        }
      ],
      hacks: [
        {
          category: "🎉 โปรโมชั่นจำกัดเวลา",
          categoryColor: "purple",
          title: "พิเศษวันล่องทะเลจากไต้ฝุ่น: โปรบนเรือคุ้มกว่าแผนเดิม",
          tips: [
            "🍹 เครื่องดื่มสุขภาพครอบครัว/เด็ก ลด 20% ช่วงเวลาจำกัด",
            "🍺 ส่วนลดพิเศษ ของว่าง+เบียร์ ที่ Captain's Bar",
            "🍶 โชจูและสาเก ลด 20% ที่ SKY Lounge",
            "🎤 ค็อกเทลคาราโอเกะครอบครัว ซื้อ 1 แถม 1 ที่ TV Studio Lounge",
            "🍫 เครปและซันเดย์ ลด 20% ที่ Chocolate Workshop",
            "🛍️ Guess ลดสูงสุด 50% วันล่องทะเลแรก, Valentino ลดสูงสุด 30% วันล่องทะเลที่สอง ซื้อสินค้าลุ้นรับรางวัลฟรี",
            "💆 ตรวจผิวและเส้นผมฟรีที่สปา",
            "🎬 ราคาพิเศษ Behind-the-Scenes Tour วันขึ้นเรือและวันล่องทะเลที่สอง"
          ]
        },
        {
          category: "📸 จุดถ่ายรูป",
          categoryColor: "rose",
          image: IMG.crystal,
          title: "บันไดคริสตัล Swarovski: เวลาที่ดีที่สุดสำหรับภาพสวยๆ",
          tips: [
            "🕕 ช่วงทอง #1: เวลา 18:30–19:00 น. ผู้โดยสารย้ายไปอาหารเย็น บันไดว่างทันที",
            "🌙 ช่วงทอง #2: หลังเที่ยงคืน — แสงไฟสวยงามที่สุด แทบไม่มีคน",
            "⬆️ เทคนิคถ่ายรูป: ยืนด้านบนถ่ายลงมา คริสตัล 61,440 เม็ดสร้างการสะท้อนน่าทึ่ง",
            "👗 ชุดที่เหมาะ: ชุดแต่งงาน/ชุดราตรีหรือชุดยาวพลิ้วไหว ดูดีมากกับฉากหลัง"
          ]
        },
        {
          category: "📸 จุดถ่ายรูป",
          categoryColor: "rose",
          image: IMG.galleria,
          title: "Galleria หลังคา LED: โชว์แสงสีฟรีระดับ IMAX",
          tips: [
            "🌟 หลังคา LED ยาว 80 เมตร มีโชว์แสงสีต่างกันตลอดวัน ชมฟรี",
            "📷 มุมถ่ายรูปฮิต: นอนราบกับพื้นแล้วถ่ายขึ้นฟ้า ได้ภาพเหมือนโปสเตอร์หนัง",
            "🎪 ศูนย์กลางงานปาร์ตี้: White Party, Italian Night และงานธีมทั้งหมดจัดที่นี่",
            "🛍️ ร้านค้าปลอดภาษีกว่า 250 แบรนด์ ช่วงเวลาคนน้อย 14:00–16:00 น."
          ]
        },
        {
          category: "🍽️ เคล็ดลับอาหาร",
          categoryColor: "amber",
          image: IMG.buffet,
          title: "บุฟเฟ่ต์ชั้น 15: อาหารซ่อนเร้นที่ไม่มีใครบอกคุณ",
          tips: [
            "🍕 ต้องลอง #1: พิซซ่าแป้งบางอบสดหลัง 23:00 น. — ฟรีและอร่อยมาก",
            "🧀 ต้องลอง #2: มอสซาเรลล่าทำมือสดทุกวัน — ฉีกดมกลิ่นนมสดได้เลย",
            "💺 เทคนิคหาที่นั่ง: อย่าแออัดที่ทางเข้า เดินไปด้านหลังที่นั่งกว้างและเงียบกว่า"
          ]
        },
        {
          category: "🍽️ เคล็ดลับอาหาร",
          categoryColor: "amber",
          image: IMG.lighthouse,
          title: "ห้องอาหารหลัก: กุ้งล็อบสเตอร์ฟรีไม่อั้น",
          tips: [
            "🦞 กุ้งล็อบสเตอร์มักปรากฏในเมนูมื้อค่ำวันที่ 2 — สั่งซ้ำได้ไม่จำกัด!",
            "💡 เทคนิค: สั่งทุกคอร์สพร้อมกันตั้งแต่ต้น ไม่ต้องรอนาน",
            "👔 การแต่งกาย: Smart casual ขึ้นไป คืน Formal Night แต่งเต็มยศ"
          ]
        },
        {
          category: "🍽️ เคล็ดลับอาหาร",
          categoryColor: "amber",
          image: IMG.steak,
          title: "ร้านอาหารพิเศษ: จองวันแรกไม่งั้นพลาด",
          tips: [
            "🥩 ตัวเลือกอันดับ 1: Butcher's Cut Steakhouse (ชั้น 7) — สเต็กระดับพรีเมียม บรรยากาศอเมริกันคลาสสิก",
            "🍣 แนะนำมาก: Kaito Teppanyaki & Sushi Bar (ชั้น 7) — โชว์เทปันยากิสดพร้อมอาหารญี่ปุ่นรสเลิศ",
            "🚨 สำคัญ: เปิดแอปช่วงบ่ายวันที่ 9 ก.ค. แล้วจองทันที — เต็มเร็วมาก",
            "💡 หลายคนพลาดจุดนี้ การจองร้านอาหารพิเศษสำคัญกว่าการจองรอบการแสดง!"
          ]
        },
        {
          category: "🍽️ เคล็ดลับอาหาร",
          categoryColor: "amber",
          image: IMG.chocolate,
          title: "Jean-Philippe Chocolate & Café: ของหวานฝรั่งเศสที่ไม่ควรพลาด",
          tips: [
            "🍫 ควบคุมโดยปรมาจารย์ของหวานระดับโลก Jean-Philippe Maury — ช็อกโกแลตฝรั่งเศสทำมือกว่าพันแบบ",
            "☕ มีกาแฟพรีเมียมและของหวานฝรั่งเศส เหมาะพักผ่อนยามบ่าย",
            "🎁 ช็อกโกแลตเหมาะเป็นของฝาก บรรจุภัณฑ์สวยหรู",
            "💡 เป็นรายการเสียเงิน แต่ราคาไม่แพง เฉลี่ยคนละ $5–15"
          ]
        },
        {
          category: "🎭 บันเทิง",
          categoryColor: "purple",
          image: IMG.broadway,
          title: "London Theatre: วิธีจองตั๋วใน 5 นาที",
          tips: [
            "⏰ จองเปิดเวลา 00:00 น. ตรงสำหรับการแสดงวันถัดไป",
            "⚡ ตั๋วหมดภายใน 5 นาที — ไม่ได้พูดเกินจริง",
            "🔔 ตั้งนาฬิกาปลุกหรือการแจ้งเตือนในปฏิทินของคุณเองเวลา 23:55 น.",
            "📱 ต้องอยู่ในโหมดเครื่องบิน + Wi-Fi เรือเมื่อพยายามจอง"
          ]
        },
        {
          category: "🎭 บันเทิง",
          categoryColor: "purple",
          image: IMG.f1,
          title: "เครื่องเล่นเสียเงิน: แพ็กเกจเติมเงินประหยัด 20–30%",
          tips: [
            "🏎️ ตัวเลือก: ซิมูเลเตอร์ F1, VR ยิงปืน, โบว์ลิ่ง และโซนเกมอาเขต",
            "💡 ควรซื้อ: แพ็กเกจเติมเงิน (เช่น เติม $70 ได้ $90) คุ้มกว่าจ่ายทีละครั้งมาก",
            "⏱️ เวลาดีที่สุด: วันจอดที่นาฮะ (10 ก.ค.) คนส่วนใหญ่ลงเรือ เครื่องเล่นว่างเกือบหมด!",
            "👨‍👩‍👧 แบ่งตามวัย: เด็กต่ำกว่า 10 ปีไป LEGO Club ฟรี เด็กโตและผู้ใหญ่ลอง F1 กับ VR"
          ]
        },
        {
          category: "💡 ประหยัด",
          categoryColor: "emerald",
          image: IMG.waterpark,
          title: "วอเตอร์พาร์ค Arizona: 3 ช่วงเวลาที่ไม่ต้องรอคิว",
          tips: [
            "🏊 ดีที่สุด #1: ก่อน 10:00 น. อากาศเย็น คนน้อยมาก",
            "🌆 ดีที่สุด #2: หลัง 17:00 น. แสงตะวันตกสวยงาม อุณหภูมิดี",
            "⚡ เคล็ดลับสุดยอด: วันจอดที่นาฮะ (10 ก.ค.) ผู้โดยสารส่วนใหญ่ลงเรือ วอเตอร์พาร์คว่างเปล่า!",
            "⚠️ อย่าลืม: ต้องนำห่วงยางมาเอง — ไม่มีที่สูบลมบนเรือ!"
          ]
        },
        {
          category: "💡 ประหยัด",
          categoryColor: "emerald",
          image: IMG.track,
          title: "คู่มือฉบับสมบูรณ์ ของฟรีบนเรือที่คุณอาจไม่รู้",
          tips: [
            "💧 เทคนิคน้ำดื่ม: น้ำจากเครื่องกลั่นเค็มนิดๆ ให้นำกระบอกน้ำไปเติมน้ำร้อนที่บุฟเฟ่ต์ชั้น 15 รอเย็นแล้วดื่มได้ ไม่เค็มและฟรี",
            "💊 ยาเมาเรือฟรี: ขอได้ที่เคาน์เตอร์ชั้น 5 ไม่ต้องมีใบสั่งยา",
            "🍊 สูตรลับแก้เมา: แอปเปิ้ลเขียวที่บุฟเฟ่ต์ เป็นเคล็ดลับของลูกเรือรุ่นเก่า",
            "🌙 มื้อดึก: บุฟเฟ่ต์เปิดเกือบ 24 ชั่วโมง มีของกินตลอด",
            "🛁 สิทธิพิเศษห้องระเบียง: อาหารเช้าส่งถึงห้องฟรี แขวนบัตรอาหารเช้าที่ประตูคืนก่อนหน้า"
          ]
        },
        {
          category: "🎪 ปาร์ตี้ธีม",
          categoryColor: "sky",
          image: IMG.cocktail,
          title: "White Party & Italian Night: คู่มือฉบับสมบูรณ์",
          tips: [
            "⬜ White Party: ชุดขาวล้วนทั้งตัว — ยิ่งขาวยิ่งดี",
            "🇮🇹 Italian Night: ใส่แดง ขาว หรือเขียว (สีธงอิตาลี)",
            "📍 สถานที่: Galleria (ดาดฟ้า 6–7) มาก่อน 30 นาทีเพื่อจองพื้นที่กลาง"
          ]
        },
        {
          category: "🌸 สปาและผ่อนคลาย",
          categoryColor: "pink",
          image: IMG.spa,
          title: "MSC Aurea Spa: นักบำบัดชาวบาหลีและโปรวันแรก",
          tips: [
            "💆 ทรีตเมนต์ตัวและหน้ากว่า 160 รายการ โดยนักบำบัดมืออาชีพชาวบาหลี",
            "💡 โปรวันแรก: มักมีแพ็กเกจโปรโมชั่นวันแรกที่ขึ้นเรือ ราคาถูกกว่าวันหลังๆ",
            "🎁 ไอเดียของขวัญ: จองทรีตเมนต์คู่กับคนพิเศษ ช่วงเวลาโรแมนติกบนเรือสำราญ",
            "📅 แนะนำจองล่วงหน้า (ผ่านแอปหรือเคาน์เตอร์ชั้น 5) คิวยอดนิยมเต็มเร็ว"
          ]
        },
      ],
      local: [
        {
          image: IMG.okinawa,
          icon: 'MapPin', title: "ตรวจคนเข้าเมืองญี่ปุ่น", 
          text: "นำสำเนาพาสปอร์ตมาให้เจ้าหน้าที่ญี่ปุ่นตรวจบนเรือ ห้ามทำหาย!" 
        },
        {
          image: IMG.naha,
          icon: 'MapPin', title: "ที่เที่ยวนาฮะ (โอกินาว่า)", 
          list: [
            "Kokusai Dori: นั่งแท็กซี่ 10 นาที แหล่งช้อปปิ้งหลัก สินค้าปลอดภาษี และเนื้อวากิว",
            "ศาลเจ้านามิโนะอุเอะ & ชายหาด: นั่งแท็กซี่ 10 นาที ศาลเจ้าริมหน้าผาพร้อมชายหาดสวยงาม เหมาะแก่การถ่ายรูป!",
            "สวนปราสาทชูริ: นั่งแท็กซี่ 20 นาที สัมผัสประวัติศาสตร์และวัฒนธรรมของอาณาจักรริวกิว"
          ]
        },
        { 
          icon: 'Sparkles', title: "[สิทธิพิเศษลงเรือ VIP]", highlight: true, 
          text: "ในขณะที่ผู้โดยสารคนอื่นต้องต่อคิวยาว บริษัทเราได้สิทธิ์ VIP ลงเรือก่อน! เดินผ่านช่องทางพิเศษไปขึ้นรถบัสส่วนตัวของเราได้เลย ประหยัดเวลาไป 1-2 ชั่วโมง!" 
        },
        { 
          icon: 'Clock', title: "การตรงต่อเวลา", 
          text: "เผื่อเวลารถติด! ต้องกลับมาท่าเรือก่อนเวลาเรือออก 1.5 ชั่วโมง เรือจะไม่รอ!" 
        },
        { 
          icon: 'ShoppingBag', title: "ศุลกากร", 
          text: "ห้ามนำเนื้อสัตว์ ผลไม้ หรืออาหารสดของญี่ปุ่นขึ้นเรือหรือกลับไต้หวันโดยเด็ดขาด!" 
        }
      ],
      together: [],
    }
  }
};
