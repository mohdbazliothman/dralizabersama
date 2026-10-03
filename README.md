# Dr Aliza — laman profil dan maklumat awam

Laman satu halaman Bahasa Melayu dengan Next.js 16.3.5 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide, Supabase, Resend, Zod dan Cloudflare Turnstile. Sasaran deployment: Vercel. Profil asas dirender oleh pelayan dan boleh dibaca tanpa JavaScript.

**Status:** kod aplikasi dan integrasi disediakan. Kunci akaun, domain dan penerima notifikasi belum dibekalkan; penghantaran sebenar tidak diaktifkan. Tiada data atau nombor rujukan kejayaan palsu dalam aplikasi. Kejayaan borang hanya dipulangkan setelah simpanan pangkalan data berjaya. Belum dideploy ke domain awam.

## Jalankan secara tempatan

Gunakan Node.js 22 LTS atau lebih baharu yang disokong Next.js.

```sh
npm ci
cp .env.example .env.local
npm run dev -- --port 3100
```

PowerShell: gunakan `Copy-Item .env.example .env.local`. Pratonton di `http://localhost:3100`. Tanpa kunci, profil boleh dilihat dan semua borang boleh dibuka, tetapi butang hantar dilumpuhkan jika site key Turnstile kosong. Jangan masukkan rahsia melalui chat atau commit `.env.local`.

```sh
npm run lint
npm test
npm run build
npm run start -- --port 3100
```

## Fail penting

| Fail / folder | Fungsi |
| --- | --- |
| `app/page.tsx` | Komposisi halaman utama, Server Component |
| `app/globals.css` | Reka bentuk, breakpoints, dialog, reduced motion |
| `data/site.ts` | Profil, statistik, pendidikan, pelantikan, rekod kerja, kategori isu |
| `data/social-content.ts` | Kandungan Facebook / TikTok yang boleh dikemas kini |
| `components/forms/contact-centre.tsx` | Pilihan urusan dan pemuatan dialog hanya apabila dibuka |
| `components/forms/contact-dialog.tsx` | Tiga borang, Turnstile, focus management, validasi dan state |
| `lib/validation.ts` | Skema Zod bersama client/server |
| `app/api/submissions/route.ts` | Endpoint pelayan, origin check, had saiz, antispam, rate limit, simpanan |
| `lib/server/submissions.ts` | Klien Supabase server-only dan notifikasi Resend |
| `app/api/notifications/retry/route.ts` | Retry notifikasi gagal/pending dan pembersihan rate limit |
| `supabase/schema.sql` | Jadual, indeks, RLS, grants dan RPC atomik |
| `app/privasi/page.tsx` | Notis penggunaan data |
| `app/layout.tsx` | Metadata, bahasa, font tempatan dan analitik pilihan |
| `app/opengraph-image.tsx` | Imej perkongsian automatik berasaskan teks fakta |
| `app/robots.ts`, `app/sitemap.ts` | Metadata pengindeksan berasaskan domain sebenar |
| `public/documents/cv-dr-aliza-awam.pdf` | CV awam yang disunting, bukan CV asal |
| `ASSET-AUDIT.md` | Jejak sumber fakta dan bahan yang belum tersedia |
| `QA-REPORT.md` | Keputusan pemeriksaan serta batas ujian |

## Environment variables

| Nama | Kegunaan |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Origin HTTPS utama tanpa path, misalnya domain sebenar yang anda miliki. Untuk dev boleh guna HTTP localhost. Digunakan juga untuk origin check dan hostname Turnstile. |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Disediakan mengikut brief; tidak digunakan kerana tiada akses pangkalan data dari client |
| `SUPABASE_SERVICE_ROLE_KEY` | Rahsia pelayan sahaja, jangan tambah prefix NEXT_PUBLIC |
| `RESEND_API_KEY` | Kunci Resend |
| `RESEND_FROM_EMAIL` | Alamat penghantar dalam domain yang telah disahkan Resend |
| `CAMPAIGN_NOTIFICATION_EMAIL` | Peti masuk rasmi pasukan untuk notifikasi |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Kunci widget awam |
| `TURNSTILE_SECRET_KEY` | Rahsia pengesahan Turnstile pada pelayan |
| `RATE_LIMIT_SECRET` | Rahsia rawak sekurang-kurangnya 32 bait untuk HMAC pengecam rangkaian |
| `CRON_SECRET` | Rahsia rawak untuk endpoint retry, disertakan oleh Vercel Cron |
| `NEXT_PUBLIC_GA_ID` | Pilihan; kosong bermakna GA4 tidak dimuatkan |
| `NEXT_PUBLIC_CLARITY_ID` | Pilihan; kosong bermakna Clarity tidak dimuatkan |

Hasilkan setiap rahsia secara berasingan dalam terminal tempatan menggunakan `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Jangan commit atau kongsi hasilnya. Semua perubahan NEXT_PUBLIC memerlukan build semula.

## Setup Supabase

1. Cipta projek di akaun anda dan pilih rantau yang sesuai.
2. Jalankan seluruh `supabase/schema.sql` di SQL Editor sebelum mengaktifkan borang.
3. Isi URL projek dan service role key pada environment pelayan Vercel.
4. RLS diaktifkan pada kedua-dua jadual. Role `anon` dan `authenticated` tidak diberi hak baca/tulis; tiada polisi public. Hanya endpoint server menggunakan service role.
5. Urus rekod melalui dashboard Supabase dengan akses terhad kepada petugas. Jangan siarkan eksport rekod atau dashboard.
6. Status kerja: `new`, `in_progress`, `closed`. Tetapkan `closed_at` apabila urusan ditutup. Semak dan padam/nyahkenal pasti rekod dalam 12 bulan selepas penutupan seperti notis privasi. Jadual retention ini ialah tugas operasi pasukan, bukan pemadaman automatik yang dilaksanakan tanpa semakan.

`payload` memegang medan khusus jenis urusan. `request_id` unik mengelakkan pendua apabila browser mengulangi penghantaran selepas gangguan. `reference_number` tidak mendedahkan maklumat peribadi. Tiada endpoint awam untuk membaca rekod.

Rate limit kekal dalam Postgres: maksimum 5 percubaan setiap 15 minit bagi HMAC IP harian. Ia berfungsi merentas instance Vercel; bukan Map dalam memori. Pelayan membaca header Vercel yang dikawal platform. Bagi hosting selain Vercel, implementasi perlu disesuaikan dengan proxy yang dipercayai; fallback tempatan berkongsi satu bucket.

## Setup Resend

1. Sahkan domain penghantar dan rekod DNS dalam Resend.
2. Isi `RESEND_API_KEY`, `RESEND_FROM_EMAIL` dan e-mel rasmi penerima.
3. Notifikasi mengandungi nombor rujukan dan jenis urusan sahaja. Nama, telefon, e-mel pengguna dan mesej tidak dihantar melalui e-mel.
4. Jika e-mel gagal, rekod kekal disimpan dengan `notification_status=failed` atau `pending`; pengguna tidak diminta menghantar semula data yang sudah disimpan.
5. `vercel.json` menyediakan retry harian pada 02:00 UTC. Tetapkan `CRON_SECRET`; Vercel menghantar `Authorization: Bearer <CRON_SECRET>`. Endpoint tidak boleh diakses tanpa rahsia.
6. Job memproses sehingga 10 notifikasi tertunggak setiap run. Untuk jumlah tinggi, naikkan kekerapan mengikut pelan Vercel atau gunakan queue terurus. Pantau backlog dan status cron selepas deployment. Resend idempotency key mengurangkan pendua dalam tetingkap perlindungan penyedia; notifikasi menggunakan semantik sekurang-kurangnya sekali, bukan jaminan tepat sekali.

Job yang sama memadam bucket had kadar berusia lebih 24 jam. Oleh sebab jadual harian, penyimpanan sebenar boleh mencapai hampir 48 jam. Jika cron gagal, pasukan perlu memulihkannya dan menjalankan cleanup.

## Setup Turnstile

1. Cipta widget Managed dalam Cloudflare Turnstile dan benarkan hostname domain sebenar.
2. Isi site key dan secret key; pastikan `NEXT_PUBLIC_SITE_URL` menggunakan origin yang sama.
3. Client menghantar token dengan action `contact`; pelayan mengesahkan token, action dan hostname melalui Siteverify.
4. Token tamat atau gagal mesti diperbaharui sebelum penghantaran. Tiada fallback yang menerima token tanpa pengesahan.
5. Untuk pembangunan, gunakan kunci ujian rasmi Cloudflare sahaja dalam environment tempatan. Jangan gunakan kunci ujian pada deployment awam. Ujian browser dalam repo memintas rangkaian Turnstile dengan fixture tempatan; ia tidak memintas CAPTCHA pada perkhidmatan sebenar.

## Deployment Vercel

1. Letakkan folder projek ini dalam repositori Git milik anda, atau jalankan Vercel CLI dalam folder projek.
2. Import ke Vercel. Pilih framework **Next.js**, install `npm ci`, build `npm run build`; biarkan output directory lalai.
3. Masukkan environment variables untuk Production. Gunakan database dan kunci berasingan untuk Preview jika anda mahu menguji penghantaran di sana.
4. Tetapkan domain utama, `NEXT_PUBLIC_SITE_URL`, hostname Turnstile dan domain Resend. Redirect alias seperti `www` kepada origin utama supaya semakan origin konsisten.
5. Deploy dan periksa `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, PDF CV dan `/privasi`.
6. Hantar satu borang ujian yang dikenal pasti sebagai ujian; sahkan rekod Supabase, nombor rujukan, notifikasi dan retry job. Padam rekod ujian selepas semakan.
7. Semak pengendali data, akses petugas, notis privasi, status pencalonan dan semua pautan rasmi sebelum berkongsi kepada orang awam.

Tiada deployment dilakukan dalam sesi pembinaan ini kerana projek Vercel, domain dan kunci perkhidmatan belum diberikan. Apabila SITE_URL kosong, laman mengeluarkan noindex dan sitemap kosong; fallback localhost hanya untuk pratonton. Domain palsu tidak dijana.

## Kandungan media

`socialContent` kini kosong. Tambah item sebenar dengan medan `id`, `platform` (`Facebook` / `TikTok`), `title`, `description`, `thumbnail` (path tempatan atau null), `url`, `date` (YYYY-MM-DD), `category`, `featured`.

- Paparan memilih satu featured dan sehingga lima item tambahan.
- Pautan HTTPS hanya kepada domain platform yang dibenarkan.
- Thumbnail tempatan dalam `public/images/`; semua imej menggunakan next/image.
- Tiada scraping, autoplay, embed berat atau video rekaan. Klik membuka platform dalam tab baharu.
- Masukkan video pengenalan sebagai item featured apabila URL sebenar diterima.

## Analitik dan privasi

Kosongkan kedua-dua ID untuk mematikan semua analitik. Apabila dikonfigurasi, skrip hanya dimuatkan selepas persetujuan jelas; butang Analitik membolehkan pengunjung menukar pilihan.

Event yang disediakan: `hero_cta_click`, `inquiry_form_open`, `issue_form_open`, `invitation_form_open`, `form_submission_success`, `social_video_click`, `cv_download`. Tiada event pendaftaran politik dalam skop neutral ini. Event menghantar nama tetap sahaja, tanpa payload borang.

Dalam GA4, **matikan Enhanced Measurement bagi interaksi borang dan pengumpulan user-provided data**, jangan pasang Google Signals, audience politik atau remarketing. Jangan tambah tracking parameter peribadi pada URL. Dalam Clarity, tetapkan masking paling ketat. Kod menandakan modal dengan `data-clarity-mask`, menghentikan Clarity sebelum modal dibuka dan tidak memulakannya semula sepanjang page view itu.

## Ujian

`npm test` menguji Zod serta skema Postgres melalui PGlite: RLS, grants, unique request, had kadar dan cleanup. PGlite menggunakan gen_random_uuid terbina dalam; Supabase menggunakan pgcrypto.

```sh
npx playwright install chromium
npm run test:browser
```

Suite browser menjalankan Next dev di port 3101. Ia menyemak 390/768/1440px, imej, anchor, axe WCAG A/AA, papan kekunci, tiga borang, loading/error/success/retry, kandungan tanpa JS serta penolakan API. Transport untuk ujian kejayaan dan CAPTCHA adalah mock, bukan integrasi akaun langsung. `PLAYWRIGHT_CHROMIUM_EXECUTABLE` boleh menunjuk kepada Chromium tempatan jika diperlukan.

## Bahan yang masih diperlukan

- Domain awam dan akaun/projek Vercel.
- Kunci Supabase, Resend, Turnstile serta e-mel penghantar/penerima rasmi.
- Rahsia rate limit dan cron.
- URL video pengenalan, hantaran aktiviti dan thumbnail yang diluluskan.
- URL rasmi TikTok, Instagram dan WhatsApp jika ingin dipaparkan.
- ID GA4 / Clarity jika mahu mengaktifkan analitik.
- Semakan operasi notis privasi serta status pencalonan terkini oleh pasukan.

## Rujukan teknikal

- [Next.js App Router](https://nextjs.org/docs/app/getting-started/installation)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Cloudflare Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Vercel request headers](https://vercel.com/docs/headers/request-headers)
- [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [Clarity consent](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2)

## Saluran borang semasa — WhatsApp
Semua borang awam kini menyediakan mesej melalui WhatsApp ke 60106538685. Pengguna perlu menekan Send dalam WhatsApp. Borang tidak memanggil API submissions, Supabase, Resend atau Turnstile. Endpoint lama dikekalkan untuk rujukan tetapi tidak digunakan oleh UI. Nombor destinasi dan format mesej berada dalam lib/whatsapp.ts. Event form_whatsapp_open menandakan pembukaan sahaja, bukan penghantaran berjaya.
