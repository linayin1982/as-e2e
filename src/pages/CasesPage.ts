import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CasesPage extends BasePage {
  readonly url = '/cases';

  // Page-level tabs
  readonly allCasesTab: Locator;
  readonly myCasesTab: Locator;
  readonly unassignedCasesTab: Locator;

  // Toolbar
  readonly columnsButton: Locator;
  readonly filterButton: Locator;
  readonly expandedViewToggle: Locator;

  // Table
  readonly casesTable: Locator;
  readonly serviceHeader: Locator;
  readonly triggeredByHeader: Locator;
  readonly brandHeader: Locator;
  readonly vehiclePhoneHeader: Locator;
  readonly customerHeader: Locator;
  readonly vinHeader: Locator;
  readonly licensePlateHeader: Locator;
  readonly startDateHeader: Locator;
  readonly statusHeader: Locator;

  // Pagination
  readonly casesPerPageButton: Locator;
  readonly previousPageLink: Locator;
  readonly nextPageLink: Locator;

  // Take case dialog
  readonly takeCaseDialog: Locator;
  readonly takeCaseDialogTitle: Locator;
  readonly takeCaseDialogDescription: Locator;
  readonly takeCaseButton: Locator;
  readonly closeTakeCaseDialogButton: Locator;

  constructor(page: Page) {
    super(page);

    this.allCasesTab = page.getByRole('tab', { name: /All cases/ });
    this.myCasesTab = page.getByRole('tab', { name: /My cases/ });
    this.unassignedCasesTab = page.getByRole('tab', { name: /Unassigned cases/ });

    this.columnsButton = page.getByText('Columns');
    this.filterButton = page.getByText('Filter');
    this.expandedViewToggle = page.getByText('Expanded view');

    this.casesTable = page.getByRole('table');
    this.serviceHeader = page.getByRole('columnheader', { name: 'Service' });
    this.triggeredByHeader = page.getByRole('columnheader', { name: 'Triggered by' });
    this.brandHeader = page.getByRole('columnheader', { name: 'Brand' });
    this.vehiclePhoneHeader = page.getByRole('columnheader', { name: 'Vehicle phone number' });
    this.customerHeader = page.getByRole('columnheader', { name: 'Customer' });
    this.vinHeader = page.getByRole('columnheader', { name: 'VIN' });
    this.licensePlateHeader = page.getByRole('columnheader', { name: 'License plate' });
    this.startDateHeader = page.getByRole('columnheader', { name: 'Start date' });
    this.statusHeader = page.getByRole('columnheader', { name: 'Status' });

    this.casesPerPageButton = page.getByRole('button', { name: /Cases per page/ });
    this.previousPageLink = page.getByRole('link').filter({ hasText: '‹' });
    this.nextPageLink = page.getByRole('link').filter({ hasText: '›' });

    this.takeCaseDialog = page.getByRole('dialog');
    this.takeCaseDialogTitle = page.getByText('Selected Case');
    this.takeCaseDialogDescription = page.getByText('Would you like to take ownership of the case?');
    this.takeCaseButton = page.getByRole('button', { name: 'Take case' });
    this.closeTakeCaseDialogButton = page.locator('[role="dialog"] .lucide-x');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  async waitForCasesToLoad(): Promise<void> {
    await this.page.getByText('Loading cases').waitFor({ state: 'hidden' });
  }

  async selectTab(tab: 'all' | 'my' | 'unassigned'): Promise<void> {
    const tabMap = {
      all: this.allCasesTab,
      my: this.myCasesTab,
      unassigned: this.unassignedCasesTab,
    };
    await tabMap[tab].click();
  }

  async clickCaseRow(rowName: string): Promise<void> {
    await this.page.getByRole('row', { name: rowName }).click();
  }

  async clickFirstCaseRow(): Promise<void> {
    await this.casesTable.getByRole('row').nth(1).click();
  }

  async takeCase(): Promise<void> {
    await this.takeCaseButton.click();
  }

  async closeTakeCaseDialog(): Promise<void> {
    await this.closeTakeCaseDialogButton.click();
  }

  getCaseRows(): Locator {
    return this.casesTable.getByRole('rowgroup').last().getByRole('row');
  }
}
