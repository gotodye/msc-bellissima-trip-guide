import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Send, X, RefreshCw, Camera, Image as ImageIcon } from 'lucide-react';
import { addPost, subscribePosts, SHIP_LOCATIONS, AUTHOR_EMOJIS, type Post } from './firebase';

// ─── 時間格式 ─────────────────────────────────────────────────────────────────
function timeAgo(ts: any): string {
  if (!ts?.seconds) return '剛剛';
  const diff = Math.floor((Date.now() - ts.seconds * 1000) / 1000);
  if (diff < 60)    return '剛剛';
  if (diff < 3600)  return `${Math.floor(diff / 60)} 分鐘前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小時前`;
  return `${Math.floor(diff / 86400)} 天前`;
}
function fmtTime(ts: any): string {
  if (!ts?.seconds) return '';
  return new Date(ts.seconds * 1000).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
}

// ─── 發文表單 ─────────────────────────────────────────────────────────────────
function PostForm({ onClose }: { onClose: () => void }) {
  const [name,     setName]    = useState(() => localStorage.getItem('msc-username') || '');
  const [emoji,    setEmoji]   = useState(() => localStorage.getItem('msc-emoji')    || '😊');
  const [location, setLocation]= useState('');
  const [message,  setMessage] = useState('');
  const [photo,    setPhoto]   = useState<File | null>(null);
  const [preview,  setPreview] = useState('');
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
  };

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
    } catch (e: any) {
      setError('發佈失敗，請確認網路連線');
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-4"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="font-bold text-[#002b5e] text-[15px]">分享你的動態</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* 作者 */}
        <div className="flex items-center gap-3">
          <select value={emoji} onChange={e => setEmoji(e.target.value)}
            className="w-14 h-12 bg-slate-100 rounded-xl text-2xl text-center cursor-pointer border-none appearance-none">
            {AUTHOR_EMOJIS.map(em => <option key={em} value={em}>{em}</option>)}
          </select>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="你的名字"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#00a0e3]" />
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

        {/* 訊息 */}
        <textarea value={message} onChange={e => setMessage(e.target.value)}
          placeholder="說點什麼吧…（選填）" rows={3}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 resize-none focus:outline-none focus:border-[#00a0e3]" />

        {/* 照片 */}
        {preview ? (
          <div className="relative rounded-xl overflow-hidden">
            <img src={preview} className="w-full max-h-56 object-cover" alt="預覽" />
            <button onClick={() => { setPhoto(null); setPreview(''); }}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
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
          {loading ? '發佈中…' : '發佈動態'}
        </button>
      </div>
    </motion.div>
  );
}

// ─── 單則動態 ─────────────────────────────────────────────────────────────────
function PostCard({ post }: { post: Post }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* 作者列 */}
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
          {post.authorEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[#002b5e] text-sm">{post.authorName}</div>
          {post.location && (
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#00a0e3] flex-shrink-0" />
              <span className="text-[11px] text-[#00a0e3] font-medium truncate">{post.location}</span>
            </div>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[10px] text-slate-400">{timeAgo(post.timestamp)}</div>
          <div className="text-[10px] text-slate-300">{fmtTime(post.timestamp)}</div>
        </div>
      </div>

      {/* 照片 */}
      {post.photoURL && (
        <img src={post.photoURL} alt="動態照片" referrerPolicy="no-referrer"
          className="w-full max-h-80 object-cover" loading="lazy" />
      )}

      {/* 文字 */}
      {post.message && (
        <div className={`px-4 py-3 text-sm text-slate-700 leading-relaxed ${post.photoURL ? '' : 'border-t border-slate-50 mt-0'}`}>
          {post.message}
        </div>
      )}

      {!post.message && !post.photoURL && (
        <div className="px-4 pb-3 text-xs text-slate-400 italic">打個卡 👋</div>
      )}
    </motion.div>
  );
}

// ─── 時間流主元件 ─────────────────────────────────────────────────────────────
export function Timeline({ isOnline }: { isOnline: boolean }) {
  const [posts,    setPosts]    = useState<Post[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [syncing,  setSyncing]  = useState(true);

  useEffect(() => {
    const unsub = subscribePosts((p, d) => {
      setPosts(p); setLastSync(d); setSyncing(false);
    });
    return unsub;
  }, []);

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
          <ImageIcon className="w-4 h-4" />
          分享我的動態
        </button>
        <span className={`text-[11px] font-medium px-3 py-1.5 rounded-full ${
          !isOnline ? 'bg-amber-100 text-amber-700' :
          syncing   ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-700'
        }`}>{syncLabel()}</span>
      </div>

      {/* 表單 */}
      <AnimatePresence>
        {showForm && <PostForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>

      {/* 動態列表 */}
      {posts.length === 0 && !syncing ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">🚢</div>
          <p className="text-sm font-medium">還沒有動態</p>
          <p className="text-xs mt-1">成為第一個分享的人吧！</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </AnimatePresence>
          {syncing && posts.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
              載入動態中…
            </div>
          )}
        </div>
      )}
    </div>
  );
}
