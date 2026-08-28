/**
 * @file src/infrastructure/storage/secureStorage.test.ts
 * @description Unit tests for SecureStorageService operations, Keychain tokens, and encrypted MMKV objects.
 */

import { SecureStorageService } from './secureStorage';

describe('SecureStorageService with react-native-keychain & MMKV', () => {
  let vault: SecureStorageService;

  beforeEach(async () => {
    vault = new SecureStorageService('test-vault', 'test-key-123');
    await vault.clearAll();
  });

  it('correctly sets, gets, and deletes strings', () => {
    vault.setString('api_key', 'secret_abc_123');
    expect(vault.getString('api_key')).toBe('secret_abc_123');

    vault.delete('api_key');
    expect(vault.getString('api_key')).toBeNull();
  });

  it('correctly manages hardware-backed auth session tokens', async () => {
    expect(await vault.getAuthToken()).toBeNull();

    await vault.setAuthToken('jwt_bearer_token_xyz');
    expect(await vault.getAuthToken()).toBe('jwt_bearer_token_xyz');

    await vault.clearAuthToken();
    expect(await vault.getAuthToken()).toBeNull();
  });

  it('correctly serializes and retrieves complex sensitive objects via encrypted MMKV', () => {
    interface PatientHealthFlag {
      prakriti: string;
      bloodGroup: string;
      allergies: string[];
    }

    const testData: PatientHealthFlag = {
      prakriti: 'Vata-Pitta',
      bloodGroup: 'O+',
      allergies: ['Dust', 'Gluten'],
    };

    vault.setSensitiveData('patient_profile', testData);
    const retrieved = vault.getSensitiveData<PatientHealthFlag>('patient_profile');

    expect(retrieved).toEqual(testData);
  });

  it('clears all entries on clearAll()', async () => {
    vault.setString('k1', 'v1');
    vault.setString('k2', 'v2');
    await vault.setAuthToken('temp_token');

    await vault.clearAll();

    expect(vault.getString('k1')).toBeNull();
    expect(vault.getString('k2')).toBeNull();
    expect(await vault.getAuthToken()).toBeNull();
  });
});
