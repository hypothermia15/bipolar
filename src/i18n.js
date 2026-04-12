import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import pl from './locales/pl.json';
import de from './locales/de.json';
import { MODIFIERS } from './data/modifiers';

// Build the English modifier translations from YAML data.
// YAML is the single source of truth for modifier display content.
// Other locales override keys where translated; missing keys fall back to English.
const enModifiers = Object.fromEntries(
  Object.entries(MODIFIERS).map(([key, d]) => [
    key,
    {
      label: d.label ?? key,
      desc: d.desc ?? '',
      detail: d.detail ?? '',
      ...(d.sections && { sections: d.sections }),
      ...(d.warnings && { warnings: d.warnings }),
    },
  ])
);

// Detect language from URL path prefix (e.g. /pl, /de)
const SUPPORTED_LANGS = ['en', 'pl', 'de'];
const pathLang = window.location.pathname.split('/')[1];
const initialLang = SUPPORTED_LANGS.includes(pathLang) ? pathLang : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { ...en, modifiers: enModifiers } },
    pl: { translation: pl },
    de: { translation: de },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
