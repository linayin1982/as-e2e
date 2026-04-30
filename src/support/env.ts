import {normalizeBaseUrl,parseTimeout} from '@utils/utilities'

export interface BaseEnv {
  apiBaseURL: string;
  cosmosBaseURL: string;
  VCC_VIN: string;
  VCC_CCID: string;
  VCC_API_TIMEOUT: number;
  VCC_AGENT_NAME: string;
  JLR_VIN: string;
  JLR_CCID: string;
  JLR_API_TIMEOUT: number;
  JLR_AGENT_NAME: string;
  agentEmail: string;
  mailDomain: string;
  account: string;
}

const DEFAULT_ENV = {
  apiBaseURL: 'https://vcc-vocmo-soft-car.qa.voc.eu-west-1.wcar.aws.wcar-i.net',
  VCC_VIN: 'YVVDD3VK5TPC45172',
  VCC_CCID: '4101',
  VCC_API_TIMEOUT: 30000,
  VCC_AGENT_NAME:'VCC QA Test Call center',
  JLR_VIN: 'VINIOTAWSCHN00309',
  JLR_CCID: '22',
  JLR_API_TIMEOUT: 30000,
  JLR_AGENT_NAME:'JLR IOT',
  cosmosBaseURL: 'https://call-center-client.cn.qa.volvocars.com.cn/',
  agentEmail: 'taichi',
  mailDomain: 'test-mail.nonprod.call-center-client.wirelesscar.cloud',
};

const DEFAULT_ACCOUNT = `${DEFAULT_ENV.agentEmail}@${DEFAULT_ENV.mailDomain}`;

let cachedBaseEnv: BaseEnv | undefined;

/** Synchronous loader for non-secret config values. Safe to call at module load time. */
export function loadBaseEnv(): BaseEnv {
  if (cachedBaseEnv) {
    return cachedBaseEnv;
  }
  cachedBaseEnv = {
    apiBaseURL: normalizeBaseUrl(process.env.ENABLING_BASE_URL ?? DEFAULT_ENV.apiBaseURL),
    VCC_VIN: process.env.VCC_VIN ?? DEFAULT_ENV.VCC_VIN,
    VCC_CCID: process.env.VCC_CCID ?? DEFAULT_ENV.VCC_CCID,
    VCC_API_TIMEOUT: parseTimeout(process.env.VCC_API_TIMEOUT ?? DEFAULT_ENV.VCC_API_TIMEOUT),
    VCC_AGENT_NAME: process.env.VCC_AGENT_NAME ?? DEFAULT_ENV.VCC_AGENT_NAME,
    JLR_VIN: process.env.JLR_VIN ?? DEFAULT_ENV.JLR_VIN,
    JLR_CCID: process.env.JLR_CCID ?? DEFAULT_ENV.JLR_CCID,
    JLR_API_TIMEOUT: parseTimeout(process.env.JLR_API_TIMEOUT ?? DEFAULT_ENV.JLR_API_TIMEOUT),
    JLR_AGENT_NAME: process.env.JLR_AGENT_NAME ?? DEFAULT_ENV.JLR_AGENT_NAME,
    cosmosBaseURL: normalizeBaseUrl(process.env.COSMOS_URL ?? DEFAULT_ENV.cosmosBaseURL),
    agentEmail: process.env.AGENT_EMAIL ?? DEFAULT_ENV.agentEmail,
    mailDomain: process.env.AGENT_MAIL_DOMAIN ?? DEFAULT_ENV.mailDomain,
    account: process.env.AGENT_ACCOUNT ?? DEFAULT_ACCOUNT,
  };
  return cachedBaseEnv;
}

