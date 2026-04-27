import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class UserAdministrationPage extends BasePage {
  readonly url = '/agents';

  // Page heading
  readonly heading: Locator;

  // Search User section
  readonly searchUserHeading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchHint: Locator;

  // Invite Users section
  readonly inviteUsersHeading: Locator;
  readonly roleButton: Locator;
  readonly rviPermissionCheckbox: Locator;
  readonly emailInput: Locator;
  readonly inviteUserButton: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'User Administration', level: 1 });

    this.searchUserHeading = page.getByRole('heading', { name: 'Search User', level: 2 });
    this.searchInput = page.getByRole('textbox', { name: 'Search...' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.searchHint = page.getByText('Search by name, surname, phone number, or email');

    this.inviteUsersHeading = page.getByRole('heading', { name: 'Invite Users', level: 2 });
    this.roleButton = page.getByRole('button', { name: /Role/ });
    this.rviPermissionCheckbox = page.getByRole('checkbox', { name: 'Remote Vehicle Immobilization (RVI)' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.inviteUserButton = page.getByRole('button', { name: 'Invite User' });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  async searchUser(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  async inviteUser(email: string, role?: string): Promise<void> {
    if (role) {
      await this.roleButton.click();
      await this.page.getByText(role).click();
    }
    await this.emailInput.fill(email);
    await this.inviteUserButton.click();
  }
}
