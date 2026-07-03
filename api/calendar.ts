// Vercel Serverless Function：產生大秀提醒的 .ics 行事曆檔案
// iOS Safari 對前端用 Blob/data URI 產生的「假下載」支援不完整，常顯示「無法下載此檔案」；
// 改成真的從伺服器回應 text/calendar，Safari 才會正確辨識並跳出「加入日曆」。
import { targetDateStr } from '../src/data';

export default function handler(req: any, res: any) {
  const message = typeof req.query?.msg === 'string' && req.query.msg
    ? req.query.msg
    : '時間到囉！快打開 MSC for Me APP 預約明天的大秀！';

  const target = new Date(targetDateStr);
  const alarmDates: Date[] = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(target);
    // 用 UTC 方法明確運算，不依賴執行環境時區——這支函式跑在 Vercel 伺服器（預設 UTC），
    // 不是使用者手機（台灣時區），用 setHours() 會把「23:55」誤判成 UTC 23:55，
    // 等於台灣時間隔天早上 7:55，整整錯開 8 小時
    d.setUTCDate(d.getUTCDate() + i);
    d.setUTCHours(15, 55, 0, 0); // 台灣時間 23:55 = UTC 15:55（UTC+8）
    alarmDates.push(d);
  }
  // toISOString() 本身就以 Z 結尾（例如 20260709T155500.000Z），移除毫秒後
  // 不需要再另外補一個 Z，否則會產生 "...Z" + "Z" 的不合法日期格式
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace('.000', '');
  const escapeText = (s: string) => s.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;');
  const events = alarmDates.map((d, i) => {
    const s = fmt(d); const e = fmt(new Date(d.getTime() + 60000));
    return `BEGIN:VEVENT\r\nDTSTART:${s}\r\nDTEND:${e}\r\nSUMMARY:🎭 MSC 大秀提醒 Day ${i + 1}\r\nDESCRIPTION:${escapeText(message)}\r\nEND:VEVENT`;
  }).join('\r\n');
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//MSC Bellissima Trip Guide//EN\r\n${events}\r\nEND:VCALENDAR\r\n`;

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.status(200).send(ics);
}
