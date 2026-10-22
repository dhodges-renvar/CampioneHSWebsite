import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { SITE } from '@/lib/site';
import { rateLimit, LEAD_PER_IP, LEAD_GLOBAL } from '@/lib/ratelimit';

/** Biggest body we will even parse. A real lead is a couple of kB. */
const MAX_BODY = 32 * 1024;

/** Values go into a notification email as HTML, so they get escaped first. */
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : '&#39;'
  );

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Payload = Record<string, string | undefined>;

const FIELDS = [
  'first_name',
  'last_name',
  'phone',
  'email',
  'address',
  'city',
  'zip',
  'division',
  'service',
  'message',
  'business_type',
  'page',
] as const;

const clean = (v: unknown, max = 2000) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

async function toSupabase(body: Payload) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: false, reason: 'not_configured' as const };

  const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/intake_web_lead`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ p: body }),
    cache: 'no-store',
  });

  if (!res.ok) {
    return { ok: false, reason: 'rejected' as const, detail: await res.text() };
  }
  return { ok: true as const };
}

async function toEmail(body: Payload) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  const from = process.env.LEAD_NOTIFY_FROM;
  if (!key || !to || !from) return { ok: false, reason: 'not_configured' as const };

  const rows = FIELDS.filter((f) => body[f])
    .map(
      (f) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#7a828a">${esc(f)}</td><td><b>${esc(
          body[f] as string
        )}</b></td></tr>`
    )
    .join('');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from,
      to: to.split(',').map((s) => s.trim()),
      subject: `New website lead — ${esc(body.first_name || 'unknown')} (${esc(
        body.division || 'general'
      )})`,
      html: `<h2 style="font-family:system-ui">New lead from ${SITE.url}</h2>
<p style="font-family:system-ui">Call them back today. Speed to lead is the whole game.</p>
<table style="font-family:system-ui;font-size:14px;border-collapse:collapse">${rows}</table>`,
    }),
    cache: 'no-store',
  });

  if (!res.ok) return { ok: false, reason: 'rejected' as const, detail: await res.text() };
  return { ok: true as const };
}

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  // Cheapest checks first: refuse before parsing anything or touching a service.
  const perIp = rateLimit(`lead:${ip}`, LEAD_PER_IP);
  const global = rateLimit('lead:all', LEAD_GLOBAL);
  if (!perIp.ok || !global.ok) {
    const retryAfter = Math.max(perIp.retryAfter, global.retryAfter);
    return NextResponse.json(
      {
        ok: false,
        error: `That is more requests than we can take right now. Please call or text ${SITE.phone}.`,
      },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  // Cap the body before JSON.parse sees it — field length limits below only
  // apply after parsing, which is too late to matter for a 10 MB payload.
  const declared = Number(req.headers.get('content-length') || 0);
  if (declared > MAX_BODY) {
    return NextResponse.json({ ok: false, error: 'Request too large.' }, { status: 413 });
  }

  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY) {
      return NextResponse.json({ ok: false, error: 'Request too large.' }, { status: 413 });
    }
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request.' }, { status: 400 });
  }

  const input = (raw ?? {}) as Record<string, unknown>;

  // --- spam traps -----------------------------------------------------------
  // 1. a hidden field no human ever fills in
  if (clean(input.company_website)) {
    return NextResponse.json({ ok: true, trapped: true });
  }
  // 2. nobody completes a real estimate request in under three seconds
  const started = Number(input.t0);
  if (Number.isFinite(started) && Date.now() - started < 2500) {
    return NextResponse.json({ ok: true, trapped: true });
  }

  const body: Payload = {};
  for (const f of FIELDS) body[f] = clean(input[f], f === 'message' ? 4000 : 200);

  // --- validation -----------------------------------------------------------
  if (!body.first_name) {
    return NextResponse.json({ ok: false, error: 'Please tell us your name.' }, { status: 422 });
  }
  const digits = (body.phone || '').replace(/\D/g, '');
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.email || '');
  if (digits.length < 10 && !emailOk) {
    return NextResponse.json(
      { ok: false, error: 'We need a phone number or an email address to reach you.' },
      { status: 422 }
    );
  }

  // The raw address is never stored — only a hash, which is enough to spot a
  // repeat submitter without keeping personal data we have no use for.
  body.ip_hash =
    ip && ip !== 'unknown' ? createHash('sha256').update(ip).digest('hex').slice(0, 32) : '';
  body.user_agent = clean(req.headers.get('user-agent'), 300);

  const [db, mail] = await Promise.all([toSupabase(body), toEmail(body)]);

  if (!db.ok && !mail.ok) {
    console.error('[lead] not delivered', { db, mail, name: body.first_name });
    return NextResponse.json(
      {
        ok: false,
        error: `Something went wrong on our end and we do not want to lose your request. Please call or text ${SITE.phone}.`,
      },
      { status: 502 }
    );
  }

  if (!db.ok) console.error('[lead] stored by email only', db);
  if (!mail.ok && mail.reason === 'rejected') console.error('[lead] email failed', mail);

  return NextResponse.json({ ok: true });
}
