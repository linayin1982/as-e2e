import { type Page, type Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  // Navigation header
  readonly logoLink: Locator;
  readonly casesTab: Locator;
  readonly activeCaseTab: Locator;

  // Search bar
  readonly vinSearchToggle: Locator;
  readonly searchInput: Locator;
  readonly searchSubmitButton: Locator;

  // User menu
  readonly userMenuButton: Locator;
  readonly preferencesLink: Locator;
  readonly userAdministrationLink: Locator;
  readonly onboardGuideLink: Locator;
  readonly cookiesButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logoLink = page.getByRole('link', { name: 'Call Center Client' });
    this.casesTab = page.getByRole('tab', { name: 'Cases' });
    this.activeCaseTab = page.getByRole('tab', { name: 'Active case' });

    this.vinSearchToggle = page.getByRole('button', { name: 'VIN' });
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.searchSubmitButton = page.locator('nav').getByRole('button').last();

    this.userMenuButton = page.locator('nav').getByRole('button').filter({ hasNotText: 'VIN' }).last();
    this.preferencesLink = page.getByRole('link', { name: 'Preferences' });
    this.userAdministrationLink = page.getByRole('link', { name: 'User administration' });
    this.onboardGuideLink = page.getByRole('link', { name: 'Onboard guide' });
    this.cookiesButton = page.getByRole('button', { name: 'Cookies' });
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
  }

  async openUserMenu(): Promise<void> {
    await this.userMenuButton.click();
  }

  async navigateToCases(): Promise<void> {
    await this.casesTab.click();
  }

  async navigateToActiveCase(): Promise<void> {
    await this.activeCaseTab.click();
  }

  async navigateToPreferences(): Promise<void> {
    await this.openUserMenu();
    await this.preferencesLink.click();
  }

  async navigateToUserAdministration(): Promise<void> {
    await this.openUserMenu();
    await this.userAdministrationLink.click();
  }

  async navigateToOnboardGuide(): Promise<void> {
    await this.openUserMenu();
    await this.onboardGuideLink.click();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutButton.click();
  }

  async searchByVin(vin: string): Promise<void> {
    await this.vinSearchToggle.click();
    await this.searchInput.fill(vin);
    await this.searchSubmitButton.click();
  }
}
