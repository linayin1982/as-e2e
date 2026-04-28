import {normalizeBaseUrl,getSecrets} from '@utils/utilities'
import {loadC3SoftcarEnv} from "./c3.env";

export interface CosmosEnv {
  baseURL: string;
  agentname: string;
  mailDomain: string;
  password: string;
  otp: string;
  account: string;
}
const DEFAULT_ENV = {
  baseURL: 'https://call-center-client.cn.qa.volvocars.com.cn/',
  agentname: 'taichi',
  mailDomain: 'test-mail.nonprod.call-center-client.wirelesscar.cloud',
};

const DEFAULT_ACCOUNT = `${DEFAULT_ENV.agentname}@${DEFAULT_ENV.mailDomain}`;


let cachedCosmosEnv: CosmosEnv | undefined;

export async function loadCosmosEnv(): Promise<CosmosEnv> {
  if (cachedCosmosEnv) {
    return cachedCosmosEnv;
  }
  const secrets = await getSecrets();
  cachedCosmosEnv = {
    baseURL: normalizeBaseUrl(process.env.COSMOS_URL ?? DEFAULT_ENV.baseURL),
    agentname: process.env.AGENT_EMAIL ?? DEFAULT_ENV.agentname,
    mailDomain: process.env.AGENT_MAIL_DOMAIN ?? DEFAULT_ENV.mailDomain,
    password: secrets.agent_password,
    otp: '',
    account: process.env.AGENT_ACCOUNT ?? DEFAULT_ACCOUNT,
  };

  return cachedCosmosEnv;
}
