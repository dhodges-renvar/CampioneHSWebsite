'use client';

/* The last line of defence: an error in the root layout itself, where neither
   the header, the footer nor the stylesheet can be assumed to have loaded.
   Everything here is inline on purpose — this file cannot depend on anything
   that might be the thing that broke. */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '2rem',
          background: '#0e1114',
          color: '#fff',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <main style={{ maxWidth: '34rem', textAlign: 'center' }}>
          <svg width="52" height="52" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <path
              d="M83.25 66.22A36.99 36.99 0 1 1 69.05 18.29"
              stroke="#fff"
              strokeWidth="9.8"
            />
            <path
              d="M67.99 58.78A20.02 20.02 0 1 1 61.48 33.6"
              stroke="#2d6ca2"
              strokeWidth="8.5"
            />
          </svg>
          <h1 style={{ fontSize: '1.75rem', margin: '1.5rem 0 0.75rem', lineHeight: 1.15 }}>
            Campione Home Services
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: '0 0 1.75rem' }}>
            The site hit an error. Please call or text{' '}
            <a href="tel:+14043414382" style={{ color: '#fff', fontWeight: 700 }}>
              (404) 341-4382
            </a>{' '}
            and we will take your details directly.
          </p>
          <button
            onClick={reset}
            style={{
              font: 'inherit',
              fontWeight: 700,
              padding: '0.9rem 1.6rem',
              minHeight: 52,
              background: '#fff',
              color: '#0e1114',
              border: 0,
              borderRadius: 3,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
