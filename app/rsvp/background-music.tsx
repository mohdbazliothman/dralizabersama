'use client';

import { useEffect, useRef, useState } from 'react';
import { Music2, Pause } from 'lucide-react';
import styles from './background-music.module.css';

export default function BackgroundMusic({ english }: { english: boolean }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    player.volume = 0.3;
    void player.play().catch(() => {
      // Browsers may require an explicit tap before allowing audible playback.
    });
    return () => player.pause();
  }, []);

  async function toggle() {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) {
      player.pause();
      return;
    }
    try {
      await player.play();
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }

  const label = english
    ? playing ? 'Pause music' : 'Play music'
    : playing ? 'Jeda muzik' : 'Mainkan muzik';

  return <div className={styles.player}>
    <audio ref={audio} src="/audio/lapres-midi-dartiste.mp3" autoPlay loop preload="metadata"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onError={() => { setPlaying(false); setFailed(true); }} />
    <button type="button" onClick={toggle} aria-label={label} title={label}>
      {playing ? <Pause size={18} aria-hidden="true" /> : <Music2 size={18} aria-hidden="true" />}
      <span>{label}</span>
    </button>
    {failed && <p role="status">{english ? 'Music could not play. Tap to retry.' : 'Muzik tidak dapat dimainkan. Tekan untuk cuba lagi.'}</p>}
  </div>;
}
