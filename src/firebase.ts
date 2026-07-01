// ─────────────────────────────────────────────────────────────────────────────
// firebase.ts  —  Firestore + Storage（Blaze 方案，含照片上傳）
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, collection, addDoc, query,
  orderBy, onSnapshot, serverTimestamp, limit,
  enableIndexedDbPersistence,
} from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

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
  id?:         string;
  tripId:      string;
  authorName:  string;
  authorEmoji: string;
  location:    string;
  message:     string;
  photoURL:    string;
  timestamp:   any;
}

export const SHIP_LOCATIONS = [
  '15F 自助餐廳 🍕', '6F 水晶樓梯 💎', '15F 水上樂園 🌊',
  '7F 老船長酒吧 🍺', '6–7F 香榭麗舍 🛍️', '5F 服務台 ℹ️',
  '主餐廳 🍽️', '甲板觀景台 🌅', '那霸國際通 🇯🇵', '波上宮神社 ⛩️',
];

export const AUTHOR_EMOJIS = ['😊','🎉','🌊','🍕','😎','🏄','✨','🥂','📸','🌺','🦞','💎'];

// 壓縮圖片（上傳前降低至 1200px，75% 品質）
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const maxPx = 1200;
        const ratio  = Math.min(1, maxPx / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// 發佈動態（含照片上傳）
export async function addPost(
  post: Omit<Post, 'id' | 'timestamp' | 'tripId' | 'photoURL'>,
  photoFile?: File,
): Promise<void> {
  let photoURL = '';
  if (photoFile) {
    const dataUrl  = await compressImage(photoFile);
    const imageRef = ref(storage, `msc-2026/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`);
    await uploadString(imageRef, dataUrl, 'data_url');
    photoURL = await getDownloadURL(imageRef);
  }
  await addDoc(collection(db, 'posts'), {
    ...post, tripId: TRIP_ID, photoURL, timestamp: serverTimestamp(),
  });
}

// 即時訂閱（回傳 unsubscribe 函式）
export function subscribePosts(cb: (posts: Post[], lastSync: Date) => void): () => void {
  const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(80));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)), new Date());
  });
}
