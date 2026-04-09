import { copyFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const DEFAULT_ENVIRONMENT = 'qa';
const DEFAULT_SITE = 'eu-west-1';

/**
 * Reads TEST_SITE and TEST_ENV from the system environment (defaults: eu-west-1 / qa),
 * resolves the matching env file at env/.env.<site>.<environment>,
 * and copies it to .env in the project root so dotenv picks it up.
 *
 * Call this before loading dotenv in playwright.config.ts.
 */
export function setupEnvFile(): { site: string; environment: string; envFile: string } {
  const environment = (process.env.TEST_ENV ?? DEFAULT_ENVIRONMENT).trim();
  const site = (process.env.TEST_SITE ?? DEFAULT_SITE).trim();

  const envFileName = `.env.${site}.${environment}`;
  const envFilePath = resolve(process.cwd(), 'env', envFileName);
  const targetPath = resolve(process.cwd(), '.env');

  if (!existsSync(envFilePath)) {
    throw new Error(
      `Env file not found: ${envFilePath}\n` +
        `  TEST_SITE="${site}", TEST_ENV="${environment}"\n` +
        `  Expected file: env/${envFileName}`,
    );
  }

  copyFileSync(envFilePath, targetPath);
  console.log(`[envSetup] Loaded env file: env/${envFileName} → .env`);

  return { site, environment, envFile: envFilePath };
}

