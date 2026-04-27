import { expect, Page } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { AuthPage } from '@pages/AuthPage';
import { CasesPage } from '@pages/CasesPage';
import { mailpit } from '@utils/mailpit-email.util';


interface AgentProperties {
  email: string;
  password: string;
  callCenterName: string;
  name?: string;
  phoneNumber?: string;
  /**
   * Indicates if an agent is assumed to be a member of multiple call centers.
   */
  inMultipleCallCenters?: boolean;
}

export class Agent {
  readonly email: string;
  readonly password: string;
  readonly name?: string;
  readonly phoneNumber?: string;
  readonly callCenterName: string;
  readonly inMultipleCallCenters: boolean;

  constructor(
    private readonly page: Page,
    { email, password, callCenterName, name, phoneNumber, inMultipleCallCenters }: AgentProperties
  ) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.callCenterName = callCenterName;
    this.inMultipleCallCenters = inMultipleCallCenters ?? false;
  }

  public async login() {
    const loginPage = new LoginPage(this.page);
    const keycloakSignInPage = new KeycloakSignInPage(this.page);
    const keycloakEmailOtpForm = new KeycloakEmailOtpForm(this.page);
    const callCentersPage = new CallCentersPage(this.page);

    await loginPage.open();
    await loginPage.acceptNecessaryCookies();
    await loginPage.clickSignInButton();
    await keycloakSignInPage.signIn(this.email, this.password, true);

    let shouldDisableOTP = false;

    await loginPage.emailOtpIsVisible().catch(async () => {
      console.warn('Did not find email OTP login form. Falling back to TOTP login and disabling TOTP.');
      shouldDisableOTP = true;
      await loginPage.tryToLoginByEmailOtp();
    });

    const accessCode = await mailpit.extractAccessCode(this.email);

    await keycloakEmailOtpForm.signIn(accessCode);

    // An agent can be redirected either directly to /cases (single call center)
    // or to /call-centers (multiple call centers) after OTP authentication.
    await expect(this.page).toHaveURL(/\/(cases|call-centers)(\/.*)?$/);
    if (this.page.url().includes('/call-centers')) {
      await callCentersPage.selectCallCenter(this.callCenterName);
    }
    await expect(this.page).toHaveURL(/\/cases(\/.*)?$/);

    if (shouldDisableOTP) {
      console.warn('Attempting to disable TOTP.');
      const navigationBar = new NavigationBar(this.page);
      const preferencesPage = new PreferencesPage(this.page);
      const keycloakConfirmationDialog = new KeycloakConfirmationDialog(this.page);

      await navigationBar.navigateTo(NavigationMenuItem.Preferences);

      await preferencesPage.deleteOtpDeviceByName('TOTP device No 1');

      await keycloakConfirmationDialog.clickConfirmationButton();

      console.log('TOTP disabled!');
    }
  }

  public async loginWithTotpApp(totpSecret: string) {
    const loginPage = new LoginPage(this.page);
    const keycloakSignInPage = new KeycloakSignInPage(this.page);
    const keycloakOtpForm = new KeycloakOtpForm(this.page);
    const callCentersPage = new CallCentersPage(this.page);

    await loginPage.open();
    await loginPage.acceptNecessaryCookies();
    await loginPage.clickSignInButton();
    await keycloakSignInPage.signIn(this.email, this.password, true);

    const { otp } = await TOTP.generate(totpSecret);
    await keycloakOtpForm.signIn(otp);

    await expect(this.page).toHaveURL(/\/(cases|call-centers)(\/.*)?$/);
    if (this.page.url().includes('/call-centers')) {
      await callCentersPage.selectCallCenter(this.callCenterName);
    }
    await expect(this.page).toHaveURL(/\/cases(\/.*)?$/);
  }

  public async closeCase(casePage: CasePage) {
    // Create a temporary WebSocket monitor for this operation
    // const workerId = `agent_close_${process.pid || 'unknown'}_${Date.now()}`;
    // const websocketMonitor = new WebSocketMonitor(this.page, workerId);
    // await websocketMonitor.initialize();
    // await websocketMonitor.startConnectionMonitoring();

    // const casePage = new CasePage(this.page);
    // const casesPage = new CasesPage(this.page, websocketMonitor);
    // await casesPage.open();
    // await casesPage.takeOrSelectCaseWithServiceId(serviceId, true);
    await casePage.clickCloseCaseButton();
    await expect(this.page.getByTestId('success-cases-page-close-case-message')).toBeVisible();

    /*     // Cleanup the temporary monitor
    await websocketMonitor.cleanup(); */
  }

  public async fileCase(page: Page, serviceId: string, agentOwnsCaseAlready = false) {
    // Create a temporary WebSocket monitor for this operation
    const workerId = `agent_file_${process.pid || 'unknown'}_${Date.now()}`;
    const websocketMonitor = new WebSocketMonitor(page, workerId);
    await websocketMonitor.initialize();
    await websocketMonitor.startConnectionMonitoring();

    const casesPage = new CasesPage(page, websocketMonitor);
    await casesPage.open();
    await casesPage.takeOrSelectCaseWithServiceId(serviceId, agentOwnsCaseAlready);

    const casePage = new CasePage(page);
    await casePage.fileCase();

    //If case page has missing translations, it will fail the test
    await checkMissingTranslations();

    // Cleanup the temporary monitor
    await websocketMonitor.cleanup();
  }

  public async logout() {
    const navigationBar = new NavigationBar(this.page);
    const loginPage = new LoginPage(this.page);

    await navigationBar.clickDropdownMenuIcon();
    await navigationBar.clickMenuItemLogout();

    await expect(loginPage.welcomeHeading).toBeVisible();
  }
}
