// ─────────────────────────────────────────────────────────────────────────────
// firebase.ts  —  Firestore + Storage（Blaze 方案，含照片上傳）
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, collection, addDoc, doc, updateDoc, increment, query,
  orderBy, onSnapshot, serverTimestamp, limit,
  enableIndexedDbPersistence,
} from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { parse as parseExif } from 'exifr';
import { classifyEvent, TASK_EVENTS } from './taskSchedule';
import type { TaskEvent } from './taskSchedule';

const firebaseConfig = {
  apiKey:            "AIzaSyAkmXeD9-x1EoXSSjK38bR5fEn_JExnamM",
  authDomain:        "msc-bellissima-2026.firebaseapp.com",
  projectId:         "msc-bellissima-2026",
  storageBucket:     "msc-bellissima-2026.firebasestorage.app",
  messagingSenderId: "752086249399",
  appId:             "1:752086249399:web:0b102d8311cb6ebd4a8232",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db      = getFirestore(app);
export const storage = getStorage(app);

// 離線快取（斷網也能看舊動態）
try { enableIndexedDbPersistence(db).catch(() => {}); } catch {}

export const TRIP_ID = 'msc-bellissima-2026-07-09';

export interface Post {
  id?:          string;
  tripId:       string;
  authorName:   string;
  authorEmoji:  string;      // 兼作「水手人物」頭像
  location:     string;
  message:      string;
  photoURL:     string;
  timestamp:    any;         // Firestore serverTimestamp（上傳/發佈時間）
  capturedAt?:  string;      // 照片實際拍攝時間（ISO 字串，來自 EXIF 或退回上傳時間）
  eventId?:     string | null; // 對應 taskSchedule.ts 的大事件 id；null = B 軌（一般航海誌）
  dayIndex?:    1 | 2 | 3 | 4;
  isTaskPost?:  boolean;
  hornCount?:   number;      // ⚓ 鳴笛數
}

// 對應規格書「時空錨點」快速勾選位置
export const SHIP_LOCATIONS = [
  '11F 中央泳池 🌊', '6F 施華洛世奇水晶中庭 💎', '星空劇院 🎭',
  '主餐廳 🍽️', '5F 免稅店 🛍️', '7F 老船長酒吧 🍺',
  '甲板觀景台 🌅', '那霸國際通 🇯🇵', '波上宮神社 ⛩️',
];

// 快捷心情／活動 Hashtag
export const QUICK_TAGS = ['#微醺時刻', '#日出大景', '#美食爭霸', '#戰利品', '#盛裝登場'];

// 10 個手繪水手頭像（圖片存在 public/avatars/），authorEmoji 欄位存放頭像 id（如 'sailor-1'）
// 舊資料若還是存實際 emoji 字元，畫面端會自動判斷並直接顯示文字，不會壞掉
export interface SailorAvatar { id: string; label: string; }
export const SAILOR_AVATARS: SailorAvatar[] = [
  { id: 'sailor-1',  label: '揮手男孩' },
  { id: 'sailor-2',  label: '敬禮女孩' },
  { id: 'sailor-3',  label: '海鷗小水手' },
  { id: 'sailor-4',  label: '船錨船長' },
  { id: 'sailor-5',  label: '眨眼女孩' },
  { id: 'sailor-6',  label: '救生圈男孩' },
  { id: 'sailor-7',  label: '望遠鏡水手' },
  { id: 'sailor-8',  label: '比讚女孩' },
  { id: 'sailor-9',  label: '敬禮男孩' },
  { id: 'sailor-10', label: '指南針水手' },
];
export const DEFAULT_AVATAR = SAILOR_AVATARS[0].id;

// 壓縮圖片（上傳前強制降至寬度 ≤1080px、檔案 ≤500KB，供多人同時連線防呆）
const MAX_DIM = 1080;
const MAX_BYTES = 500 * 1024;

function dataUrlBytes(dataUrl: string): number {
  // base64 → 約略 bytes：去掉 header 後，每 4 字元代表 3 bytes
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  return Math.floor(base64.length * 0.75);
}

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const ratio = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 從品質 0.8 開始，若超過 500KB 就逐步降品質，最低到 0.4
        let quality = 0.8;
        let out = canvas.toDataURL('image/jpeg', quality);
        while (dataUrlBytes(out) > MAX_BYTES && quality > 0.4) {
          quality -= 0.1;
          out = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(out);
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// 讀取照片 EXIF 拍攝時間；讀不到（截圖／無 EXIF）就退回上傳當下時間
export async function extractCapturedAt(file: File): Promise<Date> {
  try {
    const exif = await parseExif(file, ['DateTimeOriginal', 'CreateDate']);
    const raw = exif?.DateTimeOriginal ?? exif?.CreateDate;
    if (raw instanceof Date && !isNaN(raw.getTime())) return raw;
  } catch { /* 無 EXIF 或格式不支援，往下退回 */ }
  return new Date();
}

// 發佈航海日誌（含照片上傳、EXIF 判讀、大事件自動分類）
// forcedEventId：從大事件卡片直接拍照/上傳時指定，略過 EXIF 時間判斷，直接歸入該卡片
export async function addPost(
  post: Omit<Post, 'id' | 'timestamp' | 'tripId' | 'photoURL' | 'capturedAt' | 'eventId' | 'dayIndex' | 'isTaskPost' | 'hornCount'>,
  photoFile?: File,
  forcedEventId?: string,
): Promise<void> {
  let photoURL = '';
  let capturedAt = new Date();
  let matchedEvent: TaskEvent | null = forcedEventId
    ? (TASK_EVENTS.find(e => e.id === forcedEventId) ?? null)
    : null;

  if (photoFile) {
    // 拍攝時間與壓縮可以平行處理
    const [dataUrl, exifDate] = await Promise.all([
      compressImage(photoFile),
      extractCapturedAt(photoFile),
    ]);
    capturedAt = exifDate;
    if (!forcedEventId) matchedEvent = classifyEvent(capturedAt);

    const imageRef = ref(storage, `msc-2026/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`);
    await uploadString(imageRef, dataUrl, 'data_url');
    photoURL = await getDownloadURL(imageRef);
  }

  await addDoc(collection(db, 'posts'), {
    ...post,
    tripId: TRIP_ID,
    photoURL,
    timestamp: serverTimestamp(),
    capturedAt: capturedAt.toISOString(),
    eventId: matchedEvent?.id ?? null,
    dayIndex: matchedEvent?.day ?? null,
    isTaskPost: !!matchedEvent,
    hornCount: 0,
  });
}

// ⚓ 鳴笛（取代讚）
export async function honkPost(postId: string): Promise<void> {
  await updateDoc(doc(db, 'posts', postId), { hornCount: increment(1) });
}

// 即時訂閱（回傳 unsubscribe 函式）
export function subscribePosts(cb: (posts: Post[], lastSync: Date) => void): () => void {
  const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(80));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)), new Date());
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 留言功能：每篇貼文底下掛一個 comments 子集合
// posts/{postId}/comments/{commentId}
// ─────────────────────────────────────────────────────────────────────────────
export interface Comment {
  id?:         string;
  authorName:  string;
  authorEmoji: string;
  text:        string;
  timestamp:   any; // Firestore serverTimestamp
}

// 新增一則留言
export async function addComment(
  postId: string,
  comment: Omit<Comment, 'id' | 'timestamp'>,
): Promise<void> {
  await addDoc(collection(db, 'posts', postId, 'comments'), {
    ...comment,
    timestamp: serverTimestamp(),
  });
}

// 即時訂閱某篇貼文的留言（依時間正序，最舊的在最上面）
export function subscribeComments(
  postId: string,
  cb: (comments: Comment[]) => void,
): () => void {
  const q = query(collection(db, 'posts', postId, 'comments'), orderBy('timestamp', 'asc'));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)));
  });
}
