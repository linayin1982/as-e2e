import { type Page, type Locator } from '@playwright/test';

/**
 * Keycloak authentication portal page - handles both
 * the email/password form and the OTP (one-time code) form.
 */
export class AuthPage {
  readonly page: Page;

  // Email/Password form
  readonly signInHeading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signInButton: Locator;
  readonly languagesButton: Locator;

  // OTP form
  readonly otpInput: Locator;
  readonly otpSignInButton: Locator;
  readonly tryAnotherWayLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signInHeading = page.getByRole('heading', { name: 'Sign in to your account' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.rememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember me' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.languagesButton = page.getByRole('button', { name: 'languages' });

    this.otpInput = page.getByRole('textbox', { name: /one-time code/i });
    this.otpSignInButton = page.getByRole('button', { name: 'Sign in' });
    this.tryAnotherWayLink = page.getByRole('link', { name: 'Try Another Way' });
  }

  async fillCredentials(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async fillOtp(otp: string): Promise<void> {
    await this.otpInput.fill(otp);
    await this.otpSignInButton.click();
  }
}
