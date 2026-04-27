import { copyFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

const DEFAULT_ENVIRONMENT = 'qa';
const DEFAULT_SITE = 'eu-west-1';

/**
 * Reads TEST_SITE and TEST_ENV from the system environment (defaults: eu-west-1 / qa),
 * resolves the matching env file at env/.env.<site>.<environment>,
 * and copies it to .env in the project root so dotenv picks it up.
 *
 * Call this before loading dotenv in playwright.config.ts.
 */
export function setupEnvFile(): { site: string; environment: string } {
  const environment = (process.env.TEST_ENV ?? DEFAULT_ENVIRONMENT).trim();
  const site = (process.env.TEST_SITE ?? DEFAULT_SITE).trim();

  dotenv.config({
    path: `env/.env.${process.env.test_env}`,
    override: true,
  });

  return { site, environment};
}

