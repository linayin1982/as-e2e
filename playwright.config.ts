import { defineConfig } from '@playwright/test';
import { config as loadDotenv } from 'dotenv';
import { defineBddConfig } from 'playwright-bdd';

import { loadC3SoftcarEnv } from './src/support/c3.env';
import { setupEnvFile } from './src/support/envSetup';

setupEnvFile();
loadDotenv();

const testDir = defineBddConfig({
  features: ['features/**/*.feature'],
  steps: ['src/bdd/*.ts', 'src/steps/**/*.ts'],
  outputDir: '.features-gen',
});

const env = loadC3SoftcarEnv();

export default defineConfig({
  testDir,
  timeout: env.apiTimeoutMs,
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: env.baseURL,
    extraHTTPHeaders: {
      Accept: 'application/json, text/plain, */*',
    },
    trace: 'on-first-retry',
  },
});

