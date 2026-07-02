import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, RotateCcw, Trophy, X } from 'lucide-react';
import { storage } from './firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

// ─── 3 張賓果卡 × 5×5 (25格) ────────────────────────────────────────────────
const CARDS = [
  {
    id: 'explore', title: '🚢 探索號', color: '#002b5e',
    items: [
      { id:'e1',  emoji:'🌅', title:'看日出/落日', task:'在甲板拍下有太陽的海上照片' },
      { id:'e2',  emoji:'💎', title:'水晶樓梯',   task:'在水晶樓梯沒人時打卡合照' },
      { id:'e3',  emoji:'🌊', title:'玩水上滑道', task:'玩至少一個水上樂園滑道' },
      { id:'e4',  emoji:'🎭', title:'看大秀',     task:'親眼看完一場表演秀' },
      { id:'e5',  emoji:'🍽️', title:'主餐廳晚餐', task:'在主餐廳拍桌上佳餚' },
      { id:'e6',  emoji:'☕', title:'老船長酒吧', task:'在老船長酒吧喝一杯' },
      { id:'e7',  emoji:'💆', title:'SPA體驗',   task:'進去 Aurea SPA 放鬆' },
      { id:'e8',  emoji:'🌬️', title:'船頭迎風照', task:'在船頭拍一張迎風照' },
      { id:'e9',  emoji:'🌃', title:'甲板夜景',   task:'甲板夜間拍一張夜景' },
      { id:'e10', emoji:'🎰', title:'賭場探索',   task:'在賭場待超過 10 分鐘' },
      { id:'e11', emoji:'🏋️', title:'健身房打卡', task:'健身房使用器材並自拍' },
      { id:'e12', emoji:'🛍️', title:'Galleria逛街',task:'逛完整條香榭大道一圈' },
      { id:'e13', emoji:'🎳', title:'打保齡球',   task:'打一局保齡球' },
      { id:'e14', emoji:'🎡', title:'Cirque大秀', task:'看 Cirque du Soleil 表演' },
      { id:'e15', emoji:'🌊', title:'泳池暢泳',   task:'在任一泳池游泳' },
      { id:'e16', emoji:'🎮', title:'VR F1賽車',  task:'體驗 F1 虛擬賽車機' },
      { id:'e17', emoji:'🔭', title:'頂層日落',   task:'頂層甲板看日落' },
      { id:'e18', emoji:'🎵', title:'現場音樂',   task:'找到任何現場演奏' },
      { id:'e19', emoji:'📸', title:'神級角度',   task:'找到並分享一個超美構圖' },
      { id:'e20', emoji:'🦋', title:'LED天幕',    task:'在 Galleria 拍 LED 天幕照' },
      { id:'e21', emoji:'🐠', title:'海洋生物',   task:'在海上看到魚或海豚' },
      { id:'e22', emoji:'🌈', title:'天空奇景',   task:'拍到壯觀的雲彩或彩虹' },
      { id:'e23', emoji:'🛁', title:'泡澡放鬆',   task:'在房間浴缸泡澡一次' },
      { id:'e24', emoji:'💤', title:'自然醒',     task:'不設鬧鐘讓自己自然醒來' },
      { id:'e25', emoji:'🌙', title:'深夜探索',   task:'凌晨2點後還在甲板活動' },
    ]
  },
  {
    id: 'food', title: '🍽️ 美食號', color: '#9a3412',
    items: [
      { id:'f1',  emoji:'🦞', title:'龍蝦打卡',   task:'自助餐廳吃到龍蝦並拍照' },
      { id:'f2',  emoji:'🥩', title:'豐盛餐盤',   task:'拍一張最豐盛的自助餐盤' },
      { id:'f3',  emoji:'🍰', title:'最美甜點',   task:'找到最美甜點拍擺盤照' },
      { id:'f4',  emoji:'🌅', title:'海景早餐',   task:'窗邊對著海景拍早餐照' },
      { id:'f5',  emoji:'🍹', title:'飲料排排站', task:'5種飲料排成一列合照' },
      { id:'f6',  emoji:'🍜', title:'日式餐廳',   task:'在 Kaito 日式餐廳打卡' },
      { id:'f7',  emoji:'🎂', title:'壽星慶生',   task:'替任何一位同事慶生' },
      { id:'f8',  emoji:'🥂', title:'乾杯自拍',   task:'晚餐和同事乾杯自拍' },
      { id:'f9',  emoji:'👑', title:'私房最愛',   task:'找到最好吃的並分享給大家' },
      { id:'f10', emoji:'🍕', title:'深夜Pizza',  task:'凌晨吃到新鮮現烤Pizza' },
      { id:'f11', emoji:'🥐', title:'法式早餐',   task:'拍一張法式早餐全套照' },
      { id:'f12', emoji:'🍦', title:'免費霜淇淋', task:'吃到船上免費霜淇淋' },
      { id:'f13', emoji:'🍫', title:'巧克力工坊', task:'Jean-Philippe 巧克力店打卡' },
      { id:'f14', emoji:'🥗', title:'沙拉塔',     task:'疊一個超高的沙拉塔並拍照' },
      { id:'f15', emoji:'🍳', title:'現場烹飪',   task:'拍廚師現場料理的過程' },
      { id:'f16', emoji:'🍾', title:'開瓶慶祝',   task:'開一瓶酒和大家分享' },
      { id:'f17', emoji:'🌮', title:'挑戰新料理', task:'嘗試平常不吃的一種食物' },
      { id:'f18', emoji:'🥣', title:'早餐對比',   task:'拍豐盛vs簡單兩種早餐照' },
      { id:'f19', emoji:'☕', title:'精緻下午茶', task:'享受一次精緻下午茶' },
      { id:'f20', emoji:'🍱', title:'外帶回房',   task:'把食物帶回房間享用' },
      { id:'f21', emoji:'🥤', title:'自創特調',   task:'自己搭配一杯特調飲料' },
      { id:'f22', emoji:'🎁', title:'甜點盲選',   task:'閉眼隨機選一個甜點' },
      { id:'f23', emoji:'🌿', title:'健康挑戰',   task:'吃一頓全蔬食/健康餐' },
      { id:'f24', emoji:'🎨', title:'食物藝術',   task:'把食物擺成藝術造型拍照' },
      { id:'f25', emoji:'🔥', title:'加熱美食',   task:'在自助加熱站加熱食物' },
    ]
  },
  {
    id: 'team', title: '👥 同事號', color: '#065f46',
    items: [
      { id:'t1',  emoji:'📸', title:'全員大合照', task:'和全體同事拍一張大合照' },
      { id:'t2',  emoji:'🃏', title:'桌遊一局',   task:'和同事玩牌/棋/桌遊一局' },
      { id:'t3',  emoji:'🎤', title:'公開表演',   task:'參加船上活動或唱一首歌' },
      { id:'t4',  emoji:'🤳', title:'神秘自拍',   task:'和船長或工作人員自拍' },
      { id:'t5',  emoji:'🌺', title:'最美秘景',   task:'分享你發現的絕美拍照角落' },
      { id:'t6',  emoji:'🎯', title:'贏得獎品',   task:'在遊樂區贏任何遊戲獎品' },
      { id:'t7',  emoji:'🎉', title:'製造驚喜',   task:'給任何一位同事一個意外驚喜' },
      { id:'t8',  emoji:'💬', title:'學外語',     task:'用義大利語說Grazie給服務員' },
      { id:'t9',  emoji:'📞', title:'船內電話',   task:'打船內電話給另一間房同事' },
      { id:'t10', emoji:'👘', title:'盛裝打扮',   task:'正式之夜全套盛裝並拍照' },
      { id:'t11', emoji:'⚪', title:'白色派對',   task:'全白打扮參加 White Party' },
      { id:'t12', emoji:'🇮🇹', title:'義大利之夜', task:'紅白綠裝扮參加義大利之夜' },
      { id:'t13', emoji:'🏃', title:'甲板晨跑',   task:'在甲板上晨跑或快走一圈' },
      { id:'t14', emoji:'😴', title:'偷拍睡姿',   task:'經許可偷拍同事睡著的樣子' },
      { id:'t15', emoji:'🔑', title:'串門子',     task:'去同事房間串門子' },
      { id:'t16', emoji:'📝', title:'旅行金句',   task:'分享一句這趟旅行的心得' },
      { id:'t17', emoji:'🌊', title:'一起跳水',   task:'和同事同時跳進泳池' },
      { id:'t18', emoji:'🎸', title:'帶動跳舞',   task:'在有音樂的地方帶動大家跳舞' },
      { id:'t19', emoji:'🔮', title:'默契測試',   task:'和一位同事玩默契問答遊戲' },
      { id:'t20', emoji:'👯', title:'人人合照',   task:'和每位同事各拍一張合照（集滿！）' },
      { id:'t21', emoji:'🍽️', title:'同桌吃飯',   task:'讓所有同事坐同一桌吃飯' },
      { id:'t22', emoji:'🗣️', title:'互相稱讚',   task:'當面稱讚每位同事一個優點' },
      { id:'t23', emoji:'🌅', title:'同看日落',   task:'3位以上同事一起看日落' },
      { id:'t24', emoji:'🛳️', title:'分享密技',   task:'把發現的好玩訊息分享給大家' },
      { id:'t25', emoji:'💝', title:'感謝主辦',   task:'向此次旅遊主辦人表達謝意' },
    ]
  }
];

// Bingo line indices (5x5 grid)
const LINES = [
  [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24], // rows
  [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24], // cols
  [0,6,12,18,24],[4,8,12,16,20],                                                // diagonals
];

async function uploadPhoto(file: File, itemId: string): Promise<string> {
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
          resolve(await getDownloadURL(storageRef));
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
  const [cardIdx,   setCardIdx]   = useState(0);
  const [checked,   setChecked]   = useState<Record<string, Set<string>>>({});
  const [photos,    setPhotos]    = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [preview,   setPreview]   = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef('');

  const card     = CARDS[cardIdx];
  const myChecked = checked[card.id] ?? new Set<string>();
  const bingos   = getBingos(myChecked, card.items);
  const bingoCount = bingos.length;
  const flatBingoIdx = new Set(bingos.flat());

  const toggle = (id: string) => {
    setChecked(prev => {
      const cur = new Set(prev[card.id] ?? []);
      cur.has(id) ? cur.delete(id) : cur.add(id);
      return { ...prev, [card.id]: cur };
    });
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget.current) return;
    const id = uploadTarget.current;
    setUploading(id);
    try {
      const url = await uploadPhoto(file, id);
      setPhotos(p => ({ ...p, [id]: url }));
      setChecked(prev => {
        const cur = new Set(prev[card.id] ?? []);
        cur.add(id);
        return { ...prev, [card.id]: cur };
      });
    } catch {}
    setUploading(null);
    e.target.value = '';
  };

  const doneCount = myChecked.size;

  return (
    <div>
      {/* Card selector */}
      <div className="flex gap-2 mb-4">
        {CARDS.map((c, i) => (
          <button key={c.id} onClick={() => setCardIdx(i)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              i === cardIdx ? 'text-white shadow-md' : 'bg-slate-100 text-slate-500'
            }`}
            style={i === cardIdx ? { background: c.color } : {}}>
            {c.title}
          </button>
        ))}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {bingoCount > 0 && (
            <motion.span initial={{scale:0}} animate={{scale:1}}
              className="flex items-center gap-1 bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full text-xs font-black">
              <Trophy className="w-3 h-3" /> BINGO ×{bingoCount}
            </motion.span>
          )}
          <span className="text-xs text-slate-500">{doneCount}/25 完成</span>
        </div>
        <button onClick={() => setChecked(p => ({ ...p, [card.id]: new Set() }))}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500">
          <RotateCcw className="w-3 h-3" /> 重置
        </button>
      </div>

      {/* 5×5 Grid */}
      <AnimatePresence mode="wait">
        <motion.div key={card.id} initial={{opacity:0}} animate={{opacity:1}}
          className="grid grid-cols-5 gap-1">
          {card.items.map((item, idx) => {
            const isDone    = myChecked.has(item.id);
            const inBingo   = flatBingoIdx.has(idx);
            const photo     = photos[item.id];
            const isLoading = uploading === item.id;

            return (
              <div key={item.id}
                className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                  inBingo  ? 'ring-2 ring-amber-400 ring-offset-1' :
                  isDone   ? 'ring-1 ring-offset-1' : 'border border-slate-200'
                }`}
                style={{ aspectRatio:'1', ringColor: card.color }}
                onClick={() => toggle(item.id)}>

                {/* Background */}
                {photo
                  ? <img src={photo} className="absolute inset-0 w-full h-full object-cover" alt="" />
                  : <div className={`absolute inset-0 ${isDone ? 'opacity-90' : 'bg-slate-50'}`}
                      style={isDone && !photo ? { background: card.color } : {}} />
                }

                {/* Content */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-0.5 ${photo ? 'bg-black/40' : ''}`}>
                  <span className="text-base leading-none">{item.emoji}</span>
                  <span className={`text-[8px] font-bold mt-0.5 text-center leading-tight px-0.5 ${
                    isDone || photo ? 'text-white' : 'text-slate-600'
                  }`}>{item.title}</span>
                  {isDone && !photo && (
                    <span className="text-white text-sm font-black absolute top-0.5 right-1">✓</span>
                  )}
                </div>

                {/* Camera button */}
                <button
                  onClick={e => { e.stopPropagation(); uploadTarget.current = item.id; fileRef.current?.click(); }}
                  className="absolute bottom-0.5 right-0.5 bg-black/30 hover:bg-black/50 text-white rounded-full p-0.5 transition-colors">
                  {isLoading
                    ? <span className="w-2.5 h-2.5 block border border-white border-t-transparent rounded-full animate-spin" />
                    : <Camera className="w-2.5 h-2.5" />
                  }
                </button>

                {/* Photo tap to preview */}
                {photo && (
                  <button onClick={e => { e.stopPropagation(); setPreview(photo); }}
                    className="absolute top-0.5 left-0.5 bg-black/30 text-white text-[7px] px-1 rounded">
                    看
                  </button>
                )}
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Task list */}
      <div className="mt-4 bg-slate-50 rounded-2xl p-3 space-y-1">
        <p className="text-xs font-bold text-slate-400 mb-2">📋 任務說明</p>
        {card.items.map(item => (
          <div key={item.id} className={`flex items-start gap-1.5 text-xs ${
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
            <button className="absolute top-4 right-4 text-white p-2">
              <X className="w-6 h-6" />
            </button>
            <img src={preview} className="max-w-full max-h-[80vh] rounded-xl object-contain" alt="" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
