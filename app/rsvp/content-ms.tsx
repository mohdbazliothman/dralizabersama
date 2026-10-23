import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, CalendarDays, Clock3, MapPin, Coffee, MessagesSquare, Palette, Gavel } from 'lucide-react';
import { teaEvent as event } from '@/data/rsvp';
import RsvpForm from './rsvp-form';
import styles from './rsvp.module.css';
export const metadata: Metadata = {
  title: 'RSVP — Secawan Teh, Sebuah Cerita',
  description: 'Petang seni, bicara dan sumbangan bersama Dr Aliza. 1 November 2026, 3–5 petang, Pohon Beringin Cafe, Melaka. Melalui jemputan peribadi sahaja.',
  alternates: { canonical: 'https://bersamadraliza.org/rsvp' },
  openGraph: { title: event.title, description: event.subtitle, url: 'https://bersamadraliza.org/rsvp', images: [{ url: '/images/tea-invitation.png', alt: 'Jemputan ke Secawan Teh, Sebuah Cerita' }] },
};
export default function RsvpPage() {
  const icons = [Coffee, MessagesSquare, Palette, Gavel];
  return <main id="kandungan" className={styles.page} lang="ms">
    <nav className={styles.nav} aria-label="Navigasi acara"><Link href="/">BERSAMA DR ALIZA</Link><a href="#reservation">RSVP <ArrowUpRight size={16} /></a></nav>
    <div className={styles.languages} role="navigation" aria-label="Pilihan bahasa"><Link href="/rsvp?lang=ms" lang="ms" aria-current={'page'}>BM</Link><Link href="/rsvp?lang=en" lang="en" aria-current={undefined}>EN</Link></div><div className={styles.frame}>
      <header className={styles.hero}><p className={styles.eyebrow}>ANDA DIJEMPUT DENGAN HORMATNYA</p><span className={styles.rule} /><h1>Secawan Teh,<em>Sebuah Cerita</em></h1><p className={styles.subtitle}>{event.subtitle}</p><div className={styles.heroPortrait}><Image unoptimized src="/images/dr-aliza-tea-transparent.png" alt="Ilustrasi lukisan Dr Aliza memegang cawan teh, memakai blazer kuning dan tudung hitam" width={1024} height={1536} sizes="(max-width: 760px) 80vw, 400px" /></div><p className={styles.host}>MAJLIS MINUM PETANG & KUTIPAN DANA POLITIK<br />BERSAMA DR ALIZA</p><a href="#reservation" className={styles.button}>Daftar Kehadiran <ArrowUpRight size={18} /></a><p className={styles.deadline}>Melalui jemputan peribadi sahaja · Daftar sebelum {event.deadline}</p></header>
      <section className={styles.invitation} aria-labelledby="invitation-title"><div className={styles.letter}><p className={styles.eyebrow}>PETANG UNTUK MERAPATKAN HUBUNGAN</p><h2 id="invitation-title">Tetamu yang dihormati,</h2><p>Setiap perjalanan mempunyai cerita, dan setiap cerita bermula dengan perbualan. Anda dijemput menyertai Dr Aliza untuk menikmati minum petang, seni dan perbualan bermakna dalam suasana mesra.</p><p>Sambil menikmati secawan teh, Dr Aliza akan berkongsi perkembangan kempen pilihan rayanya, serta harapan dan perancangannya untuk masa hadapan.</p><p>Kami juga akan memperkenalkan karya seni kedua daripada siri <em>Satu Perjalanan</em> yang merakam detik, renungan dan pengalaman sepanjang perjalanan beliau.</p><p>Majlis ini turut menampilkan <strong>lelongan seni eksklusif untuk mengumpul dana</strong>, dengan hasilnya menyokong kempen pilihan raya Dr Aliza.</p><p>Kami menantikan kehadiran anda untuk menikmati petang yang mesra, perbualan bermakna dan seni yang membawa tujuan.</p><p className={styles.signature}>Salam mesra,<br /><em>Dr Aliza</em></p></div></section>
      <section className={styles.highlights} aria-labelledby="highlights-title"><p className={styles.eyebrow} id="highlights-title">SOROTAN ACARA</p><div>{event.highlights.map((item,i)=>{const Icon=icons[i];return <article key={item.title}><Icon size={34} strokeWidth={1.3}/><h3>{item.title}</h3><p>{item.text}</p></article>})}</div></section>
      <section className={styles.details} aria-label="Butiran acara"><div><CalendarDays/><span>TARIKH</span><strong>{event.date}</strong></div><div><Clock3/><span>MASA</span><strong>{event.time}</strong></div><div><MapPin/><span>TEMPAT</span><strong>{event.venue}</strong></div><div><span>BAYARAN</span><strong className={styles.price}>RM{event.admission}</strong><span>seorang</span></div></section>
      <section id="reservation" className={styles.reservation} aria-labelledby="rsvp-title"><div><p className={styles.eyebrow}>DAFTAR KEHADIRAN ANDA</p><h2 id="rsvp-title">Tempat anda<br />menanti.</h2><p>Terhad kepada 30–50 tetamu jemputan.<br />Pendaftaran awal diperlukan.</p><p>Sila daftar sebelum <strong>{event.deadline}</strong>. Hantar butiran anda kepada pasukan melalui WhatsApp. Kehadiran tertakluk pada pengesahan penganjur.</p><p className={styles.note}>Bayaran: RM50 seorang. Urusan pembayaran akan dimaklumkan oleh pasukan; tiada bayaran dikutip melalui halaman ini.</p></div><RsvpForm /></section>
      <footer className={styles.footer}><span>Mari membawa perubahan bersama.</span><Link href="/privasi">Notis privasi</Link><Link href="/">Kembali ke Dr Aliza ↗</Link></footer>
    </div>
  </main>;
}
