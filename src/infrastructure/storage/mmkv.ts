import { logger } from '../logging/logger';

// In-memory fallback / MMKV wrapper interface
class LocalStorage {
  private store = new Map<string, string>();

  getString(key: string): string | undefined {
    return this.store.get(key);
  }

  setString(key: string, value: string): void {
    this.store.set(key, value);
  }

  getObject<T>(key: string): T | null {
    const raw = this.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch (e) {
      logger.error('LocalStorage', `Failed to parse stored JSON for key: ${key}`, e);
      return null;
    }
  }

  setObject<T>(key: string, value: T): void {
    this.setString(key, JSON.stringify(value));
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clearAll(): void {
    this.store.clear();
  }
}

export const storage = new LocalStorage();
