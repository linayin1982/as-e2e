import {normalizeBaseUrl,parseTimeout,loadRequestBody} from '@utils/utilities'

export interface C3SoftcarEnv {
  baseURL: string;
  defaultVin: string;
  defaultServiceType: string;
  routingCallCenterId: string;
  initialPosition: string;
  updatePosition: string;
  defaultDestination: string;
  terminateReason: string;
  apiTimeoutMs: number;
  startRequestBodyPath: string;
  startRequestBody: Record<string, unknown>;
}

const DEFAULT_START_REQUEST_BODY_PATH = 'src/support/c3/C3_START_REQUEST_BODY.json';

const DEFAULT_ENV = {
  baseURL: 'https://vcc-vocmo-soft-car.qa.voc.eu-west-1.wcar.aws.wcar-i.net',
  defaultVin: 'YVVDD3VK5TPC45172',
  defaultServiceType: 'ECALL',
  routingCallCenterId: '22',
  initialPosition: '57.702834,11.977007',
  updatePosition: '57.703500,11.978500',
  defaultDestination: 'C3',
  terminateReason: 'cancelledInVehicle',
  apiTimeoutMs: 30000,
};

let cachedC3Env: C3SoftcarEnv | undefined;

export function loadC3SoftcarEnv(): C3SoftcarEnv {
  if (cachedC3Env) {
    return cachedC3Env;
  }

  const startRequestBodyPath =
    process.env.C3_Start_Request_Body ?? DEFAULT_START_REQUEST_BODY_PATH;

  cachedC3Env = {
    baseURL: normalizeBaseUrl(process.env.C3_BASE_URL ?? DEFAULT_ENV.baseURL),
    defaultVin: process.env.C3_SOFTCAR_VIN ?? DEFAULT_ENV.defaultVin,
    defaultServiceType: process.env.C3_SOFTCAR_SERVICE_TYPE ?? DEFAULT_ENV.defaultServiceType,
    routingCallCenterId: process.env.C3_ROUTING_CALL_CENTER_ID ?? DEFAULT_ENV.routingCallCenterId,
    initialPosition: process.env.C3_SOFTCAR_POSITION_1 ?? DEFAULT_ENV.initialPosition,
    updatePosition: process.env.C3_SOFTCAR_POSITION_2 ?? DEFAULT_ENV.updatePosition,
    defaultDestination: process.env.C3_SOFTCAR_DESTINATION ?? DEFAULT_ENV.defaultDestination,
    terminateReason: process.env.C3_SOFTCAR_TERMINATE_REASON ?? DEFAULT_ENV.terminateReason,
    apiTimeoutMs: parseTimeout(process.env.API_TIMEOUT_MS ?? DEFAULT_ENV.apiTimeoutMs),
    startRequestBodyPath,
    startRequestBody: loadRequestBody(startRequestBodyPath),
  };

  return cachedC3Env;
}
