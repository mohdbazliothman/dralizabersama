import { ImageResponse } from 'next/og';
export const alt = 'Ts. Dr. Aliza Che Amran — Profil dan maklumat rasmi';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', padding: 80, background: '#071A2E', color: '#fff', borderBottom: '20px solid #FFD400' }}><div style={{ display: 'flex', fontSize: 24, color: '#FFD400', marginBottom: 35 }}>PROFIL & MAKLUMAT RASMI</div><div style={{ display: 'flex', fontSize: 76, fontWeight: 700 }}>Ts. Dr. Aliza</div><div style={{ display: 'flex', fontSize: 76, fontWeight: 700 }}>Che Amran</div><div style={{ display: 'flex', fontSize: 28, marginTop: 30 }}>Kejuruteraan · Pendidikan · Teknologi untuk masyarakat</div></div>, size);
}
