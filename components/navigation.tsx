'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { navigation } from '@/data/site';
export function Navigation() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  return <header className="site-header"><div className="container nav-bar"><a href="#utama" className="brand" aria-label="Dr Aliza. Maklumat rasmi - halaman utama"><Image src="/images/bersama.webp" alt="BERSAMA" width={80} height={45} /><span>DR ALIZA<span className="brand-dot">.</span><small>MAKLUMAT RASMI</small></span></a><nav aria-label="Navigasi utama" id="main-nav" className={open ? 'nav-links is-open' : 'nav-links'}>{navigation.map(([name, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{name}</a>)}<a className="button yellow nav-cta" href="#hubungi" onClick={() => setOpen(false)}>Hubungi <ArrowUpRight size={16} /></a></nav><button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="main-nav" aria-label={open ? 'Tutup menu' : 'Buka menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div></header>;
}
