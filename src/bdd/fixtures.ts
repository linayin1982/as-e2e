import { expect } from '@playwright/test';
import { createBdd, test as base } from 'playwright-bdd';

import { createDefaultSoftcarState, type SoftcarScenarioState } from '../fixtures/softcarData';
import { C3SoftcarClient } from '../support/api/c3SoftcarClient';
import { loadC3SoftcarEnv } from '../support/c3env';

interface BddFixtures {
  c3SoftcarState: SoftcarScenarioState;
  c3SoftcarClient: C3SoftcarClient;
}

export const test = base.extend<BddFixtures>({
  c3SoftcarState: async ({}, use) => {
    await use(createDefaultSoftcarState(loadC3SoftcarEnv()));
  },
  c3SoftcarClient: async ({ request }, use) => {
    await use(new C3SoftcarClient(request));
  },
});

export { expect };
export const { Given, When, Then } = createBdd(test);


