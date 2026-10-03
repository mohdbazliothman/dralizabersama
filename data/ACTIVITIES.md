# Menambah posting Facebook

Sunting `data/activities.ts`, kemudian tambah rekod ke array `activities`.
Setiap rekod memerlukan `id` unik, `title`, `excerpt`, `publishedAt` (YYYY-MM-DD), `image`, `imageAlt` dan `facebookUrl` (permalink posting asal).

Simpan gambar sebenar yang dibenarkan dalam `public/images/activities/`; gunakan laluan `/images/activities/nama-fail.webp` pada `image`. Pastikan fail wujud, gunakan alt text yang menerangkan gambar, dan semak tarikh daripada posting asal, bukan kedudukan pinned post. Imej menggunakan object-fit contain supaya teks poster tidak dipotong.

Semak tajuk dan petikan terhadap posting asal. Senarai disusun mengikut tarikh penerbitan secara menurun dan memaparkan maksimum empat rekod. Posting pertama ialah featured; baki mengisi grid tanpa kad kosong. Petikan dipaparkan maksimum tiga baris. Tiada iframe atau feed automatik.

Posting pertama ialah lawatan pembaikan paip di Jalan Bukit Piatu. Teks, foto dan permalink disahkan melalui paparan awam Facebook; tarikh 1 Oktober 2026 disahkan pengguna. Bahan diperlukan bagi setiap posting baharu: permalink, gambar asal, teks dan tarikh sebenar.

Jalankan `npm run lint` dan `npm run build` sebelum penerbitan. Semak preview pada telefon dan desktop selepas menambah gambar. Jangan masukkan rekod contoh ke data produksi.

Posting tambahan: kunjungan Kampung Tun Razak (21 September 2026) dan sesi pembelajaran bersama Wong Chen (28 September 2026). Teks, foto dan permalink daripada paparan awam Facebook; tarikh disahkan pengguna.

Posting keempat: ziarah sahabat di Hospital Melaka (27 September 2026, tarikh diberikan pengguna). Teks, foto dan permalink disahkan daripada posting awam.
