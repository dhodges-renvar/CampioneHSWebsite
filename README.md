# Campione Home Services — website

Next.js 14 (App Router) + TypeScript. No CSS framework, no component library,
no runtime dependencies beyond React. Every page is statically generated.
First-load JavaScript is ~101 kB; the only client components are the header
menu and the lead form. Hero photographs go through `next/image`, so each one
is preloaded at high priority and served as AVIF or WebP at the width the
device actually needs.

---

## 1. Deploy to Vercel (10 minutes)

1. Push this folder to a GitHub repo, or drag it into **vercel.com/new**.
2. Vercel detects Next.js — leave every build setting on its default.
3. Click **Deploy**. You will get a `*.vercel.app` URL in about 90 seconds.
4. **Settings → Domains →** add `campionehomeservices.com` and
   `www.campionehomeservices.com`. Vercel shows the exact DNS records.
5. In GoDaddy, set those records:
   - `A` record, host `@`, value `76.76.21.21`
   - `CNAME` record, host `www`, value `cname.vercel-dns.com`
   Delete any existing `@` or `www` records pointing elsewhere first.
   Propagation is usually minutes, occasionally a few hours.
6. Set `www` to redirect to the apex (or the reverse — just pick one and be
   consistent, because split indexing costs rankings).

Local development, if you want it:

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build, run this before every deploy
```

---

## 2. Wire up the contact form

Until this is done the form shows an honest error telling people to call. It
will not silently swallow a lead.

**Step one — the database.** In the Supabase SQL editor, run these in order:

1. `supabase/campione_website_leads_step1.sql` — adds `drywall` to the
   division enum. Run it **alone** and let it finish; Postgres will not let a
   new enum value be added and used in the same transaction.
2. `supabase/campione_website_leads.sql` — the intake function, raw-capture
   table and the `v_web_leads` view.

**Step two — the environment variables.** Copy `.env.example` into
Vercel → Settings → Environment Variables. The two that matter are
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Redeploy after saving.

**Step three — the email alert.** Optional but strongly recommended. Set the
three `RESEND_*` / `LEAD_NOTIFY_*` variables and every submission also fires
an email the moment it lands. Leads that sit until Monday do not close.

**What happens on submit:** the form posts to `/api/lead`, which writes the
raw payload to `web_submissions`, finds or creates the contact, creates the
property if an address was given, and files a real row in `leads` with
`source_code = 'website'`. It appears on Jorge's Today page within seconds.

Check it with:

```sql
select * from v_web_leads limit 20;
```

---

## 3. Photographs

Images appear in hero sections and nowhere else, by design.

**Seven heroes carry a photograph today:** the homepage and all six division
pages. **These seven are AI-generated.** They are atmosphere — a room, an eave,
a driveway, a framed shell — chosen so each page has a real image behind the
headline at launch. None of them contains a person, a logo, lettering, or
anything presented as Campione's own work, and that is deliberate: a generated
photo of a crew would be a claim a customer can check. Treat them as temporary
and **do not upload any of them to the Google Business Profile**, which is
meant to show the actual business.

The four company pages — services, about, service area, contact — still render
the built field: ink, a raked wash in the division colour, and fine grain. It
looks finished on its own, and nobody judges a contractor's drywall from a
photograph of a country road.

**Replacement order as real CompanyCam photography accumulates:** painting
first (the only division with Local Services Ads behind it, so the most
expensive traffic), then the homepage, then exteriors — the rot-repair
argument on that page needs real proof. Pressure washing is the cheapest win:
a driveway stopped half-done is a ten-second phone photo. Drywall and
construction management matter most for credibility but are the hardest to
shoot; wait for the right job rather than rushing them.

One standing instruction to the crews does most of the work: **before you pack
up, take one wide shot of the finished room or elevation with nobody in it,
from the doorway or the street.** Wide, empty, finished. That is the hero shot.

To swap one in:

1. Drop the file in `public/img/hero/`, named after the page key, e.g.
   `painting.jpg`. Crop to 16:9. Anything from **1600 px wide** up is plenty,
   and there is no need to compress it by hand — Next generates the smaller
   sizes and serves AVIF or WebP. (The 1672 px heroes in there now come down
   as ~58 KB of AVIF on desktop, ~15 KB on a phone.)
2. Open `lib/heroes.ts` and set the `src`. One line per hero.
3. Delete the generated file it replaced, so it cannot come back in a later
   deploy.

Two settings per hero, both in `lib/heroes.ts`:

- **`focus`** sets `object-position`. It keeps the subject out from behind the
  headline — `'right center'` is right for these left-aligned heroes.
- **`dim`** scales the dark scrim that guarantees the headline stays readable.
  `1` is the default; drop toward `0.7` for an already-dark photograph so more
  of it shows, push past `1` for a bright one. The values in the file were set
  from each photo's measured brightness behind the headline, then checked by
  screenshotting every hero and measuring the rendered contrast. Every one
  clears WCAG AA. If you drop in a bright photo and the headline starts to
  swim, raise its `dim` — that is the only knob you need.

A photo that is slow or fails to load leaves the built field showing
underneath, so a hero never renders as a blank box.

---

## 4. Where to change things

| What | File |
| --- | --- |
| Phone, address, hours, founding year, rating | `lib/site.ts` |
| Everything on a division page — copy, services, FAQs, meta | `lib/divisions.ts` |
| Division colours and their accessible text variants | `lib/divisions.ts` |
| Homepage FAQ | `lib/faqs.ts` |
| Cities and the notes beside them | `lib/areas.ts` |
| Hero photographs, and how dark each one's scrim runs | `lib/heroes.ts` |
| Design tokens — colour, type scale, spacing | `app/globals.css` (`:root`) |
| Structured data | `lib/schema.ts` |

Adding a seventh division is one object in `DIVISIONS` plus its slug in
`DECK_ORDER`. The page, the nav, the footer, the sitemap, the schema markup
and `llms.txt` all pick it up with no further edits.

> One thing to know: the Google Business Profile link in `lib/site.ts`
> (`gbpUrl`) is intentionally blank. While it is empty the 5.0 rating renders
> as plain text and is left out of the schema markup — we do not claim a
> rating we cannot point at. Paste the GBP share link in once the profile is
> live and the schema picks it up.

---

## 5. SEO and AI optimisation — what is already in place

- **Per-page metadata** with unique titles and descriptions written for the
  query, not stuffed. Canonical URLs on every page.
- **JSON-LD `@graph`** with a single canonical `LocalBusiness` node that every
  other node references by `@id` — so Google, Bing and the answer engines
  resolve all seven pages back to one business rather than inferring six.
- `Service` nodes per division with a full offer catalogue, `FAQPage` on the
  homepage and all six division pages, `BreadcrumbList`, `WebSite`, `WebPage`.
- **`/sitemap.xml`** and **`/robots.txt`**, both generated from the same data
  as the pages.
- **`/llms.txt`** — a plain-text brief for answer engines, generated from the
  same source files so it can never drift from the site. When somebody asks an
  assistant "who does Level 5 drywall near Monroe GA", this is what it reads.
- **Every AI crawler explicitly allowed** in robots: GPTBot, OAI-SearchBot,
  ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended and others. For
  a local contractor that is free distribution.
- **FAQ answers are in the HTML on first paint** — rendered as native
  `<details>`, so crawlers read the text whether or not anything is clicked.
- **Dynamic Open Graph image** at `/opengraph-image` so links shared by text
  or email render as a proper card.
- Semantic headings, one `h1` per page, real landmarks, skip link, breadcrumbs.
- Self-hosted variable font — no third-party request, no render-blocking round
  trip, no consent banner implication.

**Still to do after launch (in order of value):**

1. Google Search Console — verify the domain, submit the sitemap.
2. Google Business Profile — link the website, and point the LSA landing page
   at `/painting` rather than the homepage.
3. Bing Webmaster Tools — two minutes, and it feeds ChatGPT search.
4. Add the GBP link to `lib/site.ts`.
5. Real photography. The seven heroes in place now are generated stand-ins and
   this is still the single biggest remaining lever on conversion — see
   section 3 for the order to replace them in.

---

## 6. Launch checklist

Worked against a 20-point pre-launch list. Most of that list assumes an app
with accounts, payments and an AI provider. This is a marketing site with one
public write path — the estimate form — so a good many points do not apply.
What follows is the honest verdict on each, and it is worth knowing which is
which: an item marked N/A is not an item quietly skipped.

### Done in code

| # | Item | What was done |
| --- | --- | --- |
| 1 | Hide every API key | No key is in client code. The Supabase service-role key and the Resend key are read server-side in `app/api/lead/route.ts` only. Nothing is prefixed `NEXT_PUBLIC_`. `.gitignore` excludes `.env*.local`; `.env.example` holds placeholders, never values. |
| 3 | Rate limiting | `lib/ratelimit.ts`. Five submissions per IP per ten minutes, sixty site-wide per hour, returning 429 with `Retry-After`. Checked **before** the body is parsed or any service is called, so a flood costs nothing. See the caveat below. |
| 4 | Auth on every route | There is one route — `POST /api/lead` — and it is deliberately public. The Postgres function behind it is `security definer` with `execute` revoked from `public`, `anon` and `authenticated`, so it can only be called with the service-role key from the server. The browser never talks to Supabase. |
| 5 | Database rules | RLS is on for `web_submissions`, with office roles only. The website never reads from the database at all; it only calls the one intake function. |
| 6 | Validate every input on the server | Field allowlist — anything not in `FIELDS` is dropped. Per-field length caps. 32 KB body cap enforced before `JSON.parse`. Name required, and a valid phone or email required. Values are HTML-escaped before going into the notification email, so a message body cannot inject markup into Jorge's inbox. |
| 8 | No stack traces | Every failure path returns a plain sentence and a phone number. Details go to `console.error` for the Vercel log, never to the response. Verified across malformed JSON, oversized bodies, validation failures and delivery failures. |
| 11 | 404 and 500 that don't look broken | `app/not-found.tsx` was already there. Added `app/error.tsx` (route errors — keeps the brand, offers retry and the phone number) and `app/global-error.tsx` (a failure in the root layout itself — fully inline, depends on no stylesheet or component that might be the thing that broke). |
| 14 | Meta tags and OG image | Already in place: per-page titles and descriptions, canonicals, and a dynamic OG card at `/opengraph-image` — now carrying the Campione mark. |
| 15 | Privacy policy and terms | `/privacy` and `/terms`, linked in the footer and from the form. The privacy page describes what this site actually does — the real field list, the three processors, the hashed IP — rather than boilerplate. Google Ads and LSA both want a privacy policy on the landing site, so this was blocking anyway. |
| 16 | Analytics | `@vercel/analytics` in the root layout. Cookieless and aggregate, so no consent banner and the privacy page stays true. **Switch Web Analytics on in the Vercel project or it stays inert.** |
| 19 | A way to contact you | Form, phone and email on every page, plus the sticky call bar on mobile. |

### Checked, already fine

| # | Item | Finding |
| --- | --- | --- |
| 2 | Rotate committed keys | Nothing was ever committed. The repo has only `.env.example`. If a real key ever does land in a commit, rotate it in Supabase or Resend — rewriting git history is not enough, because the old value is already out. |
| 12 | Cheap Android phone | 360 px wide renders correctly. No layout shift, tap targets at least 44 px, no horizontal scroll. Hero photos come down as AVIF at the device width — roughly 15 KB on a phone rather than 290 KB. |
| 13 | Nothing over 3 seconds | A division page is **212 KB total, LCP ~0.7 s** locally. Every page is statically generated and served from the edge. The font is self-hosted, so there is no third-party round trip on first paint. |

### Not applicable to this site

| # | Item | Why |
| --- | --- | --- |
| 7 | AI provider spending cap | There is no AI provider. The nearest equivalent is the Vercel spend limit and the Resend plan ceiling — see below. |
| 17 | Test signup, payment, password reset | None of these exist. No accounts, no checkout. The one flow to test is the estimate form, and it is covered below. |

### Needs you, not code

| # | Item | What to do |
| --- | --- | --- |
| 9 | Error tracking | Vercel logs every `console.error`, but nothing alerts you. Turn on **Log Drains** or set a Vercel monitor on 5xx responses from `/api/lead`. A form that silently fails is a business losing leads without knowing. |
| 10 | Back up and test a restore | Supabase takes daily backups on paid plans. Taking one is not the point — **restoring one into a scratch project is**, and an untested backup is a rumour. Note this database is shared with the field app, so a restore affects both. |
| 18 | Email deliverability | In Resend, verify `campionehomeservices.com` and publish the SPF, DKIM and DMARC records it gives you. Lead alerts going to spam is the single most expensive thing on this list. Send a test to a Gmail and a Microsoft 365 address and confirm both land in the inbox. |
| — | Spend caps | Vercel → Settings → Billing → spend limit. Resend has a monthly send ceiling on the free tier. Both are worth setting before the ads start. |
| — | Vercel Firewall | Project → Firewall → rate limiting on `/api/lead`. See the caveat below. |

### The rate limiting caveat, stated plainly

The limiter in `lib/ratelimit.ts` keeps its counters in memory, and on serverless
each instance has its own. One machine hammering the endpoint gets stopped. A
burst spread across many cold starts gets further than the numbers suggest.
That is a real limitation, not a detail — the durable fix is Vercel's firewall,
which runs at the edge before any function starts. Turn it on. The code-level
limiter is the belt; the firewall is the braces.

### Dependency advisories

`npm audit` reports two postcss issues that can only be resolved by moving to
Next 16. Both concern processing attacker-controlled CSS at build time. This
site compiles one stylesheet, written by us, in CI. They are not reachable at
runtime and the upgrade is not worth the churn before launch.

The site was moved from Next 14.2.35 to **15.5.28** during this pass, because
14.x carries an unpatched critical advisory (`CVE-2026-96889`, RCE via
untrusted SVG through sharp) and a high-severity Server Actions DoS, and there
is no 14.x backport. Neither was reachable here — the site uses no Server
Actions, and the image optimizer accepts only local files because
`remotePatterns` is unset — but "not currently exploitable" is a weaker
position than "patched". React went to 19 with it. The only code changes
required were awaiting `params` in `app/[slug]/page.tsx` and one type import
in `components/Icons.tsx`.

### Rollback plan

Vercel keeps every previous deployment, so rolling back is seconds, not a
rebuild:

1. **Vercel → Deployments**, find the last good one, **⋯ → Promote to
   Production**. Live in about ten seconds. Do this first and debug afterwards —
   a broken site during an ad spend is expensive by the minute.
2. **If the form is the problem but pages are fine**, leave the deploy up and
   pull `SUPABASE_SERVICE_ROLE_KEY` from the environment. The form then shows
   its honest "call us" error with the phone number instead of failing silently.
   Leads keep arriving by phone while you fix it.
3. **If a bad lead row reaches the database**, nothing on the website reads from
   the database, so there is no public impact. Delete the row in Supabase.
4. **If the domain itself is wrong** (DNS, certificate), the `*.vercel.app` URL
   keeps working throughout. Point the Google Business Profile and any ads at
   that temporarily rather than leaving a dead link in a paid ad.

Before promoting any deploy to production, load the homepage, one division
page, and submit the form with a real phone number. That is a ninety-second
check that catches almost everything that matters.
