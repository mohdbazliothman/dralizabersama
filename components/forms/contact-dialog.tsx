'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, X, CheckCircle2, LoaderCircle } from 'lucide-react';
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { categories } from '@/data/site';
import { submissionSchema, type SubmissionType } from '@/lib/validation';
import { track } from '@/lib/analytics';
type Turnstile = { render: (el: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void; reset: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile; } }
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
export default function ContactDialog({ type, onClose }: { type: SubmissionType; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const requestId = useRef<string>('');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [reference, setReference] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const reduced = useReducedMotion();
  const heading = { inquiry: 'Pertanyaan', issue: 'Isu komuniti', invitation: 'Jemput Dr Aliza' }[type];
  useEffect(() => {
    requestId.current = crypto.randomUUID();
    dialog.current?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = old; };
  }, []);
  useEffect(() => {
    if (!siteKey) return;
    let disposed = false;
    const render = () => {
      if (disposed || !widget.current || widgetId.current || !window.turnstile) return;
      widgetId.current = window.turnstile.render(widget.current, { sitekey: siteKey, action: 'contact', theme: 'light', size: 'flexible', callback: (value: string) => { setToken(value); setCaptchaError(false); }, 'expired-callback': () => setToken(''), 'error-callback': () => { setToken(''); setCaptchaError(true); } });
      if (timer) clearInterval(timer);
    };
    if (!document.getElementById('turnstile-script')) {
      const script = document.createElement('script'); script.id = 'turnstile-script'; script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.onerror = () => { if (!disposed) setCaptchaError(true); }; document.head.append(script);
    }
    const timer = setInterval(render, 300);
    render();
    const deadline = setTimeout(() => { if (!widgetId.current && !disposed) { setCaptchaError(true); if (timer) clearInterval(timer); } }, 15000);
    return () => { disposed = true; clearInterval(timer); clearTimeout(deadline); if (widgetId.current) window.turnstile?.remove(widgetId.current); widgetId.current = null; };
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
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
    if (!token) { setError('Lengkapkan semakan keselamatan sebelum menghantar.'); return; }
    setBusy(true);
    try {
      const response = await fetch('/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: parsed.data, token, website: value('website'), request_id: requestId.current }), signal: AbortSignal.timeout(25000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Penghantaran tidak berjaya. Cuba semula.');
      setReference(result.reference); track('form_submission_success');
      requestAnimationFrame(() => dialog.current?.querySelector<HTMLElement>('[data-success]')?.focus());
    } catch (err) { setError(err instanceof Error && err.name !== 'TimeoutError' ? err.message : 'Sambungan mengambil masa terlalu lama. Cuba semula; penghantaran yang sama tidak akan diduplikasi.'); }
    finally { setBusy(false); setToken(''); if (widgetId.current) window.turnstile?.reset(widgetId.current); }
  }

  function field(name: string, label: string, config: { required?: boolean; type?: string; max?: number; area?: boolean; auto?: string } = {}) {
    const props = { id: name, name, required: config.required, maxLength: config.max ?? 180, 'aria-invalid': !!fields[name], 'aria-describedby': fields[name] ? `${name}-error` : undefined, autoComplete: config.auto ?? 'off' };
    return <div className={config.area ? 'field full' : 'field'}><label htmlFor={name}>{label}{config.required && <span aria-hidden="true"> *</span>}</label>{config.area ? <textarea {...props} rows={4} /> : <input {...props} type={config.type ?? 'text'} min={config.type === 'number' ? 1 : undefined} max={config.type === 'number' ? 100000 : undefined} inputMode={name === 'phone' ? 'tel' : undefined} />}{fields[name] && <small className="field-error" id={`${name}-error`}>{fields[name]}</small>}</div>;
  }
  return <dialog ref={dialog} className="contact-dialog" aria-labelledby="dialog-title" data-clarity-mask="true" onCancel={e => { if (busy) e.preventDefault(); else onClose(); }} onClick={e => { if (e.target === e.currentTarget && !busy) onClose(); }}><LazyMotion features={domAnimation}><m.div initial={{ opacity: 0, y: reduced ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="dialog-inner"><div className="dialog-heading"><div><p className="eyebrow">HUBUNGI PASUKAN</p><h2 id="dialog-title">{heading}</h2></div><button className="icon-button" onClick={onClose} disabled={busy} aria-label="Tutup borang"><X /></button></div>{reference ? <div className="success-state" tabIndex={-1} data-success role="status"><CheckCircle2 size={52} /><h3>Maklumat telah diterima.</h3><p>Simpan nombor rujukan ini untuk urusan susulan.</p><strong className="reference">{reference}</strong><p>Pasukan akan menyemak penghantaran anda. Penerimaan ini bukan pengesahan kehadiran atau jaminan penyelesaian.</p><button className="button navy" onClick={onClose}>Selesai</button></div> : <form ref={form} onSubmit={submit} noValidate className="contact-form" data-clarity-mask="true"><p className="form-intro">Medan bertanda * wajib diisi. Jangan masukkan nombor kad pengenalan atau maklumat sulit.</p><fieldset disabled={busy}><legend className="sr-only">Butiran {heading}</legend><div className="form-grid">
      {field('full_name', 'Nama penuh', { required: true, auto: 'name', max: 120 })}{field('phone', 'Nombor telefon', { required: true, type: 'tel', auto: 'tel', max: 22 })}{field('email', 'E-mel (pilihan)', { type: 'email', auto: 'email', max: 254 })}{field('location', 'Kampung / taman / kawasan', { required: true })}{field('pdm', 'PDM, jika diketahui (pilihan)', { max: 120 })}
      {type === 'inquiry' && field('subject', 'Tajuk pertanyaan', { required: true, max: 160 })}
      {type === 'issue' && <>{field('issue_title', 'Tajuk isu', { required: true, max: 160 })}<div className="field"><label htmlFor="category">Kategori *</label><select name="category" id="category" defaultValue="" required aria-invalid={!!fields.category} aria-describedby={fields.category ? 'category-error' : undefined}><option value="" disabled>Pilih kategori</option>{categories.map(c => <option key={c}>{c}</option>)}</select>{fields.category && <small className="field-error" id="category-error">Pilih kategori isu.</small>}</div>{field('issue_location', 'Lokasi isu', { required: true, max: 300 })}{field('description', 'Penerangan isu', { required: true, area: true, max: 4000 })}<label className="checkbox full"><input type="checkbox" name="follow_up" defaultChecked /> Saya bersetuju dihubungi semula berhubung isu ini.</label></>}
      {type === 'invitation' && <>{field('organization', 'Nama organisasi', { required: true })}{field('officer', 'Nama pegawai urusan', { required: true, max: 120 })}{field('event_datetime', 'Tarikh & masa (waktu Malaysia)', { required: true, type: 'datetime-local' })}{field('venue', 'Lokasi program', { required: true, max: 300 })}{field('event_type', 'Jenis program', { required: true, max: 150 })}{field('attendance', 'Anggaran kehadiran', { required: true, type: 'number' })}</>}
      {field('message', type === 'inquiry' ? 'Mesej' : 'Maklumat tambahan (pilihan)', { required: type === 'inquiry', area: true, max: 3000 })}
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    </div><div className="consent-box"><label className="checkbox"><input type="checkbox" name="consent" required aria-invalid={!!fields.consent} aria-describedby="consent-description" /><span>Saya bersetuju maklumat ini disimpan dan digunakan oleh pasukan untuk mengurus urusan yang saya pilih. *</span></label><p id="consent-description">Baca <a href="/privasi" target="_blank" rel="noopener noreferrer">dasar privasi (tab baharu)</a>. Persetujuan boleh ditarik balik melalui borang pertanyaan.</p>{fields.consent && <p className="field-error">{fields.consent}</p>}</div></fieldset>
      {siteKey ? <div ref={widget} className="turnstile-widget" /> : <p className="setup-notice" role="status">Penghantaran dalam talian belum diaktifkan. Pasukan perlu melengkapkan sambungan keselamatan dan pangkalan data terlebih dahulu.</p>}
      {captchaError && <p className="field-error" role="alert">Semakan keselamatan tidak dapat dimuatkan. Semak sambungan dan buka semula borang.</p>}
      {error && <div className="form-error" role="alert">{error}</div>}
      <button type="submit" className="button navy submit-button" disabled={busy || !siteKey || !token} aria-busy={busy}>{busy ? <><LoaderCircle size={18} className="spin" /> Sedang menghantar…</> : <>Hantar maklumat <ArrowUpRight size={18} /></>}</button><p className="form-footnote">Nombor rujukan hanya dikeluarkan selepas rekod berjaya disimpan.</p>
    </form>}</m.div></LazyMotion></dialog>;
}
