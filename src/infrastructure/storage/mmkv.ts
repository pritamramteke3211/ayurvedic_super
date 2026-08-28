/**
 * @file src/infrastructure/storage/mmkv.ts
 * @description High-performance synchronous key-value storage powered by react-native-mmkv (v3).
 *
 * Invariants:
 * - Direct C++ JSI bindings for <0.1ms read/writes without JS bridge serialization.
 * - Graceful fallback to in-memory store in non-native / Jest testing environments.
 * - Exposes typed JSON serialization and deserialization methods.
 */

import { createMMKV, type MMKV } from 'react-native-mmkv';
import { logger } from '../logging/logger';

class MMKVStorageService {
  private mmkv: MMKV | null = null;
  private memoryFallback = new Map<string, string>();

  constructor() {
    try {
      this.mmkv = createMMKV({
        id: 'ayurvedic-super-storage',
      });
      logger.info('MMKVStorage', 'Native MMKV instance initialized successfully');
    } catch (e) {
      logger.warn(
        'MMKVStorage',
        'Native MMKV unavailable (running in Jest/Node environment). Using in-memory fallback.',
        e,
      );
      this.mmkv = null;
    }
  }

  getString(key: string): string | undefined {
    if (this.mmkv) {
      return this.mmkv.getString(key);
    }
    return this.memoryFallback.get(key);
  }

  setString(key: string, value: string): void {
    if (this.mmkv) {
      this.mmkv.set(key, value);
    } else {
      this.memoryFallback.set(key, value);
    }
  }

  getObject<T>(key: string): T | null {
    const raw = this.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch (e) {
      logger.error('MMKVStorage', `Failed to parse stored JSON for key: ${key}`, e);
      return null;
    }
  }

  setObject<T>(key: string, value: T): void {
    this.setString(key, JSON.stringify(value));
  }

  delete(key: string): void {
    if (this.mmkv) {
      this.mmkv.remove(key);
    } else {
      this.memoryFallback.delete(key);
    }
  }

  clearAll(): void {
    if (this.mmkv) {
      this.mmkv.clearAll();
    } else {
      this.memoryFallback.clear();
    }
  }
}

export const storage = new MMKVStorageService();
