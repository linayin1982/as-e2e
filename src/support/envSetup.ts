import dotenv from 'dotenv';

const DEFAULT_ENVIRONMENT = 'qa';
const DEFAULT_SITE = 'eu-west-1';

/**
 * Reads TEST_SITE and TEST_ENV from the system environment (defaults: eu-west-1 / qa),
 * resolves the matching env file at env/.env.<site>.<environment>,
 * and loads it via dotenv so all subsequent process.env reads pick it up.
 *
 * Called at the top of playwright.config.ts before any env values are read.
 */
export function setupEnvFile(): { site: string; environment: string } {
  const environment = (process.env.TEST_ENV ?? DEFAULT_ENVIRONMENT).trim();
  const site = (process.env.TEST_SITE ?? DEFAULT_SITE).trim();

  dotenv.config({
    path: `env/.env.${site}.${environment}`,
    override: true,
  });
  return { site, environment };
}
