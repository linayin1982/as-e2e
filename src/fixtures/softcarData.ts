import type { ApiCallResult, StartServiceResult } from '../support/api/c3SoftcarClient';
import type { C3SoftcarEnv } from '../support/c3env';

export interface SoftcarScenarioState {
  vin: string;
  serviceType: string;
  routingCallCenterId: string;
  initialPosition: string;
  updatePosition: string;
  destination: string;
  terminateReason: string;
  startRequestBody: Record<string, unknown>;
  serviceId?: string;
  createResponse?: StartServiceResult;
  updateResponse?: ApiCallResult;
  terminateResponse?: ApiCallResult;
}

export function createDefaultSoftcarState(env: C3SoftcarEnv): SoftcarScenarioState {
  return {
    vin: env.defaultVin,
    serviceType: env.defaultServiceType,
    routingCallCenterId: env.routingCallCenterId,
    initialPosition: env.initialPosition,
    updatePosition: env.updatePosition,
    destination: env.defaultDestination,
    terminateReason: env.terminateReason,
    startRequestBody: env.startRequestBody,
  };
}

