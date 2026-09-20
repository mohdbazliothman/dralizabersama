import test from 'node:test';
import assert from 'node:assert/strict';
import { submissionSchema } from '../../lib/validation';
const base = { full_name: 'Pengguna Ujian', phone: '+60 12-345 6789', email: '', location: 'Lokasi ujian', pdm: '', message: 'Mesej ujian sahaja.', consent: true };
test('normalizes phone and trims text, accepts optional email', () => {
  const data = submissionSchema.parse({ ...base, full_name: '  Pengguna Ujian  ', submission_type: 'inquiry', subject: 'Pertanyaan ujian' });
  assert.equal(data.phone, '+60123456789'); assert.equal(data.full_name, 'Pengguna Ujian');
});
test('rejects invalid phone, missing consent, markup, overlength and extra fields', () => {
  const valid = { ...base, submission_type: 'inquiry', subject: 'Pertanyaan ujian' };
  for (const patch of [{ phone: '---    --' }, { consent: false }, { full_name: '<script>bad</script>' }, { message: 'x'.repeat(3001) }, { identity_number: 'not-permitted' }, { email: 'not-an-email' }]) assert.equal(submissionSchema.safeParse({ ...valid, ...patch }).success, false);
});
test('issue requires category, location and detailed description', () => {
  const valid = { ...base, submission_type: 'issue', issue_title: 'Jalan ujian', category: 'Jalan', issue_location: 'Lokasi ujian', description: 'Penerangan isu ujian automatik sahaja.', follow_up: false };
  assert.equal(submissionSchema.safeParse(valid).success, true);
  assert.equal(submissionSchema.safeParse({ ...valid, category: 'unsupported' }).success, false);
  assert.equal(submissionSchema.safeParse({ ...valid, description: 'pendek' }).success, false);
});
test('invitation rejects past dates and invalid attendance', () => {
  const valid = { ...base, submission_type: 'invitation', organization: 'Organisasi ujian', officer: 'Pegawai ujian', event_datetime: '2030-01-01T10:00', venue: 'Lokasi ujian', event_type: 'Program ujian', attendance: '25' };
  assert.equal(submissionSchema.safeParse(valid).success, true);
  assert.equal(submissionSchema.safeParse({ ...valid, event_datetime: '2020-01-01T10:00' }).success, false);
  assert.equal(submissionSchema.safeParse({ ...valid, attendance: '-1' }).success, false);
});
