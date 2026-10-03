import Image from 'next/image';
import { ArrowDown, ArrowUpRight, GraduationCap, Cpu, Recycle, MapPin, BookOpen, ArrowRight, FileText } from 'lucide-react';
import { site, stats, education, appointments, stories, communityTopics, personalFacts } from '@/data/site';
import { Navigation } from '@/components/navigation';
import { SocialHub } from '@/components/sections/social-hub';
import { ContactCentre } from '@/components/forms/contact-centre';
import { TrackedLink } from '@/components/tracked-link';
import { getSiteUrl } from '@/lib/site-url';

export default function Home() {
  const url = getSiteUrl();
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Person', name: site.fullName, ...(url ? { url, image: `${url}/images/dr-aliza.webp` } : {}), sameAs: [site.facebook], alumniOf: education.map(e => ({ '@type': 'CollegeOrUniversity', name: e.place })), knowsAbout: ['Control Systems', 'Robotics', 'TVET'] },
    { '@type': 'WebSite', name: site.name, inLanguage: 'ms-MY', ...(url ? { url } : {}) },
  ] };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <Navigation />
    <main id="kandungan">
      <section className="hero" id="utama" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-layout">
          <div className="hero-copy">
            <div className="eyebrow light"><span className="yellow-line" /> PROFIL & MAKLUMAT RASMI</div>
            <p className="candidate-label">CALON BERSAMA · N.17 BUKIT KATIL</p>
            <h1 id="hero-title"><span>TS. DR.</span> ALIZA<br />CHE AMRAN<span className="title-dot">.</span></h1>
            <p className="hero-profession">Kejuruteraan. Pendidikan.<br /><em>Teknologi untuk masyarakat.</em></p>
            <p className="hero-description">Kenali latar belakang Dr Aliza dalam sistem kawalan, robotik, pendidikan TVET dan projek komuniti sepanjang lebih 20 tahun kerjaya.</p>
            <div className="hero-buttons"><TrackedLink href="#kenali" event="hero_cta_click" className="button yellow">Kenali Dr Aliza <ArrowDown size={18} /></TrackedLink><a href="#hubungi" className="button outline-light">Hubungi Pasukan <ArrowUpRight size={18} /></a></div>
            <a className="hero-text-link" href="#aktiviti">Aktiviti & saluran rasmi <ArrowRight size={16} /></a>
          </div>
          <div className="hero-visual">
            <div className="portrait-frame"><Image src="/images/dr-aliza.webp" alt="Potret Dr Aliza Che Amran memakai tudung hitam dan jaket kuning" width={1122} height={1402} sizes="(max-width: 700px) 90vw, 45vw" loading="eager" fetchPriority="high" className="portrait" /></div>
            <span className="portrait-index" aria-hidden="true">01 / KENALI DR ALIZA</span>
            <div className="portrait-caption"><span>Ts. Dr. Aliza binti Che Amran</span><small>Doctor of Engineering · Yokohama National University</small></div>
          </div>
        </div>
        <div className="hero-bottom container"><span><MapPin size={15} /> BUKIT KATIL, MELAKA</span><a href="#kenali">Terokai profil <ArrowDown size={15} /></a><span className="hero-bottom-end">ILMU / PENGALAMAN / KOMUNITI</span></div>
      </section>
      <section className="section intro" id="kenali" aria-labelledby="intro-title">
        <div className="container editorial-grid">
          <div><p className="eyebrow"><span className="section-index">01</span> KENALI DR ALIZA</p><h2 id="intro-title">Dari universiti<br />ke <span className="underline-yellow">masyarakat.</span></h2><ul className="personal-facts" aria-label="Maklumat peribadi Dr Aliza">{personalFacts.map(fact => <li key={fact}>{fact}</li>)}</ul><TrackedLink href={site.cv} event="cv_download" className="text-link" target="_blank">Lihat CV awam <FileText size={18} /><span className="sr-only"> (PDF, tab baharu)</span></TrackedLink></div>
          <div className="intro-body"><p className="lead">Sistem kawalan, robotik dan pendidikan. Tiga bidang yang membentuk perjalanan profesional Dr Aliza.</p><p>Ts. Dr. Aliza binti Che Amran ialah seorang pendidik, penyelidik robotik dan pemimpin institusi. Kerjaya beliau di KUTKM dan UTeM merangkumi pengajaran, penyelidikan, pembangunan akademik serta pengurusan kualiti.</p><p>Beliau memperoleh Doctor of Engineering dalam bidang Physics, Electrical and Computer Engineering dari Yokohama National University, Jepun. Penyelidikannya menumpukan trajektori pergerakan robot berkaki dua.</p><p>Di luar penyelidikan, rekod beliau merangkumi pembangunan kerangka TVET, program pembelajaran bersama komuniti dan sistem pengkomposan elektrik.</p></div>
        </div>
        <div className="container stats-grid">{stats.map(s => <div className="stat" key={s.label}><strong>{s.value}</strong><h3>{s.label}</h3><p>{s.detail}</p></div>)}</div>
      </section>
      <section className="section experience" id="pengalaman" aria-labelledby="experience-title"><div className="container">
        <div className="section-top"><div><p className="eyebrow"><span className="section-index">02</span> PENDIDIKAN & PENGALAMAN</p><h2 id="experience-title">Satu perjalanan.<br />Pelbagai bidang ilmu.</h2></div><p className="section-aside">Daripada asas kejuruteraan elektrik kepada penyelidikan dan kepimpinan akademik.</p></div>
        <div className="experience-columns"><div><h3 className="column-label"><GraduationCap size={20} /> Pendidikan</h3><ol className="timeline">{education.map(e => <li key={e.year}><span className="timeline-year">{e.year}</span><div><h4>{e.title}</h4><p>{e.place}</p><small>{e.detail}</small></div></li>)}</ol></div><div><h3 className="column-label"><BookOpen size={20} /> Pelantikan terpilih</h3><ol className="appointments">{appointments.map(a => <li key={a.year}><span>{a.year}</span><h4>{a.title}</h4><p>{a.place}</p></li>)}</ol></div></div>
      </div></section>
      <section className="section work-section" aria-labelledby="work-title"><div className="container">
        <div className="section-top"><div><p className="eyebrow light"><span className="section-index">03</span> REKOD KERJA</p><h2 id="work-title">Ilmu dalam<br /><span className="yellow-text">pelaksanaan.</span></h2></div><p className="section-aside">Tiga bidang kerja yang direkodkan dalam CV: teknologi, pendidikan dan penglibatan komuniti.</p></div>
        <div className="stories">{stories.map((s, i) => { const Icon = [Cpu, GraduationCap, Recycle][i]; return <article className={`story story-${i}`} key={s.id}><div className="story-meta"><span>{s.id} / {s.category}</span><Icon size={28} strokeWidth={1.4} /></div><h3>{s.title}</h3><p>{s.text}</p><div className="story-fact"><strong>{s.fact}</strong><span>{s.factLabel}</span></div></article>; })}</div>
      </div></section>
      <section className="section community" id="komuniti" aria-labelledby="community-title"><div className="container editorial-grid"><div><p className="eyebrow"><span className="section-index">04</span> RUANG KOMUNITI</p><h2 id="community-title">Ada perkara<br />untuk dikongsikan?</h2><p className="section-aside">Sampaikan pertanyaan atau maklumat isu dengan lokasi dan penerangan yang jelas.</p><a href="#hubungi" className="button navy">Sampaikan isu <ArrowUpRight size={18} /></a></div><div className="topic-list">{communityTopics.map((t, i) => <article key={t.title}><span>0{i + 1}</span><div><h3>{t.title}</h3><p>{t.text}</p></div></article>)}<p className="source-note">Saluran ini untuk maklumat dan urusan komuniti. Ia bukan perkhidmatan kecemasan, dan penghantaran borang bukan jaminan tindakan oleh agensi.</p></div></div></section>
      <SocialHub />
      <ContactCentre />
      <section className="closing"><div className="container"><p className="eyebrow light">KEKAL BERHUBUNG</p><h2>Maklumat yang jelas.<br /><span className="yellow-text">Perbualan yang terbuka.</span></h2><div className="closing-actions"><a href="#hubungi" className="button yellow">Hubungi Pasukan <ArrowUpRight size={18} /></a><a href={site.facebook} target="_blank" rel="noopener noreferrer" className="text-link light">Ikuti aktiviti rasmi <ArrowUpRight size={18} /></a></div></div><div className="closing-line" aria-hidden="true" /></section>
    </main>
    <footer><div className="container footer-main"><div className="footer-brand"><Image src="/images/bersama.webp" width={108} height={61} alt="Logo Parti BERSAMA" /><div><strong>{site.name}</strong><p>Calon BERSAMA N.17 Bukit Katil</p></div></div><div className="footer-links"><a href={site.facebook} target="_blank" rel="noopener noreferrer">Facebook <ArrowUpRight size={14} /></a><a href="/privasi">Dasar privasi</a><a href="#utama">Kembali ke atas ↑</a></div></div><div className="container footer-bottom"><p>© {new Date().getFullYear()} {site.name}. Maklumat dikemas kini dari semasa ke semasa.</p><p>TikTok, Instagram & WhatsApp rasmi: belum diumumkan.</p></div></footer>
  </>;
}
