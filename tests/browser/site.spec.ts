import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

async function mockCaptcha(page: Page) {
  await page.route('https://challenges.cloudflare.com/**', route => route.fulfill({ contentType: 'application/javascript', body: `window.turnstile={render:(el,options)=>{el.textContent='Semakan keselamatan ujian';window.captchaCallback=options.callback;options.callback('test-token');return 'test-widget'},remove:()=>{},reset:()=>{window.captchaCallback?.('test-token')}};` }));
}
async function common(page: Page) {
  await page.getByLabel('Nama penuh', { exact: false }).fill('Pengguna Ujian Automatik');
  await page.getByLabel('Nombor telefon', { exact: false }).fill('+60123456789');
  await page.getByLabel('Kampung / taman / kawasan', { exact: false }).fill('Kawasan ujian');
  await page.getByRole('checkbox', { name: 'Saya bersetuju maklumat ini' }).check();
}

for (const width of [390, 768, 1440]) {
  test(`layout, assets and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/'); await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('ALIZA');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator('img').evaluateAll(images => (images as HTMLImageElement[]).every(i => i.complete && i.naturalWidth > 0))).toBe(true);
    const broken = await page.locator('img').evaluateAll(images => (images as HTMLImageElement[]).filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src));
    expect(broken).toEqual([]);
    const anchors = await page.locator('a[href^="#"]').evaluateAll(links => links.every(a => !!document.querySelector(a.getAttribute('href')!)));
    expect(anchors).toBe(true);
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(accessibility.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `../../work/site-${width}.png`, fullPage: true });
    await page.screenshot({ path: `../../work/hero-${width}.png` });
  });
}
test('mobile menu closes on navigation and Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  await page.getByRole('button', { name: 'Buka menu' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Kenali Dr Aliza' }).click();
  await expect(page.getByRole('button', { name: 'Buka menu' })).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Buka menu' }).click(); await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Buka menu' })).toBeFocused();
});
test('dialog focus, validation, keyboard and accessibility', async ({ page }) => {
  await mockCaptcha(page); await page.goto('/');
  const opener = page.getByRole('button', { name: /Pertanyaan.*Buka borang/ }); await opener.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Hantar maklumat' }).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Sila semak');
  await expect(page.getByLabel('Nama penuh', { exact: false })).toBeFocused();
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze(); expect(scan.violations.map(v => v.id)).toEqual([]);
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toHaveCount(0); await expect(opener).toBeFocused();
});
for (const mode of ['inquiry','issue','invitation'] as const) {
  test(`${mode}: success and reference (mock transport)`, async ({ page }) => {
    await mockCaptcha(page);
    await page.route('**/api/submissions', async route => {
      const json = route.request().postDataJSON();
      expect(json.data.submission_type).toBe(mode); expect(json.data.consent).toBe(true); expect(json.request_id).toMatch(/^[a-f0-9-]{36}$/);
      await route.fulfill({ status: 201, json: { reference: 'ALZ-TEST-123456789ABC' } });
    });
    await page.goto('/');
    await page.getByRole('button', { name: mode === 'inquiry' ? /Pertanyaan.*Buka borang/ : mode === 'issue' ? /Isu komuniti.*Buka borang/ : /Jemput Dr Aliza.*Buka borang/ }).click();
    await common(page);
    if (mode === 'inquiry') { await page.getByLabel('Tajuk pertanyaan').fill('Pertanyaan ujian'); await page.getByLabel('Mesej', { exact: false }).fill('Ini mesej ujian automatik sahaja.'); }
    if (mode === 'issue') { await page.getByLabel('Tajuk isu').fill('Isu jalan ujian'); await page.getByLabel('Kategori').selectOption('Jalan'); await page.getByLabel('Lokasi isu').fill('Lokasi ujian sahaja'); await page.getByLabel('Penerangan isu').fill('Penerangan untuk ujian automatik, bukan aduan sebenar.'); }
    if (mode === 'invitation') { await page.getByLabel('Nama organisasi').fill('Organisasi ujian'); await page.getByLabel('Nama pegawai urusan').fill('Pegawai ujian'); await page.getByLabel('Tarikh & masa').fill('2030-01-01T10:00'); await page.getByLabel('Lokasi program').fill('Lokasi ujian sahaja'); await page.getByLabel('Jenis program').fill('Program ujian'); await page.getByLabel('Anggaran kehadiran').fill('20'); }
    await page.getByRole('button', { name: 'Hantar maklumat' }).click();
    await expect(page.getByText('Maklumat telah diterima.')).toBeVisible(); await expect(page.getByText('ALZ-TEST-123456789ABC')).toBeVisible();
    expect(page.url()).not.toContain('Pengguna'); await page.getByRole('button', { name: 'Selesai', exact: true }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
}
test('loading, server error and retry retain values and request id', async ({ page }) => {
  await mockCaptcha(page); let requestId = ''; let count = 0;
  await page.route('**/api/submissions', async route => {
    count++; const id = route.request().postDataJSON().request_id;
    if (count === 1) { requestId = id; await new Promise(resolve => setTimeout(resolve, 700)); await route.fulfill({ status: 503, json: { message: 'Gangguan ujian. Cuba semula.' } }); }
    else { expect(id).toBe(requestId); await route.fulfill({ status: 201, json: { reference: 'ALZ-TEST-RETRY' } }); }
  });
  await page.goto('/'); await page.getByRole('button', { name: /Pertanyaan.*Buka borang/ }).click(); await common(page);
  await page.getByLabel('Tajuk pertanyaan').fill('Ujian ralat'); await page.getByLabel('Mesej', { exact: false }).fill('Maklumat ujian sahaja.');
  await page.getByRole('button', { name: 'Hantar maklumat' }).click(); await expect(page.getByRole('button', { name: 'Sedang menghantar' })).toBeDisabled();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Gangguan ujian'); await expect(page.getByLabel('Nama penuh', { exact: false })).toHaveValue('Pengguna Ujian Automatik');
  await page.getByRole('button', { name: 'Hantar maklumat' }).click(); await expect(page.getByText('ALZ-TEST-RETRY')).toBeVisible();
});
test('base content without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } }); const page = await context.newPage(); await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible(); await expect(page.getByRole('link', { name: /Lihat CV awam/ })).toHaveAttribute('href', '/documents/cv-dr-aliza-awam.pdf');
  await expect(page.getByRole('heading', { name: 'Mulakan perbualan.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buka Facebook' })).toBeVisible();
  await context.close();
});
test('API rejects cross-origin, malformed, oversize and honeypot requests', async ({ request }) => {
  expect((await request.post('/api/submissions', { headers: { Origin: 'https://untrusted.test' }, data: {} })).status()).toBe(403);
  expect((await request.post('/api/submissions', { headers: { Origin: 'http://localhost:3101' }, data: {} })).status()).toBe(400);
  expect((await request.post('/api/submissions', { headers: { Origin: 'http://localhost:3101' }, data: { content: 'a'.repeat(21000) } })).status()).toBe(413);
  expect((await request.get('/api/notifications/retry')).status()).toBe(401);
  const valid = { data: { submission_type: 'inquiry', full_name: 'Pengguna Ujian', phone: '+60123456789', email: '', location: 'Lokasi ujian', pdm: '', message: 'Mesej ujian sahaja.', subject: 'Pertanyaan ujian', consent: true }, token: 'test-token', website: 'spam-filled-field', request_id: '11111111-1111-4111-8111-111111111111' };
  expect((await request.post('/api/submissions', { headers: { Origin: 'http://localhost:3101' }, data: valid })).status()).toBe(400);
  expect((await request.post('/api/submissions', { headers: { Origin: 'http://localhost:3101' }, data: { ...valid, website: '' } })).status()).toBe(503);
});
