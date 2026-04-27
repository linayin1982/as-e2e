import { expect } from '@playwright/test';
import { createBdd, test as base } from 'playwright-bdd';

import { createDefaultSoftcarState, type SoftcarScenarioState } from '../fixtures/softcarData';
import { C3SoftcarClient } from '../support/api/c3SoftcarClient';
import { loadC3SoftcarEnv } from '../support/c3.env';

/**
 * World class injected as `this` into every step callback.
 * Steps only need to call `this.resolveFixtures(destination)` —
 * no concrete client/state classes need to be imported in step files.
 */
export class SoftcarWorld {
  constructor(
    readonly c3SoftcarClient: C3SoftcarClient,
    readonly c3SoftcarState: SoftcarScenarioState,
    public activeDestination: string = '',
  ) {}

  /**
   * Returns the correct { client, state } pair for the given destination.
   * Add a new `case` here to support additional destinations.
   */
  resolveFixtures(destination: string) {
    switch (destination.toUpperCase()) {
      case 'C3':
        return { client: this.c3SoftcarClient, state: this.c3SoftcarState };
      default:
        throw new Error(`No softcar fixtures registered for destination "${destination}".`);
    }
  }
}

interface BddFixtures {
  softcarWorld: SoftcarWorld;
}

export const test = base.extend<BddFixtures>({
  softcarWorld: async ({ request }, use) => {
    const env = loadC3SoftcarEnv();
    await use(new SoftcarWorld(
      new C3SoftcarClient(request),
      createDefaultSoftcarState(env),
    ));
  },
});

export { expect };
export const { Given, When, Then } = createBdd(test, { worldFixture: 'softcarWorld' });


