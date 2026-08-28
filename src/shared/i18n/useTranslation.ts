/**
 * @file src/shared/i18n/useTranslation.ts
 * @description React hook integrating react-i18next with strongly-typed Ayurvedic domain dictionaries.
 *
 * Invariants:
 * - Employs official useTranslation hook from react-i18next.
 * - Exposes active `locale`, structured `t` dictionary object, and language switching methods (`setLocale`, `toggleLocale`).
 */

import { useCallback } from 'react';
import { useTranslation as useReactI18nTranslation } from 'react-i18next';
import { changeLanguage, toggleLanguage, getCurrentTranslations, SupportedLocale, Translations } from './index';

export function useTranslation() {
  const { i18n } = useReactI18nTranslation();
  const currentLocale = (i18n.language as SupportedLocale) || 'en';

  const setLocale = useCallback(async (newLocale: SupportedLocale) => {
    await changeLanguage(newLocale);
  }, []);

  const handleToggleLocale = useCallback(async () => {
    return await toggleLanguage();
  }, []);

  // Structured type-safe translations object
  const translations: Translations = getCurrentTranslations();

  return {
    locale: currentLocale,
    t: translations,
    setLocale,
    toggleLocale: handleToggleLocale,
    isHindi: currentLocale === 'hi',
    isEnglish: currentLocale === 'en',
  };
}
