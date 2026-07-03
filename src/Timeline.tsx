import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { MapPin, Send, X, RefreshCw, Camera, Anchor } from 'lucide-react';
import {
  addPost, subscribePosts, extractCapturedAt, honkPost,
  addComment, subscribeComments, getPendingPosts, flushPendingPosts,
  SHIP_LOCATIONS_BY_LANG, SAILOR_AVATARS, DEFAULT_AVATAR, QUICK_TAGS_BY_LANG,
} from './firebase';
import type { Post, Comment, PendingPost } from './firebase';
import { TASK_EVENTS, classifyEvent, eventText } from './taskSchedule';
import type { TaskEvent } from './taskSchedule';
import type { Lang } from './data';

// ─── Timeline 全區塊 UI 文字（4 語言，找不到時退回中文） ───────────────────────
const TIMELINE_TEXT: Record<Lang, {
  writeButton: string; offline: string; syncing: string; synced: (time: string) => string;
  emptyTitle: string; emptyDesc: string; loading: string;
  commentsLabel: (n: number) => string; noComments: string; namePlaceholder: string;
  confirm: string; commentPlaceholder: string; sailorAlt: string;
  uploadToMoment: string; uploading: string; uploadError: string;
  backToOverview: string; eventEmpty: string; cardEmpty: string; postDiaryTitle: (name: string) => string;
  formTitle: string; chooseAvatar: string; yourName: string; locationPlaceholder: string;
  messagePlaceholder: string; previewAlt: string; classifying: string;
  classifiedEvent: (title: string) => string; classifiedGeneral: string; uploadPhoto: string;
  errNoName: string; errNoContent: string; errSubmitFail: string; submitting: string; submitButton: string;
  anonymous: string; routeDepart: string; routeReturn: string; routeNaha: string; pendingUpload: string;
  pendingSyncLabel: (n: number) => string; locale: string;
}> = {
  zh: {
    writeButton: '寫一篇航海日誌', offline: '⚠️ 離線・顯示快取資料', syncing: '⟳ 同步中…',
    synced: t => `✓ 最後更新 ${t}`,
    emptyTitle: '航海日誌還是空的', emptyDesc: '成為第一個寫日誌的人吧！', loading: '載入航海日誌中…',
    commentsLabel: n => `💬 留言${n > 0 ? `（${n}）` : ''}`, noComments: '還沒有留言，當第一個留言的人吧！',
    namePlaceholder: '先取個名字才能留言…', confirm: '確定', commentPlaceholder: '留言…', sailorAlt: '水手人物',
    uploadToMoment: '拍照 / 上傳照片到這個時刻', uploading: '上傳中…', uploadError: '上傳失敗，請確認網路連線',
    backToOverview: '← 返回總覽', eventEmpty: '還沒有人上傳這個時刻的照片，快來搶頭香！', cardEmpty: '還沒人上傳，搶頭香！',
    postDiaryTitle: name => `${name} 的航海日誌`,
    formTitle: '✍️ 寫一篇航海日誌', chooseAvatar: '選一個水手人物', yourName: '你的名字',
    locationPlaceholder: '📍 標記地點（選填）', messagePlaceholder: '說點什麼吧…（選填）', previewAlt: '預覽',
    classifying: '判斷這張照片屬於哪個時刻…',
    classifiedEvent: title => `🎉 這張會歸入大事件卡「${title}」`, classifiedGeneral: '🌊 這張會放進一般航海誌',
    uploadPhoto: '上傳照片（選填）', errNoName: '請填寫你的名字', errNoContent: '請填寫訊息、選地點或上傳照片',
    errSubmitFail: '發佈失敗，請確認網路連線', submitting: '發佈中…', submitButton: '寫入航海日誌',
    anonymous: '匿名旅客', routeDepart: 'Day1 基隆', routeReturn: 'Day4 基隆', routeNaha: '⛩️那霸', pendingUpload: '待上傳',
    pendingSyncLabel: n => `📦 ${n} 則待上傳・恢復連線後自動補傳`, locale: 'zh-TW',
  },
  en: {
    writeButton: 'Write a Time-Sail Entry', offline: '⚠️ Offline · Showing cached data', syncing: '⟳ Syncing…',
    synced: t => `✓ Last updated ${t}`,
    emptyTitle: 'The Time-Sail log is empty', emptyDesc: 'Be the first to write an entry!', loading: 'Loading Time-Sail…',
    commentsLabel: n => `💬 Comments${n > 0 ? ` (${n})` : ''}`, noComments: 'No comments yet — be the first!',
    namePlaceholder: 'Pick a name to comment…', confirm: 'OK', commentPlaceholder: 'Add a comment…', sailorAlt: 'Sailor avatar',
    uploadToMoment: 'Take / Upload a Photo for This Moment', uploading: 'Uploading…', uploadError: 'Upload failed — please check your connection',
    backToOverview: '← Back to overview', eventEmpty: 'No photos yet for this moment — be the first!', cardEmpty: 'No photos yet — be the first!',
    postDiaryTitle: name => `${name}'s Time-Sail entry`,
    formTitle: '✍️ Write a Time-Sail Entry', chooseAvatar: 'Pick a sailor avatar', yourName: 'Your name',
    locationPlaceholder: '📍 Tag a location (optional)', messagePlaceholder: 'Say something… (optional)', previewAlt: 'Preview',
    classifying: 'Figuring out which moment this belongs to…',
    classifiedEvent: title => `🎉 This will be filed under "${title}"`, classifiedGeneral: '🌊 This will go into the general Time-Sail feed',
    uploadPhoto: 'Upload a photo (optional)', errNoName: 'Please enter your name', errNoContent: 'Please add a message, location, or photo',
    errSubmitFail: 'Failed to post — please check your connection', submitting: 'Posting…', submitButton: 'Post to Time-Sail',
    anonymous: 'Anonymous Traveler', routeDepart: 'Day1 Keelung', routeReturn: 'Day4 Keelung', routeNaha: '⛩️Naha', pendingUpload: 'Pending',
    pendingSyncLabel: n => `📦 ${n} pending — will auto-send once back online`, locale: 'en-US',
  },
  id: {
    writeButton: 'Tulis Catatan Pelayaran', offline: '⚠️ Offline · Menampilkan data tersimpan', syncing: '⟳ Menyinkronkan…',
    synced: t => `✓ Terakhir diperbarui ${t}`,
    emptyTitle: 'Catatan Pelayaran masih kosong', emptyDesc: 'Jadilah yang pertama menulis!', loading: 'Memuat Catatan Pelayaran…',
    commentsLabel: n => `💬 Komentar${n > 0 ? ` (${n})` : ''}`, noComments: 'Belum ada komentar — jadilah yang pertama!',
    namePlaceholder: 'Isi nama dulu untuk berkomentar…', confirm: 'OK', commentPlaceholder: 'Tulis komentar…', sailorAlt: 'Avatar pelaut',
    uploadToMoment: 'Foto / Unggah Foto untuk Momen Ini', uploading: 'Mengunggah…', uploadError: 'Gagal mengunggah — periksa koneksi internet Anda',
    backToOverview: '← Kembali ke ringkasan', eventEmpty: 'Belum ada foto untuk momen ini — jadilah yang pertama!', cardEmpty: 'Belum ada yang unggah — jadilah yang pertama!',
    postDiaryTitle: name => `Catatan Pelayaran ${name}`,
    formTitle: '✍️ Tulis Catatan Pelayaran', chooseAvatar: 'Pilih avatar pelaut', yourName: 'Nama Anda',
    locationPlaceholder: '📍 Tandai lokasi (opsional)', messagePlaceholder: 'Tulis sesuatu… (opsional)', previewAlt: 'Pratinjau',
    classifying: 'Mengecek momen mana foto ini termasuk…',
    classifiedEvent: title => `🎉 Foto ini akan masuk ke kartu momen "${title}"`, classifiedGeneral: '🌊 Foto ini akan masuk ke feed umum',
    uploadPhoto: 'Unggah foto (opsional)', errNoName: 'Mohon isi nama Anda', errNoContent: 'Mohon isi pesan, lokasi, atau unggah foto',
    errSubmitFail: 'Gagal memposting — periksa koneksi internet Anda', submitting: 'Memposting…', submitButton: 'Posting ke Catatan Pelayaran',
    anonymous: 'Wisatawan Anonim', routeDepart: 'Hari1 Keelung', routeReturn: 'Hari4 Keelung', routeNaha: '⛩️Naha', pendingUpload: 'Tertunda',
    pendingSyncLabel: n => `📦 ${n} tertunda・akan otomatis terkirim saat kembali online`, locale: 'id-ID',
  },
  th: {
    writeButton: 'เขียนบันทึกการเดินเรือ', offline: '⚠️ ออฟไลน์ · แสดงข้อมูลที่บันทึกไว้', syncing: '⟳ กำลังซิงค์…',
    synced: t => `✓ อัปเดตล่าสุด ${t}`,
    emptyTitle: 'บันทึกการเดินเรือยังว่างอยู่', emptyDesc: 'เป็นคนแรกที่เขียนบันทึกสิ!', loading: 'กำลังโหลดบันทึกการเดินเรือ…',
    commentsLabel: n => `💬 ความคิดเห็น${n > 0 ? `（${n}）` : ''}`, noComments: 'ยังไม่มีความคิดเห็น เป็นคนแรกเลยสิ!',
    namePlaceholder: 'ตั้งชื่อก่อนถึงจะแสดงความคิดเห็นได้…', confirm: 'ตกลง', commentPlaceholder: 'แสดงความคิดเห็น…', sailorAlt: 'อวาตาร์กะลาสี',
    uploadToMoment: 'ถ่ายภาพ / อัปโหลดภาพสำหรับช่วงเวลานี้', uploading: 'กำลังอัปโหลด…', uploadError: 'อัปโหลดไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ต',
    backToOverview: '← กลับไปหน้ารวม', eventEmpty: 'ยังไม่มีใครอัปโหลดภาพช่วงเวลานี้ มาเป็นคนแรกกันเถอะ!', cardEmpty: 'ยังไม่มีใครอัปโหลด มาเป็นคนแรกกันเถอะ!',
    postDiaryTitle: name => `บันทึกการเดินเรือของ ${name}`,
    formTitle: '✍️ เขียนบันทึกการเดินเรือ', chooseAvatar: 'เลือกอวาตาร์กะลาสี', yourName: 'ชื่อของคุณ',
    locationPlaceholder: '📍 ระบุสถานที่ (ไม่บังคับ)', messagePlaceholder: 'พูดอะไรสักหน่อย… (ไม่บังคับ)', previewAlt: 'ตัวอย่าง',
    classifying: 'กำลังตรวจสอบว่าภาพนี้อยู่ช่วงเวลาไหน…',
    classifiedEvent: title => `🎉 ภาพนี้จะถูกจัดเข้าการ์ด "${title}"`, classifiedGeneral: '🌊 ภาพนี้จะไปอยู่ในฟีดทั่วไป',
    uploadPhoto: 'อัปโหลดภาพ (ไม่บังคับ)', errNoName: 'กรุณากรอกชื่อของคุณ', errNoContent: 'กรุณากรอกข้อความ เลือกสถานที่ หรืออัปโหลดภาพ',
    errSubmitFail: 'โพสต์ไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ต', submitting: 'กำลังโพสต์…', submitButton: 'โพสต์ลงบันทึกการเดินเรือ',
    anonymous: 'นักเดินทางนิรนาม', routeDepart: 'วันที่1 จีหลง', routeReturn: 'วันที่4 จีหลง', routeNaha: '⛩️นาฮะ', pendingUpload: 'รอส่ง',
    pendingSyncLabel: n => `📦 ${n} รายการรอส่ง・จะส่งอัตโนมัติเมื่อออนไลน์`, locale: 'th-TH',
  },
};

// ─── 小工具 ─────────────────────────────────────────────────────────────────
function vibrate(ms = 12) {
  try { navigator.vibrate?.(ms); } catch { /* iOS 不支援，靜默略過 */ }
}

function fmtHM(post: Post, locale: string): string {
  if (post.capturedAt) {
    const d = new Date(post.capturedAt);
    if (!isNaN(d.getTime())) return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }
  if (post.timestamp?.seconds) {
    return new Date(post.timestamp.seconds * 1000).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }
  return '';
}

// 依「當下時刻」決定背景色（日夜漸變）
function hourToBg(hour: number): string {
  if (hour < 5)  return '#0b1a3a';
  if (hour < 7)  return '#2b3d6b';
  if (hour < 10) return '#bfe3ff';
  if (hour < 16) return '#eaf6ff';
  if (hour < 18) return '#ffd9a8';
  if (hour < 20) return '#ff9d76';
  if (hour < 22) return '#3c2f6b';
  return '#0b1a3a';
}

function eventStartMs(ev: TaskEvent): number {
  return new Date(`${ev.date}T${String(ev.startHour).padStart(2, '0')}:${String(ev.startMin).padStart(2, '0')}:00`).getTime();
}
function postSortMs(p: Post): number {
  if (p.capturedAt) { const d = new Date(p.capturedAt); if (!isNaN(d.getTime())) return d.getTime(); }
  if (p.timestamp?.seconds) return p.timestamp.seconds * 1000;
  return Date.now();
}
// 依 id 產生穩定的微小旋轉角度，讓拍立得卡片有手感但不會每次 render 亂跳
function stableRotate(id: string | undefined): number {
  if (!id) return 0;
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997;
  return (h % 7) - 3; // -3° ~ 3°
}

// 用 Web Audio 合成鳴笛聲，不需要額外音效素材
function playHornSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    [180, 220].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + 0.45);
    });
  } catch { /* Web Audio 不可用時靜默略過 */ }
}

// ─── ⚓ 鳴笛按鈕（取代讚） ────────────────────────────────────────────────────
function HornButton({ post, light }: { post: Post; light?: boolean }) {
  const [firing, setFiring] = useState(false);

  const honk = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post.id) return;
    setFiring(true);
    playHornSound();
    vibrate(15);
    setTimeout(() => setFiring(false), 350);
    honkPost(post.id).catch(() => { /* 鳴笛失敗不打斷體驗，安靜略過 */ });
  };

  return (
    <button onClick={honk}
      className={`flex items-center gap-1 text-[10px] font-bold active:scale-90 transition-transform ${
        light ? 'text-white' : 'text-[#00a0e3]'
      }`}>
      <motion.span
        animate={firing ? { scale: [1, 1.35, 1], rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.35 }}
        className="text-xs">⚓</motion.span>
      {post.hornCount ?? 0}
    </button>
  );
}
// ─── 💬 留言串 ───────────────────────────────────────────────────────────────
function CommentThread({ postId, lang }: { postId: string; lang: Lang }) {
  const t = TIMELINE_TEXT[lang];
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [myName, setMyName] = useState(() => localStorage.getItem('msc-username') || '');
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    const unsub = subscribeComments(postId, setComments);
    return unsub;
  }, [postId]);

  const fmtCommentTime = (c: Comment) => {
    if (c.timestamp?.seconds) {
      return new Date(c.timestamp.seconds * 1000).toLocaleTimeString(t.locale, { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  };

  const saveName = () => {
    const n = nameInput.trim();
    if (!n) return;
    localStorage.setItem('msc-username', n);
    if (!localStorage.getItem('msc-emoji')) localStorage.setItem('msc-emoji', DEFAULT_AVATAR);
    setMyName(n);
  };

  const send = async () => {
    const value = text.trim();
    if (!value || sending || !myName) return;
    const authorEmoji = localStorage.getItem('msc-emoji') || DEFAULT_AVATAR;
    setSending(true);
    setText('');
    try {
      await addComment(postId, { authorName: myName, authorEmoji, text: value });
    } catch {
      setText(value); // 送出失敗把文字還給使用者，不用重打
    }
    setSending(false);
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <p className="text-xs font-bold text-slate-400 mb-2">
        {t.commentsLabel(comments.length)}
      </p>
      <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-300 text-center py-2">{t.noComments}</p>
        ) : comments.map(c => (
          <div key={c.id} className="flex items-start gap-2">
            <span className="flex-shrink-0 mt-0.5"><Avatar id={c.authorEmoji} size={22} lang={lang} /></span>
            <div className="min-w-0 flex-1 bg-slate-50 rounded-xl px-3 py-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-[#002b5e]">{c.authorName}</span>
                <span className="text-[9px] text-slate-400">{fmtCommentTime(c)}</span>
              </div>
              <p className="text-xs text-slate-600 break-words">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
      {!myName ? (
        <div className="flex items-center gap-2">
          <input value={nameInput} onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveName(); }}
            placeholder={t.namePlaceholder}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#00a0e3]" />
          <button onClick={saveName} disabled={!nameInput.trim()}
            className="bg-[#002b5e] disabled:opacity-40 text-white text-xs font-bold rounded-full px-3.5 py-2 flex-shrink-0 transition-opacity">
            {t.confirm}
          </button>
        </div>
      ) : (
      <div className="flex items-center gap-2">
        <input value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
          placeholder={t.commentPlaceholder}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#00a0e3]" />
        <button onClick={send} disabled={sending || !text.trim()}
          className="bg-[#002b5e] disabled:opacity-40 text-white rounded-full p-2 flex-shrink-0 transition-opacity">
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
      )}
    </div>
  );
}

// ─── 水手頭像（新資料是圖片 id，舊資料可能還是實際 emoji 字元，兩種都要能顯示） ──
function Avatar({ id, size = 32, lang = 'zh' }: { id?: string; size?: number; lang?: Lang }) {
  if (id && /^sailor-\d+$/.test(id)) {
    return (
      <img src={`/avatars/${id}.png`} alt={TIMELINE_TEXT[lang].sailorAlt} loading="lazy"
        style={{ width: size, height: size }} className="rounded-full flex-shrink-0 object-cover" />
    );
  }
  // 舊資料相容：直接顯示原本存的 emoji 文字
  return <span style={{ fontSize: size * 0.7, lineHeight: 1 }}>{id || '😊'}</span>;
}

// 依 id + salt 產生穩定的 0~1 亂數（同一張照片每次 render 結果一致）
function seededRand(id: string, salt: number): number {
  let h = 0;
  const s = `${id}_${salt}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

// ─── 大事件卡封面「馬賽克拼圖」：4 格不規則拼貼（1 大 + N 小），取代單調的等分網格 ─────
type MosaicTile = { gridColumn: string; gridRow: string };
function mosaicTiles(n: number): MosaicTile[] {
  switch (Math.min(n, 4)) {
    case 1: return [{ gridColumn: '1 / 5', gridRow: '1 / 3' }];
    case 2: return [
      { gridColumn: '1 / 3', gridRow: '1 / 3' },
      { gridColumn: '3 / 5', gridRow: '1 / 3' },
    ];
    case 3: return [
      { gridColumn: '1 / 3', gridRow: '1 / 3' },
      { gridColumn: '3 / 5', gridRow: '1 / 2' },
      { gridColumn: '3 / 5', gridRow: '2 / 3' },
    ];
    default: return [
      { gridColumn: '1 / 3', gridRow: '1 / 3' },
      { gridColumn: '3 / 4', gridRow: '1 / 2' },
      { gridColumn: '4 / 5', gridRow: '1 / 2' },
      { gridColumn: '3 / 5', gridRow: '2 / 3' },
    ];
  }
}

// ─── 炸開特效：把大事件卡照片依穩定亂數，散開成一桌拍立得的位置 ──────────────────
const STAGE_W = 300;
const STAGE_H = 230;
const TILE_W = 92;
const TILE_H = 104;
function scatterOffset(id: string | undefined, index: number, count: number) {
  const seed = id ?? String(index);
  const angle = (index / Math.max(count, 1)) * Math.PI * 2 + seededRand(seed, 1) * 1.4;
  const radius = 50 + seededRand(seed, 2) * 40;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius * 0.65,
    rotate: (seededRand(seed, 3) - 0.5) * 36,
  };
}

// ─── Slot：大事件卡與個人拍立得，依真實時間交錯排列（夾心結構） ───────────────
type Slot =
  | { type: 'event'; event: TaskEvent; posts: Post[]; sortMs: number }
  | { type: 'post'; post: Post; sortMs: number };

// 把還沒真的傳上雲端、只存在本機的貼文轉成跟正式 Post 一樣的格式，這樣可以直接混進同一份時間軸顯示
function pendingToPost(p: PendingPost): Post & { isPending?: boolean } {
  return {
    id: p.localId,
    tripId: '',
    authorName: p.authorName,
    authorEmoji: p.authorEmoji,
    location: p.location,
    message: p.message,
    photoURL: p.photoDataUrl || '',
    timestamp: { seconds: Math.floor(new Date(p.capturedAt).getTime() / 1000) },
    capturedAt: p.capturedAt,
    eventId: p.eventId,
    dayIndex: p.dayIndex ?? undefined,
    isTaskPost: p.isTaskPost,
    hornCount: 0,
    isPending: true,
  };
}

function buildSlots(posts: Post[]): Slot[] {
  const eventSlots: Slot[] = TASK_EVENTS.map(event => ({
    type: 'event', event,
    posts: posts.filter(p => p.eventId === event.id),
    sortMs: eventStartMs(event),
  }));
  const soloSlots: Slot[] = posts
    .filter(p => !p.eventId)
    .map(post => ({ type: 'post' as const, post, sortMs: postSortMs(post) }));
  return [...eventSlots, ...soloSlots].sort((a, b) => a.sortMs - b.sortMs);
}

// 基隆用小燈塔圖示（lucide 沒有對應圖示、也沒有標準燈塔 emoji，自己畫一個極簡版）
// 紅白條紋燈塔（依使用者提供的參考插畫重繪，簡化到適合 12px 小圖示的辨識度）
function LighthouseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 1.5h5l1.2 3h-7.4l1.2-3z" fill="#ef4444" />
      <rect x="9.3" y="4.6" width="5.4" height="3.2" rx="0.5" fill="#fbbf24" />
      <path d="M8.3 7.9h7.4l2 12.8H6.3l2-12.8z" fill="white" />
      <path d="M8.3 7.9h7.4l0.7 4.4H7.6l0.7-4.4z" fill="#ef4444" />
      <path d="M7.1 15.8h9.8l0.6 3.8H6.5l0.6-3.8z" fill="#ef4444" />
      <rect x="5.5" y="20.7" width="13" height="1.6" rx="0.4" fill="#94a3b8" />
    </svg>
  );
}

// ─── 航線圖 + 移動中的小船 ──────────────────────────────────────────────────
function RouteStrip({ containerRef, lang }: { containerRef: React.RefObject<HTMLDivElement>; lang: Lang }) {
  const t = TIMELINE_TEXT[lang];
  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 120, damping: 22, mass: 0.3 });
  const left = useTransform(smooth, [0, 1], ['3%', '95%']);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      progress.set(max > 0 ? el.scrollLeft / max : 0);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [containerRef, progress]);

  return (
    <div className="relative h-9 mb-2 px-1">
      <div className="absolute top-1/2 left-1 right-1 h-[2px] bg-white/40 -translate-y-1/2 rounded-full" />
      <span className="absolute top-1/2 left-1 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-bold text-white/90 drop-shadow whitespace-nowrap">
        <LighthouseIcon className="w-3 h-3 flex-shrink-0" />{t.routeDepart}
      </span>
      <span className="absolute top-1/2 right-1 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-bold text-white/90 drop-shadow whitespace-nowrap">
        <LighthouseIcon className="w-3 h-3 flex-shrink-0" />{t.routeReturn}
      </span>
      {/* 那霸是航程中途的定點標記，固定畫在正中間，跟時間比例無關 */}
      <span
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[10px] font-bold text-white/80 drop-shadow whitespace-nowrap">
        {t.routeNaha}
      </span>
      <motion.div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-lg drop-shadow" style={{ left }}>
        🚢
      </motion.div>
    </div>
  );
}

// ─── 大事件卡（A 軌） ────────────────────────────────────────────────────────
function EventCard({ event, posts, onOpen, lang }: { event: TaskEvent; posts: Post[]; onOpen: () => void; lang: Lang }) {
  const t = TIMELINE_TEXT[lang];
  const et = eventText(event, lang);
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onOpen}
      className="w-full text-left rounded-3xl overflow-hidden shadow-lg border-2 border-white/70 bg-white"
    >
      <div className="relative h-40 bg-gradient-to-br from-[#002b5e] to-[#00a0e3] overflow-hidden">
        {posts.length > 0 ? (
          <div className="grid gap-0.5 w-full h-full" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)' }}>
            {mosaicTiles(posts.length).map((tile, i, arr) => {
              const post = posts[i];
              const overflow = i === arr.length - 1 ? posts.length - arr.length : 0;
              return (
                <div key={post.id ?? i} className="relative overflow-hidden" style={tile}>
                  <img src={post.photoURL} className="w-full h-full object-cover" loading="lazy" />
                  {overflow > 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
                      +{overflow}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/90 px-4">
            <Camera className="w-7 h-7 mb-1.5 opacity-90" />
            <p className="text-[11px] font-semibold opacity-90 text-center">{t.cardEmpty}</p>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black/45 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur">
          {et.dayLabel}
        </div>
        {posts.length > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/45 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            📸 {posts.length}
          </div>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-bold text-[#002b5e] text-[14px] leading-snug">{et.title}</h3>
        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{et.hint}</p>
        <p className="text-[10px] text-[#00a0e3] font-bold mt-2">
          {String(event.startHour).padStart(2, '0')}:{String(event.startMin).padStart(2, '0')}–{String(event.endHour).padStart(2, '0')}:{String(event.endMin).padStart(2, '0')}
        </p>
      </div>
    </motion.button>
  );
}

// ─── 個人拍立得卡（B 軌） ────────────────────────────────────────────────────
// ─── 個人拍立得卡（B 軌）點擊可放大看＋留言 ─────────────────────────────────
function PostDetailModal({ post, onClose, lang }: { post: Post; onClose: () => void; lang: Lang }) {
  const t = TIMELINE_TEXT[lang];
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-[#00a0e3]">{fmtHM(post, t.locale)}</div>
            <h3 className="font-bold text-[#002b5e] text-[15px] truncate">{t.postDiaryTitle(post.authorName)}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-4">
          {post.photoURL
            ? <img src={post.photoURL} className="w-full rounded-2xl mb-3" alt="" />
            : <div className="w-full h-40 bg-slate-50 rounded-2xl mb-3 flex items-center justify-center"><Avatar id={post.authorEmoji} size={64} lang={lang} /></div>
          }
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar id={post.authorEmoji} size={28} lang={lang} />
              <div className="min-w-0">
                <div className="text-sm font-bold text-[#002b5e]">{post.authorName}</div>
                {post.location && <div className="text-xs text-[#00a0e3] truncate">{post.location}</div>}
                {post.message && <div className="text-xs text-slate-500 truncate">{post.message}</div>}
              </div>
            </div>
            <HornButton post={post} />
          </div>
          {post.id && <CommentThread postId={post.id} lang={lang} />}
        </div>
      </motion.div>
    </motion.div>
  );
}

function PolaroidCard({ post, lang }: { post: Post & { isPending?: boolean }; lang: Lang }) {
  const rotate = useMemo(() => stableRotate(post.id), [post.id]);
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.div style={{ rotate }} whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(true)}
        className="relative bg-white p-2 pb-5 rounded-sm shadow-md border border-slate-100 cursor-pointer">
      {post.isPending && (
        <span className="absolute top-1 right-1 bg-amber-400 text-amber-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full z-10">
          {TIMELINE_TEXT[lang].pendingUpload}
        </span>
      )}
      <div className="w-full h-[128px] bg-slate-100 rounded-sm overflow-hidden flex items-center justify-center">
        {post.photoURL
          ? <img src={post.photoURL} className="w-full h-full object-cover" loading="lazy" alt="" />
          : <Avatar id={post.authorEmoji} size={40} lang={lang} />}
      </div>
      <p className="text-[10px] text-slate-500 mt-1.5 text-center truncate">{post.authorName} · {fmtHM(post, TIMELINE_TEXT[lang].locale)}</p>
      {post.location && (
        <p className="text-[9px] text-[#00a0e3] text-center truncate">{post.location}</p>
      )}
      {post.message && <p className="text-[9px] text-slate-400 text-center truncate px-1">{post.message}</p>}
      <div className="flex justify-center mt-1">
        <HornButton post={post} />
      </div>
      </motion.div>
      <AnimatePresence>
        {open && <PostDetailModal post={post} onClose={() => setOpen(false)} lang={lang} />}
      </AnimatePresence>
    </>
  );
}

// ─── 散開拍立得：大事件卡展開瞬間，照片從中心「炸開」飛散到各自的位置 ───────────
function ScatteredPolaroid({ post, index, count, onOpen, lang }: { post: Post; index: number; count: number; onOpen: () => void; lang: Lang }) {
  const { x, y, rotate } = useMemo(() => scatterOffset(post.id, index, count), [post.id, index, count]);
  return (
    <motion.button
      onClick={onOpen}
      style={{ position: 'absolute', left: STAGE_W / 2 - TILE_W / 2, top: STAGE_H / 2 - TILE_H / 2, width: TILE_W }}
      initial={{ x: 0, y: 0, rotate: 0, scale: 0.25, opacity: 0 }}
      animate={{ x, y, rotate, scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 190, damping: 17, delay: index * 0.06 }}
      whileHover={{ scale: 1.06, zIndex: 20 }}
      whileTap={{ scale: 0.94 }}
      className="bg-white p-1.5 pb-4 rounded-sm shadow-lg border border-slate-100"
    >
      <div className="w-full h-[76px] bg-slate-100 rounded-sm overflow-hidden">
        <img src={post.photoURL} className="w-full h-full object-contain" loading="lazy" alt="" />
      </div>
      <p className="text-[8px] text-slate-500 mt-1 flex items-center justify-center gap-1 truncate">
        <Avatar id={post.authorEmoji} size={12} lang={lang} /> {post.authorName}
      </p>
    </motion.button>
  );
}

// ─── 直接為這張大事件卡拍照／上傳照片，不用等 EXIF 時間自動判斷 ─────────────────
function EventUploadButton({ eventId, lang }: { eventId: string; lang: Lang }) {
  const t = TIMELINE_TEXT[lang];
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true); setError('');
    try {
      const authorName  = localStorage.getItem('msc-username') || t.anonymous;
      const authorEmoji = localStorage.getItem('msc-emoji')    || DEFAULT_AVATAR;
      await addPost({ authorName, authorEmoji, location: '', message: '' }, file, eventId);
      vibrate();
    } catch {
      setError(t.uploadError);
    } finally { setUploading(false); }
  };

  return (
    <div className="mb-4">
      <button onClick={() => fileRef.current?.click()} disabled={uploading}
        className="w-full py-3 rounded-xl border-2 border-dashed border-[#00a0e3]/40 text-[#00a0e3] text-sm font-bold flex items-center justify-center gap-2 hover:border-[#00a0e3] hover:bg-[#00a0e3]/5 transition-colors disabled:opacity-50">
        {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
        {uploading ? t.uploading : t.uploadToMoment}
      </button>
      {error && <p className="text-red-500 text-xs font-medium mt-1.5 text-center">{error}</p>}
      {/* 用 sr-only 取代 display:none —— iOS Safari 對 display:none 的 file input 呼叫 .click()
          有時不會真的跳出拍照/照片庫選單，視覺隱藏但仍在版面上才能穩定觸發 */}
      <input ref={fileRef} type="file" accept="image/*"
        className="sr-only" onChange={pick} />
    </div>
  );
}

// ─── 大事件卡展開檢視（Module B：進場時照片從馬賽克拼圖「炸開」成散落拍立得） ──────
function EventModal({ event, posts, onClose, lang }: { event: TaskEvent; posts: Post[]; onClose: () => void; lang: Lang }) {
  const t = TIMELINE_TEXT[lang];
  const et = eventText(event, lang);
  const [big, setBig] = useState<Post | null>(null);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-3"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-[#00a0e3]">{et.dayLabel}</div>
            <h3 className="font-bold text-[#002b5e] text-[15px] truncate">{et.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-4">
          {!big && <EventUploadButton eventId={event.id} lang={lang} />}
          {big ? (
            <div>
              <button onClick={() => setBig(null)} className="text-xs text-[#00a0e3] font-semibold mb-2">{t.backToOverview}</button>
              <img src={big.photoURL} className="w-full rounded-2xl mb-3" alt="" />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar id={big.authorEmoji} size={28} lang={lang} />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#002b5e]">{big.authorName}</div>
                    {big.message && <div className="text-xs text-slate-500 truncate">{big.message}</div>}
                  </div>
                </div>
                <HornButton post={big} />
              </div>
              {big.id && <CommentThread postId={big.id} lang={lang} />}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
              {t.eventEmpty}
            </div>
          ) : (
            <div className="relative mx-auto" style={{ width: STAGE_W, height: STAGE_H }}>
              {posts.map((p, i) => (
                <div key={p.id}>
                  <ScatteredPolaroid post={p} index={i} count={posts.length} onOpen={() => setBig(p)} lang={lang} />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── 發文表單（水手人物 + 地點 + 快捷標籤 + EXIF 分類預覽） ───────────────────
function PostForm({ onClose, lang }: { onClose: () => void; lang: Lang }) {
  const t = TIMELINE_TEXT[lang];
  const locations = SHIP_LOCATIONS_BY_LANG[lang] || SHIP_LOCATIONS_BY_LANG.zh;
  const quickTags = QUICK_TAGS_BY_LANG[lang] || QUICK_TAGS_BY_LANG.zh;
  const [name,     setName]    = useState(() => localStorage.getItem('msc-username') || '');
  const [emoji,    setEmoji]   = useState(() => localStorage.getItem('msc-emoji')    || DEFAULT_AVATAR);
  const [location, setLocation]= useState('');
  const [message,  setMessage] = useState('');
  const [photo,    setPhoto]   = useState<File | null>(null);
  const [preview,  setPreview] = useState('');
  const [classifyLabel, setClassifyLabel] = useState<string | null>(null);
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setClassifyLabel(t.classifying);
    extractCapturedAt(file).then(capturedAt => {
      const ev2 = classifyEvent(capturedAt);
      setClassifyLabel(ev2 ? t.classifiedEvent(eventText(ev2, lang).title) : t.classifiedGeneral);
    }).catch(() => setClassifyLabel(null));
  };

  const addTag = (tag: string) => setMessage(m => (m.includes(tag) ? m : `${m ? m + ' ' : ''}${tag}`));

  const submit = async () => {
    if (!name.trim()) { setError(t.errNoName); return; }
    if (!message.trim() && !photo && !location) { setError(t.errNoContent); return; }
    setLoading(true); setError('');
    try {
      localStorage.setItem('msc-username', name.trim());
      localStorage.setItem('msc-emoji', emoji);
      await addPost(
        { authorName: name.trim(), authorEmoji: emoji, location, message: message.trim() },
        photo ?? undefined,
      );
      onClose();
    } catch {
      setError(t.errSubmitFail);
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-4"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="font-bold text-[#002b5e] text-[15px]">{t.formTitle}</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* 水手人物 + 姓名 */}
        <div>
          <p className="text-[10px] text-slate-400 mb-1.5 ml-0.5">{t.chooseAvatar}</p>
          <div className="flex items-center gap-3 mb-2">
            <Avatar id={emoji} size={44} lang={lang} />
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder={t.yourName}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#00a0e3]" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
            {SAILOR_AVATARS.map(a => (
              <button key={a.id} type="button" onClick={() => setEmoji(a.id)}
                title={a.label}
                className={`flex-shrink-0 rounded-full p-0.5 transition-all ${
                  emoji === a.id ? 'ring-2 ring-[#00a0e3]' : 'ring-1 ring-transparent'
                }`}>
                <Avatar id={a.id} size={40} lang={lang} />
              </button>
            ))}
          </div>
        </div>

        {/* 地點 */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3">
          <MapPin className="w-4 h-4 text-[#00a0e3] flex-shrink-0" />
          <select value={location} onChange={e => setLocation(e.target.value)}
            className="flex-1 bg-transparent py-2.5 text-sm text-slate-600 border-none focus:outline-none cursor-pointer">
            <option value="">{t.locationPlaceholder}</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* 快捷標籤 */}
        <div className="flex flex-wrap gap-1.5">
          {quickTags.map(tag => (
            <button key={tag} type="button" onClick={() => addTag(tag)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 hover:bg-[#00a0e3]/10 hover:text-[#00a0e3] transition-colors">
              {tag}
            </button>
          ))}
        </div>

        {/* 訊息 */}
        <textarea value={message} onChange={e => setMessage(e.target.value)}
          placeholder={t.messagePlaceholder} rows={3}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#00a0e3]" />

        {/* 照片 */}
        {preview ? (
          <div>
            <div className="relative rounded-xl overflow-hidden">
              <img src={preview} className="w-full max-h-56 object-cover" alt={t.previewAlt} />
              <button onClick={() => { setPhoto(null); setPreview(''); setClassifyLabel(null); }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {classifyLabel && <p className="text-[11px] text-[#00a0e3] font-medium mt-1.5">{classifyLabel}</p>}
          </div>
        ) : (
          <button onClick={() => fileRef.current?.click()}
            className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm font-medium flex items-center justify-center gap-2 hover:border-[#00a0e3] hover:text-[#00a0e3] transition-colors">
            <Camera className="w-4 h-4" />
            {t.uploadPhoto}
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*"
          className="sr-only" onChange={pickPhoto} />

        {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

        <button onClick={submit} disabled={loading}
          className="w-full bg-[#002b5e] hover:bg-[#003a7a] disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {loading ? t.submitting : t.submitButton}
        </button>
      </div>
    </motion.div>
  );
}

// ─── 航海日誌主元件（橫向時間軸） ───────────────────────────────────────────
export function Timeline({ isOnline, lang }: { isOnline: boolean; lang: Lang }) {
  const t = TIMELINE_TEXT[lang];
  const [posts,    setPosts]    = useState<Post[]>([]);
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>(() => getPendingPosts());
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [syncing,  setSyncing]  = useState(true);
  const [openEvent, setOpenEvent] = useState<TaskEvent | null>(null);
  const [activeHour, setActiveHour] = useState(16);

  const scrollRef = useRef<HTMLDivElement>(null);
  const refMap = useRef(new Map<string, HTMLElement>());
  const activeIdRef = useRef<string | null>(null);

  useEffect(() => {
    const unsub = subscribePosts((p, d) => { setPosts(p); setLastSync(d); setSyncing(false); });
    return unsub;
  }, []);

  // 恢復網路連線時，自動把還留在本機、還沒真的傳上雲端的貼文補傳出去
  useEffect(() => {
    if (!isOnline) return;
    let cancelled = false;
    flushPendingPosts().then(sentCount => {
      if (!cancelled && sentCount > 0) setPendingPosts(getPendingPosts());
    });
    return () => { cancelled = true; };
  }, [isOnline]);

  const mergedPosts = useMemo(
    () => [...posts, ...pendingPosts.map(pendingToPost)],
    [posts, pendingPosts],
  );

  const slots = useMemo(() => buildSlots(mergedPosts), [mergedPosts]);
  const slotMeta = useMemo(() => {
    const map = new Map<string, { hour: number }>();
    for (const slot of slots) {
      if (slot.type === 'event') map.set(slot.event.id, { hour: slot.event.startHour });
      else map.set(`post-${slot.post.id}`, { hour: new Date(postSortMs(slot.post)).getHours() });
    }
    return map;
  }, [slots]);

  // 初始背景：用第一張卡的時刻，不用等使用者滑動
  useEffect(() => {
    if (!slots.length || activeIdRef.current) return;
    const first = slots[0];
    const id = first.type === 'event' ? first.event.id : `post-${first.post.id}`;
    const meta = slotMeta.get(id);
    if (meta) { activeIdRef.current = id; setActiveHour(meta.hour); }
  }, [slots, slotMeta]);

  // 滑動時偵測「目前置中的卡片」→ 更新日夜背景 + 觸發震動回饋
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || !slots.length) return;
    const io = new IntersectionObserver((entries) => {
      let bestId: string | null = null, bestRatio = 0;
      for (const entry of entries) {
        if (entry.intersectionRatio > bestRatio) {
          bestRatio = entry.intersectionRatio;
          bestId = (entry.target as HTMLElement).dataset.slotId ?? null;
        }
      }
      if (bestId && bestId !== activeIdRef.current) {
        activeIdRef.current = bestId;
        const meta = slotMeta.get(bestId);
        if (meta) { setActiveHour(meta.hour); vibrate(); }
      }
    }, { root, threshold: [0.3, 0.5, 0.7, 0.9] });
    refMap.current.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [slots, slotMeta]);

  const bg = hourToBg(activeHour);
  const isNight = activeHour >= 20 || activeHour < 6;
  const openSlot = openEvent
    ? (slots.find(s => s.type === 'event' && s.event.id === openEvent.id) as Extract<Slot, { type: 'event' }> | undefined)
    : undefined;

  const syncLabel = () => {
    if (pendingPosts.length > 0) return t.pendingSyncLabel(pendingPosts.length);
    if (!isOnline) return t.offline;
    if (syncing)   return t.syncing;
    if (!lastSync) return '';
    return t.synced(lastSync.toLocaleTimeString(t.locale, { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <div>
      {/* 工具列 */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-[#002b5e] hover:bg-[#003a7a] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm">
          <Anchor className="w-4 h-4" />
          {t.writeButton}
        </button>
        <span className={`text-[11px] font-medium px-3 py-1.5 rounded-full ${
          !isOnline ? 'bg-amber-100 text-amber-700' :
          syncing   ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-700'
        }`}>{syncLabel()}</span>
      </div>

      <AnimatePresence>
        {showForm && <PostForm onClose={() => { setShowForm(false); setPendingPosts(getPendingPosts()); }} lang={lang} />}
      </AnimatePresence>

      {/* 橫向轉舵時間軸 */}
      <div className="rounded-3xl pt-3 pb-4 px-1 transition-colors duration-700 relative overflow-hidden" style={{ backgroundColor: bg }}>
        {/* 深夜星空點綴 */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            opacity: isNight ? 0.7 : 0,
            backgroundImage:
              'radial-gradient(1.5px 1.5px at 20% 30%, white, transparent),' +
              'radial-gradient(1.5px 1.5px at 60% 20%, white, transparent),' +
              'radial-gradient(1px 1px at 80% 45%, white, transparent),' +
              'radial-gradient(1px 1px at 35% 65%, white, transparent),' +
              'radial-gradient(1.5px 1.5px at 90% 75%, white, transparent),' +
              'radial-gradient(1px 1px at 10% 80%, white, transparent)',
          }}
        />

        <RouteStrip containerRef={scrollRef} lang={lang} />

        {slots.length === 0 && !syncing ? (
          <div className="text-center py-14 text-slate-500 relative">
            <div className="text-4xl mb-3">🚢</div>
            <p className="text-sm font-medium">{t.emptyTitle}</p>
            <p className="text-xs mt-1 opacity-70">{t.emptyDesc}</p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex items-end gap-4 overflow-x-auto snap-x snap-mandatory pb-2 px-1 scroll-smooth [&::-webkit-scrollbar]:hidden relative"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="w-[8vw] shrink-0" aria-hidden />
            {slots.map(slot => {
              const id = slot.type === 'event' ? slot.event.id : `post-${slot.post.id}`;
              return (
                <div
                  key={id}
                  data-slot-id={id}
                  ref={el => { if (el) refMap.current.set(id, el); else refMap.current.delete(id); }}
                  className={`snap-center shrink-0 ${slot.type === 'event' ? 'w-[76vw] max-w-[300px]' : 'w-[128px]'}`}
                >
                  {slot.type === 'event'
                    ? <EventCard event={slot.event} posts={slot.posts} onOpen={() => setOpenEvent(slot.event)} lang={lang} />
                    : <PolaroidCard post={slot.post} lang={lang} />}
                </div>
              );
            })}
            <div className="w-[8vw] shrink-0" aria-hidden />
          </div>
        )}

        {syncing && posts.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm relative">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
            {t.loading}
          </div>
        )}
      </div>

      <AnimatePresence>
        {openEvent && (
          <EventModal
            event={openEvent}
            posts={openSlot?.posts ?? []}
            onClose={() => setOpenEvent(null)}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
