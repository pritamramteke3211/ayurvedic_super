export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  tag: string;
  message: string;
  data?: unknown;
}

class Logger {
  private formatMessage(level: LogLevel, tag: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${tag}]: ${message}`;
  }

  debug(tag: string, message: string, data?: unknown): void {
    if (__DEV__) {
      console.debug(this.formatMessage('debug', tag, message), data ?? '');
    }
  }

  info(tag: string, message: string, data?: unknown): void {
    console.info(this.formatMessage('info', tag, message), data ?? '');
  }

  warn(tag: string, message: string, data?: unknown): void {
    console.warn(this.formatMessage('warn', tag, message), data ?? '');
  }

  error(tag: string, message: string, error?: unknown): void {
    console.error(this.formatMessage('error', tag, message), error ?? '');
  }
}

export const logger = new Logger();
