'use client';
import { useEffect, useRef, useState } from 'react';
import { MapPin, MessageCircle, HeartHandshake, X, ArrowUpRight } from 'lucide-react';
import { whatsappNumber } from '@/lib/whatsapp';
import styles from './floating-menu.module.css';
export default function FloatingMenu({ english }: { english: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [amount, setAmount] = useState('100');
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState<'location' | 'contact' | 'donate'>('donate');
  function open(kind: 'location' | 'contact' | 'donate', button: HTMLButtonElement) { trigger.current = button; setActive(kind); setOpened(true); dialog.current?.showModal(); }
  useEffect(() => { if (!opened) return; const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous; }; }, [opened]);
  function close() { dialog.current?.close(); setOpened(false); trigger.current?.focus(); }
  const label = amount === 'above' ? (english ? 'Above RM5,000' : 'Melebihi RM5,000') : `RM${Number(amount).toLocaleString('en-MY')}`;
  const message = english ? `Hello, I would like to enquire about a donation of ${label} for Dr Aliza’s fundraising gathering. Please share the payment arrangements.` : `Salam, saya ingin bertanya tentang sumbangan ${label} untuk majlis kutipan dana Dr Aliza. Sila maklumkan urusan pembayaran.`;
  return <><nav className={styles.menu} aria-label={english ? 'Quick actions' : 'Tindakan pantas'} lang={english ? 'en' : 'ms'}>
    <button type="button" aria-haspopup="dialog" aria-expanded={opened && active === 'location'} onClick={e => open('location', e.currentTarget)}><MapPin size={21}/><span>{english ? 'Location' : 'Lokasi'}</span></button>
    <button type="button" aria-haspopup="dialog" aria-expanded={opened && active === 'contact'} onClick={e => open('contact', e.currentTarget)}><MessageCircle size={21}/><span>{english ? 'Contact' : 'Hubungi'}</span></button>
    <button type="button" aria-haspopup="dialog" aria-expanded={opened && active === 'donate'} onClick={e => open('donate', e.currentTarget)}><HeartHandshake size={21}/><span>{english ? 'Donate for the Future' : 'Sumbang untuk Masa Depan'}</span></button>
  </nav><dialog ref={dialog} className={styles.dialog} aria-labelledby="action-title" lang={english ? 'en' : 'ms'} onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if(e.target === e.currentTarget) close(); }}>
    <div className={styles.heading}>{active === 'location' ? <MapPin size={28}/> : active === 'contact' ? <MessageCircle size={28}/> : <HeartHandshake size={28}/>}<button type="button" onClick={close} aria-label={english ? 'Close' : 'Tutup'}><X size={22}/></button></div>
    {active === 'location' ? <><h2 id="action-title">{english ? 'Event location' : 'Lokasi acara'}</h2><p><strong>Pohon Beringin Cafe</strong><br/>Bukit Katil, Melaka</p><p>{english ? '1 November 2026 · 3:00–5:00 PM' : '1 November 2026 · 3:00–5:00 petang'}</p><a className={styles.continue} href="https://www.google.com/maps/search/?api=1&query=Pohon%20Beringin%20Cafe%20Bukit%20Katil%20Melaka" target="_blank" rel="noopener noreferrer">{english ? 'Open Google Maps' : 'Buka Google Maps'} <ArrowUpRight size={18}/></a><p><a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(english ? 'Hello, please share directions to Pohon Beringin Cafe for the event.' : 'Salam, boleh kongsikan arah ke Pohon Beringin Cafe untuk acara ini?')}`} target="_blank" rel="noopener noreferrer">{english ? 'Ask for directions via WhatsApp ↗' : 'Tanya arah melalui WhatsApp ↗'}</a></p></> : active === 'contact' ? <><h2 id="action-title">{english ? 'Contact the team' : 'Hubungi pasukan'}</h2><p>{english ? 'For RSVP, event details or other enquiries, contact the team on WhatsApp.' : 'Untuk pendaftaran, butiran acara atau pertanyaan lain, hubungi pasukan melalui WhatsApp.'}</p><p><strong>+60 10-653 8685</strong></p><a className={styles.continue} href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">{english ? 'Open WhatsApp' : 'Buka WhatsApp'} <ArrowUpRight size={18}/></a></> : <><h2 id="action-title">{english ? 'Choose your contribution' : 'Pilih jumlah sumbangan'}</h2>
    <label htmlFor="donation-amount">{english ? 'Donation amount' : 'Jumlah sumbangan'}</label>
    <select id="donation-amount" value={amount} onChange={e => setAmount(e.target.value)}>{['100','200','300','500','800','1000','5000'].map(value => <option key={value} value={value}>RM {Number(value).toLocaleString('en-MY')}</option>)}<option value="above">{english ? 'Above RM 5,000' : 'Melebihi RM 5,000'}</option></select>
    <p>{english ? 'Continue to WhatsApp to discuss payment with the team. No payment is taken here.' : 'Teruskan ke WhatsApp untuk urusan pembayaran dengan pasukan. Tiada bayaran dikutip di sini.'}</p>
    <a className={styles.continue} href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">{english ? 'Continue via WhatsApp' : 'Teruskan melalui WhatsApp'} <ArrowUpRight size={18}/></a>
    </>}
  </dialog></>;
}
