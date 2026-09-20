import { z } from 'zod';
import { categories } from '@/data/site';

const text = (min: number, max: number) => z.string().trim().min(min, `Sila masukkan sekurang-kurangnya ${min} aksara.`).max(max, `Maksimum ${max} aksara.`).refine(v => !/[<>\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(v), 'Teks mengandungi aksara yang tidak dibenarkan.');
const common = {
  full_name: text(2, 120),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{8,22}$/, 'Sila masukkan nombor telefon yang sah.').transform(v => v.replace(/[ ()-]/g, '')).refine(v => /^\+?\d{8,15}$/.test(v), 'Sila semak nombor telefon.'),
  email: z.union([z.literal(''), z.email('E-mel tidak sah.').max(254)]),
  location: text(2, 180),
  pdm: text(0, 120),
  message: text(0, 3000),
  consent: z.literal(true, { error: 'Persetujuan diperlukan untuk menghantar borang.' }),
};
export const submissionSchema = z.discriminatedUnion('submission_type', [
  z.object({ ...common, submission_type: z.literal('inquiry'), subject: text(3, 160), message: text(10, 3000) }).strict(),
  z.object({ ...common, submission_type: z.literal('issue'), issue_title: text(3, 160), category: z.enum(categories), issue_location: text(3, 300), description: text(20, 4000), follow_up: z.boolean() }).strict(),
  z.object({ ...common, submission_type: z.literal('invitation'), organization: text(2, 180), officer: text(2, 120), event_datetime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Pilih tarikh dan masa.').refine(v => Number.isFinite(Date.parse(v + ':00+08:00')) && Date.parse(v + ':00+08:00') > Date.now(), 'Tarikh program mestilah pada masa hadapan (waktu Malaysia).'), venue: text(3, 300), event_type: text(2, 150), attendance: z.coerce.number().int().min(1).max(100000) }).strict(),
]);
export const envelopeSchema = z.object({
  data: submissionSchema,
  token: z.string().min(1).max(2048),
  website: z.string().max(200),
  request_id: z.uuid(),
}).strict();
export type Submission = z.infer<typeof submissionSchema>;
export type SubmissionType = Submission['submission_type'];
