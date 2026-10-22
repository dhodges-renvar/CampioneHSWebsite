/* ============================================================================
   RATE LIMITING
   ----------------------------------------------------------------------------
   The lead endpoint is the only public write path on this site, and every hit
   costs money twice: a row in Supabase and an email through Resend. Without a
   limit, one script can fill Jorge's inbox and the bill in an afternoon.

   This is an in-process sliding window. Be honest about what that means on
   serverless: each Vercel instance keeps its own counters, so a burst spread
   across many cold starts gets more through than the numbers below suggest.
   It stops the common case — one machine hammering one endpoint — and it costs
   nothing. The durable layer is Vercel's own firewall (Project → Firewall →
   Rate limiting), which runs at the edge before any function starts. Turn that
   on too; this is the belt, that is the braces.

   Two windows on purpose:
     perIp    stops one source from flooding
     global   caps total damage when the source is a botnet, because the bill
              is what actually hurts
   A real contractor site sees a handful of leads a day, so these ceilings are
   far above honest use and still well under anything expensive.
   ========================================================================== */

type Hit = { count: number; reset: number };

const buckets = new Map<string, Hit>();
let lastSweep = Date.now();

/** Drop expired entries so a long-lived instance cannot grow without bound. */
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, v] of buckets) if (v.reset <= now) buckets.delete(k);
}

export type Limit = { limit: number; windowMs: number };

export const LEAD_PER_IP: Limit = { limit: 5, windowMs: 10 * 60_000 };
export const LEAD_GLOBAL: Limit = { limit: 60, windowMs: 60 * 60_000 };

export function rateLimit(key: string, { limit, windowMs }: Limit) {
  const now = Date.now();
  sweep(now);

  const hit = buckets.get(key);
  if (!hit || hit.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  hit.count += 1;
  if (hit.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((hit.reset - now) / 1000) };
  }
  return { ok: true, remaining: limit - hit.count, retryAfter: 0 };
}
