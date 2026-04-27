import { sleep, throwError } from '@utils/utilities';

interface MailpitMessageSummary extends Record<string, unknown> {
  ID: string;
  Created: string;
}

interface MailpitMessagesResponse extends Record<string, unknown> {
  messages?: MailpitMessageSummary[];
}

interface MailSearchOptions {
  retries?: number;
  delayMs?: number;
  initialDelayMs?: number;
}

const DEFAULT_MAIL_SEARCH_OPTIONS: Required<MailSearchOptions> = {
  retries: 5,
  delayMs: 5000,
  initialDelayMs: 3000,
};

const REGISTER_URL_PATTERN = /(?<registerUrl>https:\/\/\S*\/realms\/\S+\/login-actions\/action-token\?\S+)/;
const ACCESS_CODE_PATTERN = /Access code:\s*(?<accessCode>\w+)\. This code will expire/;

class MailpitClient {
  private get baseUrl(): string {
    const url = process.env.BE_MOCK_MAIL_URL;
    if (!url) {
      throw new Error('BE_MOCK_MAIL_URL environment variable is not set');
    }
    return url;
  }

  async getMail(
    address: string,
    pattern: RegExp,
    options?: MailSearchOptions
  ): Promise<{ match: RegExpMatchArray | null; messageId: string | null }> {
    const { retries, delayMs, initialDelayMs } = { ...DEFAULT_MAIL_SEARCH_OPTIONS, ...options };

    await sleep(initialDelayMs);

    for (let attempt = 0; attempt <= retries; attempt++) {
      const result = await this.findMatchingMessage(address, pattern);
      if (result.match) {
        return result;
      }

      if (attempt < retries) {
        await sleep(delayMs);
      }
    }

    return { match: null, messageId: null };
  }

  async extractRegisterUrl(address: string): Promise<string | null> {
    const { match } = await this.getMail(address, REGISTER_URL_PATTERN);
    return match?.groups?.registerUrl ?? null;
  }

  async extractAccessCode(userEmail: string): Promise<string> {
    const { match } = await this.getMail(userEmail, ACCESS_CODE_PATTERN);
    const accessCode = match?.groups?.accessCode;
    if (!accessCode) {
      throwError('No code found after maximum retries');
    }

    return accessCode;
  }

  private async request(path: string, init?: RequestInit): Promise<Response> {
    const url = new URL(path, this.baseUrl);
    const response = await fetch(url, {
      ...init,
      headers: { ...init?.headers },
    });

    if (!response.ok) {
      throw new Error(`Mailpit request failed for ${url.pathname}: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  private async getAllMessages(
    pathname: string,
    queryParams: Record<string, string> = {}
  ): Promise<MailpitMessageSummary[]> {
    const params = new URLSearchParams(queryParams);
    const response = await this.request(`${pathname}?${params.toString()}`);
    const { messages = [] } = (await response.json()) as MailpitMessagesResponse;
    return messages.sort((a, b) => this.getTimestamp(b) - this.getTimestamp(a));
  }

  private async deleteMessage(messageId: string): Promise<void> {
    await this.request('/api/v1/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ IDs: [messageId] }),
    });
  }

  private async findMatchingMessage(
    address: string,
    pattern: RegExp
  ): Promise<{ match: RegExpMatchArray | null; messageId: string | null }> {
    const messages = await this.getAllMessages('/api/v1/search', {
      query: `to:${address}`,
    });

    for (const message of messages) {
      const messageId = this.getMessageId(message);
      const rawMessage = await this.request(`/api/v1/message/${encodeURIComponent(messageId)}/raw`);
      const mail = this.parseEmail(await rawMessage.text());
      const match = mail.match(pattern);
      if (match) {
        await this.deleteMessage(messageId);
        return { match, messageId };
      }
    }

    return { match: null, messageId: null };
  }

  private getMessageId(message: MailpitMessageSummary): string {
    if (!message.ID || message.ID.length === 0) {
      throw new Error('Mailpit message is missing a valid ID');
    }
    return message.ID;
  }

  private getTimestamp(message: MailpitMessageSummary): number {
    return new Date(message.Created).getTime();
  }

  private parseEmail(email: string): string {
    return email.replace(/=(?:\r\n|\r|\n)/g, '').replace(/=3D/g, '=');
  }
}

const mailpit = new MailpitClient();

export { mailpit, MailpitClient };
