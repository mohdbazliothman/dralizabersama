import { NextRequest, NextResponse, after } from 'next/server';
import { createHmac, randomUUID } from 'node:crypto';
import { envelopeSchema } from '@/lib/validation';
import { getSiteUrl } from '@/lib/site-url';
import { backendReady, database, notifySubmission } from '@/lib/server/submissions';

export const runtime = 'nodejs';
export const maxDuration = 30;
const reply = (status: number, message: string, extra = {}) => NextResponse.json({ message, ...extra }, { status, headers: { 'Cache-Control': 'no-store', ...(status === 429 ? { 'Retry-After': '900' } : {}) } });
async function readLimited(request: NextRequest) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('empty');
  let size = 0; const chunks: Uint8Array[] = [];
  while (true) { const { value, done } = await reader.read(); if (done) break; size += value.byteLength; if (size > 20000) { await reader.cancel(); throw new Error('too_large'); } chunks.push(value); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export async function POST(request: NextRequest) {
  const trustedOrigin = getSiteUrl();
  const origin = request.headers.get('origin');
  const localOrigin = process.env.NODE_ENV !== 'production' ? request.nextUrl.origin : null;
  if (!origin || (origin !== trustedOrigin && origin !== localOrigin)) return reply(403, 'Permintaan tidak dibenarkan. Muat semula halaman rasmi.');
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415, 'Format penghantaran tidak disokong.');
  if (Number(request.headers.get('content-length') || 0) > 20000) return reply(413, 'Maklumat terlalu panjang.');
  let input: unknown;
  try { input = await readLimited(request); } catch { return reply(400, 'Borang tidak dapat dibaca atau terlalu panjang.'); }
  const parsed = envelopeSchema.safeParse(input);
  if (!parsed.success) return reply(400, 'Sila semak semua medan dan lengkapkan semakan keselamatan.');
  if (parsed.data.website) return reply(400, 'Penghantaran tidak dapat disahkan.');
  if (!backendReady()) return reply(503, 'Penghantaran belum diaktifkan oleh pasukan. Sila cuba kemudian.');
  try {
    const db = database();
    // Vercel replaces x-vercel-forwarded-for; never trust client-supplied x-forwarded-for.
    const ip = process.env.VERCEL === '1' ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() : 'local-preview';
    const day = new Date().toISOString().slice(0, 10);
    const fingerprint = createHmac('sha256', process.env.RATE_LIMIT_SECRET!).update(`${day}:${ip || 'unknown'}`).digest('hex');
    const { data: allowed, error: rateError } = await db.rpc('consume_submission_rate', { p_key: fingerprint });
    if (rateError) return reply(503, 'Sistem sedang sibuk. Sila cuba kemudian.');
    if (!allowed) return reply(429, 'Terlalu banyak percubaan. Sila tunggu 15 minit sebelum mencuba semula.');
    const { token, data, request_id } = parsed.data;
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token }), signal: AbortSignal.timeout(8000) });
    if (!verification.ok) return reply(503, 'Semakan keselamatan tidak tersedia. Cuba semula.');
    const result = await verification.json();
    if (!result.success || result.action !== 'contact' || result.hostname !== new URL(trustedOrigin!).hostname) return reply(400, 'Semakan keselamatan tamat atau tidak sah. Lengkapkan semula semakan.');
    const { data: existing, error: readError } = await db.from('campaign_submissions').select('reference_number').eq('request_id', request_id).maybeSingle();
    if (readError) return reply(503, 'Rekod tidak dapat disemak. Cuba semula.');
    if (existing) return reply(200, 'Penghantaran telah diterima.', { reference: existing.reference_number });
    const { full_name, phone, email, location, pdm, consent, submission_type, ...payload } = data;
    const id = randomUUID();
    const reference = `ALZ-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`;
    const { error } = await db.from('campaign_submissions').insert({ id, request_id, reference_number: reference, submission_type, full_name, phone, email: email || null, location, pdm: pdm || null, payload, consent, consent_version: '2026-09-20', status: 'new' });
    if (error) {
      if (error.code === '23505') {
        const { data: duplicate } = await db.from('campaign_submissions').select('reference_number').eq('request_id', request_id).maybeSingle();
        if (duplicate) return reply(200, 'Penghantaran telah diterima.', { reference: duplicate.reference_number });
      }
      return reply(503, 'Maklumat belum dapat disimpan. Sila cuba semula.');
    }
    after(async () => { await notifySubmission(id, reference, submission_type); });
    return reply(201, 'Maklumat berjaya disimpan.', { reference });
  } catch { return reply(503, 'Sambungan terganggu. Cuba semula dengan borang ini untuk mengelakkan pendua.'); }
}
