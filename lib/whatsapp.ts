import type { Submission } from './validation';
export const whatsappNumber = '60106538685';
const labels: Record<string, string> = { full_name: 'Nama penuh', phone: 'Telefon', email: 'E-mel', location: 'Kawasan', pdm: 'PDM', message: 'Mesej / maklumat tambahan', subject: 'Tajuk pertanyaan', issue_title: 'Tajuk isu', category: 'Kategori', issue_location: 'Lokasi isu', description: 'Penerangan isu', follow_up: 'Boleh dihubungi semula', organization: 'Organisasi', officer: 'Pegawai urusan', event_datetime: 'Tarikh & masa (Malaysia)', venue: 'Lokasi program', event_type: 'Jenis program', attendance: 'Anggaran kehadiran' };
export function whatsappUrl(data: Submission) {
  const heading = { inquiry: 'Pertanyaan', issue: 'Isu komuniti', invitation: 'Jemput Dr Aliza' }[data.submission_type];
  const lines = Object.entries(data).filter(([key, value]) => labels[key] && value !== '').map(([key, value]) => `${labels[key]}: ${typeof value === 'boolean' ? (value ? 'Ya' : 'Tidak') : key === 'event_datetime' ? String(value).replace('T', ' ') : value}`);
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent([heading, '', ...lines, '', 'Saya bersetuju maklumat ini digunakan oleh pasukan untuk mengurus urusan ini.'].join('\n'))}`;
}
