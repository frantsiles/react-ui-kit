// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/build',
      '**/coverage',
      '**/storybook-static',
      '**/node_modules',
      '.nx',
      'tmp',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          // Capas entre paquetes, de abajo hacia arriba (docs/adr/0007-capas.md).
          // Un proyecto sin etiqueta layer:* no puede depender de nada.
          depConstraints: [
            { sourceTag: 'layer:core', onlyDependOnLibsWithTags: ['layer:core'] },
            { sourceTag: 'layer:icons', onlyDependOnLibsWithTags: ['layer:core'] },
            {
              sourceTag: 'layer:components',
              onlyDependOnLibsWithTags: ['layer:core', 'layer:icons'],
            },
            {
              sourceTag: 'layer:app',
              onlyDependOnLibsWithTags: ['layer:core', 'layer:icons', 'layer:components'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
  ...storybook.configs["flat/recommended"]
];
