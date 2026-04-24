import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ActiveCasePage extends BasePage {
  // Case tabs
  readonly activeCaseContentTab: Locator;
  readonly notesTab: Locator;
  readonly reportTab: Locator;

  /**
   * Ownership notice banner — visible when the current user owns this live case.
   * Text: "You have ownership of this case. If the call ends unexpectedly,
   *        please call the vehicle back."
   * Contains two dismiss buttons (left and right of the message).
   */
  readonly ownershipNoticeBanner: Locator;
  readonly ownershipNoticeText: Locator;
  readonly dismissOwnershipNoticeButton: Locator;

  // Case header / actions
  readonly takenStatusBadge: Locator;
  readonly closeFlowStep: Locator;
  readonly reportFlowStep: Locator;
  readonly closeCaseButton: Locator;

  // Service section
  readonly serviceHeading: Locator;
  readonly serviceEventsButton: Locator;
  readonly triggeredByValue: Locator;
  readonly startedValue: Locator;
  readonly statusValue: Locator;
  /**
   * Only present when the case status is "Terminated" or similar closed states.
   * Not visible for live/ongoing cases (e.g. "Clear call requested").
   */
  readonly statusReasonValue: Locator;

  // Summary section
  readonly summaryHeading: Locator;
  readonly mainInfoTab: Locator;
  readonly customerTab: Locator;
  readonly vehicleTab: Locator;
  readonly subscriptionsTab: Locator;

  // Summary - Main info tab fields
  readonly vinRegion: Locator;
  readonly brandRegion: Locator;
  readonly engineRegion: Locator;
  readonly registrationCountryRegion: Locator;
  readonly productionDateRegion: Locator;
  readonly licensePlateRegion: Locator;
  readonly vehiclePhoneRegion: Locator;
  readonly deviceRegion: Locator;
  readonly modelYearRegion: Locator;
  readonly exteriorColorRegion: Locator;
  readonly softwareVersionRegion: Locator;

  // Summary - Customer tab
  /** Shown when the case has no associated customer data. */
  readonly noCustomerInfoMessage: Locator;

  // Summary - Vehicle tab (superset of Main info; adds the fields below)
  readonly engineTypeRegion: Locator;
  readonly fuelTypeRegion: Locator;
  readonly numberOfDoorsRegion: Locator;
  readonly deliveryDateRegion: Locator;
  readonly bodyStyleRegion: Locator;
  readonly transmissionTypeRegion: Locator;
  readonly trimRegion: Locator;

  // Summary - Subscriptions tab
  /** Shown when no subscriptions are linked to the vehicle. */
  readonly noSubscriptionsMessage: Locator;

  // Warning lights section
  readonly warningLightsHeading: Locator;
  /** Shown when no warning light data is available for the vehicle. */
  readonly noWarningDataMessage: Locator;

  // Vehicle status section
  readonly vehicleStatusHeading: Locator;
  readonly allDataButton: Locator;
  readonly vehicleStatusMainInfoTab: Locator;
  readonly vehicleStatusExteriorFeaturesTab: Locator;
  readonly vehicleStatusTiresTab: Locator;

  // Vehicle status - Main info tab fields
  readonly fuelRegion: Locator;
  readonly fuelLevelRegion: Locator;
  readonly batteryRegion: Locator;
  readonly brakeFluidRegion: Locator;
  readonly oilRegion: Locator;
  readonly engineCoolantRegion: Locator;
  readonly engineStatusRegion: Locator;
  readonly srsStatusRegion: Locator;
  readonly vehicleStateRegion: Locator;
  readonly exteriorTemperatureRegion: Locator;
  readonly interiorTemperatureRegion: Locator;
  readonly powerSourceRegion: Locator;
  readonly serviceRequiredDistanceRegion: Locator;
  readonly serviceRequiredDaysRegion: Locator;

  // Vehicle status - Exterior features tab
  readonly doorsHeading: Locator;
  readonly centralLockingStatus: Locator;
  readonly frontDoorsSection: Locator;
  readonly frontLeftDoorStatus: Locator;
  readonly frontRightDoorStatus: Locator;
  readonly rearDoorsSection: Locator;
  readonly rearLeftDoorStatus: Locator;
  readonly rearRightDoorStatus: Locator;
  readonly windowsHeading: Locator;
  readonly frontLeftWindowStatus: Locator;
  readonly frontRightWindowStatus: Locator;
  readonly rearLeftWindowStatus: Locator;
  readonly rearRightWindowStatus: Locator;
  readonly sunroofWindowStatus: Locator;
  readonly hoodAndTrunkHeading: Locator;
  /** Shown when hood/trunk data is unavailable. */
  readonly noHoodTrunkInfoMessage: Locator;

  // Vehicle status - Tires tab
  readonly tirePressureHeading: Locator;
  /** Shown when tire pressure data is unavailable for the vehicle. */
  readonly noTirePressureMessage: Locator;

  // Emergency information panel
  readonly emergencyInfoHeading: Locator;
  readonly callStartTimeValue: Locator;
  readonly numberOfOccupantsValue: Locator;

  // Service events dialog
  readonly serviceEventsDialog: Locator;
  readonly serviceEventsDialogHeading: Locator;
  readonly serviceEventsDialogCloseButton: Locator;
  readonly serviceEventsEventColumnHeader: Locator;
  readonly serviceEventsTimestampColumnHeader: Locator;
  /** All event rows inside the Service events dialog. */
  readonly serviceEventsRows: Locator;

  // All data dialog
  readonly allDataDialog: Locator;
  readonly allDataDialogHeading: Locator;
  readonly allDataDialogCloseButton: Locator;
  readonly allDataSearchInput: Locator;
  readonly allDataAlphabeticalOrderButton: Locator;
  /**
   * All key-value rows inside the "Vehicle Status (all data)" dialog.
   * Each row contains a key (status name) and a clickable value.
   */
  readonly allDataRows: Locator;

  // Map / location panel
  readonly addressValue: Locator;
  /**
   * Enabled for live/ongoing cases; disabled for terminated/historical cases.
   */
  readonly updateVehiclePositionButton: Locator;
  readonly latitudeValue: Locator;
  readonly longitudeValue: Locator;
  readonly headingValue: Locator;
  readonly expandPoiSearchButton: Locator;
  readonly centerMapButton: Locator;
  readonly chooseViewButton: Locator;
  readonly zoomInButton: Locator;
  readonly zoomOutButton: Locator;

  constructor(page: Page) {
    super(page);

    this.activeCaseContentTab = page.getByRole('tab', { name: 'Active case' });
    this.notesTab = page.getByRole('tab', { name: 'Notes' });
    this.reportTab = page.getByRole('tab', { name: 'Report' });

    this.ownershipNoticeText = page.getByText('You have ownership of this case');
    this.ownershipNoticeBanner = this.ownershipNoticeText.locator('..');
    this.dismissOwnershipNoticeButton = this.ownershipNoticeBanner.locator('img').first();

    this.takenStatusBadge = page.getByText('Taken');
    this.closeFlowStep = page.getByText('Close');
    this.reportFlowStep = page.getByText('Report');
    this.closeCaseButton = page.getByRole('button', { name: 'Close case' });

    this.serviceHeading = page.getByRole('heading', { name: 'Service', level: 2 });
    this.serviceEventsButton = page.getByRole('button', { name: 'Service events' });
    this.triggeredByValue = page.getByText('Triggered by').locator('..').getByText(/Car button|System/);
    this.startedValue = page.getByText('Started').locator('..');
    this.statusValue = page.getByText('Status').first().locator('..');
    this.statusReasonValue = page.getByText('Status reason').locator('..');

    this.summaryHeading = page.getByRole('heading', { name: 'Summary', level: 2 });
    this.mainInfoTab = page.getByRole('tab', { name: 'Main info' }).first();
    this.customerTab = page.getByRole('tab', { name: 'Customer' });
    this.vehicleTab = page.getByRole('tab', { name: 'Vehicle' });
    this.subscriptionsTab = page.getByRole('tab', { name: 'Subscriptions' });

    this.vinRegion = page.getByRole('region', { name: 'VIN' });
    this.brandRegion = page.getByRole('region', { name: 'Brand' });
    this.engineRegion = page.getByRole('region', { name: 'Engine' });
    this.registrationCountryRegion = page.getByRole('region', { name: 'Registration country' });
    this.productionDateRegion = page.getByRole('region', { name: 'Production date' });
    this.licensePlateRegion = page.getByRole('region', { name: 'License plate' });
    this.vehiclePhoneRegion = page.getByRole('region', { name: 'Vehicle phone number' });
    this.deviceRegion = page.getByRole('region', { name: 'Device' });
    this.modelYearRegion = page.getByRole('region', { name: 'Model / Year' });
    this.exteriorColorRegion = page.getByRole('region', { name: 'Exterior color' });
    this.softwareVersionRegion = page.getByRole('region', { name: 'Software version' });

    this.noCustomerInfoMessage = page.getByText('There is no information regarding this customer.');

    this.engineTypeRegion = page.getByRole('region', { name: 'Engine type' });
    this.fuelTypeRegion = page.getByRole('region', { name: 'Fuel type' });
    this.numberOfDoorsRegion = page.getByRole('region', { name: 'Number of doors' });
    this.deliveryDateRegion = page.getByRole('region', { name: 'Delivery date' });
    this.bodyStyleRegion = page.getByRole('region', { name: 'Body style' });
    this.transmissionTypeRegion = page.getByRole('region', { name: 'Transmission type' });
    this.trimRegion = page.getByRole('region', { name: 'Trim' });

    this.noSubscriptionsMessage = page.getByText('No subscriptions associated with this vehicle.');

    this.warningLightsHeading = page.getByRole('heading', { name: 'Warning lights', level: 2 });
    this.noWarningDataMessage = page.getByText('There is no warning data available for this vehicle');

    this.vehicleStatusHeading = page.getByRole('heading', { name: 'Vehicle status', level: 2 });
    this.allDataButton = page.getByRole('button', { name: 'All data' });
    this.vehicleStatusMainInfoTab = page.getByRole('tab', { name: 'Main info' }).last();
    this.vehicleStatusExteriorFeaturesTab = page.getByRole('tab', { name: 'Exterior features' });
    this.vehicleStatusTiresTab = page.getByRole('tab', { name: 'Tires' });

    this.fuelRegion = page.getByRole('region', { name: 'Fuel' });
    this.fuelLevelRegion = page.getByRole('region', { name: 'Fuel level' });
    this.batteryRegion = page.getByRole('region', { name: 'Battery' });
    this.brakeFluidRegion = page.getByRole('region', { name: 'Brake fluid' });
    this.oilRegion = page.getByRole('region', { name: 'Oil' });
    this.engineCoolantRegion = page.getByRole('region', { name: 'Engine coolant' });
    this.engineStatusRegion = page.getByRole('region', { name: 'Engine status' });
    this.srsStatusRegion = page.getByRole('region', { name: 'SRS status' });
    this.vehicleStateRegion = page.getByRole('region', { name: 'Vehicle state' });
    this.exteriorTemperatureRegion = page.getByRole('region', { name: 'Exterior temperature' });
    this.interiorTemperatureRegion = page.getByRole('region', { name: 'Interior temperature' });
    this.powerSourceRegion = page.getByRole('region', { name: 'Power source' });
    this.serviceRequiredDistanceRegion = page.getByRole('region', { name: 'Service required' }).first();
    this.serviceRequiredDaysRegion = page.getByRole('region', { name: 'Service required' }).last();

    this.doorsHeading = page.getByText('Doors');
    this.centralLockingStatus = page.getByText(/Central locking:/);
    this.frontDoorsSection = page.getByText('Front doors').locator('..');
    this.frontLeftDoorStatus = page.getByText(/Left door:/).first();
    this.frontRightDoorStatus = page.getByText(/Right door:/).first();
    this.rearDoorsSection = page.getByText('Rear doors').locator('..');
    this.rearLeftDoorStatus = page.getByText(/Left door:/).last();
    this.rearRightDoorStatus = page.getByText(/Right door:/).last();
    this.windowsHeading = page.getByText('Windows');
    this.frontLeftWindowStatus = page.getByText(/Left window:/).first();
    this.frontRightWindowStatus = page.getByText(/Right window:/).first();
    this.rearLeftWindowStatus = page.getByText(/Left window:/).last();
    this.rearRightWindowStatus = page.getByText(/Right window:/).last();
    this.sunroofWindowStatus = page.getByText(/Sunroof window:/);
    this.hoodAndTrunkHeading = page.getByText('Hood and trunk');
    this.noHoodTrunkInfoMessage = page.getByText("There is no information about this vehicle's hood and trunk.");

    this.tirePressureHeading = page.getByText('Tire pressure');
    this.noTirePressureMessage = page.getByText('There is no tire pressure data available for this vehicle');

    this.serviceEventsDialog = page.getByRole('dialog');
    this.serviceEventsDialogHeading = this.serviceEventsDialog.getByRole('heading', { name: 'Service events', level: 3 });
    this.serviceEventsDialogCloseButton = this.serviceEventsDialog.locator('img').first();
    this.serviceEventsEventColumnHeader = this.serviceEventsDialog.getByText('Event');
    this.serviceEventsTimestampColumnHeader = this.serviceEventsDialog.getByText('Timestamp');
    this.serviceEventsRows = this.serviceEventsDialog.locator('document > generic > generic').nth(1).locator('> generic');

    this.allDataDialog = page.getByRole('dialog');
    this.allDataDialogHeading = this.allDataDialog.getByRole('heading', { name: 'Vehicle Status (all data)', level: 2 });
    this.allDataDialogCloseButton = this.allDataDialog.locator('img').first();
    this.allDataSearchInput = this.allDataDialog.getByRole('textbox', { name: 'Search status by name' });
    this.allDataAlphabeticalOrderButton = this.allDataDialog.getByRole('button', { name: 'Alphabetical order' });
    this.allDataRows = this.allDataDialog.locator('[role="document"] > div > div').last().locator('> div');

    this.emergencyInfoHeading = page.getByRole('heading', { name: 'Emergency Information', level: 2 });
    this.callStartTimeValue = page.getByText('Call start time').locator('..').locator('div').last();
    this.numberOfOccupantsValue = page.getByText('Number of occupants').locator('..').locator('div').last();

    this.addressValue = page.getByText('Address').locator('..').locator('div').last();
    this.updateVehiclePositionButton = page.getByRole('button', { name: 'Update vehicle position' });
    this.latitudeValue = page.getByText('Latitude').locator('..').locator('div').last();
    this.longitudeValue = page.getByText('Longitude').locator('..').locator('div').last();
    this.headingValue = page.getByText('Heading').locator('..').locator('div').last();
    this.expandPoiSearchButton = page.getByRole('button', { name: 'Expand POI search' });
    this.centerMapButton = page.getByText('Center map on vehicle');
    this.chooseViewButton = page.getByText('Choose view');
    this.zoomInButton = page.getByText('Zoom in');
    this.zoomOutButton = page.getByText('Zoom out');
  }

  async goToNotesTab(): Promise<void> {
    await this.notesTab.click();
  }

  async goToReportTab(): Promise<void> {
    await this.reportTab.click();
  }

  async goToActiveCaseTab(): Promise<void> {
    await this.activeCaseContentTab.click();
  }

  /** Dismisses the ownership notice banner if it is visible. */
  async dismissOwnershipNotice(): Promise<void> {
    if (await this.ownershipNoticeBanner.isVisible()) {
      await this.dismissOwnershipNoticeButton.click();
    }
  }

  /** Returns true when the user owns this case and the notice banner is shown. */
  async isOwnershipNoticeVisible(): Promise<boolean> {
    return this.ownershipNoticeText.isVisible();
  }

  async selectSummaryTab(tab: 'mainInfo' | 'customer' | 'vehicle' | 'subscriptions'): Promise<void> {
    const tabMap = {
      mainInfo: this.mainInfoTab,
      customer: this.customerTab,
      vehicle: this.vehicleTab,
      subscriptions: this.subscriptionsTab,
    };
    await tabMap[tab].click();
  }

  async selectVehicleStatusTab(tab: 'mainInfo' | 'exteriorFeatures' | 'tires'): Promise<void> {
    const tabMap = {
      mainInfo: this.vehicleStatusMainInfoTab,
      exteriorFeatures: this.vehicleStatusExteriorFeaturesTab,
      tires: this.vehicleStatusTiresTab,
    };
    await tabMap[tab].click();
  }

  /** Opens the Service events dialog. */
  async openServiceEventsDialog(): Promise<void> {
    await this.serviceEventsButton.click();
  }

  /** Closes the Service events dialog. */
  async closeServiceEventsDialog(): Promise<void> {
    await this.serviceEventsDialogCloseButton.click();
  }

  /** Opens the "Vehicle Status (all data)" dialog. */
  async openAllDataDialog(): Promise<void> {
    await this.allDataButton.click();
  }

  /** Closes the "Vehicle Status (all data)" dialog. */
  async closeAllDataDialog(): Promise<void> {
    await this.allDataDialogCloseButton.click();
  }

  /**
   * Returns the value locator for a given raw status key in the All data dialog.
   * Example keys: 'centralLockStatus', 'fuelLevelPerc', 'DOOR_ALL_LOCK_STATUS'
   */
  getAllDataValueByKey(key: string): Locator {
    return this.allDataDialog.getByText(key, { exact: true }).locator('..').locator('div').last();
  }

  async closeCase(): Promise<void> {
    await this.closeCaseButton.click();
  }

  async getVin(): Promise<string> {
    return (await this.vinRegion.textContent()) ?? '';
  }
}
