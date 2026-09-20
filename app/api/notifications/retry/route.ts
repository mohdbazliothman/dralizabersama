import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { database, notifySubmission } from '@/lib/server/submissions';
export const runtime = 'nodejs';
export const maxDuration = 60;
export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const auth = request.headers.get('authorization') || '';
  const correct = expected ? `Bearer ${expected}` : '';
  if (!correct || auth.length !== correct.length || !timingSafeEqual(Buffer.from(auth), Buffer.from(correct))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const db = database();
    await db.rpc('cleanup_submission_rate');
    const { data, error } = await db.from('campaign_submissions').select('id,reference_number,submission_type').in('notification_status', ['pending', 'failed']).lt('created_at', new Date(Date.now() - 60000).toISOString()).order('created_at').limit(10);
    if (error) return NextResponse.json({ error: 'Unavailable' }, { status: 503 });
    let sent = 0;
    for (const row of data || []) if (await notifySubmission(row.id, row.reference_number, row.submission_type)) sent++;
    return NextResponse.json({ attempted: data?.length || 0, sent }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Unavailable' }, { status: 503 }); }
}
