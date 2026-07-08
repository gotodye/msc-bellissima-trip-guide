// ─────────────────────────────────────────────────────────────────────────────
// taskSchedule.ts — 航海日誌大事件時段設定表
// 判斷基準：照片「本地牆鐘時間」(手機到那霸後通常會自動切換為 JST，
// 因此直接比對 getHours()/getMinutes()，不做手動時區換算)。
// 找不到對應時段 → 歸為 B 軌（一般航海誌／個人生活流）。
// ─────────────────────────────────────────────────────────────────────────────

export interface TaskEvent {
  id: string;
  day: 1 | 2 | 3 | 4;
  dayLabel: string;   // 顯示用的天數標籤（中文，向下相容；其他語言請透過 eventText() 取得）
  title: string;      // 大事件任務名稱（中文，向下相容）
  hint: string;       // 拍照與互動引導文字（中文，向下相容）
  date: string;       // 'YYYY-MM-DD'（該事件發生的當地日曆日期）
  startHour: number; startMin: number;
  endHour: number; endMin: number;
}

export const TASK_EVENTS: TaskEvent[] = [
  {
    id: 'd1-depart', day: 1, dayLabel: 'Day 1・基隆啟航',
    title: '再見台灣！甲板啟航派對',
    hint: '17:30 離港，捕捉與基隆地標合影的瞬間',
    date: '2026-07-09', startHour: 16, startMin: 0, endHour: 18, endMin: 0,
  },
  {
    id: 'd1-crystal', day: 1, dayLabel: 'Day 1・基隆啟航',
    title: '閃耀榮耀！水晶階梯／天幕首秀',
    hint: '6F 施華洛世奇水晶階梯／LED 榮耀大道天幕燈光秀',
    date: '2026-07-09', startHour: 20, startMin: 0, endHour: 22, endMin: 0,
  },
  {
    id: 'd2-morning', day: 2, dayLabel: 'Day 2・航海日',
    title: '海上陽光！尋找船上最 Chill 的角落',
    hint: '泳池畔曬太陽、海景健身房、豪華自助早餐',
    date: '2026-07-10', startHour: 9, startMin: 0, endHour: 11, endMin: 30,
  },
  {
    id: 'd2-naha', day: 2, dayLabel: 'Day 2・航海日',
    title: '近距離接觸！船長合影＋金氏世界紀錄挑戰',
    hint: '難得機會與船長合影，或見證/挑戰獨一無二的金氏世界紀錄',
    date: '2026-07-10', startHour: 14, startMin: 0, endHour: 17, endMin: 0,
  },
  {
    id: 'd2-night', day: 2, dayLabel: 'Day 2・航海日',
    title: '世界盃同樂夜！甲板酒吧狂歡',
    hint: '專屬觀賽區世界盃派對，各式酒水點心，氣氛沸騰',
    date: '2026-07-10', startHour: 21, startMin: 0, endHour: 23, endMin: 59,
  },
  {
    id: 'd3-shopping', day: 3, dayLabel: 'Day 3・航海日',
    title: '手作職人時間！義式料理＋手工藝工坊',
    hint: '跟主廚學道地義式料理手作，或手工藝課程做專屬紀念品',
    date: '2026-07-11', startHour: 10, startMin: 0, endHour: 12, endMin: 30,
  },
  {
    id: 'd3-gala', day: 3, dayLabel: 'Day 3・航海日',
    title: '榮耀盛裝派對！今晚我最美/帥',
    hint: '正式裝扮，中庭或主餐廳大合照',
    date: '2026-07-11', startHour: 19, startMin: 0, endHour: 21, endMin: 30,
  },
  {
    id: 'd4-farewell', day: 4, dayLabel: 'Day 4・返抵基隆',
    title: '再見榮耀號！下船前的最後回顧',
    hint: '四天最喜歡的照片，或戰利品大集合',
    date: '2026-07-12', startHour: 8, startMin: 0, endHour: 10, endMin: 0,
  },
];

// ─── 大事件卡顯示文字（4 語言），依 event.id 對照。找不到就退回中文 ────────────
type EventText = { dayLabel: string; title: string; hint: string };
const EVENT_TEXT: Record<string, Record<string, EventText>> = {
  en: {
    'd1-depart':   { dayLabel: 'Day 1 · Keelung Departure', title: 'Farewell Taiwan! Deck Departure Party', hint: '17:30 departure — capture the moment with the Keelung skyline' },
    'd1-crystal':  { dayLabel: 'Day 1 · Keelung Departure', title: 'Shine On! Crystal Staircase / Sky Show Debut', hint: '6F Swarovski crystal staircase / LED Galleria ceiling light show' },
    'd2-morning':  { dayLabel: 'Day 2 · At Sea', title: "Sunny Days at Sea! Find the Ship's Chillest Spot", hint: 'Poolside sunbathing, ocean-view gym, or the lavish breakfast buffet' },
    'd2-naha':     { dayLabel: 'Day 2 · At Sea', title: 'Up Close! Captain Photo Op + Guinness World Record Challenge', hint: 'A rare photo with the Captain, or witness/join a one-of-a-kind Guinness World Record attempt' },
    'd2-night':    { dayLabel: 'Day 2 · At Sea', title: 'World Cup Party Night! Deck Bar Bash', hint: 'World Cup viewing party in the dedicated lounge, with drinks and snacks and a buzzing atmosphere' },
    'd3-shopping': { dayLabel: 'Day 3 · At Sea', title: "Artisan Hour! Italian Cooking + Handicraft Workshops", hint: "Learn authentic Italian cooking from the chef, or make your own souvenir in the handicraft workshop" },
    'd3-gala':     { dayLabel: 'Day 3 · At Sea', title: 'Glamour Night! Dressed to Impress', hint: 'Formal wear, group photo in the atrium or main dining room' },
    'd4-farewell': { dayLabel: 'Day 4 · Back to Keelung', title: 'Farewell Bellissima! One Last Look Back', hint: 'Your favorite photo from the trip, or all your souvenirs together' },
  },
  id: {
    'd1-depart':   { dayLabel: 'Hari 1 · Keberangkatan Keelung', title: 'Selamat Tinggal Taiwan! Pesta Keberangkatan di Dek', hint: 'Berangkat 17:30 — abadikan momen dengan latar Keelung' },
    'd1-crystal':  { dayLabel: 'Hari 1 · Keberangkatan Keelung', title: 'Bersinar! Tangga Kristal / Debut Pertunjukan Langit', hint: 'Tangga kristal Swarovski lantai 6 / pertunjukan lampu langit-langit LED Galleria' },
    'd2-morning':  { dayLabel: 'Hari 2 · Berlayar', title: 'Hari Cerah di Laut! Cari Sudut Paling Santai di Kapal', hint: 'Berjemur di kolam renang, gym dengan pemandangan laut, atau sarapan prasmanan mewah' },
    'd2-naha':     { dayLabel: 'Hari 2 · Berlayar', title: 'Momen Dekat! Foto Bersama Kapten + Tantangan Rekor Guinness', hint: 'Foto langka bersama Kapten, atau saksikan/ikut tantangan Rekor Dunia Guinness yang unik' },
    'd2-night':    { dayLabel: 'Hari 2 · Berlayar', title: 'Malam Pesta Piala Dunia! Keriuhan di Bar Dek', hint: 'Pesta nonton Piala Dunia di lounge khusus, lengkap dengan minuman, camilan, dan suasana meriah' },
    'd3-shopping': { dayLabel: 'Hari 3 · Berlayar', title: 'Waktunya Berkarya! Lokakarya Masak Italia + Kerajinan Tangan', hint: 'Belajar masakan Italia otentik dari chef, atau buat suvenir sendiri di lokakarya kerajinan tangan' },
    'd3-gala':     { dayLabel: 'Hari 3 · Berlayar', title: 'Pesta Gemerlap! Tampil Terbaik Malam Ini', hint: 'Busana formal, foto bersama di atrium atau restoran utama' },
    'd4-farewell': { dayLabel: 'Hari 4 · Kembali ke Keelung', title: 'Selamat Tinggal Bellissima! Kilas Balik Terakhir', hint: 'Foto favoritmu selama 4 hari, atau kumpulan oleh-oleh' },
  },
  th: {
    'd1-depart':   { dayLabel: 'วันที่ 1 · ออกเดินทางจากจีหลง', title: 'ลาก่อนไต้หวัน! ปาร์ตี้ออกเรือบนดาดฟ้า', hint: 'ออกเรือ 17:30 น. — เก็บภาพประทับใจกับฉากหลังจีหลง' },
    'd1-crystal':  { dayLabel: 'วันที่ 1 · ออกเดินทางจากจีหลง', title: 'ประกายแห่งความรุ่งโรจน์! บันไดคริสตัล/โชว์แสงเพดานครั้งแรก', hint: 'บันไดคริสตัล Swarovski ชั้น 6 / โชว์แสงเพดาน LED ที่ Galleria' },
    'd2-morning':  { dayLabel: 'วันที่ 2 · ล่องทะเล', title: 'แดดสวยกลางทะเล! ตามหามุมชิลที่สุดบนเรือ', hint: 'อาบแดดริมสระ ยิมวิวทะเล หรือมื้อเช้าบุฟเฟต์สุดหรู' },
    'd2-naha':     { dayLabel: 'วันที่ 2 · ล่องทะเล', title: 'ใกล้ชิดกัปตัน! ถ่ายรูปคู่กัปตัน + ท้าทายสถิติโลกกินเนสส์', hint: 'โอกาสหายากถ่ายรูปคู่กัปตัน หรือร่วมเป็นสักขีพยาน/ท้าทายสถิติโลกกินเนสส์สุดพิเศษ' },
    'd2-night':    { dayLabel: 'วันที่ 2 · ล่องทะเล', title: 'คืนปาร์ตี้ฟุตบอลโลก! สนุกสุดเหวี่ยงที่บาร์ดาดฟ้า', hint: 'ปาร์ตี้ชมฟุตบอลโลกในโซนพิเศษ พร้อมเครื่องดื่มและของว่าง บรรยากาศคึกคักสุดๆ' },
    'd3-shopping': { dayLabel: 'วันที่ 3 · ล่องทะเล', title: 'ช่วงเวลาช่างฝีมือ! เวิร์กช็อปทำอาหารอิตาเลียน + งานฝีมือ', hint: 'เรียนทำอาหารอิตาเลียนแท้จากเชฟ หรือทำของที่ระลึกของตัวเองในเวิร์กช็อปงานฝีมือ' },
    'd3-gala':     { dayLabel: 'วันที่ 3 · ล่องทะเล', title: 'ค่ำคืนแกลม! แต่งตัวสวยเด่นที่สุด', hint: 'ชุดทางการ ถ่ายรูปหมู่ที่ห้องโถงหรือห้องอาหารหลัก' },
    'd4-farewell': { dayLabel: 'วันที่ 4 · กลับถึงจีหลง', title: 'ลาก่อน Bellissima! มองย้อนครั้งสุดท้ายก่อนลงเรือ', hint: 'ภาพโปรดตลอด 4 วัน หรือรวมของฝากทั้งหมด' },
  },
};

/** 依語言取得大事件卡顯示文字；en/id/th 找不到時退回 TaskEvent 內建的中文欄位。 */
export function eventText(event: TaskEvent, lang: string): EventText {
  return EVENT_TEXT[lang]?.[event.id] ?? { dayLabel: event.dayLabel, title: event.title, hint: event.hint };
}

/** 依照片實際拍攝時間（本地牆鐘時間）比對任務時段；找不到回傳 null（B 軌）。 */
export function classifyEvent(capturedAt: Date): TaskEvent | null {
  const dateStr = `${capturedAt.getFullYear()}-${String(capturedAt.getMonth() + 1).padStart(2, '0')}-${String(capturedAt.getDate()).padStart(2, '0')}`;
  const mins = capturedAt.getHours() * 60 + capturedAt.getMinutes();
  for (const ev of TASK_EVENTS) {
    if (ev.date !== dateStr) continue;
    const start = ev.startHour * 60 + ev.startMin;
    const end = ev.endHour * 60 + ev.endMin;
    if (mins >= start && mins <= end) return ev;
  }
  return null;
}

export function eventById(id: string | null | undefined): TaskEvent | undefined {
  return TASK_EVENTS.find(e => e.id === id);
}

/** 整趟航程的起訖，用於橫向時間軸換算滑動進度（0~1）。 */
export const TRIP_START = new Date('2026-07-09T16:00:00');
export const TRIP_END = new Date('2026-07-12T10:00:00');
