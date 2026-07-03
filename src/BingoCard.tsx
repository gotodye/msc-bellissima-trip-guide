import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, RotateCcw, Trophy, X, AlertCircle } from 'lucide-react';
import { storage } from './firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

// ─── 3 張賓果卡 × 3×3 (9格，方便印在一張紙上) ─────────────────────────────────
const CARDS = [
    {
        id: 'explore', title: '🚢 探索號', color: '#002b5e',
        items: [
            { id: 'e1', emoji: '🌅', title: '看日出/落日', task: '在甲板拍下有太陽的海上照片' },
            { id: 'e2', emoji: '💎', title: '水晶樓梯', task: '在水晶樓梯沒人時打卡合照' },
            { id: 'e3', emoji: '🌊', title: '玩水上滑道', task: '玩至少一個水上樂園滑道' },
            { id: 'e4', emoji: '🎭', title: '看大秀', task: '親眼看完一場表演秀' },
            { id: 'e9', emoji: '🌃', title: '甲板夜景', task: '甲板夜間拍一張夜景' },
            { id: 'e12', emoji: '🛍️', title: 'Galleria逛街', task: '逛完整條香榭大道一圈' },
            { id: 'e15', emoji: '🏊', title: '泳池暢泳', task: '在任一泳池游泳' },
            { id: 'e16', emoji: '🎮', title: 'VR F1賽車', task: '體驗 F1 虛擬賽車機' },
            { id: 'e20', emoji: '🦋', title: 'LED天幕', task: '在 Galleria 拍 LED 天幕照' },
        ]
    },
    {
        id: 'food', title: '🍽️ 美食號', color: '#9a3412',
        items: [
            { id: 'f1', emoji: '🦞', title: '龍蝦打卡', task: '自助餐廳吃到龍蝦並拍照' },
            { id: 'f2', emoji: '🥩', title: '豐盛餐盤', task: '拍一張最豐盛的自助餐盤' },
            { id: 'f3', emoji: '🍰', title: '最美甜點', task: '找到最美甜點拍擺盤照' },
            { id: 'f5', emoji: '🍹', title: '飲料排排站', task: '5種飲料排成一列合照' },
            { id: 'f6', emoji: '🍜', title: '日式餐廳', task: '在 Kaito 日式餐廳打卡' },
            { id: 'f10', emoji: '🍕', title: '深夜Pizza', task: '凌晨吃到新鮮現烤Pizza' },
            { id: 'f12', emoji: '🍦', title: '免費霜淇淋', task: '吃到船上免費霜淇淋' },
            { id: 'f13', emoji: '🍫', title: '巧克力工坊', task: 'Jean-Philippe 巧克力店打卡' },
            { id: 'f19', emoji: '☕', title: '精緻下午茶', task: '享受一次精緻下午茶' },
        ]
    },
    {
        id: 'team', title: '👥 同事號', color: '#065f46',
        items: [
            { id: 't1', emoji: '📸', title: '全員大合照', task: '和全體同事拍一張大合照' },
            { id: 't2', emoji: '🃏', title: '桌遊一局', task: '和同事玩牌/棋/桌遊一局' },
            { id: 't4', emoji: '🤳', title: '神秘自拍', task: '和船長或工作人員自拍' },
            { id: 't9', emoji: '📞', title: '船內電話', task: '打船內電話給另一間房同事' },
            { id: 't10', emoji: '👘', title: '盛裝打扮', task: '正式之夜全套盛裝並拍照' },
            { id: 't11', emoji: '⚪', title: '白色派對', task: '全白打扮參加 White Party' },
            { id: 't12', emoji: '🇮🇹', title: '義大利之夜', task: '紅白綠裝扮參加義大利之夜' },
            { id: 't17', emoji: '🌊', title: '一起跳水', task: '和同事同時跳進泳池' },
            { id: 't20', emoji: '👯', title: '人人合照', task: '和每位同事各拍一張合照（集滿！）' },
        ]
    }
];

// Bingo line indices (3x3 grid)
const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],       // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],       // cols
    [0, 4, 8], [2, 4, 6],               // diagonals
];

async function uploadPhoto(file: File, itemId: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onerror = () => reject(new Error('無法讀取這張圖片'));
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
                } catch (err) { reject(err); }
            };
            img.src = e.target!.result as string;
        };
        reader.onerror = () => reject(new Error('無法讀取這個檔案'));
        reader.readAsDataURL(file);
    });
}

function getBingos(checked: Set<string>, items: { id: string }[]): number[][] {
    return LINES.filter(line => line.every(i => checked.has(items[i]?.id)));
}

interface Props { lang: string; }

export function BingoCard({ lang }: Props) {
    const [cardIdx, setCardIdx] = useState(0);
    const [checked, setChecked] = useState<Record<string, Set<string>>>({});
    const [photos, setPhotos] = useState<Record<string, string>>({});
    const [uploading, setUploading] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const uploadTarget = useRef('');

    const card = CARDS[cardIdx];
    const myChecked = checked[card.id] ?? new Set<string>();
    const bingos = getBingos(myChecked, card.items);
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
        setUploadError(null);
        try {
            const url = await uploadPhoto(file, id);
            setPhotos(p => ({ ...p, [id]: url }));
            setChecked(prev => {
                const cur = new Set(prev[card.id] ?? []);
                cur.add(id);
                return { ...prev, [card.id]: cur };
            });
        } catch (err) {
            setUploadError('照片上傳失敗，請確認網路連線後再試一次');
            setTimeout(() => setUploadError(null), 4000);
        }
        setUploading(null);
        e.target.value = '';
    };

    const doneCount = myChecked.size;
    const total = card.items.length;

    return (
        <div>
            {/* Card selector */}
            <div className="flex gap-2 mb-4">
                {CARDS.map((c, i) => (
                    <button key={c.id} onClick={() => setCardIdx(i)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${i === cardIdx ? 'text-white shadow-md' : 'bg-slate-100 text-slate-500'
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
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="flex items-center gap-1 bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full text-xs font-black">
                            <Trophy className="w-3 h-3" /> BINGO ×{bingoCount}
                        </motion.span>
                    )}
                    <span className="text-xs text-slate-500">{doneCount}/{total} 完成</span>
                </div>
                <button onClick={() => setChecked(p => ({ ...p, [card.id]: new Set() }))}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500">
                    <RotateCcw className="w-3 h-3" /> 重置
                </button>
            </div>

            {/* Upload error banner */}
            <AnimatePresence>
                {uploadError && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="mb-3 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-3 py-2 rounded-xl">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {uploadError}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3×3 Grid */}
            <AnimatePresence mode="wait">
                <motion.div key={card.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="grid grid-cols-3 gap-2">
                    {card.items.map((item, idx) => {
                        const isDone = myChecked.has(item.id);
                        const inBingo = flatBingoIdx.has(idx);
                        const photo = photos[item.id];
                        const isLoading = uploading === item.id;

                        return (
                            <div key={item.id}
                                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all ${inBingo ? 'ring-2 ring-amber-400 ring-offset-1' :
                                        isDone ? 'ring-1 ring-offset-1' : 'border border-slate-200'
                                    }`}
                                style={{ aspectRatio: '1', ringColor: card.color }}
                                onClick={() => toggle(item.id)}>

                                {/* Background: real photo thumbnail once uploaded, otherwise theme color / placeholder */}
                                {photo
                                    ? <img src={photo} className="absolute inset-0 w-full h-full object-cover" alt={item.title} loading="lazy" />
                                    : <div className={`absolute inset-0 ${isDone ? 'opacity-90' : 'bg-slate-50'}`}
                                        style={isDone && !photo ? { background: card.color } : {}} />
                                }

                                {/* Content */}
                                <div className={`absolute inset-0 flex flex-col items-center justify-center gap-0.5 p-1 ${photo ? 'bg-black/35' : ''}`}>
                                    <span className="text-2xl leading-none">{item.emoji}</span>
                                    <span className={`text-[11px] font-bold text-center leading-tight px-1 ${isDone || photo ? 'text-white' : 'text-slate-600'
                                        }`}>{item.title}</span>
                                    {isDone && !photo && (
                                        <span className="text-white text-lg font-black absolute top-1 right-1.5">✓</span>
                                    )}
                                </div>

                                {/* Camera button — bigger tap target now that cells are 3×3 not 5×5 */}
                                <button
                                    onClick={e => { e.stopPropagation(); uploadTarget.current = item.id; fileRef.current?.click(); }}
                                    className="absolute bottom-1.5 right-1.5 bg-black/40 hover:bg-black/60 active:scale-90 text-white rounded-full p-1.5 transition-all">
                                    {isLoading
                                        ? <span className="w-3.5 h-3.5 block border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        : <Camera className="w-3.5 h-3.5" />
                                    }
                                </button>

                                {/* Photo tap to preview full size */}
                                {photo && (
                                    <button onClick={e => { e.stopPropagation(); setPreview(photo); }}
                                        className="absolute top-1.5 left-1.5 bg-black/40 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        看大圖
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
                    <div key={item.id} className={`flex items-start gap-1.5 text-xs ${myChecked.has(item.id) ? 'text-slate-400 line-through' : 'text-slate-600'
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
