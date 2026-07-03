import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, RotateCcw, Trophy, X, AlertCircle } from 'lucide-react';
import { storage } from './firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

// ─── 2 張賓果卡 × 3×3（共18格，含那霸上岸任務）／ 4 語言版本 ──────────────────
type BingoItem = { id: string; emoji: string; title: string; task: string };
type BingoDeck = { id: string; title: string; color: string; items: BingoItem[] };

const CARDS_BY_LANG: Record<string, BingoDeck[]> = {
  zh: [
    {
      id: 'explore', title: '🚢 探索號', color: '#002b5e',
      items: [
        { id: 'e1', emoji: '🌅', title: '看日出/落日', task: '在甲板拍下有太陽的海上照片' },
        { id: 'e2', emoji: '💎', title: '水晶樓梯', task: '在水晶樓梯沒人時打卡合照' },
        { id: 'e4', emoji: '🎭', title: '看大秀', task: '親眼看完一場表演秀' },
        { id: 'e9', emoji: '🌃', title: '甲板夜景', task: '甲板夜間拍一張夜景' },
        { id: 'e16', emoji: '🎮', title: 'VR F1賽車', task: '體驗 F1 虛擬賽車機' },
        { id: 'e20', emoji: '🦋', title: 'LED天幕', task: '在 Galleria 拍 LED 天幕照' },
        { id: 'n1', emoji: '⛩️', title: '波上宮打卡', task: '在波上宮或波之上海灘拍照' },
        { id: 'n2', emoji: '🛍️', title: '國際通戰利品', task: '在國際通買到戰利品拍照' },
        { id: 'n3', emoji: '🏯', title: '首里城巡禮', task: '造訪首里城拍一張紀念照' },
      ]
    },
    {
      id: 'together', title: '🍽️ 美食同事號', color: '#9a3412',
      items: [
        { id: 'f1', emoji: '🦞', title: '龍蝦打卡', task: '自助餐廳吃到龍蝦並拍照' },
        { id: 'f3', emoji: '🍰', title: '最美甜點', task: '找到最美甜點拍擺盤照' },
        { id: 'f12', emoji: '🍦', title: '免費霜淇淋', task: '吃到船上免費霜淇淋' },
        { id: 'k1', emoji: '🧱', title: '樂高俱樂部', task: '和小朋友一起去樂高俱樂部玩耍' },
        { id: 't1', emoji: '📸', title: '全員大合照', task: '和全體同事拍一張大合照' },
        { id: 't11', emoji: '⚪', title: '白色派對', task: '全白打扮參加 White Party' },
        { id: 't12', emoji: '🇮🇹', title: '義大利之夜', task: '紅白綠裝扮參加義大利之夜' },
        { id: 's1', emoji: '🎁', title: '血拚戰利品', task: '拍一張這趟旅程的血拚戰利品' },
        { id: 'f5', emoji: '🥤', title: '飲料排排站', task: '5種飲料排成一列合照' },
      ]
    }
  ],
  en: [
    {
      id: 'explore', title: '🚢 Explorer', color: '#002b5e',
      items: [
        { id: 'e1', emoji: '🌅', title: 'Sunrise/Sunset', task: 'Snap a sea photo with the sun from the deck' },
        { id: 'e2', emoji: '💎', title: 'Crystal Staircase', task: 'Photo at the Crystal Staircase when it\'s empty' },
        { id: 'e4', emoji: '🎭', title: 'Watch a Show', task: 'See a full theatre show live' },
        { id: 'e9', emoji: '🌃', title: 'Deck at Night', task: 'Take a night photo from the deck' },
        { id: 'e16', emoji: '🎮', title: 'VR F1 Racing', task: 'Try the F1 racing simulator' },
        { id: 'e20', emoji: '🦋', title: 'LED Canopy', task: 'Photo of the LED canopy in the Galleria' },
        { id: 'n1', emoji: '⛩️', title: 'Naminoue Shrine', task: 'Photo at Naminoue Shrine or Beach' },
        { id: 'n2', emoji: '🛍️', title: 'Kokusai Dori Haul', task: 'Photo of what you bought on Kokusai Dori' },
        { id: 'n3', emoji: '🏯', title: 'Shuri Castle', task: 'Take a memorial photo at Shuri Castle' },
      ]
    },
    {
      id: 'together', title: '🍽️ Food & Friends', color: '#9a3412',
      items: [
        { id: 'f1', emoji: '🦞', title: 'Lobster Check-in', task: 'Get lobster at the buffet and snap it' },
        { id: 'f3', emoji: '🍰', title: 'Prettiest Dessert', task: 'Find and photograph the prettiest dessert' },
        { id: 'f12', emoji: '🍦', title: 'Free Soft-Serve', task: 'Get the free soft-serve ice cream onboard' },
        { id: 'k1', emoji: '🧱', title: 'LEGO Club', task: 'Take the kids to play at the LEGO Club' },
        { id: 't1', emoji: '📸', title: 'Group Photo', task: 'Take a group photo with everyone' },
        { id: 't11', emoji: '⚪', title: 'White Party', task: 'Dress in all-white for the White Party' },
        { id: 't12', emoji: '🇮🇹', title: 'Italian Night', task: 'Wear red, white, or green for Italian Night' },
        { id: 's1', emoji: '🎁', title: 'Shopping Haul', task: 'Photo of your shopping haul from the trip' },
        { id: 'f5', emoji: '🥤', title: 'Drink Lineup', task: 'Line up 5 different drinks for a photo' },
      ]
    }
  ],
  id: [
    {
      id: 'explore', title: '🚢 Penjelajah', color: '#002b5e',
      items: [
        { id: 'e1', emoji: '🌅', title: 'Matahari Terbit/Terbenam', task: 'Foto laut dengan matahari dari dek' },
        { id: 'e2', emoji: '💎', title: 'Tangga Kristal', task: 'Foto di Tangga Kristal saat sepi' },
        { id: 'e4', emoji: '🎭', title: 'Nonton Pertunjukan', task: 'Tonton satu pertunjukan sampai selesai' },
        { id: 'e9', emoji: '🌃', title: 'Dek Malam Hari', task: 'Foto pemandangan malam dari dek' },
        { id: 'e16', emoji: '🎮', title: 'Balapan VR F1', task: 'Coba simulator balapan F1' },
        { id: 'e20', emoji: '🦋', title: 'Kanopi LED', task: 'Foto kanopi LED di Galleria' },
        { id: 'n1', emoji: '⛩️', title: 'Kuil Naminoue', task: 'Foto di Kuil Naminoue atau Pantai' },
        { id: 'n2', emoji: '🛍️', title: 'Belanjaan Kokusai Dori', task: 'Foto belanjaan dari Kokusai Dori' },
        { id: 'n3', emoji: '🏯', title: 'Kastil Shuri', task: 'Foto kenangan di Kastil Shuri' },
      ]
    },
    {
      id: 'together', title: '🍽️ Makanan & Teman', color: '#9a3412',
      items: [
        { id: 'f1', emoji: '🦞', title: 'Cek-in Lobster', task: 'Dapatkan lobster di buffet dan foto' },
        { id: 'f3', emoji: '🍰', title: 'Dessert Tercantik', task: 'Cari dan foto dessert paling cantik' },
        { id: 'f12', emoji: '🍦', title: 'Es Krim Gratis', task: 'Dapatkan es krim gratis di kapal' },
        { id: 'k1', emoji: '🧱', title: 'LEGO Club', task: 'Ajak anak-anak main di LEGO Club' },
        { id: 't1', emoji: '📸', title: 'Foto Bersama', task: 'Foto bersama semua rekan kerja' },
        { id: 't11', emoji: '⚪', title: 'Pesta Putih', task: 'Pakai baju serba putih ke Pesta Putih' },
        { id: 't12', emoji: '🇮🇹', title: 'Malam Italia', task: 'Pakai merah, putih, atau hijau ke Malam Italia' },
        { id: 's1', emoji: '🎁', title: 'Hasil Belanja', task: 'Foto hasil belanja dari perjalanan ini' },
        { id: 'f5', emoji: '🥤', title: 'Deretan Minuman', task: 'Susun 5 minuman berbeda untuk difoto' },
      ]
    }
  ],
  th: [
    {
      id: 'explore', title: '🚢 นักสำรวจ', color: '#002b5e',
      items: [
        { id: 'e1', emoji: '🌅', title: 'พระอาทิตย์ขึ้น/ตก', task: 'ถ่ายรูปทะเลกับพระอาทิตย์จากดาดฟ้า' },
        { id: 'e2', emoji: '💎', title: 'บันไดคริสตัล', task: 'ถ่ายรูปที่บันไดคริสตัลตอนไม่มีคน' },
        { id: 'e4', emoji: '🎭', title: 'ดูโชว์', task: 'ดูการแสดงสดจนจบหนึ่งรอบ' },
        { id: 'e9', emoji: '🌃', title: 'ดาดฟ้ายามค่ำคืน', task: 'ถ่ายรูปวิวกลางคืนจากดาดฟ้า' },
        { id: 'e16', emoji: '🎮', title: 'แข่งรถ VR F1', task: 'ลองเล่นเครื่องจำลองแข่งรถ F1' },
        { id: 'e20', emoji: '🦋', title: 'หลังคา LED', task: 'ถ่ายรูปหลังคา LED ที่ Galleria' },
        { id: 'n1', emoji: '⛩️', title: 'ศาลเจ้านามิโนะอุเอะ', task: 'ถ่ายรูปที่ศาลเจ้านามิโนะอุเอะหรือชายหาด' },
        { id: 'n2', emoji: '🛍️', title: 'ของฝากจาก Kokusai Dori', task: 'ถ่ายรูปของที่ซื้อจาก Kokusai Dori' },
        { id: 'n3', emoji: '🏯', title: 'ปราสาทชูริ', task: 'ถ่ายรูปที่ระลึกที่ปราสาทชูริ' },
      ]
    },
    {
      id: 'together', title: '🍽️ อาหารและเพื่อน', color: '#9a3412',
      items: [
        { id: 'f1', emoji: '🦞', title: 'เช็กอินล็อบสเตอร์', task: 'หาล็อบสเตอร์ที่บุฟเฟ่ต์แล้วถ่ายรูป' },
        { id: 'f3', emoji: '🍰', title: 'ของหวานสวยที่สุด', task: 'หาและถ่ายรูปของหวานที่สวยที่สุด' },
        { id: 'f12', emoji: '🍦', title: 'ไอศกรีมฟรี', task: 'กินไอศกรีมซอฟต์เสิร์ฟฟรีบนเรือ' },
        { id: 'k1', emoji: '🧱', title: 'LEGO Club', task: 'พาเด็กๆ ไปเล่นที่ LEGO Club' },
        { id: 't1', emoji: '📸', title: 'ถ่ายรูปหมู่', task: 'ถ่ายรูปรวมกับเพื่อนร่วมงานทุกคน' },
        { id: 't11', emoji: '⚪', title: 'White Party', task: 'แต่งชุดขาวล้วนไปงาน White Party' },
        { id: 't12', emoji: '🇮🇹', title: 'Italian Night', task: 'แต่งชุดแดง ขาว เขียว ไปงาน Italian Night' },
        { id: 's1', emoji: '🎁', title: 'ของที่ช้อปมา', task: 'ถ่ายรูปของที่ช้อปได้ในทริปนี้' },
        { id: 'f5', emoji: '🥤', title: 'แถวเครื่องดื่ม', task: 'จัดเครื่องดื่ม 5 ชนิดเรียงกันถ่ายรูป' },
      ]
    }
  ],
};

const UI_TEXT: Record<string, { done: string; reset: string; viewPhoto: string; uploadError: string }> = {
  zh: { done: '完成', reset: '重置', viewPhoto: '看大圖', uploadError: '照片上傳失敗，請確認網路連線後再試一次' },
  en: { done: 'done', reset: 'Reset', viewPhoto: 'View', uploadError: 'Upload failed — check your connection and try again' },
  id: { done: 'selesai', reset: 'Atur Ulang', viewPhoto: 'Lihat', uploadError: 'Gagal mengunggah — periksa koneksi internet Anda dan coba lagi' },
  th: { done: 'เสร็จ', reset: 'รีเซ็ต', viewPhoto: 'ดูรูปใหญ่', uploadError: 'อัปโหลดไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่' },
};

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
      img.onerror = () => reject(new Error('image read failed'));
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
    reader.onerror = () => reject(new Error('file read failed'));
    reader.readAsDataURL(file);
  });
}

function getBingos(checked: Set<string>, items: { id: string }[]): number[][] {
  return LINES.filter(line => line.every(i => checked.has(items[i]?.id)));
}

// ─── 進度存到 localStorage，避免切分頁或重新整理後打勾跟照片就不見 ──────────────
const STORAGE_KEY = 'msc-bingo-progress-v2';

function loadProgress(): { checked: Record<string, string[]>; photos: Record<string, string> } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { checked: parsed.checked ?? {}, photos: parsed.photos ?? {} };
    }
  } catch { /* ignore corrupt/missing storage */ }
  return { checked: {}, photos: {} };
}

function saveProgress(checked: Record<string, Set<string>>, photos: Record<string, string>) {
  try {
    const checkedArr: Record<string, string[]> = {};
    Object.entries(checked).forEach(([k, v]) => { checkedArr[k] = Array.from(v); });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ checked: checkedArr, photos }));
  } catch { /* storage full or unavailable — progress just won't persist this session */ }
}

interface Props { lang: string; }

export function BingoCard({ lang }: Props) {
  const CARDS = CARDS_BY_LANG[lang] || CARDS_BY_LANG.zh;
  const t = UI_TEXT[lang] || UI_TEXT.zh;

  const [cardIdx, setCardIdx] = useState(0);
  const [checked, setChecked] = useState<Record<string, Set<string>>>(() => {
    const saved = loadProgress();
    const result: Record<string, Set<string>> = {};
    Object.entries(saved.checked).forEach(([k, v]) => { result[k] = new Set(v); });
    return result;
  });
  const [photos, setPhotos] = useState<Record<string, string>>(() => loadProgress().photos);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef('');

  // 每次打勾或上傳照片的狀態變動，就存進 localStorage，切分頁或重新整理都不會不見
  useEffect(() => {
    saveProgress(checked, photos);
  }, [checked, photos]);

  const card = CARDS[Math.min(cardIdx, CARDS.length - 1)];
  const myChecked = checked[card.id] ?? new Set<string>();
  const bingos = getBingos(myChecked, card.items);
  const bingoCount = bingos.length;
  const flatBingoIdx = new Set(bingos.flat());

  // 點格子＝直接開啟選照片（相片庫優先，也可以選拍照），上傳成功才算完成該格
  // 已經上傳過的格子再點一次＝重新上傳、換照片
  const openPicker = (itemId: string) => {
    uploadTarget.current = itemId;
    fileRef.current?.click();
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
      setUploadError(t.uploadError);
      setTimeout(() => setUploadError(null), 4000);
    }
    setUploading(null);
    e.target.value = '';
  };

  const resetCard = () => {
    setChecked(p => ({ ...p, [card.id]: new Set() }));
    setPhotos(p => {
      const next = { ...p };
      card.items.forEach(item => { delete next[item.id]; });
      return next;
    });
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
          <span className="text-xs text-slate-500">{doneCount}/{total} {t.done}</span>
        </div>
        <button onClick={resetCard}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500">
          <RotateCcw className="w-3 h-3" /> {t.reset}
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

      {/* 3×3 Grid — 說明文字直接放在格子裡，點格子＝上傳/重新上傳照片 */}
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
                onClick={() => openPicker(item.id)}>

                {/* Background: real photo thumbnail once uploaded, otherwise theme color / placeholder */}
                {photo
                  ? <img src={photo} className="absolute inset-0 w-full h-full object-cover" alt={item.title} loading="lazy" />
                  : <div className="absolute inset-0 bg-slate-50" />
                }

                {/* Content: emoji + title + task 說明文字都放在格子內 */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center gap-0.5 p-1.5 text-center ${photo ? 'bg-black/45' : ''}`}>
                  <span className="text-xl leading-none">{item.emoji}</span>
                  <span className={`text-[10px] font-bold leading-tight ${photo ? 'text-white' : 'text-slate-700'}`}>
                    {item.title}
                  </span>
                  <span className={`text-[8px] leading-tight ${photo ? 'text-white/85' : 'text-slate-400'}`}>
                    {item.task}
                  </span>
                  {isDone && (
                    <span className={`absolute top-1 right-1.5 text-sm font-black ${photo ? 'text-white' : ''}`}
                      style={!photo ? { color: card.color } : {}}>✓</span>
                  )}
                </div>

                {/* Camera icon — visual hint that tapping (re)uploads a photo */}
                <div className="absolute bottom-1.5 right-1.5 bg-black/40 text-white rounded-full p-1.5 pointer-events-none">
                  {isLoading
                    ? <span className="w-3.5 h-3.5 block border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Camera className="w-3.5 h-3.5" />
                  }
                </div>

                {/* Photo tap to preview full size (doesn't trigger re-upload) */}
                {photo && (
                  <button onClick={e => { e.stopPropagation(); setPreview(photo); }}
                    className="absolute top-1.5 left-1.5 bg-black/40 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {t.viewPhoto}
                  </button>
                )}
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <input ref={fileRef} type="file" accept="image/*"
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
