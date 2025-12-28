import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'pnpm exec nx run @my-ui-library/react-ui-kit:dev',
        production: 'pnpm exec nx run @my-ui-library/react-ui-kit:preview',
      },
      ciWebServerCommand:
        'pnpm exec nx run @my-ui-library/react-ui-kit:preview',
      ciBaseUrl: 'http://localhost:4300',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
