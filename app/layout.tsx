import type { Metadata } from 'next';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import './globals.css';
import { site } from '@/data/site';
import { getSiteUrl } from '@/lib/site-url';
import { AnalyticsConsent } from '@/components/analytics-consent';
const url = getSiteUrl();
const title = 'Dr Aliza Che Amran | Profil & Maklumat Rasmi';
export const metadata: Metadata = {
  title: { default: title, template: '%s | Dr Aliza Che Amran' }, description: site.description,
  metadataBase: new URL(url || 'http://localhost:3100'),
  ...(url ? { alternates: { canonical: '/' } } : {}),
  openGraph: { title, description: site.description, locale: 'ms_MY', type: 'website', siteName: site.name, ...(url ? { url, images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: site.name }] } : {}) },
  twitter: { card: 'summary_large_image', title, description: site.description, ...(url ? { images: ['/opengraph-image'] } : {}) },
  robots: { index: !!url, follow: !!url }, icons: { icon: '/icon.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ms"><body><a className="skip-link" href="#kandungan">Langkau ke kandungan</a>{children}<AnalyticsConsent /></body></html>;
}
