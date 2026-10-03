import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { activities, selectActivities, type Activity } from '@/data/activities';
import { site } from '@/data/site';
import styles from './social-hub.module.css';

function ActivityCard({ item, featured = false }: { item: Activity; featured?: boolean }) {
  const date = new Intl.DateTimeFormat('ms-MY', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${item.publishedAt}T00:00:00Z`));
  return <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
    <div className={styles.image}><Image src={item.image} alt={item.imageAlt} fill sizes={featured ? '(max-width: 700px) 90vw, 50vw' : '(max-width: 700px) 90vw, 33vw'} /></div>
    <div className={styles.body}>
      <p className={styles.meta}>FACEBOOK <span aria-hidden="true">/</span> <time dateTime={item.publishedAt}>{date}</time></p>
      <h3>{item.title}</h3><p className={styles.excerpt}>{item.excerpt}</p>
      <a href={item.facebookUrl} target="_blank" rel="noopener noreferrer" className={`text-link ${styles.link}`} aria-label={`Baca di Facebook: ${item.title}`}>Baca di Facebook <ArrowUpRight size={17} aria-hidden="true" /></a>
    </div>
  </article>;
}

export function SocialHub() {
  const [featured, ...remaining] = selectActivities(activities);
  return <section className="section social-section" id="aktiviti" aria-labelledby="social-title"><div className="container">
    <div className="section-top"><div><p className="eyebrow"><span className="section-index">05</span> AKTIVITI & MEDIA</p><h2 id="social-title">Ikuti perkembangannya.</h2></div><a href={site.facebook} target="_blank" rel="noopener noreferrer" className="text-link">Facebook rasmi <ArrowUpRight size={18} aria-hidden="true" /></a></div>
    {featured ? <div className={styles.posts}><ActivityCard item={featured} featured />{remaining.length > 0 && <div className={styles.grid}>{remaining.map(item => <ActivityCard key={item.id} item={item} />)}</div>}</div> : <div className={styles.fallback}><div><span className="label">FACEBOOK DR ALIZA</span><p>Ikuti aktiviti dan perkongsian terkini di Facebook rasmi.</p></div><a href={site.facebook} target="_blank" rel="noopener noreferrer" className="button navy">Buka Facebook <ArrowUpRight size={18} aria-hidden="true" /></a></div>}
  </div></section>;
}
