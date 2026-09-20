import Image from 'next/image';
import { ArrowUpRight, Play, Video } from 'lucide-react';
import { socialContent } from '@/data/social-content';
import { site } from '@/data/site';
import { TrackedLink } from '@/components/tracked-link';
import type { SocialContent } from '@/types/social';
function validItem(item: SocialContent) {
  try { const u = new URL(item.url); const allowed = item.platform === 'Facebook' ? ['facebook.com', 'www.facebook.com', 'fb.watch'] : ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com']; return u.protocol === 'https:' && allowed.includes(u.hostname) && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && Number.isFinite(Date.parse(item.date)); } catch { return false; }
}
function MediaCard({ item, featured = false }: { item: SocialContent; featured?: boolean }) {
  return <article className={featured ? 'media-card featured-media' : 'media-card'}><div className="media-thumb">{item.thumbnail?.startsWith('/images/') ? <Image src={item.thumbnail} alt={item.title} fill sizes={featured ? '(max-width: 700px) 90vw, 60vw' : '(max-width: 700px) 90vw, 30vw'} /> : <Video size={48} strokeWidth={1} />}<span className="play-mark"><Play size={20} /></span></div><div className="media-body"><p className="media-meta">{item.platform} · {item.category} · <time dateTime={item.date}>{new Intl.DateTimeFormat('ms-MY', { dateStyle: 'medium' }).format(new Date(item.date))}</time></p><h3>{item.title}</h3><p>{item.description}</p><TrackedLink event="social_video_click" href={item.url} target="_blank" className="text-link">Lihat di {item.platform} <ArrowUpRight size={16} /></TrackedLink></div></article>;
}
export function SocialHub() {
  const items = socialContent.filter(validItem);
  const featured = items.find(i => i.featured) ?? items[0];
  return <section className="section social-section" id="aktiviti" aria-labelledby="social-title"><div className="container"><div className="section-top"><div><p className="eyebrow"><span className="section-index">05</span> AKTIVITI & MEDIA</p><h2 id="social-title">Ikuti perkembangannya.</h2></div><a href={site.facebook} target="_blank" rel="noopener noreferrer" className="text-link">Facebook rasmi <ArrowUpRight size={18} /></a></div>{featured ? <div className="media-grid"><MediaCard item={featured} featured />{items.filter(i => i.id !== featured.id).slice(0, 5).map(i => <MediaCard item={i} key={i.id} />)}</div> : <div className="media-empty"><div className="media-empty-visual" aria-hidden="true"><Video size={54} strokeWidth={1} /><span>RUANG VIDEO & AKTIVITI</span></div><div><span className="label">SALURAN RASMI</span><h3>Perkembangan terkini<br />di Facebook Dr Aliza.</h3><p>Pautan video dan sorotan aktiviti akan dimuatkan selepas bahan rasmi diterima. Buat masa ini, lawati halaman Facebook rasmi.</p><a className="button navy" href={site.facebook} target="_blank" rel="noopener noreferrer">Buka Facebook <ArrowUpRight size={18} /></a><small>Video pengenalan dan pautan TikTok belum tersedia.</small></div></div>}</div></section>;
}
