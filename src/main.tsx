import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ─── 連上網路時自動偵測並套用新版本，不用使用者手動重新整理 ──────────────────
if ('serviceWorker' in navigator) {
  let refreshing = false;
  // 新版本的 Service Worker 接手控制權的那一刻，自動重新整理套用最新內容
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  navigator.serviceWorker.ready.then(registration => {
    // 每次恢復網路連線時，主動檢查一次是否有新版本
    window.addEventListener('online', () => registration.update());
    // App 開著沒關的話，每 5 分鐘也主動檢查一次，避免長時間停留沒觸發更新
    setInterval(() => registration.update(), 5 * 60 * 1000);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
