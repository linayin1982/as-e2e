import { expect } from '@playwright/test';
import { createBdd, test as base } from 'playwright-bdd';
import { createDefaultSoftcarState, type SoftcarScenarioState } from './softcarData';
import { C3SoftcarClient } from '@support/api/c3SoftcarClient';
import { loadC3SoftcarEnv } from '@support/c3.env';
import { LoginPage } from '@pages/LoginPage';
import { loadCosmosEnv } from '@support/cosmos.env';
import { CasesPage } from '@pages/CasesPage';
import { OnboardingPage } from '@pages/OnboardingPage';
import { PreferencesPage } from '@pages/PreferencesPage';
import { UserAdministrationPage } from '@pages/UserAdministrationPage';

/**
 * World class injected as `this` into every step callback.
 *
 * Usage in steps:
 *   - Given step calls `this.activate(destination)` to populate `this.softcarState` and `this.activeClient`
 *   - All subsequent When/Then steps read from `this.softcarState` and `this.activeClient` directly
 */
export class SoftcarWorld {
  /** Shared mutable state for the current scenario — populated by activate(). */
  public softcarState: Partial<SoftcarScenarioState> = {};
  /** The resolved API client for the active destination — set by activate(). */
  public activeClient!: C3SoftcarClient;
  public activeDestination: string = '';

  constructor(
    private readonly c3SoftcarClient: C3SoftcarClient,
    private readonly c3SoftcarState: SoftcarScenarioState,
  ) {}

  /**
   * Resolves the destination, populates `softcarState` with the correct
   * initial values, and sets `activeClient`. Call this in the Given step.
   * Add a new `case` here to support additional destinations.
   */
  activate(destination: string): void {
    this.activeDestination = destination;
    switch (destination.toUpperCase()) {
      case 'C3':
        Object.assign(this.softcarState, this.c3SoftcarState);
        this.activeClient = this.c3SoftcarClient;
        break;
      default:
        throw new Error(`No softcar fixtures registered for destination "${destination}".`);
    }
  }
}

/** Fixtures used by API/BDD steps via the World pattern. */
export interface BddFixtures {
  softcarWorld: SoftcarWorld;
}

/** Fixtures used by UI/page-object steps. */
export interface PageFixtures {
  cosmosEnv: Awaited<ReturnType<typeof loadCosmosEnv>>;
  loginPage: LoginPage;
  casesPage: CasesPage;
  onboardingPage: OnboardingPage;
  preferencesPage: PreferencesPage;
  userAdministrationPage: UserAdministrationPage;
}

/** softcarWorld is test-scoped (needs `request`); UI fixtures are worker-scoped. */
export const test = base.extend<BddFixtures, Omit<PageFixtures, never> & Pick<PageFixtures, 'cosmosEnv' | 'loginPage' | 'casesPage' | 'onboardingPage' | 'preferencesPage' | 'userAdministrationPage'>>({
  softcarWorld: async ({ request }, use) => {
    const c3env = loadC3SoftcarEnv();
    await use(new SoftcarWorld(
      new C3SoftcarClient(request),
      createDefaultSoftcarState(c3env),
    ));
  },

  // worker-scoped: resolved once per worker
  cosmosEnv: [async ({}, use) => {
    await use(await loadCosmosEnv());
  }, { scope: 'worker' }],

  loginPage: [async ({ browser }, use) => {
    const page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
    await page.close();
  }, { scope: 'worker' }],

  casesPage: [async ({ browser }, use) => {
    const page = await browser.newPage();
    const casesPage = new CasesPage(page);
    await casesPage.goto();
    await use(casesPage);
    await page.close();
  }, { scope: 'worker' }],

  onboardingPage: [async ({ browser }, use) => {
    const page = await browser.newPage();
    const onboardingPage = new OnboardingPage(page);
    await onboardingPage.goto();
    await use(onboardingPage);
    await page.close();
  }, { scope: 'worker' }],

  preferencesPage: [async ({ browser }, use) => {
    const page = await browser.newPage();
    const preferencesPage = new PreferencesPage(page);
    await preferencesPage.goto();
    await use(preferencesPage);
    await page.close();
  }, { scope: 'worker' }],

  userAdministrationPage: [async ({ browser }, use) => {
    const page = await browser.newPage();
    const userAdministrationPage = new UserAdministrationPage(page);
    await userAdministrationPage.goto();
    await use(userAdministrationPage);
    await page.close();
  }, { scope: 'worker' }],
});

export { expect };
export const { Given, When, Then } = createBdd(test, { worldFixture: 'softcarWorld' });
