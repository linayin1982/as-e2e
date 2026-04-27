import {normalizeBaseUrl,parseTimeout,loadRequestBody} from '@utils/utilities'

export interface CosmosEnv {
  baseURL: string;
  agentname: string;
  mailDomain: string;
  password: string | undefined;
  otp: string | undefined;
}
const DEFAULT_ENV = {
  baseURL: 'https://call-center-client.cn.qa.volvocars.com.cn/',
  agentname: 'taichi',
  mailDomain: 'test-mail.nonprod.call-center-client.wirelesscar.cloud',
  password: undefined,
  otp: undefined
};


let cachedCosmosEnv: CosmosEnv | undefined;

export function loadCosmosEnv(): CosmosEnv {
  if (cachedCosmosEnv) {
    return cachedCosmosEnv;
  }

  cachedCosmosEnv = {
    baseURL: normalizeBaseUrl(process.env.COSMOS_URL ?? DEFAULT_ENV.baseURL),
    agentname: process.env.C3_SOFTCAR_VIN ?? DEFAULT_ENV.agentname,
    mailDomain: process.env.C3_SOFTCAR_SERVICE_TYPE ?? DEFAULT_ENV.mailDomain,
    password: process.env.C3_ROUTING_CALL_CENTER_ID ?? undefined,
    otp: process.env.C3_SOFTCAR_POSITION_1 ?? undefined,
  };

  return cachedCosmosEnv;
}
