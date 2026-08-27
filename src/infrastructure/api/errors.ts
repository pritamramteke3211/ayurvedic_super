export class NetworkError extends Error {
  constructor(message = 'Network connection failed. Please check your internet connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Request timed out. Please try again.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly responseBody?: unknown;

  constructor(status: number, message: string, responseBody?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.responseBody = responseBody;
  }
}

export class SessionExpiredError extends ApiError {
  constructor(message = 'Your session has expired. Please log in again.') {
    super(401, message);
    this.name = 'SessionExpiredError';
  }
}

export class ParseError extends Error {
  constructor(message = 'Failed to parse server response.') {
    super(message);
    this.name = 'ParseError';
  }
}
