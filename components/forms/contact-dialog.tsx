'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, X, CheckCircle2, LoaderCircle } from 'lucide-react';
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { categories } from '@/data/site';
import { submissionSchema, type SubmissionType } from '@/lib/validation';
import { track } from '@/lib/analytics';
import { whatsappUrl } from '@/lib/whatsapp';
export default function ContactDialog({ type, onClose }: { type: SubmissionType; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [handoffUrl, setHandoffUrl] = useState('');
  const reduced = useReducedMotion();
  const heading = { inquiry: 'Pertanyaan', issue: 'Isu komuniti', invitation: 'Jemput Dr Aliza' }[type];
  useEffect(() => {
    dialog.current?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = old; };
  }, []);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy) return;
    setError(''); setFields({});
    const fd = new FormData(e.currentTarget);
    const value = (name: string) => String(fd.get(name) ?? '');
    const common = { submission_type: type, full_name: value('full_name'), phone: value('phone'), email: value('email'), location: value('location'), pdm: value('pdm'), message: value('message'), consent: fd.get('consent') === 'on' };
    const specifics = type === 'issue' ? { issue_title: value('issue_title'), category: value('category'), issue_location: value('issue_location'), description: value('description'), follow_up: fd.get('follow_up') === 'on' } : type === 'invitation' ? { organization: value('organization'), officer: value('officer'), event_datetime: value('event_datetime'), venue: value('venue'), event_type: value('event_type'), attendance: value('attendance') } : { subject: value('subject') };
    const parsed = submissionSchema.safeParse({ ...common, ...specifics });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach(i => { const key = String(i.path[0]); errors[key] ??= i.message; });
      setFields(errors); setError('Sila semak medan yang ditandakan.');
      requestAnimationFrame(() => (form.current?.elements.namedItem(Object.keys(errors)[0]) as HTMLElement | null)?.focus()); return;
    }
    if (value('website')) return;
    setBusy(true);
    const url = whatsappUrl(parsed.data);
    setHandoffUrl(url);
    window.open(url, '_blank', 'noopener,noreferrer');
    track('form_whatsapp_open');
    setBusy(false);
    requestAnimationFrame(() => dialog.current?.querySelector<HTMLElement>('[data-success]')?.focus());
  }

  function field(name: string, label: string, config: { required?: boolean; type?: string; max?: number; area?: boolean; auto?: string } = {}) {
    const props = { id: name, name, required: config.required, maxLength: config.max ?? 180, 'aria-invalid': !!fields[name], 'aria-describedby': fields[name] ? `${name}-error` : undefined, autoComplete: config.auto ?? 'off' };
    return <div className={config.area ? 'field full' : 'field'}><label htmlFor={name}>{label}{config.required && <span aria-hidden="true"> *</span>}</label>{config.area ? <textarea {...props} rows={4} /> : <input {...props} type={config.type ?? 'text'} min={config.type === 'number' ? 1 : undefined} max={config.type === 'number' ? 100000 : undefined} inputMode={name === 'phone' ? 'tel' : undefined} />}{fields[name] && <small className="field-error" id={`${name}-error`}>{fields[name]}</small>}</div>;
  }
  return <dialog ref={dialog} className="contact-dialog" aria-labelledby="dialog-title" data-clarity-mask="true" onCancel={e => { if (busy) e.preventDefault(); else onClose(); }} onClick={e => { if (e.target === e.currentTarget && !busy) onClose(); }}><LazyMotion features={domAnimation}><m.div initial={{ opacity: 0, y: reduced ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="dialog-inner"><div className="dialog-heading"><div><p className="eyebrow">HUBUNGI PASUKAN</p><h2 id="dialog-title">{heading}</h2></div><button className="icon-button" onClick={onClose} disabled={busy} aria-label="Tutup borang"><X /></button></div>{handoffUrl ? <div className="success-state" tabIndex={-1} data-success role="status"><CheckCircle2 size={52} /><h3>Teruskan di WhatsApp.</h3><p>Mesej anda telah disediakan untuk +60 10-653 8685. Semak mesej dan tekan Send dalam WhatsApp. Laman ini tidak dapat mengesahkan penghantaran.</p><a className="button navy" href={handoffUrl} target="_blank" rel="noopener noreferrer">Buka WhatsApp <ArrowUpRight size={18} /></a><p>Jika tab baharu tidak dibuka, gunakan butang di atas.</p><button className="text-link" onClick={() => setHandoffUrl('')}>Isi borang baharu</button></div> : <form ref={form} onSubmit={submit} noValidate className="contact-form" data-clarity-mask="true"><p className="form-intro">Medan bertanda * wajib diisi. Jangan masukkan nombor kad pengenalan atau maklumat sulit.</p><fieldset disabled={busy}><legend className="sr-only">Butiran {heading}</legend><div className="form-grid">
      {field('full_name', 'Nama penuh', { required: true, auto: 'name', max: 120 })}{field('phone', 'Nombor telefon', { required: true, type: 'tel', auto: 'tel', max: 22 })}{field('email', 'E-mel (pilihan)', { type: 'email', auto: 'email', max: 254 })}{field('location', 'Kampung / taman / kawasan', { required: true })}{field('pdm', 'PDM, jika diketahui (pilihan)', { max: 120 })}
      {type === 'inquiry' && field('subject', 'Tajuk pertanyaan', { required: true, max: 160 })}
      {type === 'issue' && <>{field('issue_title', 'Tajuk isu', { required: true, max: 160 })}<div className="field"><label htmlFor="category">Kategori *</label><select name="category" id="category" defaultValue="" required aria-invalid={!!fields.category} aria-describedby={fields.category ? 'category-error' : undefined}><option value="" disabled>Pilih kategori</option>{categories.map(c => <option key={c}>{c}</option>)}</select>{fields.category && <small className="field-error" id="category-error">Pilih kategori isu.</small>}</div>{field('issue_location', 'Lokasi isu', { required: true, max: 300 })}{field('description', 'Penerangan isu', { required: true, area: true, max: 4000 })}<label className="checkbox full"><input type="checkbox" name="follow_up" defaultChecked /> Saya bersetuju dihubungi semula berhubung isu ini.</label></>}
      {type === 'invitation' && <>{field('organization', 'Nama organisasi', { required: true })}{field('officer', 'Nama pegawai urusan', { required: true, max: 120 })}{field('event_datetime', 'Tarikh & masa (waktu Malaysia)', { required: true, type: 'datetime-local' })}{field('venue', 'Lokasi program', { required: true, max: 300 })}{field('event_type', 'Jenis program', { required: true, max: 150 })}{field('attendance', 'Anggaran kehadiran', { required: true, type: 'number' })}</>}
      {field('message', type === 'inquiry' ? 'Mesej' : 'Maklumat tambahan (pilihan)', { required: type === 'inquiry', area: true, max: 3000 })}
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    </div><div className="consent-box"><label className="checkbox"><input type="checkbox" name="consent" required aria-invalid={!!fields.consent} aria-describedby="consent-description" /><span>Saya bersetuju maklumat ini dibawa ke WhatsApp dan digunakan oleh pasukan untuk mengurus urusan yang saya pilih. *</span></label><p id="consent-description">Baca <a href="/privasi" target="_blank" rel="noopener noreferrer">dasar privasi (tab baharu)</a>. Persetujuan boleh ditarik balik melalui borang pertanyaan.</p>{fields.consent && <p className="field-error">{fields.consent}</p>}</div></fieldset>
      {error && <div className="form-error" role="alert">{error}</div>}
      <button type="submit" className="button navy submit-button" disabled={busy} aria-busy={busy}>{busy ? <><LoaderCircle size={18} className="spin" /> Membuka WhatsApp…</> : <>Teruskan ke WhatsApp <ArrowUpRight size={18} /></>}</button><p className="form-footnote">Maklumat borang dimasukkan ke pautan WhatsApp untuk menyediakan mesej. Tekan Send di WhatsApp untuk menghantar ke +60 10-653 8685. Borang ini tidak disimpan dalam pangkalan data laman.</p>
    </form>}</m.div></LazyMotion></dialog>;
}
