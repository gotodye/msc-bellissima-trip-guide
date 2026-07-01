import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import {
  AlertTriangle, CheckSquare, ShieldAlert, Ship, Globe,
  Smartphone, MessageCircle, Calendar, Ticket, Coffee,
  Camera, Utensils, Star, MapPin, ShoppingBag, Clock,
  Sparkles, Trophy, RotateCcw, WifiOff, Download, ImageDown, CheckCheck,
} from 'lucide-react';
import { dictionary, targetDateStr, type Lang } from './data';
import { Timeline } from './Timeline';

// ─── Icon Map ─────────────────────────────────────────────────────────────────
const iconMap: Record<string, React.ElementType> = {
  AlertTriangle, CheckSquare, ShieldAlert, Ship, Globe,
  Smartphone, MessageCircle, Calendar, Ticket, Coffee,
  Camera, Utensils, Star, MapPin, ShoppingBag, Clock, Sparkles,
};

const catColor: Record<string, string> = {
  rose:    'bg-rose-100 text-rose-700',
  amber:   'bg-amber-100 text-amber-700',
  purple:  'bg-purple-100 text-purple-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  sky:     'bg-sky-100 text-sky-700',
  pink:    'bg-pink-100 text-pink-700',
};

// Hero ship photos — settour OG + Unsplash fallback
const HERO_IMAGES = [
  'https://www.settour.com.tw/act/gfg/MSCcruise/images/fb2026.jpg',
  'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1600',
];

// ─── ICS download ──────────────────────────────────────────────────────────────
function downloadICS(message: string, errorMsg: string) {
  const target = new Date(targetDateStr);
  const alarmDates: Date[] = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(target); d.setDate(d.getDate() + i); d.setHours(23, 55, 0, 0); alarmDates.push(d);
  }
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace('.000', '');
  const events = alarmDates.map((d, i) => {
    const s = fmt(d); const e = fmt(new Date(d.getTime() + 60000));
    return `BEGIN:VEVENT\r\nDTSTART:${s}Z\r\nDTEND:${e}Z\r\nSUMMARY:🎭 MSC 大秀提醒 Day ${i + 1}\r\nDESCRIPTION:${message}\r\nEND:VEVENT`;
  }).join('\r\n');
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\n${events}\r\nEND:VCALENDAR`;
  try {
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'msc-show-alarm.ics'; a.click();
    URL.revokeObjectURL(url);
  } catch { alert(errorMsg); }
}

// ─── Bingo helpers ─────────────────────────────────────────────────────────────
function checkBingo(items: Record<string, boolean>, cells: any[]): boolean {
  const ok = (i: number) => cells[i]?.text === 'FREE' || !!items[`b${i}`];
  for (let r = 0; r < 5; r++) if ([0,1,2,3,4].every(c => ok(r*5+c))) return true;
  for (let c = 0; c < 5; c++) if ([0,1,2,3,4].every(r => ok(r*5+c))) return true;
  if ([0,6,12,18,24].every(ok)) return true;
  if ([4,8,12,16,20].every(ok)) return true;
  return false;
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function HackCard({ item }: { item: any }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      {item.image && (
        <div className="relative h-52 overflow-hidden">
          <img src={item.image} alt={item.title} referrerPolicy="no-referrer"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm border ${catColor[item.categoryColor] || catColor.sky}`}>
              {item.category}
            </span>
          </div>
        </div>
      )}
      <div className="p-5">
        <h3 className="font-bold text-[#002b5e] text-[15px] mb-4 leading-snug">{item.title}</h3>
        <div className="space-y-2.5">{item.tips?.map((tip: string, i: number) => (
          <p key={i} className="text-sm text-slate-600 leading-relaxed">{tip}</p>
        ))}</div>
      </div>
    </div>
  );
}

function BingoCell({ cell, checked, onToggle }: { cell: any; checked: boolean; onToggle: () => void }) {
  const isFree = cell.text === 'FREE';
  const active = isFree || checked;
  return (
    <button onClick={onToggle} disabled={isFree} title={cell.desc}
      className={`aspect-square flex flex-col items-center justify-center rounded-xl border-none transition-all select-none
        ${isFree ? 'bg-[#00a0e3] cursor-default' : active ? 'bg-[#002b5e] scale-95 shadow-inner cursor-pointer' : 'bg-slate-100 hover:bg-slate-200 cursor-pointer active:scale-90'}`}>
      <span className="text-lg leading-none">{cell.emoji}</span>
      <span className={`text-[8px] font-bold leading-tight mt-0.5 px-0.5 text-center ${active ? 'text-white' : 'text-slate-600'}`}>{cell.text}</span>
    </button>
  );
}

function BingoCard({ content, bingoItems, onToggle, hasBingo, onReset }: any) {
  const t = content.together;
  const completed = Object.values(bingoItems).filter(Boolean).length + 1;
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-xl"><Trophy className="w-5 h-5 text-amber-600" /></div>
          <div>
            <h3 className="font-bold text-[#002b5e] text-[15px]">{t.bingoTitle}</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">{t.bingoDesc}</p>
          </div>
        </div>
        <button onClick={onReset} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      <AnimatePresence>
        {hasBingo && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="my-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl p-3 text-center shadow">
            <p className="text-white font-bold text-sm">{t.bingoWinText}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-5 gap-1.5 my-4">
        {t.bingoCells?.map((cell: any, idx: number) => (
          <BingoCell key={idx} cell={cell} checked={!!bingoItems[`b${idx}`]} onToggle={() => onToggle(idx)} />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-slate-100 rounded-full h-1.5">
          <div className="bg-[#00a0e3] h-1.5 rounded-full transition-all duration-500" style={{ width: `${(completed/25)*100}%` }} />
        </div>
        <span className="text-xs text-slate-500 whitespace-nowrap">{completed} / 25 {t.progressUnit}</span>
      </div>
    </div>
  );
}

function StandardCard({ item, checkedItems, toggleCheck }: { item: any; checkedItems: Record<string, boolean>; toggleCheck: (k: string) => void }) {
  const Icon = iconMap[item.icon] || Sparkles;
  return (
    <div className={`rounded-2xl overflow-hidden shadow-sm border ${item.highlight ? 'border-[#00a0e3] bg-gradient-to-br from-[#e8f4ff] to-[#f0f8ff]' : 'border-slate-100 bg-white'}`}>
      {item.image && <div className="h-44 overflow-hidden"><img src={item.image} alt={item.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" loading="lazy" /></div>}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-xl ${item.highlight ? 'bg-[#00a0e3]/20' : 'bg-slate-100'}`}>
            <Icon className={`w-5 h-5 ${item.highlight ? 'text-[#00a0e3]' : 'text-[#002b5e]'}`} />
          </div>
          <h3 className="font-bold text-[15px] leading-snug text-[#002b5e]">{item.title}</h3>
        </div>
        {item.text && <div className="space-y-1.5">{item.text.split('\n').map((line: string, i: number) => <p key={i} className="text-sm text-slate-600 leading-relaxed">{line}</p>)}</div>}
        {item.list && <ul className="space-y-2.5 mt-1">{item.list.map((line: string, i: number) => <li key={i} className="text-sm text-slate-600 leading-relaxed pl-3 border-l-2 border-slate-200">{line}</li>)}</ul>}
        {item.checklist && <ul className="space-y-2.5 mt-1">{item.checklist.map((label: string, i: number) => {
          const key = `${item.title}-${i}`; const checked = !!checkedItems[key];
          return (
            <li key={i}>
              <button onClick={() => toggleCheck(key)} className={`flex items-start gap-3 w-full text-left rounded-lg p-1.5 -m-1.5 transition-colors ${checked ? 'opacity-60' : 'hover:bg-slate-50'}`}>
                <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${checked ? 'bg-[#00a0e3] border-[#00a0e3]' : 'border-slate-300'}`}>
                  {checked && <svg viewBox="0 0 12 9" fill="none" className="w-3 h-3"><path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className={`text-sm leading-relaxed ${checked ? 'line-through text-slate-400' : 'text-slate-600'}`}>{label}</span>
              </button>
            </li>
          );
        })}</ul>}
      </div>
    </div>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection({ content, countdown, lang, onLangChange, reminderAdded, onReminderClick, isOnline, installPrompt, onInstall, preloaded, preloading, onPreload }: any) {
  const [heroError, setHeroError] = useState(false);
  const [heroIdx,   setHeroIdx]   = useState(0);
  const units = content.timeUnits || ['天','時','分','秒'];

  const tryNextHero = () => {
    if (heroIdx < HERO_IMAGES.length - 1) setHeroIdx(i => i + 1);
    else setHeroError(true);
  };

  return (
    <div className="relative" style={{ minHeight: 340 }}>
      {/* Ship photo */}
      {!heroError ? (
        <img
          src={HERO_IMAGES[heroIdx]}
          referrerPolicy="no-referrer"
          onError={tryNextHero}
          className="absolute inset-0 w-full h-full object-cover"
          alt="MSC Bellissima"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a3d] via-[#002b5e] to-[#003f8a]" />
      )}

      {/* Gradient overlay: photo shows at top, fades to navy at bottom */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,15,35,.45) 0%, rgba(0,20,50,.65) 40%, rgba(0,43,94,.92) 75%, #002b5e 100%)' }} />

      {/* Content */}
      <div className="relative px-5 pt-safe pt-4 pb-5 max-w-lg mx-auto">
        {/* Lang switcher */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-white/15 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white/80 text-[11px] font-bold tracking-widest">MSC BELLISSIMA</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {(['zh','en','id','th'] as Lang[]).map(l => (
              <button key={l} onClick={() => onLangChange(l)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${lang === l ? 'bg-white text-[#002b5e]' : 'bg-white/15 text-white/70 hover:bg-white/25'}`}>
                {{zh:'中',en:'EN',id:'ID',th:'TH'}[l]}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="mb-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-0.5 bg-[#00a0e3] rounded-full" />
            <span className="text-[#00a0e3] text-xs font-bold tracking-wider uppercase">Company Trip 2026</span>
          </div>
          <h1 className="text-white font-bold text-3xl leading-tight mb-1">MSC 榮耀號</h1>
          <p className="text-white/65 text-sm">基隆 → 那霸（沖繩）→ 基隆</p>
        </div>

        {/* Departure badge */}
        <div className="flex items-center gap-2 my-4">
          <span className="bg-[#00a0e3] text-white text-xs font-bold px-3 py-1.5 rounded-full">
            📅 7/9 出發
          </span>
          <span className="bg-white/15 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full">
            4天3夜
          </span>
        </div>

        {/* Countdown */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <p className="text-white/60 text-[11px] font-bold mb-2 tracking-wide">{content.countdownTitle}</p>
          <div className="grid grid-cols-4 gap-2">
            {[countdown.days, countdown.hours, countdown.minutes, countdown.seconds].map((val, i) => (
              <div key={i} className="text-center bg-white/10 rounded-xl py-2.5">
                <div className="text-2xl font-bold text-white tabular-nums leading-none">{String(val).padStart(2,'0')}</div>
                <div className="text-white/50 text-[10px] font-medium mt-1">{units[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PWA + Preload strip */}
        {isOnline && (
          <div className="flex gap-2">
            {installPrompt && (
              <button onClick={onInstall}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
                <Download className="w-3.5 h-3.5" />
                安裝APP
              </button>
            )}
            {!preloaded ? (
              <button onClick={onPreload} disabled={preloading}
                className={`flex-1 flex items-center justify-center gap-1.5 text-white text-xs font-bold py-2.5 rounded-xl transition-colors ${preloading ? 'bg-white/10 opacity-60 cursor-wait' : 'bg-white/15 hover:bg-white/25'}`}>
                <ImageDown className="w-3.5 h-3.5" />
                {preloading ? '載入中…' : '預載圖片'}
              </button>
            ) : (
              <div className="flex-1 flex items-center justify-center gap-1.5 bg-green-500/20 text-green-300 text-xs font-bold py-2.5 rounded-xl">
                <CheckCheck className="w-3.5 h-3.5" />
                圖片已快取 ✓
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── All image URLs for preloading ─────────────────────────────────────────────
const ALL_IMAGES = [
  'https://photo.settour.com.tw/900x600/https://www.settour.com.tw/ss_img/cms/20230525/8e6c9024-5cdb-41d6-a7bd-f8c94eb005e2.jpg',
  'https://photo.settour.com.tw/900x600/https://www.settour.com.tw/ss_img/cms/20230525/da99ad78-b3f0-4555-b97d-16428a644afe.jpg',
  'https://photo.settour.com.tw/900x600/https://www.settour.com.tw/ss_img/cms/20230525/ed3952bc-dde9-4ab3-b6f6-a94aade53cf6.jpg',
  'https://photo.settour.com.tw/900x600/https://www.settour.com.tw/ss_img/cms/20230525/0af50d44-8050-4fe4-9ef6-10601f395e43.jpg',
  'https://photo.settour.com.tw/900x600/https://www.settour.com.tw/ss_img/cms/20230525/b3d76dbe-ac7e-4525-b86a-957e02f00352.jpg',
  'https://photo.settour.com.tw/900x600/https://www.settour.com.tw/ss_img/cms/20230525/bf02ccfa-08e7-4e35-9ffd-af2a6f7acf2a.jpg',
  'https://photo.settour.com.tw/900x600/https://www.settour.com.tw/ss_img/cms/20230525/1cff08f9-aa24-4124-b590-f83204ba7b6e.jpg',
  'https://photo.settour.com.tw/900x600/https://www.settour.com.tw/ss_img/cms/20230525/b302403e-7656-4d28-b1f0-47bc7f371852.jpg',
  'https://photo.settour.com.tw/900x600/https://www.settour.com.tw/ss_img/cms/20230525/c95be796-3e35-44ec-baaf-86e910843903.jpg',
  'https://photo.settour.com.tw/900x600/https://www.settour.com.tw/ss_img/cms/20230525/7b56da9b-a0b8-4f44-bca4-ba9a0a7db782.jpg',
  'https://photo.settour.com.tw/900x600/https://www.settour.com.tw/ss_img/cms/20230525/a980dad5-9b97-4d10-b17c-023c86ad0312.jpg',
  'https://photo.settour.com.tw/900x600/https://www.settour.com.tw/ss_img/cms/20230525/641794a8-8387-4124-a246-e65083b2d9cd.jpg',
];

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [lang,         setLang]         = useState<Lang>('zh');
  const [activeTab,    setActiveTab]    = useState('pre');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('msc-checklist') || '{}'); } catch { return {}; }
  });
  const [bingoItems,   setBingoItems]   = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('msc-bingo') || '{}'); } catch { return {}; }
  });
  const [hasBingo,     setHasBingo]     = useState(false);
  const [reminderAdded,setReminderAdded]= useState(false);
  const [countdown,    setCountdown]    = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOnline,     setIsOnline]     = useState(navigator.onLine);
  const [installPrompt,setInstallPrompt]= useState<any>(null);
  const [preloaded,    setPreloaded]    = useState(() => !!localStorage.getItem('msc-images-cached'));
  const [preloading,   setPreloading]   = useState(false);

  const content = dictionary[lang];
  const sectionsData: any[] = (content.sections as any)[activeTab] || [];

  // Countdown
  useEffect(() => {
    const target = new Date(targetDateStr).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setCountdown({ days: Math.floor(diff/86400000), hours: Math.floor(diff%86400000/3600000), minutes: Math.floor(diff%3600000/60000), seconds: Math.floor(diff%60000/1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  // Online detection
  useEffect(() => {
    const on = () => setIsOnline(true); const off = () => setIsOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  // Install prompt
  useEffect(() => {
    const h = (e: any) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', h);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);

  // Bingo win check
  useEffect(() => {
    setHasBingo(checkBingo(bingoItems, content.together?.bingoCells || []));
  }, [bingoItems, lang]);

  const toggleCheck = (key: string) => {
    const u = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(u); localStorage.setItem('msc-checklist', JSON.stringify(u));
  };

  const toggleBingo = (idx: number) => {
    const u = { ...bingoItems, [`b${idx}`]: !bingoItems[`b${idx}`] };
    setBingoItems(u); localStorage.setItem('msc-bingo', JSON.stringify(u));
  };

  const preloadImages = async () => {
    setPreloading(true);
    await Promise.allSettled(ALL_IMAGES.map(src => new Promise<void>(res => {
      const img = new Image(); img.onload = img.onerror = () => res(); img.src = src;
    })));
    setPreloading(false); setPreloaded(true); localStorage.setItem('msc-images-cached', '1');
  };

  const tabs = content.tabs || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f4ff] to-[#f8fbff] font-sans">
      {/* Offline banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="bg-amber-500 text-white flex items-center justify-center gap-2 overflow-hidden">
            <div className="flex items-center gap-2 py-2 text-sm font-medium">
              <WifiOff className="w-4 h-4" />
              {lang === 'zh' ? '📵 離線模式 — 顯示快取內容' : 'Offline Mode — Showing cached content'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <HeroSection
        content={content} countdown={countdown} lang={lang} onLangChange={setLang}
        reminderAdded={reminderAdded}
        onReminderClick={() => { downloadICS(content.reminderMessage, content.reminderError); setReminderAdded(true); }}
        isOnline={isOnline} installPrompt={installPrompt}
        onInstall={() => { installPrompt?.prompt(); installPrompt?.userChoice.then(() => setInstallPrompt(null)); }}
        preloaded={preloaded} preloading={preloading} onPreload={preloadImages}
      />

      {/* Reminder bar (visible on onboard + hacks tab) */}
      {(activeTab === 'onboard' || activeTab === 'hacks') && (
        <div className="bg-[#002b5e] px-4 py-3">
          <div className="max-w-lg mx-auto">
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-white font-bold text-sm mb-1">{content.reminderTitle}</p>
              <p className="text-white/65 text-xs mb-3 leading-relaxed">{content.reminderDesc}</p>
              <button onClick={() => { downloadICS(content.reminderMessage, content.reminderError); setReminderAdded(true); }}
                className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${reminderAdded ? 'bg-green-500 text-white' : 'bg-white text-[#002b5e] hover:bg-blue-50'}`}>
                {reminderAdded ? content.reminderToggleOn : content.reminderToggleOff}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-lg mx-auto overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex px-4 py-2 gap-1.5 min-w-max">
            {tabs.map((tab: any) => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#002b5e] text-white shadow-md' : 'text-slate-500 hover:text-[#002b5e] hover:bg-slate-100'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-5">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab + lang} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="space-y-4">

            {activeTab === 'social' ? (
              <Timeline isOnline={isOnline} />
            ) : activeTab === 'together' ? (
              <BingoCard content={content} bingoItems={bingoItems} onToggle={toggleBingo} hasBingo={hasBingo}
                onReset={() => { setBingoItems({}); localStorage.setItem('msc-bingo', '{}'); setHasBingo(false); }} />
            ) : activeTab === 'hacks' ? (
              <>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-amber-800 font-bold text-sm">
                    ✨ {lang==='zh' ? '以下密技整理自各大旅遊部落客、Youtuber 及 Dcard/PTT 旅遊板的第一手分享！' :
                        lang==='en' ? 'Tips curated from travel bloggers, YouTubers & community forums!' :
                        lang==='id' ? 'Tips dari blogger perjalanan, YouTuber & forum komunitas!' :
                        'เคล็ดลับจากบล็อกเกอร์ YouTuber และฟอรัมชุมชน!'}
                  </p>
                </div>
                {sectionsData.map((item: any, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <HackCard item={item} />
                  </motion.div>
                ))}
              </>
            ) : (
              sectionsData.map((item: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <StandardCard item={item} checkedItems={checkedItems} toggleCheck={toggleCheck} />
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="text-center py-6 text-slate-400 text-xs pb-safe">
        <Ship className="w-4 h-4 inline-block mr-1.5 mb-0.5 opacity-50" />
        MSC Bellissima · 2026 Company Trip
      </footer>
    </div>
  );
}
