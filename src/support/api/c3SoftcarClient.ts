import type { APIRequestContext, APIResponse } from '@playwright/test';

export interface ApiCallResult {
  ok: boolean;
  status: number;
  body: string;
}

export interface StartServiceResult extends ApiCallResult {
  serviceId?: string;
}

export interface SoftcarServiceRequest {
  vin: string;
  serviceType: string;
  routingCallCenterId: string;
  position: string;
  destination: string;
  startRequestBody?: Record<string, unknown>;
}

export interface SoftcarTerminationRequest {
  vin: string;
  serviceId: string;
  serviceType: string;
  terminateReason: string;
  destination: string;
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

export class C3SoftcarClient {
  public constructor(private readonly request: APIRequestContext) {}

  public async startService(requestData: SoftcarServiceRequest): Promise<StartServiceResult> {
    const response = await this.request.post(`/vehicles/${encodeURIComponent(requestData.vin)}/services`, {
      params: {
        serviceType: requestData.serviceType,
        routingCallCenterId: requestData.routingCallCenterId,
        position1: requestData.position,
        destination: requestData.destination,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestData.startRequestBody ?? {},
    });

    const result = await this.toResult(response);
    return {
      ...result,
      serviceId: extractServiceId(result.body),
    };
  }

  public async sendUpdate(requestData: Omit<SoftcarServiceRequest, 'routingCallCenterId'> & { serviceId: string }): Promise<ApiCallResult> {
    const response = await this.request.put(
      `/vehicles/${encodeURIComponent(requestData.vin)}/services/${encodeURIComponent(requestData.serviceId)}/sendupdate`,
      {
        params: {
          serviceTypeFallback: requestData.serviceType,
          position1: requestData.position,
          destination: requestData.destination,
        },
      },
    );

    return this.toResult(response);
  }

  public async terminate(requestData: SoftcarTerminationRequest): Promise<ApiCallResult> {
    const response = await this.request.post(
      `/vehicles/${encodeURIComponent(requestData.vin)}/services/${encodeURIComponent(requestData.serviceId)}/terminateack`,
      {
        params: {
          serviceTypeFallback: requestData.serviceType,
          terminateReason: requestData.terminateReason,
          destination: requestData.destination,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        data: {},
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


