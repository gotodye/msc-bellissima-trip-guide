import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, RotateCcw, Trophy, X } from 'lucide-react';
import { storage } from './firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

// ─── 3 張賓果卡的任務清單 ──────────────────────────────────────────────────
const CARDS = [
  {
    id: 'explore', title: '🚢 探索號', color: '#002b5e',
    items: [
      { id:'e1', emoji:'🌅', title:'日落打卡',   task:'在甲板拍下有太陽的照片' },
      { id:'e2', emoji:'💎', title:'水晶樓梯',   task:'在水晶樓梯前打卡合照' },
      { id:'e3', emoji:'🌊', title:'水上樂園',   task:'玩至少一個水上滑道' },
      { id:'e4', emoji:'🎭', title:'看大秀',     task:'親眼看完一場表演秀' },
      { id:'e5', emoji:'🍽️', title:'主餐廳',     task:'在主餐廳拍桌上佳餚' },
      { id:'e6', emoji:'☕', title:'船長酒吧',   task:'在老船長酒吧喝一杯' },
      { id:'e7', emoji:'💆', title:'放鬆身心',   task:'體驗SPA或泡泳池' },
      { id:'e8', emoji:'🌬️', title:'迎風奔跑',   task:'在船頭拍一張迎風照' },
      { id:'e9', emoji:'🌃', title:'夜景打卡',   task:'甲板夜間拍一張夜景' },
    ]
  },
  {
    id: 'food', title: '🍽️ 美食號', color: '#9a3412',
    items: [
      { id:'f1', emoji:'🦞', title:'龍蝦打卡',   task:'吃到龍蝦並拍照留念' },
      { id:'f2', emoji:'🥩', title:'豐盛餐盤',   task:'拍一張最豐盛的自助餐盤' },
      { id:'f3', emoji:'🍰', title:'甜點美照',   task:'找到最美甜點拍擺盤照' },
      { id:'f4', emoji:'🌅', title:'海景早餐',   task:'窗邊對著海景拍早餐照' },
      { id:'f5', emoji:'🍹', title:'飲料排排站', task:'5種飲料排成一列合照' },
      { id:'f6', emoji:'🍜', title:'日式餐廳',   task:'在日式餐廳用餐打卡' },
      { id:'f7', emoji:'🎂', title:'壽星驚喜',   task:'幫人慶生或找到壽星' },
      { id:'f8', emoji:'🥂', title:'乾杯自拍',   task:'晚餐和同事乾杯自拍' },
      { id:'f9', emoji:'👑', title:'私房最愛',   task:'找到最好吃的並告訴大家' },
    ]
  },
  {
    id: 'team', title: '👥 同事號', color: '#065f46',
    items: [
      { id:'t1', emoji:'📸', title:'大合照',     task:'和全體同事拍一張大合照' },
      { id:'t2', emoji:'🃏', title:'桌遊一局',   task:'和同事玩牌/棋/桌遊' },
      { id:'t3', emoji:'🎤', title:'上台表演',   task:'參加船上活動或唱一首歌' },
      { id:'t4', emoji:'🛍️', title:'奇特伴手禮', task:'那霸買到最特別的禮物' },
      { id:'t5', emoji:'🗺️', title:'那霸探索',   task:'逛2個以上景點並打卡' },
      { id:'t6', emoji:'🤳', title:'神秘自拍',   task:'和船長或工作人員自拍' },
      { id:'t7', emoji:'🌺', title:'最美角落',   task:'發現船上最美的拍照角落' },
      { id:'t8', emoji:'🎯', title:'贏得獎品',   task:'在遊樂區贏任何遊戲獎品' },
      { id:'t9', emoji:'💌', title:'寄明信片',   task:'在那霸寄出一張明信片' },
    ]
  }
];

const LINES = [
  [0,1,2],[3,4,5],[6,7,8],   // rows
  [0,3,6],[1,4,7],[2,5,8],   // cols
  [0,4,8],[2,4,6]            // diagonals
];

async function compressAndUpload(file: File, itemId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        const max = 800;
        const ratio = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        try {
          const storageRef = ref(storage, `bingo/${itemId}-${Date.now()}.jpg`);
          await uploadString(storageRef, dataUrl, 'data_url');
          const url = await getDownloadURL(storageRef);
          resolve(url);
        } catch(e) { reject(e); }
      };
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getBingos(checked: Set<string>, items: {id:string}[]): number[][] {
  return LINES.filter(line => line.every(i => checked.has(items[i]?.id)));
}

interface Props { lang: string; }

export function BingoCard({ lang }: Props) {
  const [cardIdx, setCardIdx]   = useState(0);
  const [checked, setChecked]   = useState<Record<string, Set<string>>>({});
  const [photos,  setPhotos]    = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [preview,   setPreview]  = useState<{id:string;url:string} | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<string>('');

  const card = CARDS[cardIdx];
  const myChecked = checked[card.id] ?? new Set();
  const bingos = getBingos(myChecked, card.items);
  const bingoCount = bingos.length;

  const toggle = (itemId: string) => {
    setChecked(prev => {
      const cur = new Set(prev[card.id] ?? []);
      cur.has(itemId) ? cur.delete(itemId) : cur.add(itemId);
      return { ...prev, [card.id]: cur };
    });
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget.current) return;
    const id = uploadTarget.current;
    setUploading(id);
    try {
      const url = await compressAndUpload(file, id);
      setPhotos(p => ({ ...p, [id]: url }));
      // auto-check when photo uploaded
      setChecked(prev => {
        const cur = new Set(prev[card.id] ?? []);
        cur.add(id);
        return { ...prev, [card.id]: cur };
      });
    } catch { /* fail silently */ }
    setUploading(null);
    e.target.value = '';
  };

  const reset = () => {
    setChecked(prev => ({ ...prev, [card.id]: new Set() }));
  };

  return (
    <div className="space-y-4">
      {/* Card selector */}
      <div className="flex gap-2">
        {CARDS.map((c, i) => (
          <button key={c.id} onClick={() => setCardIdx(i)}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all ${
              i === cardIdx
                ? 'text-white shadow-lg scale-105'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
            style={i === cardIdx ? { background: c.color } : {}}>
            {c.title}
          </button>
        ))}
      </div>

      {/* Bingo status */}
      <AnimatePresence mode="wait">
        <motion.div key={card.id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {bingoCount > 0 && (
                <motion.div initial={{scale:0}} animate={{scale:1}}
                  className="flex items-center gap-1 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-black">
                  <Trophy className="w-3 h-3" />
                  BINGO ×{bingoCount}
                </motion.div>
              )}
              <span className="text-xs text-slate-500">
                {myChecked.size}/9 完成
              </span>
            </div>
            <button onClick={reset} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600">
              <RotateCcw className="w-3 h-3" /> 重置
            </button>
          </div>

          {/* 3×3 Grid */}
          <div className="grid grid-cols-3 gap-2">
            {card.items.map((item, idx) => {
              const isChecked = myChecked.has(item.id);
              const photo = photos[item.id];
              const isLoading = uploading === item.id;
              const inBingo = bingos.some(line => line.includes(idx));

              return (
                <motion.div key={item.id}
                  whileTap={{ scale: 0.95 }}
                  className={`relative rounded-2xl overflow-hidden aspect-square cursor-pointer transition-all ${
                    inBingo ? 'ring-2 ring-amber-400 ring-offset-1' :
                    isChecked ? 'ring-2 ring-offset-1' : 'border border-slate-200'
                  }`}
                  style={{ ringColor: card.color }}
                  onClick={() => toggle(item.id)}>

                  {/* Background photo or color */}
                  {photo ? (
                    <img src={photo} className="absolute inset-0 w-full h-full object-cover" alt="" />
                  ) : (
                    <div className={`absolute inset-0 transition-colors ${
                      isChecked ? 'opacity-90' : 'bg-slate-50'
                    }`} style={isChecked ? { background: card.color } : {}} />
                  )}

                  {/* Overlay */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center p-1 ${
                    photo ? 'bg-black/40' : ''
                  }`}>
                    <span className="text-2xl leading-none">{item.emoji}</span>
                    <span className={`text-[10px] font-bold mt-1 text-center leading-tight ${
                      isChecked || photo ? 'text-white' : 'text-slate-700'
                    }`}>{item.title}</span>
                    {isChecked && !photo && (
                      <span className="text-white text-lg font-black absolute top-1 right-2">✓</span>
                    )}
                  </div>

                  {/* Camera button */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      uploadTarget.current = item.id;
                      fileRef.current?.click();
                    }}
                    className={`absolute bottom-1 right-1 rounded-full p-1 transition-all ${
                      photo ? 'bg-white/80 text-slate-700' : 'bg-black/20 text-white/80 hover:bg-black/40'
                    }`}>
                    {isLoading
                      ? <span className="w-3 h-3 block border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <Camera className="w-3 h-3" />
                    }
                  </button>

                  {/* Photo preview button */}
                  {photo && (
                    <button
                      onClick={e => { e.stopPropagation(); setPreview({ id: item.id, url: photo }); }}
                      className="absolute top-1 left-1 bg-black/40 text-white text-[9px] px-1 rounded">
                      查看
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Task list */}
      <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5">
        <p className="text-xs font-bold text-slate-500 mb-2">📋 任務說明</p>
        {card.items.map(item => (
          <div key={item.id} className={`flex items-start gap-2 text-xs ${
            myChecked.has(item.id) ? 'text-slate-400 line-through' : 'text-slate-600'
          }`}>
            <span className="flex-shrink-0">{item.emoji}</span>
            <span><b>{item.title}</b>：{item.task}</span>
          </div>
        ))}
      </div>

      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        className="hidden" onChange={onFile} />

      {/* Photo preview modal */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setPreview(null)}>
            <button className="absolute top-4 right-4 text-white"><X className="w-6 h-6" /></button>
            <img src={preview.url} className="max-w-full max-h-[80vh] rounded-xl object-contain" alt="" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
