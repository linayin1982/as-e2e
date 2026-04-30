import type { ApiCallResult, StartServiceResult } from '@support/api/xCallEnablingClient.js';
import type { BaseEnv } from '@support/env.js';
import { resolve } from 'node:path';

export interface ServiceScenarioState {
  vin: string;
  routingCallCenterId: string;
  serviceType?: string;
  initialPosition?: string;
  updatePosition?: string;
  destination?: string;
  terminateReason?: string;
  serviceId?: string;
  serviceIdentifierType?: string;
  startRequestBodyFilePath?: string;
  updateRequestBodyFilePath?: string;
  terminateRequestBodyFilePath?: string;
  createResponse?: StartServiceResult;
  updateResponse?: ApiCallResult;
  terminateResponse?: ApiCallResult;
}

export function createBCallServiceState(env: BaseEnv): ServiceScenarioState {
  const dataDir = resolve(process.cwd(), 'src', 'bdd', 'data');
  return {
    vin: env.defaultVin,
    routingCallCenterId: env.routingCallCenterId,
    serviceType: 'BCALL',
    startRequestBodyFilePath: resolve(dataDir, 'BCALL_START_REQUEST_BODY.json'),
    updateRequestBodyFilePath: resolve(dataDir, 'BCALL_UPDATE_REQUEST_BODY.json'),
    terminateRequestBodyFilePath: resolve(dataDir, 'BCALL_TERMINATE_REQUEST_BODY.json'),
  };
}

