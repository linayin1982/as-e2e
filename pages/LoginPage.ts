import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly url = '/login';

  // Welcome screen
  readonly heading: Locator;
  readonly signInHeading: Locator;
  readonly signInDescription: Locator;
  readonly signInButton: Locator;

  // Language / footer
  readonly languageButton: Locator;
  readonly privacyPolicyLink: Locator;
  readonly cookiePreferencesButton: Locator;

  // Cookie consent dialog
  readonly cookieDialog: Locator;
  readonly acceptCookiesButton: Locator;
  readonly manageCookiePreferencesButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { level: 1, name: 'Welcome to the WirelessCar Call Center Client' });
    this.signInHeading = page.getByRole('heading', { level: 2, name: 'Sign in' });
    this.signInDescription = page.getByText("To start, click on the login button below.");
    this.signInButton = page.getByRole('button', { name: 'Sign In' });

    this.languageButton = page.getByText('Language');
    this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });
    this.cookiePreferencesButton = page.getByText('Cookie Preferences');

    this.cookieDialog = page.getByRole('dialog');
    this.acceptCookiesButton = page.getByRole('button', { name: 'Got it!' });
    this.manageCookiePreferencesButton = page.getByRole('button', { name: 'Manage preferences' });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  async acceptCookies(): Promise<void> {
    if (await this.acceptCookiesButton.isVisible()) {
      await this.acceptCookiesButton.click();
    }
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }
}
