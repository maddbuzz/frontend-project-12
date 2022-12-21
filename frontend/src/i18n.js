import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

import resources from './locales/index.js';

const defaultLanguage = 'ru';

const i18n = i18next.createInstance();
i18n
  // // detect user language
  // // learn more: https://github.com/i18next/i18next-browser-languageDetector
  // .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

export default i18n;
