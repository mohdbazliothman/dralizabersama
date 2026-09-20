export const site = {
  name: 'Ts. Dr. Aliza Che Amran',
  fullName: 'Ts. Dr. Aliza binti Che Amran',
  role: 'Calon BERSAMA · N.17 Bukit Katil, Melaka',
  facebook: 'https://www.facebook.com/BersamaDrAliza',
  cv: '/documents/cv-dr-aliza-awam.pdf',
  description: 'Profil, pendidikan, pengalaman kejuruteraan dan aktiviti Ts. Dr. Aliza Che Amran. Dapatkan maklumat rasmi dan hubungi pasukan.',
};
export const navigation = [
  ['Utama', 'utama'], ['Kenali Dr Aliza', 'kenali'], ['Pengalaman', 'pengalaman'],
  ['Komuniti', 'komuniti'], ['Aktiviti', 'aktiviti'],
] as const;
// Maklumat peribadi dibekalkan oleh pengguna pada 21 September 2026.
export const personalFacts = ['Menginap di Bukit Katil', 'Sudah Berkeluarga', '1 Orang Anak'];
export const stats = [
  { value: '20+', label: 'Tahun pengalaman', detail: 'Kejuruteraan, pendidikan dan kepimpinan institusi.', source: 'CV, hlm. 1–2' },
  { value: '100%', label: 'Kejayaan akreditasi', detail: 'Penilaian penuh dan pembaharuan program semasa memimpin fungsi kualiti, 2021–2023.', source: 'CV, hlm. 3' },
  { value: 'RM100k', label: 'Projek kompos komuniti', detail: 'Jumlah dua projek UniMADANI 2024, masing-masing RM50,000.', source: 'CV, hlm. 3–4' },
  { value: '29', label: 'Dokumen dalam Scopus', detail: 'Jumlah yang dilaporkan dalam CV April 2026; bukan kiraan langsung.', source: 'CV, hlm. 4' },
];
export const education = [
  { year: '2003', title: 'Bachelor of Electrical and Electronics Engineering', place: 'Universiti Teknologi PETRONAS', detail: 'Pengkhususan kawalan dan instrumentasi.' },
  { year: '2006', title: 'Master of Electrical and Computer Systems Engineering', place: 'Monash University, Australia', detail: 'Kejuruteraan elektrik.' },
  { year: '2013', title: 'Doctor of Engineering', place: 'Yokohama National University, Jepun', detail: 'Physics, Electrical and Computer Engineering. Penyelidikan trajektori pergerakan robot berkaki dua.' },
];
export const appointments = [
  { year: '2004–2025', title: 'Tutor, pensyarah & pensyarah kanan', place: 'KUTKM / UTeM' },
  { year: '2013–2015', title: 'Deputy Director', place: 'Centre of Teaching and Learning, UTeM' },
  { year: '2021–2023', title: 'Deputy Director', place: 'Centre for Strategic, Quality & Risk Management, UTeM' },
  { year: 'APR–MEI 2026', title: 'Visiting Lecturer', place: 'Henan Polytechnic, Zhengzhou, China · seperti dinyatakan dalam CV' },
];
export const stories = [
  { id: '01', category: 'ROBOTIK & SISTEM KAWALAN', title: 'Memahami gerakan.\nMembangunkan sistem.', text: 'Penyelidikan kedoktoran Dr Aliza mengkaji trajektori robot berkaki dua. Rekod beliau turut merangkumi pembangunan tangan robotik, robot penghantaran dokumen dan sistem kawalan robotik industri.', fact: '4', factLabel: 'hasil robotik didaftarkan sebagai hak cipta bersama pada 2016', source: 'CV, hlm. 1 & 4', icon: 'robot' },
  { id: '02', category: 'PENDIDIKAN & TVET', title: 'Daripada kemahiran\nkepada kerangka pendidikan.', text: 'Beliau mengetuai pembangunan profil kompetensi tenaga akademik teknikal yang diterjemahkan kepada standard pekerjaan NOSS P853-001-5:2017 dan program sarjana pendidikan serta latihan teknikal.', fact: '2017', factLabel: 'tahun standard NOSS yang dirujuk dalam kerangka TVET', source: 'CV, hlm. 2 & 4', icon: 'education' },
  { id: '03', category: 'TEKNOLOGI & KOMUNITI', title: 'Sisa makanan.\nKegunaan baharu.', text: 'Projek pengkomposan UniMADANI menggabungkan sistem elektrik hibrid, latihan bersama SWCorp Melaka dan penggunaan secara berperingkat oleh komuniti di Pantai Siring serta Taman Dato’ Abdul Aziz.', fact: '2', factLabel: 'lokasi projek komuniti dengan jumlah geran RM100,000', source: 'CV, hlm. 3–4', icon: 'community' },
];
export const categories = ['Jalan', 'Longkang', 'Banjir', 'Lampu jalan', 'Sampah', 'Keselamatan', 'Kesihatan', 'Kebajikan', 'Pendidikan', 'Ekonomi', 'Perniagaan', 'Belia', 'Kemudahan awam', 'Lain-lain'] as const;
export const communityTopics = [
  { title: 'Kemudahan & persekitaran', text: 'Jalan, longkang, banjir, lampu jalan, sampah dan kemudahan awam.', icon: 'road' },
  { title: 'Pendidikan & kemahiran', text: 'Pendidikan, TVET, akses pembelajaran dan kegiatan anak muda.', icon: 'education' },
  { title: 'Kehidupan & kebajikan', text: 'Ekonomi keluarga, perniagaan, kesihatan, keselamatan dan kebajikan.', icon: 'community' },
];
