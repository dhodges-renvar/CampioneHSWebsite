/* ============================================================================
   THE CAMPIONE MARK
   ----------------------------------------------------------------------------
   The double-C used in the field app, rebuilt as vector so it stays sharp at
   every size and can be recoloured for a dark header.

   Geometry is measured from the app icon, so the two stay identical:
     outer ring  centreline r 36.99, stroke 9.80, arc 26° -> 301°
     inner ring  centreline r 20.02, stroke 8.50, arc 26° -> 305°
   in a 100 x 100 box centred at 50,50.

   The outer ring is `currentColor`, so it inherits the surrounding text colour
   — ink on paper, white on the dark header. The inner ring stays the painting
   blue on both, which is what carries the brand.
   ========================================================================== */

type Props = {
  /** Rendered size in px. */
  size?: number;
  /** Inner ring colour. Defaults to the painting blue. */
  inner?: string;
  className?: string;
};

export default function Mark({ size = 34, inner = 'var(--painting)', className }: Props) {
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
      <path d="M67.99 58.78A20.02 20.02 0 1 1 61.48 33.6" stroke={inner} strokeWidth="8.5" />
    </svg>
  );
}
