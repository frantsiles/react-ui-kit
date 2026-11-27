type Rgba = [number, number, number, number];

/** Convierte "rgb(23 23 23)", "rgb(30 58 138 / 0.35)" o "rgba(…)" a [r, g, b, a]. */
export function parseColor(value: string): Rgba | null {
  const nums = value.match(/[\d.]+%?/g);
  if (!nums || nums.length < 3) return null;
  const [r, g, b] = nums.slice(0, 3).map(Number) as [number, number, number];
  const alphaRaw = nums[3];
  const a = alphaRaw === undefined ? 1 : alphaRaw.endsWith('%') ? Number.parseFloat(alphaRaw) / 100 : Number(alphaRaw);
  return [r, g, b, a];
}

/** Mezcla un color con alfa sobre un fondo opaco. */
export function flatten([r, g, b, a]: Rgba, [br, bg, bb]: Rgba): Rgba {
  return [r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a), 1];
}

function luminance([r, g, b]: Rgba): number {
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Relación de contraste WCAG 2.x entre dos colores opacos. */
export function contrastRatio(a: Rgba, b: Rgba): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
