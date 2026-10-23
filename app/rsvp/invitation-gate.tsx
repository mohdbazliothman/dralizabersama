'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { MailOpen } from 'lucide-react';
import styles from './invitation-gate.module.css';

export default function InvitationGate({ english, children }: { english: boolean; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);
  function open(music: boolean) {
    // Dispatch synchronously inside the click so audio retains user activation.
    if (music) window.dispatchEvent(new Event('rsvp-play-music'));
    dialog.current?.close();
    document.body.style.overflow = '';
    window.scrollTo({ top: 0, behavior: 'instant' });
    content.current?.focus({ preventScroll: true });
    window.dispatchEvent(new Event('rsvp-reveal'));
  }
  return <>
    <dialog ref={dialog} className={styles.gate} aria-labelledby="invitation-cover-title" onCancel={e => { e.preventDefault(); open(false); }}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>{english ? 'A PERSONAL INVITATION' : 'JEMPUTAN PERIBADI'}</span>
        <MailOpen className={styles.icon} size={38} strokeWidth={1} aria-hidden="true" />
        <h1 id="invitation-cover-title">{english ? 'A Cup of Tea,' : 'Secawan Teh,'}<em>{english ? 'A Story to Tell' : 'Sebuah Cerita'}</em></h1>
        <p>{english ? 'An afternoon with Dr Aliza' : 'Minum petang bersama Dr Aliza'}</p>
        <span className={styles.date}>{english ? '1 NOVEMBER 2026' : '1 NOVEMBER 2026'}</span>
        <button autoFocus type="button" className={styles.open} onClick={() => open(true)}>{english ? 'Open Invitation' : 'Buka Jemputan'} <span aria-hidden="true">↗</span></button>
        <small>{english ? 'Open with background music' : 'Buka dengan muzik latar'}</small>
        <button type="button" className={styles.silent} onClick={() => open(false)}>{english ? 'Continue without music' : 'Teruskan tanpa muzik'}</button>
      </div>
    </dialog>
    <div ref={content} tabIndex={-1} className={styles.content}>{children}</div>
  </>;
}
