/**
 * @file src/shared/i18n/index.ts
 * @description Internationalization configuration using i18next & react-i18next with MMKV locale persistence.
 *
 * Invariants:
 * - Employs industry-standard i18next engine with initReactI18next plugin.
 * - Synchronously initializes with persisted locale from MMKV storage (defaults to 'en').
 * - Exports strongly typed helper methods and dictionaries for English and Hindi.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { storage } from '../../infrastructure/storage/mmkv';
import { en } from './en';
import { hi } from './hi';
import { SupportedLocale, Translations } from './types';

const STORAGE_LOCALE_KEY = 'amrutam_app_locale';

// Read persisted locale from MMKV
const savedLocale = (storage.getString(STORAGE_LOCALE_KEY) as SupportedLocale) || 'en';

export const resources = {
  en: { translation: en },
  hi: { translation: hi },
} as const;

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources,
    lng: savedLocale,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React handles XSS escaping
    },
  });

/**
 * Changes the active application locale and persists the selection to MMKV.
 */
export const changeLanguage = async (locale: SupportedLocale): Promise<void> => {
  storage.setString(STORAGE_LOCALE_KEY, locale);
  await i18n.changeLanguage(locale);
};

/**
 * Toggles between English ('en') and Hindi ('hi').
 */
export const toggleLanguage = async (): Promise<SupportedLocale> => {
  const next: SupportedLocale = i18n.language === 'en' ? 'hi' : 'en';
  await changeLanguage(next);
  return next;
};

/**
 * Synchronously retrieves current active translations.
 */
export const getCurrentTranslations = (): Translations => {
  return (resources[i18n.language as SupportedLocale]?.translation || en) as Translations;
};

export default i18n;
export { i18n };
export * from './types';
export { en } from './en';
export { hi } from './hi';
