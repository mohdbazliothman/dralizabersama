export type EventName = 'hero_cta_click' | 'inquiry_form_open' | 'issue_form_open' | 'invitation_form_open' | 'form_submission_success' | 'social_video_click' | 'cv_download';
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; clarity?: (...args: unknown[]) => void; analyticsConsent?: boolean; privateFormOpened?: boolean; } }
export function track(event: EventName) {
  if (typeof window === 'undefined' || !window.analyticsConsent) return;
  window.gtag?.('event', event); // Fixed event name only; never form values or identifiers.
}
export function protectForm() {
  window.privateFormOpened = true;
  window.clarity?.('stop');
}
