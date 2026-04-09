import { Given, Then, When, expect } from '../../bdd/fixtures';

Given('the default C3 softcar request data', async ({ c3SoftcarState }) => {
  expect(c3SoftcarState.vin).toBeTruthy();
  expect(c3SoftcarState.serviceType).toBeTruthy();
  expect(c3SoftcarState.initialPosition).toContain(',');
  expect(c3SoftcarState.updatePosition).toContain(',');
});

When('I start the softcar service towards {string}', async ({ c3SoftcarClient, c3SoftcarState }, destination: string) => {
  c3SoftcarState.destination = destination;
  c3SoftcarState.createResponse = await c3SoftcarClient.startService({
    vin: c3SoftcarState.vin,
    serviceType: c3SoftcarState.serviceType,
    routingCallCenterId: c3SoftcarState.routingCallCenterId,
    position: c3SoftcarState.initialPosition,
    destination,
    startRequestBody: c3SoftcarState.startRequestBody,
  });
  c3SoftcarState.serviceId = c3SoftcarState.createResponse.serviceId;
});

Then('the service is created successfully', async ({ c3SoftcarState }) => {
  expect(c3SoftcarState.createResponse, 'Expected the create-service request to run first.').toBeDefined();
  expect(
    c3SoftcarState.createResponse?.ok,
    `Create service failed with status ${c3SoftcarState.createResponse?.status}: ${c3SoftcarState.createResponse?.body}`,
  ).toBeTruthy();
  expect(c3SoftcarState.serviceId, `Could not extract a serviceId from: ${c3SoftcarState.createResponse?.body}`).toBeTruthy();
});

When('I send the softcar position update towards {string}', async ({ c3SoftcarClient, c3SoftcarState }, destination: string) => {
  expect(c3SoftcarState.serviceId, 'Cannot send update before a serviceId is available.').toBeTruthy();
  c3SoftcarState.destination = destination;
  c3SoftcarState.updateResponse = await c3SoftcarClient.sendUpdate({
    vin: c3SoftcarState.vin,
    serviceId: c3SoftcarState.serviceId!,
    serviceType: c3SoftcarState.serviceType,
    position: c3SoftcarState.updatePosition,
    destination,
  });
});

Then('the position update is accepted', async ({ c3SoftcarState }) => {
  expect(c3SoftcarState.updateResponse, 'Expected the update request to run first.').toBeDefined();
  expect(
    c3SoftcarState.updateResponse?.ok,
    `Update request failed with status ${c3SoftcarState.updateResponse?.status}: ${c3SoftcarState.updateResponse?.body}`,
  ).toBeTruthy();
});

When(
  'I terminate the softcar service towards {string} with reason {string}',
  async ({ c3SoftcarClient, c3SoftcarState }, destination: string, terminateReason: string) => {
    expect(c3SoftcarState.serviceId, 'Cannot terminate before a serviceId is available.').toBeTruthy();
    c3SoftcarState.destination = destination;
    c3SoftcarState.terminateReason = terminateReason;
    c3SoftcarState.terminateResponse = await c3SoftcarClient.terminate({
      vin: c3SoftcarState.vin,
      serviceId: c3SoftcarState.serviceId!,
      serviceType: c3SoftcarState.serviceType,
      terminateReason,
      destination,
    });
  },
);

Then('the termination acknowledgement is accepted', async ({ c3SoftcarState }) => {
  expect(c3SoftcarState.terminateResponse, 'Expected the terminate request to run first.').toBeDefined();
  expect(
    c3SoftcarState.terminateResponse?.ok,
    `Terminate request failed with status ${c3SoftcarState.terminateResponse?.status}: ${c3SoftcarState.terminateResponse?.body}`,
  ).toBeTruthy();
});

