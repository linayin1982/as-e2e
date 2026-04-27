import { Given, Then, When, expect } from '../../bdd/fixtures';
import type { SoftcarWorld } from '../../bdd/fixtures';
Given('the default {string} softcar request data', async function(this: SoftcarWorld, destination: string) {
  this.activeDestination = destination;
  const { state } = this.resolveFixtures(destination);
  expect(state.vin).toBeTruthy();
  expect(state.serviceType).toBeTruthy();
  expect(state.initialPosition).toContain(',');
  expect(state.updatePosition).toContain(',');
});
When('I start the softcar service towards {string}', async function(this: SoftcarWorld, destination: string) {
  this.activeDestination = destination;
  const { client, state } = this.resolveFixtures(destination);
  state.destination = destination;
  state.createResponse = await client.startService({
    vin: state.vin,
    serviceType: state.serviceType,
    routingCallCenterId: state.routingCallCenterId,
    position: state.initialPosition,
    destination,
    startRequestBody: state.startRequestBody,
  });
  state.serviceId = state.createResponse.serviceId;
});
Then('the service is created successfully', async function(this: SoftcarWorld) {
  const { state } = this.resolveFixtures(this.activeDestination);
  expect(state.createResponse, 'Expected the create-service request to run first.').toBeDefined();
  expect(
    state.createResponse?.ok,
    `Create service failed with status ${state.createResponse?.status}: ${state.createResponse?.body}`,
  ).toBeTruthy();
  expect(state.serviceId, `Could not extract a serviceId from: ${state.createResponse?.body}`).toBeTruthy();
});
When('I send the softcar position update towards {string}', async function(this: SoftcarWorld, destination: string) {
  this.activeDestination = destination;
  const { client, state } = this.resolveFixtures(destination);
  expect(state.serviceId, 'Cannot send update before a serviceId is available.').toBeTruthy();
  state.destination = destination;
  state.updateResponse = await client.sendUpdate({
    vin: state.vin,
    serviceId: state.serviceId!,
    serviceType: state.serviceType,
    position: state.updatePosition,
    destination,
  });
});
Then('the position update is accepted', async function(this: SoftcarWorld) {
  const { state } = this.resolveFixtures(this.activeDestination);
  expect(state.updateResponse, 'Expected the update request to run first.').toBeDefined();
  expect(
    state.updateResponse?.ok,
    `Update request failed with status ${state.updateResponse?.status}: ${state.updateResponse?.body}`,
  ).toBeTruthy();
});
When(
  'I terminate the softcar service towards {string} with reason {string}',
  async function(this: SoftcarWorld, destination: string, terminateReason: string) {
    this.activeDestination = destination;
    const { client, state } = this.resolveFixtures(destination);
    expect(state.serviceId, 'Cannot terminate before a serviceId is available.').toBeTruthy();
    state.destination = destination;
    state.terminateReason = terminateReason;
    state.terminateResponse = await client.terminate({
      vin: state.vin,
      serviceId: state.serviceId!,
      serviceType: state.serviceType,
      terminateReason,
      destination,
    });
  },
);
Then('the termination acknowledgement is accepted', async function(this: SoftcarWorld) {
  const { state } = this.resolveFixtures(this.activeDestination);
  expect(state.terminateResponse, 'Expected the terminate request to run first.').toBeDefined();
  expect(
    state.terminateResponse?.ok,
    `Terminate request failed with status ${state.terminateResponse?.status}: ${state.terminateResponse?.body}`,
  ).toBeTruthy();
});
