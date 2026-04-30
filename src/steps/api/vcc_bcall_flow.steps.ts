import { Given, Then, When, expect } from '@bdd/fixtures';
import type { SoftcarWorld } from '@bdd/fixtures';

Given('the default {string} softcar request data', async function(this: SoftcarWorld, destination: string) {
  this.activate(destination);
  const s = this.softcarState as Record<string, unknown>;
  expect(s.startRequestBodyFilePath, 'Missing start request body file path in scenario data.').toBeTruthy();
  expect(s.updateRequestBodyFilePath, 'Missing update request body file path in scenario data.').toBeTruthy();
  expect(s.terminateRequestBodyFilePath, 'Missing terminate request body file path in scenario data.').toBeTruthy();
});

When('I start the softcar service towards {string}', async function(this: SoftcarWorld, destination: string) {
  this.activate(destination);
  const s = this.softcarState as Record<string, any>;
  s.destination = destination;
  s.createResponse = await this.activeClient.startService({
    requestBodyFilePath: s.startRequestBodyFilePath!,
  });
  s.serviceId = s.createResponse.serviceId;
});

Then('the service is created successfully', async function(this: SoftcarWorld) {
  const s = this.softcarState as Record<string, any>;
  expect(s.createResponse, 'Expected the create-service request to run first.').toBeDefined();
  expect(
    s.createResponse?.ok,
    `Create service failed with status ${s.createResponse?.status}: ${s.createResponse?.body}`,
  ).toBeTruthy();
  expect(s.serviceId, `Could not extract a serviceId from: ${s.createResponse?.body}`).toBeTruthy();
});

When('I send the softcar position update towards {string}', async function(this: SoftcarWorld, destination: string) {
  this.activate(destination);
  const s = this.softcarState as Record<string, any>;
  expect(s.serviceId, 'Cannot send update before a serviceId is available.').toBeTruthy();
  expect(s.updateRequestBodyFilePath, 'Missing update request body file path in scenario data.').toBeTruthy();
  s.destination = destination;
  s.updateResponse = await this.activeClient.sendUpdate({
    serviceId: s.serviceId!,
    requestBodyFilePath: s.updateRequestBodyFilePath!,
    serviceIdentifierType: s.serviceIdentifierType,
  });
});

Then('the position update is accepted', async function(this: SoftcarWorld) {
  const s = this.softcarState as Record<string, any>;
  expect(s.updateResponse, 'Expected the update request to run first.').toBeDefined();
  expect(
    s.updateResponse?.ok,
    `Update request failed with status ${s.updateResponse?.status}: ${s.updateResponse?.body}`,
  ).toBeTruthy();
});

When(
  'I terminate the softcar service towards {string} with reason {string}',
  async function(this: SoftcarWorld, destination: string, terminateReason: string) {
    this.activate(destination);
    const s = this.softcarState as Record<string, any>;
    expect(s.serviceId, 'Cannot terminate before a serviceId is available.').toBeTruthy();
    expect(s.terminateRequestBodyFilePath, 'Missing terminate request body file path in scenario data.').toBeTruthy();
    s.destination = destination;
    s.terminateReason = terminateReason;
    s.terminateResponse = await this.activeClient.terminate({
      serviceId: s.serviceId!,
      requestBodyFilePath: s.terminateRequestBodyFilePath!,
      serviceIdentifierType: s.serviceIdentifierType,
    });
  },
);

Then('the termination acknowledgement is accepted', async function(this: SoftcarWorld) {
  const s = this.softcarState as Record<string, any>;
  expect(s.terminateResponse, 'Expected the terminate request to run first.').toBeDefined();
  expect(
    s.terminateResponse?.ok,
    `Terminate request failed with status ${s.terminateResponse?.status}: ${s.terminateResponse?.body}`,
  ).toBeTruthy();
});
