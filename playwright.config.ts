import { defineConfig } from '@playwright/test';

// Uses the locally installed Chrome (no browser download) against the Vite dev server.
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  retries: 0, // a flaky test must be fixed, not retried until green
  reporter: [['list'], ['json', { outputFile: 'e2e-results.json' }]],
  use: {
    baseURL: 'http://localhost:5173',
    channel: 'chrome',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  outputDir: 'e2e-artifacts',
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
