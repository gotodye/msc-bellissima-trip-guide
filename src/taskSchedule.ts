// ─────────────────────────────────────────────────────────────────────────────
// taskSchedule.ts — 航海日誌大事件時段設定表
// 判斷基準：照片「本地牆鐘時間」(手機到那霸後通常會自動切換為 JST，
// 因此直接比對 getHours()/getMinutes()，不做手動時區換算)。
// 找不到對應時段 → 歸為 B 軌（一般航海誌／個人生活流）。
// ─────────────────────────────────────────────────────────────────────────────

export interface TaskEvent {
  id: string;
  day: 1 | 2 | 3 | 4;
  dayLabel: string;   // 顯示用的天數標籤
  title: string;      // 大事件任務名稱
  hint: string;       // 拍照與互動引導文字
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
    id: 'd2-morning', day: 2, dayLabel: 'Day 2・海上巡航→那霸',
    title: '海上陽光！尋找船上最 Chill 的角落',
    hint: '泳池畔曬太陽、海景健身房、豪華自助早餐',
    date: '2026-07-10', startHour: 9, startMin: 0, endHour: 11, endMin: 30,
  },
  {
    id: 'd2-naha', day: 2, dayLabel: 'Day 2・海上巡航→那霸',
    title: '沖繩我來了！登陸第一張照片',
    hint: '那霸港口榮耀號合影／國際通第一口冰淇淋或泡盛',
    date: '2026-07-10', startHour: 14, startMin: 0, endHour: 17, endMin: 0,
  },
  {
    id: 'd2-night', day: 2, dayLabel: 'Day 2・海上巡航→那霸',
    title: '榮耀號的沖繩夜景',
    hint: '沖繩居酒屋夜生活、那霸夜市，或甲板眺望港口夜景',
    date: '2026-07-10', startHour: 21, startMin: 0, endHour: 23, endMin: 59,
  },
  {
    id: 'd3-shopping', day: 3, dayLabel: 'Day 3・那霸離港→海上巡航',
    title: '最後血拼／沖繩最後巡禮',
    hint: '藥妝黑糖採購照，或亞利桑那水上樂園滑水道狂歡照',
    date: '2026-07-11', startHour: 10, startMin: 0, endHour: 12, endMin: 30,
  },
  {
    id: 'd3-gala', day: 3, dayLabel: 'Day 3・那霸離港→海上巡航',
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

/** 那霸抵達時刻在整趟航程中的進度比例（0~1），航線圖上用來畫「那霸」定點標記。 */
const nahaEvent = TASK_EVENTS.find(e => e.id === 'd2-naha')!;
const nahaArrival = new Date(`${nahaEvent.date}T${String(nahaEvent.startHour).padStart(2, '0')}:${String(nahaEvent.startMin).padStart(2, '0')}:00`);
export const NAHA_PROGRESS = (nahaArrival.getTime() - TRIP_START.getTime()) / (TRIP_END.getTime() - TRIP_START.getTime());
