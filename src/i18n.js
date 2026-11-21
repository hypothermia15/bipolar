import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import pl from './locales/pl.json';
import de from './locales/de.json';
import tr from './locales/tr.json';
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

// Turkish adaptation: the app is served as static files from a sub-folder, so the
// language lives in the query string (?lang=en) and in localStorage instead of the URL path.
export const SUPPORTED_LANGS = ['tr', 'en', 'pl', 'de'];
const STORAGE_KEY = 'bipolar-manzarasi-lang';

function readStoredLang() {
  try { return window.localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

export function rememberLang(lang) {
  try { window.localStorage.setItem(STORAGE_KEY, lang); } catch { /* storage unavailable */ }
  document.documentElement.lang = lang;
  const url = new URL(window.location.href);
  if (lang === 'tr') url.searchParams.delete('lang');
  else url.searchParams.set('lang', lang);
  window.history.replaceState(null, '', url);
}

const queryLang = new URLSearchParams(window.location.search).get('lang');
const storedLang = readStoredLang();
const initialLang = SUPPORTED_LANGS.includes(queryLang) ? queryLang
  : SUPPORTED_LANGS.includes(storedLang) ? storedLang : 'tr';
document.documentElement.lang = initialLang;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { ...en, modifiers: enModifiers } },
    pl: { translation: pl },
    de: { translation: de },
    tr: { translation: tr },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', () => { document.title = i18n.t('title'); });
document.title = i18n.t('title');

export default i18n;
