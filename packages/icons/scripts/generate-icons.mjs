/**
 * Genera src/generated/icons.ts a partir de lucide-static.
 *
 * Solo se incluyen los íconos de ICONS: el set crece de forma deliberada, no
 * importando los ~2000 de Lucide. Para sumar uno: agrégalo a la lista y corre
 *   pnpm --filter @my-ui/icons generate
 *
 * Los SVG se convierten a datos (no a strings HTML) y se renderizan con React,
 * así nunca se inyecta markup con dangerouslySetInnerHTML.
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));

/** Íconos direccionales: se espejan automáticamente en contextos RTL. */
const RTL_MIRRORED = new Set(['arrow-left', 'arrow-right', 'chevron-left', 'chevron-right']);

/**
 * Nombre en el kit (kebab-case). Si Lucide usa otro nombre, se indica como
 * [nombreEnElKit, nombreEnLucide]: así un renombre en Lucide no rompe nuestra API.
 */
const ICONS = [
  'arrow-left',
  'arrow-right',
  'check',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  ['circle-alert', 'circle-exclamation-point'],
  'circle-check',
  'eye',
  'eye-off',
  'info',
  'loader-circle',
  'lock',
  'mail',
  'minus',
  'plus',
  'search',
  ['triangle-alert', 'triangle-exclamation-point'],
  'user',
  'x',
];

const nodes = require('lucide-static/icon-nodes.json');
const { version } = JSON.parse(
  readFileSync(require.resolve('lucide-static/package.json'), 'utf8'),
);

const pascal = (name) =>
  name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

const lines = [
  '// Archivo generado por scripts/generate-icons.mjs. No editar a mano.',
  `// Íconos de Lucide v${version} (https://lucide.dev), licencia ISC: ver LICENSE-lucide.`,
  "import { createIcon } from '../lib/create-icon';",
  '',
];

for (const entry of ICONS) {
  const [name, source] = Array.isArray(entry) ? entry : [entry, entry];
  const node = nodes[source];
  if (!node) throw new Error(`El ícono "${source}" no existe en lucide-static ${version}`);
  const options = RTL_MIRRORED.has(name) ? ', { mirrorInRtl: true }' : '';
  lines.push(
    `export const Icon${pascal(name)} = /* @__PURE__ */ createIcon('${pascal(name)}', ${JSON.stringify(node)}${options});`,
  );
}

const out = path.join(here, '../src/generated/icons.ts');
writeFileSync(out, lines.join('\n') + '\n');
console.log(`Generados ${ICONS.length} íconos en ${path.relative(process.cwd(), out)}`);
