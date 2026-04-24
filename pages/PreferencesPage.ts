import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PreferencesPage extends BasePage {
  readonly url = '/preferences';

  // Page heading
  readonly heading: Locator;

  // User Preferences section
  readonly userPreferencesHeading: Locator;
  readonly languageButton: Locator;

  // Notifications
  readonly emergencyServicesNotificationCheckbox: Locator;
  readonly emergencyServicesSoundCheckbox: Locator;
  readonly otherServicesNotificationCheckbox: Locator;
  readonly otherServicesSoundCheckbox: Locator;
  readonly updatesNotificationCheckbox: Locator;
  readonly updatesSoundCheckbox: Locator;
  readonly enableNotificationsButton: Locator;

  // Units - Distance
  readonly kilometersRadio: Locator;
  readonly milesRadio: Locator;
  readonly milesAndKilometersRadio: Locator;

  // Units - Pressure
  readonly psiRadio: Locator;
  readonly kpaRadio: Locator;

  // Units - Fuel consumption
  readonly litersPer100KmRadio: Locator;
  readonly mpgRadio: Locator;

  // Units - Temperature
  readonly celsiusRadio: Locator;
  readonly fahrenheitRadio: Locator;

  // Time zone
  readonly timeZoneValue: Locator;

  // Save
  readonly saveButton: Locator;

  // Change Password section
  readonly changePasswordHeading: Locator;
  readonly setNewPasswordLink: Locator;

  // Configure OTP section
  readonly configureOtpHeading: Locator;
  readonly addOtpDeviceLink: Locator;

  // Change contact information section
  readonly changeContactInfoHeading: Locator;
  readonly setContactInfoButton: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole('heading', { name: 'Preferences', level: 1 });

    this.userPreferencesHeading = page.getByRole('heading', { name: 'User Preferences', level: 2 });
    this.languageButton = page.getByRole('button', { name: /American English/ });

    this.emergencyServicesNotificationCheckbox = page.getByText('Emergency services').locator('..').getByRole('checkbox').first();
    this.emergencyServicesSoundCheckbox = page.getByText('Emergency services').locator('..').getByRole('checkbox').last();
    this.otherServicesNotificationCheckbox = page.getByText('Other services').locator('..').getByRole('checkbox').first();
    this.otherServicesSoundCheckbox = page.getByText('Other services').locator('..').getByRole('checkbox').last();
    this.updatesNotificationCheckbox = page.getByText('Updates').locator('..').getByRole('checkbox').first();
    this.updatesSoundCheckbox = page.getByText('Updates').locator('..').getByRole('checkbox').last();
    this.enableNotificationsButton = page.getByRole('button', { name: 'Enable notifications' });

    this.kilometersRadio = page.getByRole('radio', { name: 'kilometers (km)' });
    this.milesRadio = page.getByRole('radio', { name: 'miles', exact: true });
    this.milesAndKilometersRadio = page.getByRole('radio', { name: 'miles and kilometers (km)' });

    this.psiRadio = page.getByRole('radio', { name: 'Pounds per Square Inch (PSI)' });
    this.kpaRadio = page.getByRole('radio', { name: 'kilopascal (kPa)' });

    this.litersPer100KmRadio = page.getByRole('radio', { name: 'liters per 100 kilometers (l/100 km)' });
    this.mpgRadio = page.getByRole('radio', { name: 'miles per gallon (MPG)' });

    this.celsiusRadio = page.getByRole('radio', { name: 'Celsius (°C)' });
    this.fahrenheitRadio = page.getByRole('radio', { name: 'Fahrenheit (°F)' });

    this.timeZoneValue = page.getByText(/GMT/);

    this.saveButton = page.getByRole('button', { name: 'Save' });

    this.changePasswordHeading = page.getByRole('heading', { name: 'Change Password', level: 2 });
    this.setNewPasswordLink = page.getByRole('link', { name: 'Set new password' });

    this.configureOtpHeading = page.getByRole('heading', { name: 'Configure OTP', level: 2 });
    this.addOtpDeviceLink = page.getByRole('link', { name: 'Add OTP device' });

    this.changeContactInfoHeading = page.getByRole('heading', { name: 'Change contact information', level: 2 });
    this.setContactInfoButton = page.getByRole('button', { name: 'Set contact information' });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  async selectDistanceUnit(unit: 'km' | 'miles' | 'both'): Promise<void> {
    const radioMap = {
      km: this.kilometersRadio,
      miles: this.milesRadio,
      both: this.milesAndKilometersRadio,
    };
    await radioMap[unit].click();
  }

  async selectPressureUnit(unit: 'psi' | 'kpa'): Promise<void> {
    const radioMap = {
      psi: this.psiRadio,
      kpa: this.kpaRadio,
    };
    await radioMap[unit].click();
  }

  async selectTemperatureUnit(unit: 'celsius' | 'fahrenheit'): Promise<void> {
    const radioMap = {
      celsius: this.celsiusRadio,
      fahrenheit: this.fahrenheitRadio,
    };
    await radioMap[unit].click();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}
