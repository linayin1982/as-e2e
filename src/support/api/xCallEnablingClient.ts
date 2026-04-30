import type { APIRequestContext, APIResponse } from '@playwright/test';
import { readFile } from 'node:fs/promises';

export interface ApiCallResult {
  ok: boolean;
  status: number;
  body: string;
}

export interface StartServiceResult extends ApiCallResult {
  serviceId?: string;
}

export interface XCallStartRequest {
  requestBodyFilePath: string;
}

export interface XCallUpdateRequest {
  serviceId: string;
  requestBodyFilePath: string;
  serviceIdentifierType?: string;
}

export interface XCallTerminationRequest {
  serviceId: string;
  requestBodyFilePath: string;
  serviceIdentifierType?: string;
}

function sanitizeBody(body: string): string {
  return body.trim();
}

function extractServiceId(body: string): string | undefined {
  const trimmedBody = sanitizeBody(body);

  if (!trimmedBody) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(trimmedBody) as unknown;

    if (typeof parsed === 'string' && parsed.trim()) {
      return parsed.trim();
    }

    if (parsed && typeof parsed === 'object') {
      const candidates = ['serviceId', 'id', 'uuid'] as const;

      for (const candidate of candidates) {
        const value = (parsed as Record<string, unknown>)[candidate];
        if (typeof value === 'string' && value.trim()) {
          return value.trim();
        }
      }
    }
  } catch {
    // Fall through to text parsing.
  }

  const uuidMatch = trimmedBody.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i,
  );

  if (uuidMatch) {
    return uuidMatch[0];
  }

  const unquoted = trimmedBody.replace(/^"+|"+$/g, '').trim();
  return unquoted || undefined;
}

type JsonObject = Record<string, unknown>;

async function loadRequestBody(filePath: string): Promise<JsonObject> {
  const content = await readFile(filePath, 'utf-8');
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in request body file "${filePath}": ${message}`);
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`Request body file "${filePath}" must contain a JSON object.`);
  }

  return parsed as JsonObject;
}

export class XCallEnablingClient {
  public constructor(private readonly request: APIRequestContext) {}

  public async startService(requestData: XCallStartRequest): Promise<StartServiceResult> {
    const body = await loadRequestBody(requestData.requestBodyFilePath);

    const response = await this.request.post('/services', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
    });

    const result = await this.toResult(response);
    return {
      ...result,
      serviceId: extractServiceId(result.body),
    };
  }

  public async sendUpdate(requestData: XCallUpdateRequest): Promise<ApiCallResult> {
    const body = await loadRequestBody(requestData.requestBodyFilePath);

    const response = await this.request.put(
      `/services/${encodeURIComponent(requestData.serviceId)}`,
      {
        params: requestData.serviceIdentifierType
          ? { serviceIdentifierType: requestData.serviceIdentifierType }
          : undefined,
        headers: {
          'Content-Type': 'application/json',
        },
        data: body,
      },
    );

    return this.toResult(response);
  }

  public async terminate(requestData: XCallTerminationRequest): Promise<ApiCallResult> {
    const body = await loadRequestBody(requestData.requestBodyFilePath);

    const response = await this.request.put(
      `/services/${encodeURIComponent(requestData.serviceId)}`,
      {
        params: requestData.serviceIdentifierType
          ? { serviceIdentifierType: requestData.serviceIdentifierType }
          : undefined,
        headers: {
          'Content-Type': 'application/json',
        },
        data: body,
      },
    );

    return this.toResult(response);
  }

  private async toResult(response: APIResponse): Promise<ApiCallResult> {
    return {
      ok: response.ok(),
      status: response.status(),
      body: await response.text(),
    };
  }
}


