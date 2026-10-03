export type Activity = {
  id: string;
  title: string;
  excerpt: string;
  /** Tarikh sebenar posting: YYYY-MM-DD. */
  publishedAt: string;
  /** Fail tempatan dalam public/images/activities/. */
  image: string;
  imageAlt: string;
  facebookUrl: string;
};

// Isi hanya selepas teks, tarikh, imej dan permalink disahkan.
// Tarikh posting Bukit Piatu disahkan pengguna: 1 Oktober 2026.
export const activities: Activity[] = [{
  "id": "lawatan-paip-bukit-piatu",
  "title": "Meninjau pembaikan paip di Jalan Bukit Piatu",
  "excerpt": "Lawatan ke lokasi pembaikan paip bocor serta maklum balas kepada SAMB tentang bekalan air alternatif untuk penduduk yang terjejas.",
  "publishedAt": "2026-10-01",
  "image": "/images/activities/lawatan-paip-bukit-piatu.jpg",
  "imageAlt": "Dr Aliza bersama seorang wanita di lokasi kerja pembaikan paip pada waktu malam.",
  "facebookUrl": "https://www.facebook.com/BersamaDrAliza/posts/pfbid0hShPaHPkJbndZhTUHkBhDSikao49bEXZvypf9VueruvhpwZshyuHWLtJJuTHa5Eyl"
}, {
  id: 'kunjungan-kg-tun-razak',
  title: 'Bertemu warga Kampung Tun Razak',
  excerpt: 'Dr Aliza berkongsi kunjungan bertemu warga Bukit Katil di Kampung Tun Razak dan mengucapkan terima kasih kepada mereka yang menjayakan program.',
  publishedAt: '2026-09-21',
  image: '/images/activities/kunjungan-kg-tun-razak.jpg',
  imageAlt: 'Dr Aliza berbual dengan warga di sebuah gerai berbumbung di Kampung Tun Razak.',
  facebookUrl: 'https://www.facebook.com/BersamaDrAliza/posts/pfbid0RhNbBNYYM9trALZVMY8MJyhy2nHh5byrXxijFnRkVNbZfsZWxeGC3S35Y7ATQtmvl'
}, {
  "id": "sesi-pembelajaran",
  "title": "Sesi pembelajaran bersama Wong Chen",
  "excerpt": "Dr Aliza berkongsi pengalamannya mengikuti sesi bersama Wong Chen dan pembantunya, Ivan, serta pertemuan dengan JimmyHappy.",
  "publishedAt": "2026-09-28",
  "image": "/images/activities/sesi-pembelajaran.jpg",
  "imageAlt": "Dr Aliza bergambar bersama seorang peserta dalam ruang sesi pembelajaran.",
  "facebookUrl": "https://www.facebook.com/BersamaDrAliza/posts/pfbid0SYxLQcqKfskVmibdjYRJTjUHVdqqSVYfj3u1cXCs4BipNMdWr24G1EhWi5MNJQXSl"
}, {
  id: 'ziarah-hospital-melaka',
  title: 'Ziarah sahabat di Hospital Melaka',
  excerpt: 'Dr Aliza berkongsi ziarah menemui sahabatnya, Haji Babji, di Hospital Melaka dan menitipkan doa agar beliau segera sembuh.',
  publishedAt: '2026-09-27',
  image: '/images/activities/ziarah-hospital-melaka.jpg',
  imageAlt: 'Dr Aliza bergambar bersama Haji Babji dan dua wanita di ruang hospital.',
  facebookUrl: 'https://www.facebook.com/BersamaDrAliza/posts/pfbid0EB1NR3ZpjGagUrj2dYzieqvVABCBWXSXmrwM6Aq3jRq1YFDAruVFRc8f1jdhqdo2l'
}];

export function selectActivities(items: Activity[]): Activity[] {
  return items.filter(item => {
    try {
      const url = new URL(item.facebookUrl);
      const date = new Date(`${item.publishedAt}T00:00:00Z`);
      return item.id.trim() && item.title.trim() && item.excerpt.trim() && item.imageAlt.trim()
        && item.image.startsWith('/images/') && !item.image.includes('..')
        && /^\d{4}-\d{2}-\d{2}$/.test(item.publishedAt)
        && Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === item.publishedAt
        && url.protocol === 'https:' && ['facebook.com', 'www.facebook.com', 'm.facebook.com'].includes(url.hostname)
        && url.pathname !== '/' && !url.username && !url.password;
    } catch { return false; }
  }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 4);
}
