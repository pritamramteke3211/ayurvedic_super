/**
 * @file src/infrastructure/api/client.ts
 * @description Robust, typed HTTP client wrapper with configurable timeouts,
 * exponential backoff retries for transient errors, abort controller support,
 * and mapped domain/infrastructure error hierarchies.
 *
 * Invariants:
 * - Never returns raw unknown exceptions; all failures map to typed errors (NetworkError, TimeoutError, ApiError, SessionExpiredError).
 * - Retries only transient failures (NetworkError, 5xx server errors, timeouts); does not retry 4xx client errors.
 * - Respects caller-supplied AbortSignals and internal timeout timers via combined signal abort.
 */

import {
  ApiError,
  NetworkError,
  ParseError,
  SessionExpiredError,
  TimeoutError,
} from './errors';

export interface HttpClientConfig {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
}

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly defaultTimeoutMs: number;
  private readonly defaultMaxRetries: number;
  private readonly defaultRetryDelayMs: number;

  constructor(config: HttpClientConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...config.defaultHeaders,
    };
    this.defaultTimeoutMs = config.timeoutMs ?? 10000;
    this.defaultMaxRetries = config.maxRetries ?? 2;
    this.defaultRetryDelayMs = config.retryDelayMs ?? 500;
  }

  /**
   * Performs an HTTP GET request.
   */
  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * Performs an HTTP POST request with an optional JSON payload.
   */
  async post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Performs an HTTP PUT request with an optional JSON payload.
   */
  async put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Performs an HTTP DELETE request.
   */
  async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  /**
   * Core request dispatcher with retry and timeout management.
   */
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const fullUrl = this.buildUrl(endpoint, options.params);
    const maxRetries = options.retries ?? this.defaultMaxRetries;
    const timeoutMs = options.timeoutMs ?? this.defaultTimeoutMs;

    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        return await this.executeSingleRequest<T>(fullUrl, options, timeoutMs);
      } catch (error) {
        const isRetryable = this.isRetryableError(error);
        const hasAttemptsLeft = attempt < maxRetries;

        if (isRetryable && hasAttemptsLeft) {
          const backoffDelay = this.defaultRetryDelayMs * Math.pow(2, attempt);
          await this.sleep(backoffDelay);
          attempt++;
          continue;
        }

        throw error;
      }
    }

    throw new NetworkError('Max request retry attempts exceeded.');
  }

  /**
   * Executes a single fetch attempt wrapped with an AbortController timeout.
   */
  private async executeSingleRequest<T>(
    url: string,
    options: RequestOptions,
    timeoutMs: number,
  ): Promise<T> {
    const controller = new AbortController();
    let isTimeoutTriggered = false;

    const timer = setTimeout(() => {
      isTimeoutTriggered = true;
      controller.abort();
    }, timeoutMs);

    // Merge external abort signal if provided
    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort());
    }

    try {
      const headers = {
        ...this.defaultHeaders,
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      const text = await response.text();
      if (!text) {
        return {} as T;
      }

      try {
        return JSON.parse(text) as T;
      } catch {
        throw new ParseError(`Failed to parse JSON response from ${url}`);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError || err instanceof ParseError) {
        throw err;
      }

      if (isTimeoutTriggered || (err as { name?: string })?.name === 'AbortError') {
        throw new TimeoutError(`Request to ${url} timed out after ${timeoutMs}ms`);
      }

      throw new NetworkError((err as Error)?.message || 'Network request failed');
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Converts non-2xx responses into structured typed API errors.
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = await response.text().catch(() => null);
    }

    const message =
      (body as { message?: string })?.message ||
      `HTTP Request failed with status ${response.status} (${response.statusText})`;

    if (response.status === 401) {
      throw new SessionExpiredError(message);
    }

    throw new ApiError(response.status, message, body);
  }

  /**
   * Determines whether an error is transient and safe to retry.
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof TimeoutError || error instanceof NetworkError) {
      return true;
    }
    if (error instanceof ApiError) {
      // Retry 5xx server errors and 429 Too Many Requests; never retry 4xx client errors
      return error.status >= 500 || error.status === 429;
    }
    return false;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const isAbsolute = endpoint.startsWith('http://') || endpoint.startsWith('https://');
    let url = isAbsolute ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    return url;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const defaultHttpClient = new HttpClient();
