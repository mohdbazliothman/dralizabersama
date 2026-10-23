'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import styles from './rsvp.module.css';

/** Progressive enhancement: server-rendered text stays readable without JavaScript. */
export default function SlowReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = root.current;
    if (!container || !('IntersectionObserver' in window)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const targets = Array.from(container.querySelectorAll<HTMLElement>([
      `.${styles.hero} > p`, `.${styles.hero} h1`,
      `.${styles.letter} > p`, `.${styles.letter} > h2`,
      `.${styles.highlights} > p`, `.${styles.highlights} article`,
      `.${styles.details} > div`, `.${styles.reservation} > div > p`,
      `.${styles.reservation} > div > h2`,
    ].join(',')));
    const animations = new Map<HTMLElement, Animation>();
    let observer: IntersectionObserver | undefined;
    function showAll() {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      targets.forEach(el => { el.style.removeProperty('opacity'); });
    }
    function start() {
      showAll();
      if (preference.matches) return;
      targets.forEach(el => { el.style.opacity = '0'; });
      observer = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting);
        visible.forEach((entry, index) => {
          const el = entry.target as HTMLElement;
          observer?.unobserve(el);
          const heading = el.matches('h1,h2');
          const animation = el.animate([
            { opacity: 0, transform: `translateY(${heading ? 24 : 16}px)` },
            { opacity: 1, transform: 'translateY(0)' },
          ], { duration: heading ? 3400 : 2600, delay: Math.min(index * 180, 720), easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' });
          animations.set(el, animation);
          animation.onfinish = () => { el.style.removeProperty('opacity'); animation.cancel(); animations.delete(el); };
        });
      }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
      targets.forEach(el => observer?.observe(el));
    }
    // Never make focused links or their surrounding text wait for an animation.
    function onFocus(event: FocusEvent) {
      targets.filter(el => el.contains(event.target as Node)).forEach(el => {
        observer?.unobserve(el); animations.get(el)?.cancel(); animations.delete(el); el.style.removeProperty('opacity');
      });
    }
    start();
    preference.addEventListener('change', start);
    container.addEventListener('focusin', onFocus);
    return () => { showAll(); preference.removeEventListener('change', start); container.removeEventListener('focusin', onFocus); };
  }, []);
  return <div ref={root}>{children}</div>;
}
