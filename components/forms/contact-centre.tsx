'use client';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { ArrowUpRight, MessageSquare, MapPin, CalendarDays, ShieldCheck } from 'lucide-react';
import type { SubmissionType } from '@/lib/validation';
import { protectForm, track } from '@/lib/analytics';
const ContactDialog = dynamic(() => import('./contact-dialog'), { ssr: false, loading: () => <div className="dialog-loading" role="status">Membuka borang…</div> });
const options = [
  { type: 'inquiry' as const, title: 'Pertanyaan', description: 'Dapatkan maklumat atau hubungi pasukan.', icon: MessageSquare },
  { type: 'issue' as const, title: 'Isu komuniti', description: 'Kongsikan isu, lokasi dan penerangan.', icon: MapPin },
  { type: 'invitation' as const, title: 'Jemput Dr Aliza', description: 'Hantar butiran program atau jemputan.', icon: CalendarDays },
];
export function ContactCentre() {
  const [active, setActive] = useState<SubmissionType | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  function open(type: SubmissionType) { previousFocus.current = document.activeElement as HTMLElement; protectForm(); track(`${type}_form_open`); setActive(type); }
  function close() { setActive(null); requestAnimationFrame(() => previousFocus.current?.focus()); }
  return <section className="section contact-section" id="hubungi" aria-labelledby="contact-title"><div className="container"><div className="section-top"><div><p className="eyebrow"><span className="section-index">06</span> HUBUNGI PASUKAN</p><h2 id="contact-title">Mulakan perbualan.</h2></div><p className="section-aside">Pilih urusan anda. Isi borang dan teruskan ke WhatsApp pasukan di +60 10-653 8685.</p></div><div className="action-grid">{options.map(({ type, title, description, icon: Icon }, i) => <button key={type} onClick={() => open(type)} className="action-card"><div className="action-top"><Icon size={30} strokeWidth={1.5} /><span>0{i + 1}</span></div><h3>{title}</h3><p>{description}</p><span className="action-link">Buka borang <ArrowUpRight size={20} /></span></button>)}</div><p className="contact-privacy"><ShieldCheck size={17} /> Tiada nombor kad pengenalan diperlukan. <a href="/privasi">Ketahui penggunaan data anda.</a></p><noscript><p>Borang memerlukan JavaScript. Hubungi pasukan melalui WhatsApp: +60 10-653 8685.</p></noscript></div>{active && <ContactDialog type={active} onClose={close} />}</section>;
}

