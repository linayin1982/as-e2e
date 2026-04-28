import { test as setup } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { AuthPage } from '@pages/AuthPage';
import { loadCosmosEnv } from '@support/cosmos.env';
import { mailpit } from '@utils/mailpit-email.util';

const AUTH_FILE = 'playwright/.auth/user.json';

/**
 * Auth setup project — runs once before any test project that declares
 * it as a dependency in playwright.config.ts.
 * Saves the authenticated browser storage state so all tests can reuse
 * the session without repeating the login flow.
 */
setup('authenticate', async ({ page }) => {
  const cosmosEnv = await loadCosmosEnv();
  const loginPage = new LoginPage(page);
  const authPage = new AuthPage(page);

  await loginPage.goto();
  await loginPage.acceptCookies();
  await loginPage.clickSignIn();
  await authPage.fillCredentials(cosmosEnv.account, cosmosEnv.password);
  cosmosEnv.otp = await mailpit.extractAccessCode(cosmosEnv.account);
  await authPage.fillOtp(cosmosEnv.otp);

  // Save auth state once — all dependent test projects will reuse this file
  await page.context().storageState({ path: AUTH_FILE });
});

