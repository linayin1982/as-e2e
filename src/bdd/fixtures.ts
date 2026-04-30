import { expect, type Browser } from '@playwright/test';
import { createBdd, test as base } from 'playwright-bdd';
import { createBCallServiceState, type ServiceScenarioState } from './serviceData';
import { XCallEnablingClient } from '@support/api/xCallEnablingClient.js';
import { loadBaseEnv } from '@support/env.js';
import { LoginPage } from '@pages/LoginPage';
import { CasesPage } from '@pages/CasesPage';
import { OnboardingPage } from '@pages/OnboardingPage';
import { PreferencesPage } from '@pages/PreferencesPage';
import { UserAdministrationPage } from '@pages/UserAdministrationPage';

/**
 * World class injected as `this` into every step callback.
 *
 * Usage in steps:
 *   - Given step calls `this.activate(destination)` to populate `this.ServiceState` and `this.activeClient`
 *   - All subsequent When/Then steps read from `this.ServiceState` and `this.activeClient` directly
 */
export class ServiceWorld {
  /** Shared mutable state for the current scenario — populated by activate(). */
  public ServiceState: Partial<ServiceScenarioState> = {};
  /** The resolved API client for the active destination — set by activate(). */
  public activeClient!: XCallEnablingClient;
  public activeDestination: string = '';

  constructor(
    private readonly xcallClient: XCallEnablingClient,
    private readonly callServiceState: ServiceScenarioState,
  ) {}

  /**
   * Resolves the destination, populates `ServiceState` with the correct
   * initial values, and sets `activeClient`. Call this in the Given step.
   * Add a new `case` here to support additional destinations.
   */
  activate(destination: string): void {
    const normalizedDestination = destination.toUpperCase();

    switch (normalizedDestination) {
      case 'BCALL':
        // Merge defaults first so required request-body paths are always available,
        // while preserving runtime values such as serviceId between step calls.
        this.ServiceState = {
          ...this.callServiceState,
          ...this.ServiceState,
        };
        this.activeClient = this.xcallClient;
        this.activeDestination = normalizedDestination;
        break;
      default:
        throw new Error(`No Service fixtures registered for destination "${destination}".`);
    }
  }
}

/** Fixtures used by API/BDD steps via the World pattern. */
export interface BddFixtures {
  ServiceWorld: ServiceWorld;
}

/** Fixtures used by UI/page-object steps. */
export interface PageFixtures {
  loginPage: LoginPage;
  casesPage: CasesPage;
  onboardingPage: OnboardingPage;
  preferencesPage: PreferencesPage;
  userAdministrationPage: UserAdministrationPage;
}

/** ServiceWorld is test-scoped; UI fixtures are worker-scoped. */
export const test = base.extend<BddFixtures, PageFixtures>({
  ServiceWorld: async ({ request }, use) => {
    const env = loadBaseEnv();
    await use(new ServiceWorld(
      new XCallEnablingClient(request),
      createBCallServiceState(env),
    ));
  },

  loginPage: [async ({ browser }: { browser: Browser }, use) => {
    const page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
    await page.close();
  }, { scope: 'worker' }],

  casesPage: [async ({ browser }: { browser: Browser }, use) => {
    const page = await browser.newPage();
    const casesPage = new CasesPage(page);
    await casesPage.goto();
    await use(casesPage);
    await page.close();
  }, { scope: 'worker' }],

  onboardingPage: [async ({ browser }: { browser: Browser }, use) => {
    const page = await browser.newPage();
    const onboardingPage = new OnboardingPage(page);
    await onboardingPage.goto();
    await use(onboardingPage);
    await page.close();
  }, { scope: 'worker' }],

  preferencesPage: [async ({ browser }: { browser: Browser }, use) => {
    const page = await browser.newPage();
    const preferencesPage = new PreferencesPage(page);
    await preferencesPage.goto();
    await use(preferencesPage);
    await page.close();
  }, { scope: 'worker' }],

  userAdministrationPage: [async ({ browser }: { browser: Browser }, use) => {
    const page = await browser.newPage();
    const userAdministrationPage = new UserAdministrationPage(page);
    await userAdministrationPage.goto();
    await use(userAdministrationPage);
    await page.close();
  }, { scope: 'worker' }],
});

export { expect };
export const { Given, When, Then } = createBdd(test, { worldFixture: 'ServiceWorld' });
