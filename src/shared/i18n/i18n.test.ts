/**
 * @file src/shared/i18n/i18n.test.ts
 * @description Unit tests for i18next integration, language switching, and translation resolution.
 */

import { i18n, changeLanguage, toggleLanguage, getCurrentTranslations } from './index';

describe('i18next Integration', () => {
  beforeEach(async () => {
    await changeLanguage('en');
  });

  it('defaults to english translations with proper keys', () => {
    expect(i18n.language).toBe('en');
    const t = getCurrentTranslations();
    expect(t.consultation.findDoctor).toBe('Find an Ayurvedic Vaidya');
    expect(t.shop.addToCart).toBe('Add to Cart');
  });

  it('switches dynamically to hindi with proper authentic Ayurvedic terms', async () => {
    await changeLanguage('hi');
    expect(i18n.language).toBe('hi');
    const t = getCurrentTranslations();
    expect(t.consultation.findDoctor).toBe('आयुर्वेदिक वैद्य खोजें');
    expect(t.shop.addToCart).toBe('कार्ट में जोड़ें');
    expect(t.healthRecords.prakritiProfile).toBe('दोष व प्रकृति संतुलन प्रोफाइल');
  });

  it('toggles between en and hi properly', async () => {
    expect(i18n.language).toBe('en');
    const toggled1 = await toggleLanguage();
    expect(toggled1).toBe('hi');
    expect(i18n.language).toBe('hi');

    const toggled2 = await toggleLanguage();
    expect(toggled2).toBe('en');
    expect(i18n.language).toBe('en');
  });
});
