/* ============================================================================
   THE CAMPIONE MARK
   ----------------------------------------------------------------------------
   The double-C used in the field app, rebuilt as vector so it stays sharp at
   every size and can be recoloured for a dark header.

   Geometry is measured from the app icon, so the two stay identical:
     outer ring  centreline r 36.99, stroke 9.80, arc 26° -> 301°
     inner ring  centreline r 20.02, stroke 8.50, arc 26° -> 305°
   in a 100 x 100 box centred at 50,50.

   Both rings are `currentColor`, the inner one at reduced opacity so it reads
   as grey against whatever it sits on — light grey on the dark header, mid grey
   on paper — without a second asset or a second colour to keep in sync.

   The inner ring is deliberately NOT blue. Blue belongs to the painting
   division; the parent brand is ink and grey, and a blue mark in the header
   would say "painting company" on every page of a six-division site.
   ========================================================================== */

type Props = {
  /** Rendered size in px. */
  size?: number;
  /** Inner ring colour. Defaults to currentColor at 55%, which reads as grey. */
  inner?: string;
  className?: string;
};

export default function Mark({ size = 34, inner, className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M83.25 66.22A36.99 36.99 0 1 1 69.05 18.29"
        stroke="currentColor"
        strokeWidth="9.8"
      />
      <path
        d="M67.99 58.78A20.02 20.02 0 1 1 61.48 33.6"
        stroke={inner ?? 'currentColor'}
        strokeOpacity={inner ? 1 : 0.55}
        strokeWidth="8.5"
      />
    </svg>
  );
}
