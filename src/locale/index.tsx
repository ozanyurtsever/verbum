import * as i18next from 'i18next';
import EN from './languages/en.json';
import FR from './languages/fr.json';
import PTBR from './languages/ptBr.json';
import RU from './languages/ru.json';
import TR  from './languages/tr.json';
import DE from './languages/de.json';


export const resources = {
  ar: {},
  de: DE,
  en: EN,
  es: {},
  fr: FR,
  it: {},
  ja: {},
  nl: {},
  pl: {},
  pt: {},
  ptBr: PTBR,
  ru: RU,
  tr: TR,
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

const i18n = i18next
  .createInstance(
    {
      ns: ['toolbar', 'action'],
      resources,
      fallbackLng: 'en',
      debug: true,
      interpolation: {
        escapeValue: false,
      },
    },
    // We must provide a function as second parameter, otherwise i18next errors
    (err, t) => {}
  )
  .use(languageDetector as i18next.Module);

export default i18n;
