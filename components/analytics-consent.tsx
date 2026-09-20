'use client';
import { useEffect, useState } from 'react';
const ga = process.env.NEXT_PUBLIC_GA_ID;
const clarity = process.env.NEXT_PUBLIC_CLARITY_ID;
const configured = !!(ga || clarity);
function enable() {
  window.analyticsConsent = true;
  window.gtag?.('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  if (ga && /^G-[A-Z0-9]+$/.test(ga) && !document.getElementById('ga-script')) {
    window.dataLayer = window.dataLayer || [];
    // gtag expects an Arguments object in dataLayer (Google's documented queue format).
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function () { window.dataLayer!.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    window.gtag('config', ga, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script'); script.id = 'ga-script'; script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${ga}`; document.head.append(script);
  }
  if (clarity && /^[a-z0-9]+$/.test(clarity) && !window.privateFormOpened && !document.getElementById('clarity-script')) {
    const queue: unknown[][] = [];
    const stub = (...args: unknown[]) => { queue.push(args); };
    Object.assign(stub, { q: queue }); window.clarity = stub;
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
    const script = document.createElement('script'); script.id = 'clarity-script'; script.async = true; script.src = `https://www.clarity.ms/tag/${clarity}`; document.head.append(script);
  }
}
export function AnalyticsConsent() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!configured) return;
    let value: string | null = null;
    try { value = localStorage.getItem('aliza-analytics'); } catch { /* Storage may be blocked. */ }
    if (value === 'yes') enable();
    if (!value) { const timer = setTimeout(() => setShow(true), 500); return () => clearTimeout(timer); }
  }, []);
  if (!configured) return null;
  function choose(allow: boolean) {
    try { localStorage.setItem('aliza-analytics', allow ? 'yes' : 'no'); } catch { /* Consent applies for this page. */ }
    window.analyticsConsent = allow;
    if (allow) enable();
    else { window.gtag?.('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' }); window.clarity?.('stop'); }
    setShow(false);
  }
  return <>{show && <aside className="consent-banner" aria-label="Pilihan analitik"><strong>Analitik pilihan</strong><p>Benarkan ukuran penggunaan laman? Butiran borang tidak dihantar kepada analitik.</p><div><button onClick={() => choose(false)} className="button soft">Tolak</button><button onClick={() => choose(true)} className="button navy">Benarkan</button></div><a href="/privasi">Baca dasar privasi</a></aside>}<button className="analytics-settings" onClick={() => setShow(!show)}>Analitik</button></>;
}
