import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class OnboardingPage extends BasePage {
  readonly url = '/onboarding';

  // Page content
  readonly heading: Locator;
  readonly welcomeText: Locator;

  // FAQ links
  readonly changeLanguageLink: Locator;
  readonly changePasswordLink: Locator;
  readonly handleCaseLink: Locator;
  readonly searchVehicleLink: Locator;
  readonly whatsNewLink: Locator;

  // Handle case sub-items
  readonly takeCaseFromListItem: Locator;
  readonly clearCallItem: Locator;
  readonly closeCaseItem: Locator;
  readonly reportCaseItem: Locator;

  // What's new sub-items
  readonly copyDataItem: Locator;
  readonly mapItem: Locator;
  readonly collisionDataItem: Locator;
  readonly remoteServicesItem: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'Onboard guide' });
    this.welcomeText = page.getByText('Welcome to the new Call Center Client');

    this.changeLanguageLink = page.getByRole('link', { name: /How can I change my language/ });
    this.changePasswordLink = page.getByRole('link', { name: /How can I change my password/ });
    this.handleCaseLink = page.getByRole('link', { name: /How can I handle a case/ });
    this.searchVehicleLink = page.getByRole('link', { name: /How can I search vehicle or customer information/ });
    this.whatsNewLink = page.getByRole('link', { name: /What is new that I should know/ });

    this.takeCaseFromListItem = page.getByText('Take a case from the Case List');
    this.clearCallItem = page.getByText('What should I know about "Clear Call"?');
    this.closeCaseItem = page.getByText('Close the case');
    this.reportCaseItem = page.getByText('Report the case');

    this.copyDataItem = page.getByText('Copy data easily');
    this.mapItem = page.getByText('Map');
    this.collisionDataItem = page.getByText('Visual collision data');
    this.remoteServicesItem = page.getByText('Remote services');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }
}
