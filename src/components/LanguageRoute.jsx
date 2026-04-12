import { useEffect } from 'react';
import { useParams, Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Reads the :lang param from the URL, sets i18next language accordingly.
 * If the lang is unsupported, redirects to /.
 * If the lang is "en" (default), redirects to / to keep URLs clean.
 */
export default function LanguageRoute({ supportedLangs }) {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  const isSupported = supportedLangs.includes(lang);

  useEffect(() => {
    if (isSupported && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, isSupported, i18n]);

  // Unsupported language → redirect to home (English)
  if (!isSupported) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
