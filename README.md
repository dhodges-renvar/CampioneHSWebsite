# Campione Home Services — website

Next.js 14 (App Router) + TypeScript. No CSS framework, no component library,
no runtime dependencies beyond React. Every page is statically generated.
First-load JavaScript is ~96 kB; the only client component is the header menu
and the lead form.

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

## 3. Adding photographs

Background images appear in hero sections and nowhere else, by design. Until
real job photography exists, every hero renders a built field — ink, a raked
wash in that division's colour, and fine grain. It is designed to look
finished on its own, so the site can launch today.

To add a photo:

1. Drop the file in `public/img/hero/` — name it after the page key, e.g.
   `painting.jpg`.
2. Crop to **2400 × 1350** (16:9), export JPG at quality 72–78, aim for under
   350 KB. Darker frames work best; the text scrim is tuned for a dark left
   third.
3. Open `lib/heroes.ts` and set the `src`. One line per hero.

`focus` controls `background-position` — use it to keep the subject out from
behind the headline. `'right center'` is usually right for the left-aligned
heroes.

**Shot list, in priority order:** a finished interior with real light; a
cabinet kitchen after refinishing; a two-storey exterior mid-repaint with
staging; a Level 5 wall under raking light; a driveway half washed; a crew on
site in branded shirts. Pull candidates from CompanyCam first.

---

## 4. Where to change things

| What | File |
| --- | --- |
| Phone, address, hours, founding year, rating | `lib/site.ts` |
| Everything on a division page — copy, services, FAQs, meta | `lib/divisions.ts` |
| Division colours and their accessible text variants | `lib/divisions.ts` |
| Homepage FAQ | `lib/faqs.ts` |
| Cities and the notes beside them | `lib/areas.ts` |
| Hero photographs | `lib/heroes.ts` |
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
5. Photography. This is the single biggest remaining lever on conversion.
