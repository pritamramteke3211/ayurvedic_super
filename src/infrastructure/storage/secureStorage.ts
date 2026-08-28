/**
 * @file src/infrastructure/storage/secureStorage.ts
 * @description Production Secure Storage combining hardware-backed react-native-keychain (for credentials/tokens)
 * and AES-256 encrypted react-native-mmkv (for structured sensitive medical profiles).
 *
 * Invariants:
 * - Employs react-native-keychain for OS Keychain / Android Keystore hardware-backed token security.
 * - Employs encrypted MMKV instance for sub-millisecond encrypted structured key-value reads/writes.
 * - Provides graceful zero-crash in-memory fallback for Jest/Node testing environments.
 */

import * as Keychain from 'react-native-keychain';
import { createMMKV, type MMKV } from 'react-native-mmkv';
import { logger } from '../logging/logger';

const SECURE_VAULT_ID = 'ayurvedic-super-secure-vault';
const SECURE_ENCRYPTION_KEY = 'AmrutamAyurveda2026!EncryptedVault#99';
const AUTH_SERVICE_KEY = 'amrutam_auth_service';

export interface SecureStorageInterface {
  getString(key: string): string | null;
  setString(key: string, value: string): void;
  getObject<T>(key: string): T | null;
  setObject<T>(key: string, value: T): void;
  delete(key: string): void;
  clearAll(): void;

  // Keychain-backed Auth Token Methods
  getAuthToken(): Promise<string | null>;
  setAuthToken(token: string): Promise<boolean>;
  clearAuthToken(): Promise<boolean>;

  // Encrypted MMKV Methods
  getSensitiveData<T>(key: string): T | null;
  setSensitiveData<T>(key: string, data: T): void;
}

export class SecureStorageService implements SecureStorageInterface {
  private mmkv: MMKV | null = null;
  private memoryFallback = new Map<string, string>();
  private memoryKeychainToken: string | null = null;
  private readonly isEncrypted: boolean;

  constructor(vaultId = SECURE_VAULT_ID, encryptionKey = SECURE_ENCRYPTION_KEY) {
    try {
      this.mmkv = createMMKV({
        id: vaultId,
        encryptionKey: encryptionKey,
      });
      this.isEncrypted = true;
      logger.info('SecureStorage', `Encrypted MMKV vault '${vaultId}' initialized.`);
    } catch (e) {
      this.isEncrypted = false;
      this.mmkv = null;
      logger.warn(
        'SecureStorage',
        'Native MMKV unavailable (Jest/Node testing runtime). Using memory fallback.',
        e,
      );
    }
  }

  getString(key: string): string | null {
    if (this.mmkv) {
      const val = this.mmkv.getString(key);
      return val !== undefined ? val : null;
    }
    return this.memoryFallback.get(key) ?? null;
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
      logger.error('SecureStorage', `Failed to parse secure JSON for key: ${key}`, e);
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

  async clearAll(): Promise<void> {
    if (this.mmkv) {
      this.mmkv.clearAll();
    } else {
      this.memoryFallback.clear();
    }
    this.memoryKeychainToken = null;
    try {
      await Keychain.resetGenericPassword({ service: AUTH_SERVICE_KEY });
    } catch {
      // Graceful fallback for non-native environments
    }
  }

  // --- Hardware-Backed Keychain Auth Tokens ---

  async getAuthToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({ service: AUTH_SERVICE_KEY });
      if (credentials) {
        return credentials.password;
      }
      return this.memoryKeychainToken;
    } catch (e) {
      logger.warn('SecureStorage', 'Keychain read failed or in test mode, using memory store', e);
      return this.memoryKeychainToken;
    }
  }

  async setAuthToken(token: string): Promise<boolean> {
    this.memoryKeychainToken = token;
    try {
      const result = await Keychain.setGenericPassword('auth_user', token, {
        service: AUTH_SERVICE_KEY,
      });
      return typeof result === 'boolean' ? result : true;
    } catch (e) {
      logger.warn('SecureStorage', 'Keychain write failed or in test mode, saved to memory', e);
      return true;
    }
  }

  async clearAuthToken(): Promise<boolean> {
    this.memoryKeychainToken = null;
    try {
      return await Keychain.resetGenericPassword({ service: AUTH_SERVICE_KEY });
    } catch (e) {
      logger.warn('SecureStorage', 'Keychain reset failed or in test mode', e);
      return true;
    }
  }

  // --- Encrypted Structured Domain Data ---

  getSensitiveData<T>(key: string): T | null {
    return this.getObject<T>(`sensitive_${key}`);
  }

  setSensitiveData<T>(key: string, data: T): void {
    this.setObject<T>(`sensitive_${key}`, data);
  }

  isVaultEncrypted(): boolean {
    return this.isEncrypted;
  }
}

export const secureStorage = new SecureStorageService();
