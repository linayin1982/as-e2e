import { readFileSync } from 'fs';
import { resolve } from 'path';

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
  apiTimeoutMs: 30_000,
};

let cachedC3Env: C3SoftcarEnv | undefined;

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

function parseTimeout(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? `${DEFAULT_ENV.apiTimeoutMs}`, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_ENV.apiTimeoutMs;
}

function loadRequestBody(filePath: string): Record<string, unknown> {
  const absolutePath = resolve(process.cwd(), filePath);
  const raw = readFileSync(absolutePath, 'utf-8');
  return JSON.parse(raw) as Record<string, unknown>;
}

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
    apiTimeoutMs: parseTimeout(process.env.API_TIMEOUT_MS),
    startRequestBodyPath,
    startRequestBody: loadRequestBody(startRequestBodyPath),
  };

  return cachedC3Env;
}
