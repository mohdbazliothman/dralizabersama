import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export function database() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(8000) }) } });
}
export function backendReady() {
  return ['NEXT_PUBLIC_SITE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'CAMPAIGN_NOTIFICATION_EMAIL', 'TURNSTILE_SECRET_KEY', 'RATE_LIMIT_SECRET'].every(key => !!process.env[key]);
}
// No personal data in notification. Access to records stays in the authenticated Supabase dashboard.
export async function notifySubmission(id: string, reference: string, type: string) {
  const db = database();
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const result = await resend.emails.send({ from: process.env.RESEND_FROM_EMAIL!, to: process.env.CAMPAIGN_NOTIFICATION_EMAIL!, subject: `Urusan baharu: ${reference}`, text: `Nombor rujukan: ${reference}\nJenis urusan: ${type}\n\nRekod telah disimpan. Semak melalui papan pemuka Supabase yang dilindungi akses. Tiada butiran peribadi disertakan dalam e-mel ini.` }, { idempotencyKey: `submission/${id}` });
    if (result.error) throw new Error('notification_failed');
    await db.from('campaign_submissions').update({ notification_status: 'sent', notified_at: new Date().toISOString() }).eq('id', id);
    return true;
  } catch {
    await db.from('campaign_submissions').update({ notification_status: 'failed' }).eq('id', id);
    return false;
  }
}
