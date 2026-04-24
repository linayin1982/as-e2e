import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Vehicle detail page — reached by searching a VIN in the global search bar
 * and selecting the autocomplete result.
 *
 * URL pattern: /vehicles/:vin?vehicleIdentifierType=VIN
 *
 * Sections:
 * 1. Summary     — Customer / Vehicle / Subscriptions tabs
 * 2. Remote services — SVT, POI, RDU, RVI, Assistance, RCS action buttons
 * 3. Vehicle History — historical cases table with expandable rows
 */
export class VehiclePage extends BasePage {
  // ─── Summary section ───────────────────────────────────────────────────────

  readonly summaryHeading: Locator;

  // Summary tabs
  readonly customerTab: Locator;
  readonly vehicleTab: Locator;
  readonly subscriptionsTab: Locator;

  // Summary - Customer tab
  /** Shown when no customer data is linked to the vehicle. */
  readonly noCustomerInfoMessage: Locator;

  // Summary - Vehicle tab fields
  readonly vinValue: Locator;
  readonly brandRegion: Locator;
  readonly engineRegion: Locator;
  readonly registrationCountryRegion: Locator;
  readonly productionDateRegion: Locator;
  readonly engineTypeRegion: Locator;
  readonly licensePlateRegion: Locator;
  readonly vehiclePhoneRegion: Locator;
  readonly fuelTypeRegion: Locator;
  readonly modelYearRegion: Locator;
  readonly exteriorColorRegion: Locator;
  readonly deviceRegion: Locator;
  readonly numberOfDoorsRegion: Locator;
  readonly deliveryDateRegion: Locator;
  readonly bodyStyleRegion: Locator;
  readonly transmissionTypeRegion: Locator;
  readonly trimRegion: Locator;
  readonly softwareVersionRegion: Locator;

  // Summary - Subscriptions tab
  /** Shown when no subscriptions are linked to the vehicle. */
  readonly noSubscriptionsMessage: Locator;

  // ─── Remote services section ────────────────────────────────────────────────

  readonly remoteServicesHeading: Locator;

  // Remote service trigger buttons
  readonly svtButton: Locator;
  readonly poiButton: Locator;
  readonly rduButton: Locator;
  readonly rviButton: Locator;
  readonly assistanceButton: Locator;
  readonly rcsButton: Locator;

  // SVT confirmation dialog
  readonly remoteServiceDialog: Locator;
  readonly svtDialogHeading: Locator;
  readonly svtDialogCloseButton: Locator;
  readonly svtCancelButton: Locator;
  readonly svtStartButton: Locator;

  // POI dialog (has embedded map + search)
  readonly poiDialogHeading: Locator;
  readonly poiDialogCloseButton: Locator;
  readonly poiSearchInput: Locator;
  readonly poiSearchButton: Locator;
  readonly poiCancelButton: Locator;
  /**
   * Disabled until a point of interest is selected via the search input.
   */
  readonly poiStartButton: Locator;

  // ─── Vehicle History section ────────────────────────────────────────────────

  readonly vehicleHistoryHeading: Locator;
  /** "Showing you historical cases for the last 200 days." */
  readonly vehicleHistorySubtitle: Locator;

  // History table column headers
  readonly historyServiceColumnHeader: Locator;
  readonly historyStartDateColumnHeader: Locator;
  readonly historyClosedDateColumnHeader: Locator;
  readonly historyCallCenterColumnHeader: Locator;
  readonly historyAgentColumnHeader: Locator;

  /** All history rows (each represents one historical case). */
  readonly historyRows: Locator;

  // Expanded history row detail sub-columns
  /** "Service" sub-column header inside an expanded history row. */
  readonly expandedServiceSubColumn: Locator;
  /** "Started" sub-column header inside an expanded history row. */
  readonly expandedStartedSubColumn: Locator;
  /** "Status" sub-column header inside an expanded history row. */
  readonly expandedStatusSubColumn: Locator;
  /** "Reason" sub-column header inside an expanded history row. */
  readonly expandedReasonSubColumn: Locator;

  constructor(page: Page) {
    super(page);

    // Summary
    this.summaryHeading = page.getByRole('heading', { name: 'Summary', level: 2 });
    this.customerTab = page.getByRole('tab', { name: 'Customer' });
    this.vehicleTab = page.getByRole('tab', { name: 'Vehicle' });
    this.subscriptionsTab = page.getByRole('tab', { name: 'Subscriptions' });

    this.noCustomerInfoMessage = page.getByText('There is no information regarding this customer.');
    this.noSubscriptionsMessage = page.getByText('No subscriptions associated with this vehicle.');

    // Vehicle tab fields
    this.vinValue = page.getByText('VIN').locator('..').locator('div').last();
    this.brandRegion = page.getByRole('region', { name: 'Brand' });
    this.engineRegion = page.getByRole('region', { name: 'Engine' });
    this.registrationCountryRegion = page.getByRole('region', { name: 'Registration country' });
    this.productionDateRegion = page.getByRole('region', { name: 'Production date' });
    this.engineTypeRegion = page.getByRole('region', { name: 'Engine type' });
    this.licensePlateRegion = page.getByRole('region', { name: 'License plate' });
    this.vehiclePhoneRegion = page.getByRole('region', { name: 'Vehicle phone number' });
    this.fuelTypeRegion = page.getByRole('region', { name: 'Fuel type' });
    this.modelYearRegion = page.getByRole('region', { name: 'Model / Year' });
    this.exteriorColorRegion = page.getByRole('region', { name: 'Exterior color' });
    this.deviceRegion = page.getByRole('region', { name: 'Device' });
    this.numberOfDoorsRegion = page.getByRole('region', { name: 'Number of doors' });
    this.deliveryDateRegion = page.getByRole('region', { name: 'Delivery date' });
    this.bodyStyleRegion = page.getByRole('region', { name: 'Body style' });
    this.transmissionTypeRegion = page.getByRole('region', { name: 'Transmission type' });
    this.trimRegion = page.getByRole('region', { name: 'Trim' });
    this.softwareVersionRegion = page.getByRole('region', { name: 'Software version' });

    // Remote services
    this.remoteServicesHeading = page.getByRole('heading', { name: 'Remote services', level: 2 });
    this.svtButton = page.getByRole('button', { name: 'Stolen Vehicle Tracking (SVT)' });
    this.poiButton = page.getByRole('button', { name: 'Points of Interest (POI)' });
    this.rduButton = page.getByRole('button', { name: 'Remote Door Unlock (RDU)' });
    this.rviButton = page.getByRole('button', { name: 'Remote Vehicle Immobilization (RVI)' });
    this.assistanceButton = page.getByRole('button', { name: 'Assistance Call (Assistance)' });
    this.rcsButton = page.getByRole('button', { name: 'Remote Connectivity Status (RCS)' });

    this.remoteServiceDialog = page.getByRole('dialog');

    // SVT dialog
    this.svtDialogHeading = this.remoteServiceDialog.getByRole('heading', { name: 'Stolen Vehicle Tracking (SVT)', level: 2 });
    this.svtDialogCloseButton = this.remoteServiceDialog.locator('img').first();
    this.svtCancelButton = this.remoteServiceDialog.getByRole('button', { name: 'Cancel' });
    this.svtStartButton = this.remoteServiceDialog.getByRole('button', { name: 'Start SVT' });

    // POI dialog
    this.poiDialogHeading = this.remoteServiceDialog.getByRole('heading', { name: 'Points of Interest (POI)', level: 2 });
    this.poiDialogCloseButton = this.remoteServiceDialog.locator('img').first();
    this.poiSearchInput = this.remoteServiceDialog.getByRole('textbox', { name: 'Search for point of interest' });
    this.poiSearchButton = this.remoteServiceDialog.getByRole('button').filter({ hasText: /^$/ }).first();
    this.poiCancelButton = this.remoteServiceDialog.getByRole('button', { name: 'Cancel' });
    this.poiStartButton = this.remoteServiceDialog.getByRole('button', { name: 'Start POI' });

    // Vehicle History
    this.vehicleHistoryHeading = page.getByRole('heading', { name: 'Vehicle History', level: 2 });
    this.vehicleHistorySubtitle = page.getByText('Showing you historical cases for the last 200 days.');
    this.historyServiceColumnHeader = page.getByText('Service').first();
    this.historyStartDateColumnHeader = page.getByText('Start date');
    this.historyClosedDateColumnHeader = page.getByText('Closed date');
    this.historyCallCenterColumnHeader = page.getByText('Call Center Name');
    this.historyAgentColumnHeader = page.getByText('Agent');
    this.historyRows = page.locator('[role="heading"][aria-level="2"]:has-text("Vehicle History") ~ div > div > div');

    // Expanded row detail sub-columns
    this.expandedServiceSubColumn = page.getByText('Service').nth(1);
    this.expandedStartedSubColumn = page.getByText('Started');
    this.expandedStatusSubColumn = page.getByText('Status').last();
    this.expandedReasonSubColumn = page.getByText('Reason');
  }

  /** Navigate to the vehicle page for a specific VIN. */
  async goto(vin: string): Promise<void> {
    await this.page.goto(`/vehicles/${vin}?vehicleIdentifierType=VIN`);
  }

  async selectSummaryTab(tab: 'customer' | 'vehicle' | 'subscriptions'): Promise<void> {
    const tabMap = {
      customer: this.customerTab,
      vehicle: this.vehicleTab,
      subscriptions: this.subscriptionsTab,
    };
    await tabMap[tab].click();
  }

  /** Opens the SVT confirmation dialog. */
  async openSvtDialog(): Promise<void> {
    await this.svtButton.click();
  }

  /** Opens the POI dialog. */
  async openPoiDialog(): Promise<void> {
    await this.poiButton.click();
  }

  /** Opens the RDU dialog. */
  async openRduDialog(): Promise<void> {
    await this.rduButton.click();
  }

  /** Opens the RVI dialog. */
  async openRviDialog(): Promise<void> {
    await this.rviButton.click();
  }

  /** Opens the Assistance Call dialog. */
  async openAssistanceDialog(): Promise<void> {
    await this.assistanceButton.click();
  }

  /** Opens the RCS dialog. */
  async openRcsDialog(): Promise<void> {
    await this.rcsButton.click();
  }

  /**
   * Returns the "Case info" button for a given history row (0-based index).
   * Use this to open the case info panel for a specific historical case.
   */
  getCaseInfoButton(rowIndex: number): Locator {
    return this.historyRows.nth(rowIndex).getByRole('button', { name: 'Case info' });
  }

  /**
   * Returns the expand/collapse toggle button for a given history row (0-based index).
   * When expanded, a sub-row shows Service, Started, Status, Reason details
   * plus a "Service info" button.
   */
  getHistoryRowExpandButton(rowIndex: number): Locator {
    return this.historyRows.nth(rowIndex).getByRole('button').last();
  }

  /**
   * Returns the "Service info" button inside an expanded history row.
   * Must call getHistoryRowExpandButton(rowIndex).click() first.
   */
  getServiceInfoButton(rowIndex: number): Locator {
    return this.historyRows.nth(rowIndex).getByRole('button', { name: 'Service info' });
  }
}
