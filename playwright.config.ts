import { defineConfig, devices } from '@playwright/test';
import { config as loadDotenv } from 'dotenv';
import { defineBddConfig } from 'playwright-bdd';

import { loadBaseEnv } from '@support/env.js';
import { setupEnvFile } from '@support/envSetup';

setupEnvFile();
loadDotenv();

const testDir = defineBddConfig({
  features: ['features/**/*.feature'],
  steps: ['src/bdd/*.ts', 'src/steps/**/*.ts'],
  outputDir: '.features-gen',
});

const env = loadBaseEnv();

const AUTH_FILE = 'playwright/.auth/user.json';

export default defineConfig({
  testDir,
  timeout: env.apiTimeoutMs,
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    extraHTTPHeaders: {
      Accept: 'application/json, text/plain, */*',
    },
    trace: 'on-first-retry',
  },
  projects: [
    // --- Setup project: runs auth.setup.ts once before UI tests ---
    {
      name: 'setup',
      testMatch: '**/setup/auth.setup.ts',
      use: { baseURL: env.cosmosBaseURL },
    },
    // --- API tests: no browser, no auth needed ---
    {
      name: 'api',
      grep: /@c3/,
      use: { ...devices['Desktop Chrome'], baseURL: env.apiBaseURL },
      // no dependency on setup — API tests don't need a logged-in browser
    },
    // --- UI tests: depend on setup, load saved auth state ---
    {
      name: 'ui',
      grep: /@ui/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.cosmosBaseURL,
        storageState: AUTH_FILE,
      },
      dependencies: ['setup'],
    },
  ],
});

