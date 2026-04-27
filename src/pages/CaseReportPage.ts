import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CaseReportPage extends BasePage {
  // Case type checkboxes
  readonly emergencyCheckbox: Locator;
  readonly roadsideAssistanceCheckbox: Locator;
  readonly testCallCheckbox: Locator;
  readonly falseCaseCheckbox: Locator;

  // My Actions checkboxes
  readonly alertRescueAuthoritiesCheckbox: Locator;
  readonly informPoliceCheckbox: Locator;
  readonly informTowTruckCheckbox: Locator;
  readonly otherActionCheckbox: Locator;

  // Additional information
  readonly additionalInfoTextarea: Locator;

  // Submit
  readonly saveAndReportButton: Locator;

  // Notice
  readonly reportNotice: Locator;

  constructor(page: Page) {
    super(page);

    this.emergencyCheckbox = page.getByRole('checkbox', { name: 'Emergency' });
    this.roadsideAssistanceCheckbox = page.getByRole('checkbox', { name: 'Roadside Assistance / Breakdown' });
    this.testCallCheckbox = page.getByRole('checkbox', { name: 'Test call' });
    this.falseCaseCheckbox = page.getByRole('checkbox', { name: 'False Case / Use' });

    this.alertRescueAuthoritiesCheckbox = page.getByRole('checkbox', { name: 'Alert rescue authorities' });
    this.informPoliceCheckbox = page.getByRole('checkbox', { name: 'Inform police' });
    this.informTowTruckCheckbox = page.getByRole('checkbox', { name: 'Inform tow truck' });
    this.otherActionCheckbox = page.getByRole('checkbox', { name: 'Other' });

    this.additionalInfoTextarea = page.getByRole('textbox', { name: 'Additional information (optional)' });

    this.saveAndReportButton = page.getByRole('button', { name: 'Save and report' });

    this.reportNotice = page.getByText('The service must be closed and acknowledged before it can be reported.');
  }

  async selectCaseType(type: 'emergency' | 'roadsideAssistance' | 'testCall' | 'falseCase'): Promise<void> {
    const checkboxMap = {
      emergency: this.emergencyCheckbox,
      roadsideAssistance: this.roadsideAssistanceCheckbox,
      testCall: this.testCallCheckbox,
      falseCase: this.falseCaseCheckbox,
    };
    await checkboxMap[type].check();
  }

  async selectAction(action: 'alertRescue' | 'informPolice' | 'informTowTruck' | 'other'): Promise<void> {
    const checkboxMap = {
      alertRescue: this.alertRescueAuthoritiesCheckbox,
      informPolice: this.informPoliceCheckbox,
      informTowTruck: this.informTowTruckCheckbox,
      other: this.otherActionCheckbox,
    };
    await checkboxMap[action].check();
  }

  async fillAdditionalInfo(text: string): Promise<void> {
    await this.additionalInfoTextarea.fill(text);
  }

  async saveAndReport(): Promise<void> {
    await this.saveAndReportButton.click();
  }
}
