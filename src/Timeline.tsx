import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { MapPin, Send, X, RefreshCw, Camera, Anchor } from 'lucide-react';
import {
  addPost, subscribePosts, extractCapturedAt, honkPost,
  SHIP_LOCATIONS, AUTHOR_EMOJIS, QUICK_TAGS,
} from './firebase';
import type { Post } from './firebase';
import { TASK_EVENTS, classifyEvent } from './taskSchedule';
import type { TaskEvent } from './taskSchedule';

// ─── 小工具 ─────────────────────────────────────────────────────────────────
function vibrate(ms = 12) {
  try { navigator.vibrate?.(ms); } catch { /* iOS 不支援，靜默略過 */ }
}

function fmtHM(post: Post): string {
  if (post.capturedAt) {
    const d = new Date(post.capturedAt);
    if (!isNaN(d.getTime())) return d.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
  }
  if (post.timestamp?.seconds) {
    return new Date(post.timestamp.seconds * 1000).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
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
type Slot =
  | { type: 'event'; event: TaskEvent; posts: Post[]; sortMs: number }
  | { type: 'post'; post: Post; sortMs: number };

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

// ─── 航線圖 + 移動中的小船 ──────────────────────────────────────────────────
function RouteStrip({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const { scrollXProgress } = useScroll({ container: containerRef });
  const smooth = useSpring(scrollXProgress, { stiffness: 120, damping: 22, mass: 0.3 });
  const left = useTransform(smooth, [0, 1], ['3%', '95%']);
  return (
    <div className="relative h-9 mb-2 px-1">
      <div className="absolute top-1/2 left-1 right-1 h-[2px] bg-white/40 -translate-y-1/2 rounded-full" />
      <span className="absolute top-1/2 left-1 -translate-y-1/2 text-[10px] font-bold text-white/90 drop-shadow">⚓ 基隆</span>
      <span className="absolute top-1/2 right-1 -translate-y-1/2 text-[10px] font-bold text-white/90 drop-shadow">⛩️ 那霸</span>
      <motion.div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-lg drop-shadow" style={{ left }}>
        🚢
      </motion.div>
    </div>
  );
}

// ─── 大事件卡（A 軌） ────────────────────────────────────────────────────────
function EventCard({ event, posts, onOpen }: { event: TaskEvent; posts: Post[]; onOpen: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onOpen}
      className="w-full text-left rounded-3xl overflow-hidden shadow-lg border-2 border-white/70 bg-white"
    >
      <div className="relative h-40 bg-gradient-to-br from-[#002b5e] to-[#00a0e3] overflow-hidden">
        {posts.length > 0 ? (
          <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-full h-full">
            {Array.from({ length: 4 }).map((_, i) => (
              posts[i]
                ? <img key={posts[i].id} src={posts[i].photoURL} className="w-full h-full object-cover" loading="lazy" />
                : <div key={i} className="w-full h-full bg-white/10" />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/90 px-4">
            <Camera className="w-7 h-7 mb-1.5 opacity-90" />
            <p className="text-[11px] font-semibold opacity-90 text-center">還沒人上傳，搶頭香！</p>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black/45 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur">
          {event.dayLabel}
        </div>
        {posts.length > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/45 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            📸 {posts.length}
          </div>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-bold text-[#002b5e] text-[14px] leading-snug">{event.title}</h3>
        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{event.hint}</p>
        <p className="text-[10px] text-[#00a0e3] font-bold mt-2">
          {String(event.startHour).padStart(2, '0')}:{String(event.startMin).padStart(2, '0')}–{String(event.endHour).padStart(2, '0')}:{String(event.endMin).padStart(2, '0')}
        </p>
      </div>
    </motion.button>
  );
}

// ─── 個人拍立得卡（B 軌） ────────────────────────────────────────────────────
function PolaroidCard({ post }: { post: Post }) {
  const rotate = useMemo(() => stableRotate(post.id), [post.id]);
  return (
    <motion.div style={{ rotate }} whileTap={{ scale: 0.96 }}
      className="bg-white p-2 pb-5 rounded-sm shadow-md border border-slate-100">
      <div className="w-full h-[128px] bg-slate-100 rounded-sm overflow-hidden flex items-center justify-center">
        {post.photoURL
          ? <img src={post.photoURL} className="w-full h-full object-cover" loading="lazy" alt="" />
          : <span className="text-2xl">{post.authorEmoji}</span>}
      </div>
      <p className="text-[10px] text-slate-500 mt-1.5 text-center truncate">{post.authorName} · {fmtHM(post)}</p>
      {post.location && (
        <p className="text-[9px] text-[#00a0e3] text-center truncate">{post.location}</p>
      )}
      {post.message && <p className="text-[9px] text-slate-400 text-center truncate px-1">{post.message}</p>}
      <div className="flex justify-center mt-1">
        <HornButton post={post} />
      </div>
    </motion.div>
  );
}

// ─── 大事件卡展開檢視（Module B 之前的簡化版：只做網格瀏覽，還沒做馬賽克拼圖與炸開特效） ──
function EventModal({ event, posts, onClose }: { event: TaskEvent; posts: Post[]; onClose: () => void }) {
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
            <div className="text-[10px] font-bold text-[#00a0e3]">{event.dayLabel}</div>
            <h3 className="font-bold text-[#002b5e] text-[15px] truncate">{event.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-4">
          {big ? (
            <div>
              <button onClick={() => setBig(null)} className="text-xs text-[#00a0e3] font-semibold mb-2">← 返回總覽</button>
              <img src={big.photoURL} className="w-full rounded-2xl mb-3" alt="" />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl">{big.authorEmoji}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#002b5e]">{big.authorName}</div>
                    {big.message && <div className="text-xs text-slate-500 truncate">{big.message}</div>}
                  </div>
                </div>
                <HornButton post={big} />
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
              還沒有人上傳這個時刻的照片，快來搶頭香！
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5">
              {posts.map(p => (
                <button key={p.id} onClick={() => setBig(p)} className="aspect-square rounded-lg overflow-hidden">
                  <img src={p.photoURL} className="w-full h-full object-cover" loading="lazy" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── 發文表單（水手人物 + 地點 + 快捷標籤 + EXIF 分類預覽） ───────────────────
function PostForm({ onClose }: { onClose: () => void }) {
  const [name,     setName]    = useState(() => localStorage.getItem('msc-username') || '');
  const [emoji,    setEmoji]   = useState(() => localStorage.getItem('msc-emoji')    || '😊');
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

    setClassifyLabel('判斷這張照片屬於哪個時刻…');
    extractCapturedAt(file).then(capturedAt => {
      const ev2 = classifyEvent(capturedAt);
      setClassifyLabel(ev2 ? `🎉 這張會歸入大事件卡「${ev2.title}」` : '🌊 這張會放進一般航海誌');
    }).catch(() => setClassifyLabel(null));
  };

  const addTag = (tag: string) => setMessage(m => (m.includes(tag) ? m : `${m ? m + ' ' : ''}${tag}`));

  const submit = async () => {
    if (!name.trim()) { setError('請填寫你的名字'); return; }
    if (!message.trim() && !photo && !location) { setError('請填寫訊息、選地點或上傳照片'); return; }
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
      setError('發佈失敗，請確認網路連線');
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-4"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="font-bold text-[#002b5e] text-[15px]">✍️ 寫一篇航海日誌</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* 水手人物 + 姓名 */}
        <div>
          <p className="text-[10px] text-slate-400 mb-1 ml-0.5">選一個水手人物</p>
          <div className="flex items-center gap-3">
            <select value={emoji} onChange={e => setEmoji(e.target.value)}
              className="w-14 h-12 bg-slate-100 rounded-xl text-2xl text-center cursor-pointer border-none appearance-none">
              {AUTHOR_EMOJIS.map(em => <option key={em} value={em}>{em}</option>)}
            </select>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="你的名字"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#00a0e3]" />
          </div>
        </div>

        {/* 地點 */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3">
          <MapPin className="w-4 h-4 text-[#00a0e3] flex-shrink-0" />
          <select value={location} onChange={e => setLocation(e.target.value)}
            className="flex-1 bg-transparent py-2.5 text-sm text-slate-600 border-none focus:outline-none cursor-pointer">
            <option value="">📍 標記地點（選填）</option>
            {SHIP_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* 快捷標籤 */}
        <div className="flex flex-wrap gap-1.5">
          {QUICK_TAGS.map(tag => (
            <button key={tag} type="button" onClick={() => addTag(tag)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 hover:bg-[#00a0e3]/10 hover:text-[#00a0e3] transition-colors">
              {tag}
            </button>
          ))}
        </div>

        {/* 訊息 */}
        <textarea value={message} onChange={e => setMessage(e.target.value)}
          placeholder="說點什麼吧…（選填）" rows={3}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#00a0e3]" />

        {/* 照片 */}
        {preview ? (
          <div>
            <div className="relative rounded-xl overflow-hidden">
              <img src={preview} className="w-full max-h-56 object-cover" alt="預覽" />
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
            上傳照片（選填）
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" capture="environment"
          className="hidden" onChange={pickPhoto} />

        {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

        <button onClick={submit} disabled={loading}
          className="w-full bg-[#002b5e] hover:bg-[#003a7a] disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {loading ? '發佈中…' : '寫入航海日誌'}
        </button>
      </div>
    </motion.div>
  );
}

// ─── 航海日誌主元件（橫向時間軸） ───────────────────────────────────────────
export function Timeline({ isOnline }: { isOnline: boolean }) {
  const [posts,    setPosts]    = useState<Post[]>([]);
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

  const slots = useMemo(() => buildSlots(posts), [posts]);
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
    if (!isOnline) return '⚠️ 離線・顯示快取資料';
    if (syncing)   return '⟳ 同步中…';
    if (!lastSync) return '';
    return `✓ 最後更新 ${lastSync.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div>
      {/* 工具列 */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-[#002b5e] hover:bg-[#003a7a] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm">
          <Anchor className="w-4 h-4" />
          寫一篇航海日誌
        </button>
        <span className={`text-[11px] font-medium px-3 py-1.5 rounded-full ${
          !isOnline ? 'bg-amber-100 text-amber-700' :
          syncing   ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-700'
        }`}>{syncLabel()}</span>
      </div>

      <AnimatePresence>
        {showForm && <PostForm onClose={() => setShowForm(false)} />}
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

        <RouteStrip containerRef={scrollRef} />

        {posts.length === 0 && !syncing ? (
          <div className="text-center py-14 text-slate-500 relative">
            <div className="text-4xl mb-3">🚢</div>
            <p className="text-sm font-medium">航海日誌還是空的</p>
            <p className="text-xs mt-1 opacity-70">成為第一個寫日誌的人吧！</p>
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
                    ? <EventCard event={slot.event} posts={slot.posts} onOpen={() => setOpenEvent(slot.event)} />
                    : <PolaroidCard post={slot.post} />}
                </div>
              );
            })}
            <div className="w-[8vw] shrink-0" aria-hidden />
          </div>
        )}

        {syncing && posts.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm relative">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
            載入航海日誌中…
          </div>
        )}
      </div>

      <AnimatePresence>
        {openEvent && (
          <EventModal
            event={openEvent}
            posts={openSlot?.posts ?? []}
            onClose={() => setOpenEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
