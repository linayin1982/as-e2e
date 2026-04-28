import { Locator, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import {getSecretValue} from '@utils/awsUtils'
/**
 * Check if the element exists.
 * @param element The element to check
 * @param timeout The timeout. If the element is not found within the timeout this method will return false
 */
async function elementExists(element: Locator, timeout: number): Promise<boolean> {
  try {
    await element.waitFor({ state: 'visible', timeout: timeout });
  } catch (_) {
    // Element timed out
  }
  return element.isVisible();
}

function throwError(errorMessage = ''): never {
  throw new Error(errorMessage);
}

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function enableDebugLoggingScript() {
  localStorage.setItem('log_level', '5');
}

function enableDebugLogging(page: Page) {
  return page.evaluate(() => {
    localStorage.setItem('log_level', '5');
  });
}

async function getRequestHeaders(page: Page): Promise<Record<string, string>> {
  const headers = (await page?.evaluate(() => {
    const token = localStorage.getItem('token');
    const tenant = localStorage.getItem('tenant');
    if (!token && !tenant) {
      console.log('No token or tenant found in localStorage');
      throw new Error('No token or tenant found in localStorage');
    }
    return {
      ...(token && { authorization: `${token}` }),
      ...(tenant && { tenant: tenant }),
      'Content-Type': 'application/json',
    };
  })) || { 'Content-Type': 'application/json' };
  return headers;
}


/**
 * Extract the case ID from the current page URL
 * Expected URL format: https://localhost:4200/cases/{caseId}
 * @param page The Playwright page object
 * @returns The case ID extracted from the URL, or null if not found
 */
function getCaseIdFromCasePageUrl(page: Page): string | null {
  const url = page.url();
  const match = url.match(/\/cases\/([a-f0-9-]+)/i);
  return match ? match[1] : null;
}

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

function parseTimeout(value: string | number): number {
  return Number.parseInt(value.toString());
}

function loadRequestBody(filePath: string): Record<string, unknown> {
  const absolutePath = resolve(process.cwd(), filePath);
  const raw = readFileSync(absolutePath, 'utf-8');
  return JSON.parse(raw) as Record<string, unknown>;
}

interface Secrets {
  tenant: string;
  agent_password: string;
  map_api_key: string;
}

async function getSecrets(): Promise<Secrets> {
  const secret = await getSecretValue(process.env.SECRET_ID!, process.env.REGION!, process.env.AWS_PROFILE!);
  return {
    tenant: secret.tenant,
    agent_password: secret.agent_password,
    map_api_key: secret.map_api_key,
  };
}


export {
  sleep,
  elementExists,
  throwError,
  enableDebugLogging,
  enableDebugLoggingScript,
  getRequestHeaders,
  getCaseIdFromCasePageUrl,
  normalizeBaseUrl,
  parseTimeout,
  loadRequestBody,
  getSecrets
};
