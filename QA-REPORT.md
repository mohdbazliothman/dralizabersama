# Laporan semakan

20 September 2026. Semakan dilakukan terhadap kod dalam pakej ini, pada Windows dan Chromium tempatan.

## Keputusan

| Pemeriksaan | Keputusan |
| --- | --- |
| ESLint | Lulus, tiada error atau warning |
| Next.js production build | Lulus, termasuk pemeriksaan TypeScript dan penjanaan halaman |
| Ujian unit / pangkalan data | 5 lulus |
| Ujian browser | 11 lulus |
| Paparan 390px / 768px / 1440px | Tiada horizontal overflow; imej berjaya dimuatkan; semakan visual dilakukan |
| Axe WCAG 2 A/AA dan 2.1 AA | Tiada pelanggaran dikesan pada tiga viewport dan dialog yang diuji |
| Papan kekunci | Menu tutup dengan Escape; focus kekal dalam dialog; focus kembali ke butang pembuka |
| Borang | Pertanyaan, isu dan jemputan: validasi serta success/reference diuji; loading/error/retry mengekalkan data dan request ID |
| Tanpa JavaScript | Profil, rekod, pautan CV dan Facebook boleh dibaca/digunakan |
| CV awam | Lima halaman dirender dan disemak; telefon/e-mel peribadi serta halaman referee dibuang |
| Dependency audit semasa pemasangan | Tiada vulnerability dilaporkan oleh npm |

## Lighthouse mobile, production build tempatan

- Performance: **93/100**.
- Accessibility: **100/100**.
- Best Practices: **100/100**.
- SEO: **66/100** kerana halaman sengaja menggunakan `noindex` dan robots disallow apabila domain sebenar belum dikonfigurasi.
- Largest Contentful Paint: **3.0 saat** dalam simulasi mudah alih ini.
- Cumulative Layout Shift: **0**.

Laporan HTML disediakan bersama pakej sumber. Skor ialah satu ukuran makmal pada localhost, bukan jaminan skor pada hosting sebenar atau semua peranti. Kod dialog, Zod client dan animasi dimuatkan hanya apabila pengguna membuka borang. Font dihos sendiri; tiada embed sosial atau analitik aktif secara lalai.

## Semakan keselamatan yang dilakukan

- Zod menolak input tidak sah, teks berlebihan, markup, medan tambahan dan persetujuan yang tiada.
- Skema SQL dijalankan dalam PGlite (Postgres tempatan). RLS, penafian hak role anon, unik request ID, reset bucket dan pembersihan had kadar diuji.
- API menolak origin asing, input rosak, payload melebihi saiz dan akses cron tanpa autentikasi.
- Honeypot dan keperluan konfigurasi disemak melalui permintaan API ujian.
- Service role key hanya dirujuk dalam kod server-only. Tiada fail `.env.local` atau rahsia dalam pakej.
- PDF asal dengan butiran peribadi tidak diletakkan dalam public atau ZIP.

## Batas ujian / perkara belum aktif

- Ujian kejayaan browser menggunakan mock transport dan mock Turnstile. Ia tidak menghantar data kepada akaun pihak ketiga.
- Supabase sebenar, e-mel Resend, Turnstile sebenar dan Vercel Cron belum diuji terus kerana kunci akaun belum dibekalkan.
- Tiada deployment awam dilakukan. Domain, canonical, sitemap awam dan kebenaran indexing diaktifkan apabila SITE_URL HTTPS sebenar ditetapkan dan build semula dibuat.
- GA4 dan Clarity kekal tidak aktif. Persetujuan dan masking perlu disahkan semula pada konfigurasi akaun sebenar sebelum pengaktifan.
- Pautan video, gambar aktiviti dan saluran tambahan belum diberikan; empty state dipaparkan secara jelas.
- Penilaian aksesibiliti ini ialah semakan asas automatik dan papan kekunci, bukan audit pensijilan menyeluruh.
