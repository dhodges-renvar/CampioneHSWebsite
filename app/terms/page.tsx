import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Crumbs from '@/components/Crumbs';
import JsonLd from '@/components/JsonLd';
import { SITE } from '@/lib/site';
import { graph, breadcrumbs, webPage } from '@/lib/schema';

export const metadata: Metadata = {
  title: `Terms of Use | ${SITE.name}`,
  description: `The terms that apply to using the ${SITE.name} website, including what an estimate request is and is not.`,
  alternates: { canonical: '/terms' },
};

const UPDATED = 'October 22, 2026';

export default function TermsPage() {
  return (
    <>
      <Hero
        imageKey="terms"
        kicker="Legal"
        title="Terms of Use"
        lead="What applies when you use this website. The work itself is governed by the written proposal you sign, not by this page."
        align="center"
      />

      <Crumbs items={[{ label: 'Terms of Use' }]} />

      <section className="section">
        <div className="wrap wrap--narrow stack-lg">
          <p className="muted">Last updated {UPDATED}</p>

          <div className="stack">
            <h2>The important one first</h2>
            <p>
              Nothing on this website is a contract or a binding quote. Prices, scopes and
              timelines become real only in a written proposal signed by both sides. If this page
              and your signed proposal ever disagree, the proposal wins.
            </p>
          </div>

          <div className="stack">
            <h2>Estimate requests</h2>
            <p>
              Submitting the form asks us to contact you. It does not create a contract, reserve
              a place on the schedule, or oblige either of us to anything. We may decline work, and
              you may decline a proposal, for any reason.
            </p>
            <p>
              By sending the form you confirm the contact details are yours, or that you have
              permission to give them, and you agree we may contact you about your request by
              phone, text or email. You can tell us to stop at any time.
            </p>
          </div>

          <div className="stack">
            <h2>Accuracy of what you read here</h2>
            <p>
              We keep the service descriptions, coverage areas and process pages accurate, but
              they describe how we usually work, not a guarantee for every job. Which materials,
              preparation and sequence a specific property needs is decided on site and written
              into the proposal. Photographs on this site are illustrative and do not depict a
              specific completed project unless the page says so.
            </p>
          </div>

          <div className="stack">
            <h2>Licensing</h2>
            <p>
              Work is performed by {SITE.legal} and its divisions. Where a trade or a project
              requires a licensed contractor under {SITE.stateFull} law, that work is performed
              under the appropriate license. Ask us and we will tell you exactly who holds the
              license on your job before you sign anything.
            </p>
          </div>

          <div className="stack">
            <h2>Using the site</h2>
            <p>
              Please do not attempt to break, overload or gain unauthorised access to this site or
              the systems behind it, submit the form with information that is not yours, or use
              anything here to send unsolicited marketing. The text, photographs and design on this
              site belong to {SITE.legal}; you are welcome to link to any page.
            </p>
          </div>

          <div className="stack">
            <h2>Other sites</h2>
            <p>
              Where we link somewhere else — a manufacturer&rsquo;s specification, a licensing
              board, a review profile — we do not control that site and are not responsible for
              it.
            </p>
          </div>

          <div className="stack">
            <h2>Liability</h2>
            <p>
              This website is provided as it is. We are not liable for loss arising from relying on
              general information here rather than on a written proposal or a direct conversation.
              Nothing in this paragraph limits any liability that cannot be limited under
              {' '}
              {SITE.stateFull} law, including liability for the work we actually perform, which is
              governed by your proposal and by law.
            </p>
          </div>

          <div className="stack">
            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of the State of {SITE.stateFull}, and disputes
              about this website belong in the courts of {SITE.county}, {SITE.stateFull}.
            </p>
          </div>

          <div className="stack">
            <h2>Contact</h2>
            <p>
              {SITE.legal}, {SITE.street}, {SITE.city}, {SITE.state} {SITE.zip}.{' '}
              <a href={SITE.phoneHref}>{SITE.phone}</a> ·{' '}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </div>

          <div className="stack">
            <p className="muted">
              These terms are written in plain language to describe how we operate. They are not
              legal advice and have not been reviewed by an attorney. See also our{' '}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>

      <JsonLd
        data={graph([
          webPage({
            path: '/terms',
            name: `Terms of Use | ${SITE.name}`,
            description: `The terms that apply to using the ${SITE.name} website.`,
          }),
          breadcrumbs([{ name: 'Terms of Use', path: '/terms' }]),
        ])}
      />
    </>
  );
}
