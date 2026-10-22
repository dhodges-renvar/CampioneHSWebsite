'use client';

/* Route-level error boundary. Without this, a thrown error in any page renders
   Next's default screen — which on a contractor's site reads as "this company
   is broken". This keeps the brand, keeps the phone number in front of the
   visitor, and gives them something to do. */

import { useEffect } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { IconPhone } from '@/components/Icons';
import DeckRule from '@/components/DeckRule';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Goes to the Vercel runtime log. The digest is what ties this to the
    // server-side stack trace, which is never shown to the visitor.
    console.error('[page error]', error.digest ?? '', error.message);
  }, [error]);

  return (
    <section className="hero hero--center">
      <div className="hero__field" />
      <div className="hero__rake" />
      <div className="hero__grain" />

      <div className="wrap">
        <div className="hero__inner">
          <p className="kicker kicker--on-dark">Something went wrong</p>
          <h1>This page did not load.</h1>
          <p className="hero__lead">
            That is on us, not on you. Try again — and if it keeps happening, call and we will
            take your details the old-fashioned way.
          </p>
          <div className="btn-row">
            <button className="btn btn--white" onClick={reset}>
              Try again
            </button>
            <a className="btn btn--ghost-light" href={SITE.phoneHref}>
              <IconPhone />
              {SITE.phone}
            </a>
            <Link className="btn btn--ghost-light" href="/">
              Back to the homepage
            </Link>
          </div>
        </div>
      </div>

      <div className="hero__rule">
        <DeckRule tall />
      </div>
    </section>
  );
}
