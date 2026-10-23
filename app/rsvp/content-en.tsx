import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, CalendarDays, Clock3, MapPin, Coffee, MessagesSquare, Palette, Gavel } from 'lucide-react';
import { teaEvent as event } from '@/data/rsvp-en';
import RsvpForm from './rsvp-form-en';
import styles from './rsvp.module.css';
export const metadata: Metadata = {
  title: 'RSVP — A Cup of Tea, A Story to Tell',
  description: 'An afternoon of art, conversation and giving with Dr Aliza. 1 November 2026, 3–5 PM, Pohon Beringin Cafe, Melaka. By personal invitation only.',
  alternates: { canonical: 'https://bersamadraliza.org/rsvp' },
  openGraph: { title: event.title, description: event.subtitle, url: 'https://bersamadraliza.org/rsvp', images: [{ url: '/images/tea-invitation.png', alt: 'Invitation to A Cup of Tea, A Story to Tell' }] },
};
export default function RsvpPage() {
  const icons = [Coffee, MessagesSquare, Palette, Gavel];
  return <main id="kandungan" className={styles.page} lang="en">
    <nav className={styles.nav} aria-label="Event navigation"><Link href="/">WITH DR ALIZA</Link><a href="#reservation">RSVP <ArrowUpRight size={16} /></a></nav>
    <div className={styles.languages} role="navigation" aria-label="Language selection"><Link href="/rsvp?lang=ms" lang="ms" aria-current={undefined}>BM</Link><Link href="/rsvp?lang=en" lang="en" aria-current={'page'}>EN</Link></div><div className={styles.frame}>
      <header className={styles.hero}><p className={styles.eyebrow}>YOU ARE CORDIALLY INVITED</p><span className={styles.rule} /><h1>A Cup of Tea,<em>A Story to Tell</em></h1><p className={styles.subtitle}>{event.subtitle}</p><div className={styles.heroPortrait}><Image unoptimized src="/images/dr-aliza-tea-transparent.png" alt="Painted illustration of Dr Aliza holding a teacup, wearing a yellow blazer and black hijab" width={1024} height={1536} sizes="(max-width: 760px) 80vw, 400px" /></div><p className={styles.host}>A HI-TEA & POLITICAL FUNDRAISING GATHERING<br />WITH DR ALIZA</p><a href="#reservation" className={styles.button}>Kindly RSVP <ArrowUpRight size={18} /></a><p className={styles.deadline}>By personal invitation only · RSVP by {event.deadline}</p></header>
      <section className={styles.invitation} aria-labelledby="invitation-title"><div className={styles.letter}><p className={styles.eyebrow}>AN AFTERNOON TO CONNECT</p><h2 id="invitation-title">Dear Valued Guest,</h2><p>Every journey has a story, and every story begins with a conversation. You are warmly invited to join Dr Aliza for an intimate afternoon of tea, art and meaningful talks.</p><p>Over a cup of tea, Dr Aliza will share updates from her ongoing election campaign, along with her hopes and plans for the future.</p><p>We will also be unveiling the second artwork from the <em>Satu Perjalanan</em> series, a collection that captures moments, reflections and experiences along her journey.</p><p>The afternoon will feature an exclusive <strong>fundraising art auction</strong>, with proceeds supporting Dr Aliza’s election campaign.</p><p>We look forward to welcoming you for an afternoon of good company, great conversations and art with purpose.</p><p className={styles.signature}>Warm regards,<br /><em>Dr Aliza</em></p></div></section>
      <section className={styles.highlights} aria-labelledby="highlights-title"><p className={styles.eyebrow} id="highlights-title">EVENT HIGHLIGHTS</p><div>{event.highlights.map((item,i)=>{const Icon=icons[i];return <article key={item.title}><Icon size={34} strokeWidth={1.3}/><h3>{item.title}</h3><p>{item.text}</p></article>})}</div></section>
      <section className={styles.details} aria-label="Event details"><div><CalendarDays/><span>DATE</span><strong>{event.date}</strong></div><div><Clock3/><span>TIME</span><strong>{event.time}</strong></div><div><MapPin/><span>VENUE</span><strong>{event.venue}</strong></div><div><span>ADMISSION</span><strong className={styles.price}>RM{event.admission}</strong><span>per person</span></div></section>
      <section id="reservation" className={styles.reservation} aria-labelledby="rsvp-title"><div><p className={styles.eyebrow}>SAVE YOUR SEAT</p><h2 id="rsvp-title">A seat at<br />the table.</h2><p>Limited to 30–50 invited guests.<br />Advance registration required.</p><p>Please RSVP by <strong>{event.deadline}</strong>. Send your details to the team via WhatsApp. Attendance is subject to confirmation by the organisers.</p><p className={styles.note}>Admission: RM50 per person. Payment arrangements will be confirmed by the team; no payment is collected on this page.</p></div><RsvpForm /></section>
      <footer className={styles.footer}><span>Let’s make a difference together.</span><Link href="/privasi">Privacy notice</Link><Link href="/">Back to Dr Aliza ↗</Link></footer>
    </div>
  </main>;
}
