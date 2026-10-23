import type { Metadata } from 'next';
import FloatingMenu from './floating-menu';
import InvitationGate from './invitation-gate';

import SlowReveal from './slow-reveal';
import MalayPage, { metadata as malayMetadata } from './content-ms';
import EnglishPage, { metadata as englishMetadata } from './content-en';
type Props = { searchParams: Promise<{ lang?: string | string[] }> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const english = (await searchParams).lang !== 'ms';
  return { ...(english ? englishMetadata : malayMetadata), alternates: {
    canonical: `https://bersamadraliza.org/rsvp${english ? '' : '?lang=ms'}`,
    languages: { 'ms-MY': 'https://bersamadraliza.org/rsvp?lang=ms', en: 'https://bersamadraliza.org/rsvp?lang=en', 'x-default': 'https://bersamadraliza.org/rsvp' },
  } };
}
export default async function Page({ searchParams }: Props) {
  const english = (await searchParams).lang !== 'ms';
  return <InvitationGate english={english}><SlowReveal key={english ? 'en' : 'ms'}>{english ? <EnglishPage /> : <MalayPage />}</SlowReveal><FloatingMenu english={english} /></InvitationGate>;
}
