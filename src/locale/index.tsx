import * as i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import EN from './languages/en.json';
import FR from './languages/fr.json';
import PTBR from './languages/ptBr.json';

export const resources = {
  ar: {},
  de: {},
  en: EN,
  es: {},
  fr: FR,
  it: {},
  ja: {},
  nl: {},
  pl: {},
  pt: {},
  ptBr: PTBR,
  ru: {},
  ukr: {},
  zh: {},
} as const;

export const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    const language = navigator.language;
    callback(language.substring(0, 2));
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

export const i18n = i18next
  .use(initReactI18next)
  .use(languageDetector as i18next.Module)
  .init({
    ns: ['toolbar', 'action'],
    resources,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
