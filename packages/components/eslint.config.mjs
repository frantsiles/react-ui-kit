import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

/*
 * Capas de componentes, de abajo hacia arriba: una carpeta por fase de la hoja
 * de ruta (docs/ROADMAP.md, docs/adr/0007-capas.md). Un archivo solo importa
 * de su capa, de capas inferiores y de `internal/`.
 */
const layers = [
  'fundamentos',
  'acciones',
  'layout',
  'overlays',
  'colecciones',
  'navegacion',
  'shell',
  'datos',
];

/** Coincide con un import que entra a alguna de esas carpetas: '../overlays/popover'. */
const importsFrom = (names) => `(^|/)(${names.join('|')})(/|$)`;

const selfImport = {
  name: '@my-ui/components',
  message: 'Dentro del paquete, importa con ruta relativa: importar el paquete desde sí mismo crea ciclos.',
};

const layerRules = layers.map((layer, index) => {
  const above = layers.slice(index + 1);
  return {
    files: [`src/lib/${layer}/**/*.{ts,tsx}`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [selfImport],
          patterns: above.length
            ? [
                {
                  regex: importsFrom(above),
                  message: `"${layer}" no puede depender de una capa superior (${above.join(', ')}). Si de verdad lo necesita, el componente va en otra capa: revisa la hoja de ruta.`,
                },
              ]
            : [],
        },
      ],
    },
  };
});

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  ...layerRules,
  {
    files: ['src/lib/internal/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [selfImport],
          patterns: [
            {
              regex: importsFrom(layers),
              message: '`internal/` son utilidades sin dependencias de componentes: no puede importar de ninguna capa.',
            },
          ],
        },
      ],
    },
  },
  {
    // Todo archivo de src/lib vive en una capa o en internal/
    files: ['src/lib/**/*.{ts,tsx}'],
    ignores: [...layers.map((layer) => `src/lib/${layer}/**`), 'src/lib/internal/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message: `Los archivos de src/lib van en una carpeta de capa (${layers.join(', ')}) o en internal/.`,
        },
      ],
    },
  },
];
