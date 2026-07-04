import { useEffect, useRef, useState } from 'react';

// 背景音樂：使用者提供的海浪風格音檔，loop 播放
const STORAGE_KEY = 'msc-bgm-enabled';
const TARGET_VOLUME = 0.35;
const AUDIO_SRC = '/audio/bgm.mp3';

export function useBackgroundMusic() {
    const [enabled, setEnabled] = useState(() => localStorage.getItem(STORAGE_KEY) !== '0');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fadeRafRef = useRef<number | null>(null);

    const getAudio = () => {
        if (!audioRef.current) {
            const audio = new Audio(AUDIO_SRC);
            audio.loop = true;
            audio.volume = 0;
            audio.preload = 'auto';
            audioRef.current = audio;
        }
        return audioRef.current;
    };

    const fadeTo = (target: number, duration: number) => {
        const audio = getAudio();
        if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
        const start = audio.volume;
        const startTime = performance.now();
        const step = (now: number) => {
            const t = Math.min(1, (now - startTime) / duration);
            audio.volume = start + (target - start) * t;
            if (t < 1) {
                fadeRafRef.current = requestAnimationFrame(step);
            } else if (target === 0) {
                audio.pause();
            }
        };
        fadeRafRef.current = requestAnimationFrame(step);
    };

    useEffect(() => {
        const audio = getAudio();

        if (!enabled) { fadeTo(0, 600); return; }

        let cancelled = false;
        const tryPlay = () => {
            if (cancelled) return;
            audio.play().then(() => { if (!cancelled) fadeTo(TARGET_VOLUME, 1200); }).catch(() => {});
        };

        if (audio.paused) tryPlay();
        else fadeTo(TARGET_VOLUME, 800);

        // 瀏覽器自動播放限制：若首次播放被擋下，等使用者第一次點擊畫面後重試
        document.addEventListener('pointerdown', tryPlay, { once: true });
        return () => { cancelled = true; document.removeEventListener('pointerdown', tryPlay); };
    }, [enabled]);

    const toggle = () => {
        setEnabled(prev => {
            const next = !prev;
            localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
            return next;
        });
    };

    return { enabled, toggle };
}
