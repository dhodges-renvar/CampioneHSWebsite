import type { ReactNode } from 'react';
import { heroFor } from '@/lib/heroes';
import DeckRule from './DeckRule';

type Props = {
  /** Key into HERO_IMAGES. Also decides which photograph loads, when there is one. */
  imageKey: string;
  kicker?: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  /** Division colour. Tints the built field and the kicker rule. */
  accent?: string;
  variant?: 'home' | 'page';
  align?: 'left' | 'center';
  /** A solid colour bar instead of the six-segment deck rule. Used on division pages. */
  footRule?: string;
  facts?: { value: string; label: string }[];
};

export default function Hero({
  imageKey,
  kicker,
  title,
  lead,
  children,
  accent,
  variant = 'page',
  align = 'left',
  footRule,
  facts,
}: Props) {
  const img = heroFor(imageKey);

  const style: Record<string, string> = {};
  if (accent) style['--accent'] = accent;
  if (img.src) {
    style['--hero-img'] = `url(${img.src})`;
    if (img.focus) style['--hero-pos'] = img.focus;
  }

  return (
    <section
      className={[
        'hero',
        variant === 'home' ? 'hero--home' : '',
        align === 'center' ? 'hero--center' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style as React.CSSProperties}
    >
      <div className="hero__field" />
      <div className="hero__rake" />
      <div className="hero__bg" />
      <div className="hero__scrim" />
      <div className="hero__grain" />

      <div className="wrap">
        <div className="hero__inner">
          {kicker && <p className="kicker kicker--on-dark">{kicker}</p>}
          <h1>{title}</h1>
          {lead && <p className="hero__lead">{lead}</p>}
          {children && <div className="btn-row">{children}</div>}

          {facts && facts.length > 0 && (
            <div className="hero__facts">
              {facts.map((f) => (
                <div className="hero__fact" key={f.label}>
                  <b>{f.value}</b>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hero__rule">
        {footRule ? (
          <div className="deck-rule deck-rule--tall" aria-hidden>
            <span style={{ background: footRule }} />
          </div>
        ) : (
          <DeckRule tall />
        )}
      </div>
    </section>
  );
}
