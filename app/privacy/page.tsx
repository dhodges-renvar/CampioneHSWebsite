import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Crumbs from '@/components/Crumbs';
import JsonLd from '@/components/JsonLd';
import { SITE } from '@/lib/site';
import { graph, breadcrumbs, webPage } from '@/lib/schema';

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE.name}`,
  description: `How ${SITE.name} handles the information you send through this website — what is collected, where it goes, how long it is kept, and how to have it deleted.`,
  alternates: { canonical: '/privacy' },
};

const UPDATED = 'October 22, 2026';

export default function PrivacyPage() {
  return (
    <>
      <Hero
        imageKey="privacy"
        kicker="Legal"
        title="Privacy Policy"
        lead="What this site collects, where it goes, and how to get it removed. Written to describe what actually happens, not to cover every eventuality in language nobody reads."
        align="center"
      />

      <Crumbs items={[{ label: 'Privacy Policy' }]} />

      <section className="section">
        <div className="wrap wrap--narrow stack-lg">
          <p className="muted">Last updated {UPDATED}</p>

          <div className="stack">
            <h2>The short version</h2>
            <p>
              The only information this website collects is what you type into the estimate form,
              plus basic technical information every web server receives. We use it to quote your
              job and contact you about it. We do not sell it, rent it, or share it with anyone who
              is not helping us run the business. If you want it deleted, ask and we will delete it.
            </p>
          </div>

          <div className="stack">
            <h2>Who we are</h2>
            <p>
              {SITE.legal}, {SITE.street}, {SITE.city}, {SITE.state} {SITE.zip}. You can reach us
              at{' '}
              <a href={SITE.phoneHref}>{SITE.phone}</a> or{' '}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </p>
          </div>

          <div className="stack">
            <h2>What we collect</h2>
            <p>
              <b>What you give us.</b> When you submit the estimate form we receive your name,
              phone number, email address, the property address, city and ZIP, which division and
              service you are asking about, whether you are a homeowner or a trade customer, and
              anything you write in the message field.
            </p>
            <p>
              <b>What arrives automatically.</b> Which page you submitted from, your browser&rsquo;s
              user-agent string, and a one-way hash of your IP address. We store the hash rather
              than the address itself — it lets us recognise repeat submissions from the same
              source without keeping information we have no use for.
            </p>
            <p>
              <b>What we do not collect.</b> This site has no accounts, no logins, and no payment
              processing. We never ask for a card number, a bank account or a Social Security
              number through this website, and you should treat any message claiming otherwise as
              fraudulent.
            </p>
          </div>

          <div className="stack">
            <h2>Cookies and tracking</h2>
            <p>
              This site sets no advertising or tracking cookies. Page-view measurement is
              aggregate and cookieless, which means we can see that a page was viewed but cannot
              follow an individual person across the internet. There are no third-party
              advertising pixels on the site at the time of writing. If that changes — for example
              if we add conversion tracking for Google Ads — this page will be updated before it
              goes live.
            </p>
          </div>

          <div className="stack">
            <h2>Where it goes</h2>
            <p>
              Form submissions are stored in our customer database, hosted by Supabase on servers
              in the United States, and a copy is emailed to our office through Resend so somebody
              sees it the same day. The website itself is hosted by Vercel. These three companies
              process the information on our behalf and under contract; they are not permitted to
              use it for their own purposes.
            </p>
            <p>
              We do not sell personal information, and we do not share it with anyone else except
              where we are legally required to, or where a subcontractor needs the property address
              to do work you have hired us for.
            </p>
          </div>

          <div className="stack">
            <h2>How long we keep it</h2>
            <p>
              Estimate requests stay in our records for as long as we might reasonably need them —
              to honour a quote, to handle a warranty question, or to meet record-keeping
              obligations. In practice that means several years for work we performed, and a
              shorter period for enquiries that never became jobs. When you ask us to delete your
              information we will, except where we are required to keep a record of a completed
              transaction.
            </p>
          </div>

          <div className="stack">
            <h2>Your choices</h2>
            <p>
              Ask us for a copy of what we hold about you, ask us to correct it, or ask us to
              delete it. Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call{' '}
              <a href={SITE.phoneHref}>{SITE.phone}</a> and we will handle it. You do not need to
              give a reason, and asking will never affect how we treat you as a customer.
            </p>
            <p>
              If you have asked us to stop contacting you, we will stop. Reply STOP to any text
              message, or tell us on the phone.
            </p>
          </div>

          <div className="stack">
            <h2>Children</h2>
            <p>
              This site is intended for adults arranging work on a property. We do not knowingly
              collect information from children.
            </p>
          </div>

          <div className="stack">
            <h2>Changes</h2>
            <p>
              If we change how any of this works, we will change this page and update the date at
              the top. Material changes to how we use information already collected will not be
              applied retroactively without telling you.
            </p>
          </div>

          <div className="stack">
            <p className="muted">
              This page describes our actual practice in plain language. It is not legal advice,
              and it is not a substitute for a policy reviewed by an attorney if your
              circumstances require one. See also our <Link href="/terms">Terms of Use</Link>.
            </p>
          </div>
        </div>
      </section>

      <JsonLd
        data={graph([
          webPage({
            path: '/privacy',
            name: `Privacy Policy | ${SITE.name}`,
            description: `How ${SITE.name} handles information submitted through this website.`,
          }),
          breadcrumbs([{ name: 'Privacy Policy', path: '/privacy' }]),
        ])}
      />
    </>
  );
}
