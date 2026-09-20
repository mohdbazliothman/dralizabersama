import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('SQL schema, RLS, permissions, persistent rate limit and uniqueness', async () => {
  const db = new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
    // PGlite provides gen_random_uuid natively; Supabase uses pgcrypto.
    const sql = (await readFile('supabase/schema.sql', 'utf8')).replace('create extension if not exists pgcrypto;', '');
    await db.exec(sql);
    const rls = await db.query<{ relrowsecurity: boolean }>("select relrowsecurity from pg_class where relname in ('campaign_submissions','submission_rate_limits')");
    assert.equal(rls.rows.length, 2); assert.ok(rls.rows.every(r => r.relrowsecurity));
    const permissions = await db.query<{ can_read: boolean; can_write: boolean }>("select has_table_privilege('anon', 'public.campaign_submissions', 'SELECT') can_read, has_table_privilege('anon', 'public.campaign_submissions', 'INSERT') can_write");
    assert.deepEqual(permissions.rows[0], { can_read: false, can_write: false });
    for (let i = 1; i <= 7; i++) {
      const result = await db.query<{ allowed: boolean }>('select consume_submission_rate($1) allowed', ['a'.repeat(64)]);
      assert.equal(result.rows[0].allowed, i <= 5);
    }
    await db.exec("update submission_rate_limits set window_start=now()-interval '16 minutes'");
    assert.equal((await db.query<{ allowed: boolean }>('select consume_submission_rate($1) allowed', ['a'.repeat(64)])).rows[0].allowed, true);
    await db.exec("update submission_rate_limits set window_start=now()-interval '25 hours'; select cleanup_submission_rate();");
    assert.equal((await db.query('select * from submission_rate_limits')).rows.length, 0);
    await db.exec("set role anon;");
    await assert.rejects(db.query('select * from campaign_submissions'));
    await assert.rejects(db.query('select consume_submission_rate($1)', ['a'.repeat(64)]));
    await db.exec('reset role;');
    const insert = "insert into campaign_submissions(request_id,reference_number,submission_type,full_name,phone,location,consent,consent_version) values ('11111111-1111-4111-8111-111111111111','ALZ-TEST-UNIQUE','inquiry','Pengguna Ujian','+60123456789','Ujian',true,'2026-09-20')";
    await db.exec(insert); await assert.rejects(db.exec(insert));
  } finally { await db.close(); }
});
