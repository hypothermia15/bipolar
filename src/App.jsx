import React from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGS, rememberLang } from "./i18n.js";
import { useSimulation } from "./hooks/useSimulation";
import SimulationCanvas from "./components/SimulationCanvas";
import ModifierControls from "./components/ModifierControls";
import InfoPanel from "./components/InfoPanel";
import "./App.css";

export default function App() {
  const { t, i18n } = useTranslation();
  const {
    sim, activeModifiers, toggleModifier, disturb, loop,
    isPaused, togglePause, startIndex, reset,
  } = useSimulation();

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    rememberLang(lang);
  };

  return (
    <div className="app-container" style={{
      background: "#0a0b18", minHeight: "100vh", display: "flex",
      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif", color: "#ccd6f0",
      overflowX: "hidden", width: "100vw", position: "relative"
    }}>
      <aside className="sidebar">
        <div className="sidebar-wordmark">Bipolar</div>
        <ModifierControls activeModifiers={activeModifiers} toggleModifier={toggleModifier} />
      </aside>

      <main className="content-area">
        <header className="app-header">
          <div className="header-title">
            <h2 className="main-title">{t("title")}</h2>
            <p className="main-subtitle">{t("subtitle")}</p>
          </div>
          <div className="header-controls">
            <div className="lang-picker">
              {SUPPORTED_LANGS.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLanguage(l)}
                  className={`lang-item ${i18n.language === l ? "active" : ""}`}
                  aria-pressed={i18n.language === l}
                >
                  {l.toUpperCase()}
                </button>
              ))}
              <div className="lang-slider" style={{
                width: 34,
                left: 2 + (Math.max(0, SUPPORTED_LANGS.indexOf(i18n.language)) * 35)
              }} />
            </div>
            <a href="https://github.com/ciessielski/bipolar" target="_blank" rel="noopener noreferrer" className="github-link" aria-label={t("ui.originalLink", { defaultValue: "Original work" })} title={t("ui.originalLink", { defaultValue: "Original work" })}>
              <svg height="16" aria-hidden="true" viewBox="0 0 16 16" width="16" style={{ fill: "currentColor" }}>
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
            </a>
          </div>
        </header>

        <div className="main-visuals">
          <div className="canvas-wrapper">
            <SimulationCanvas sim={sim} loop={loop} disturb={disturb} isPaused={isPaused} />
            <div className="simulation-controls">
              <label>
                {t("ui.startPosition")}
                <select value={startIndex} onChange={(event) => reset(Number(event.target.value))}>
                  <option value={0}>{t("ui.mania")}</option>
                  <option value={1}>{t("ui.euthymia")}</option>
                  <option value={2}>{t("ui.depression")}</option>
                </select>
              </label>
              <button type="button" onClick={togglePause}>
                {t(isPaused ? "ui.resumeSimulation" : "ui.pauseSimulation")}
              </button>
              <button type="button" onClick={() => reset()}>{t("ui.resetSimulation")}</button>
            </div>
          </div>
          <div className="info-wrapper">
            <InfoPanel activeModifiers={activeModifiers} />
          </div>
        </div>

        <footer className="app-footer">
          <p className="footer-disclaimer">{t("ui.disclaimer", { defaultValue: "This is an educational visualization, not a medical tool. Parameter values are simplified approximations and do not constitute clinical guidance." })}</p>
          <p className="footer-credit">
            <a href="https://github.com/ciessielski/bipolar" target="_blank" rel="noopener noreferrer">{t("ui.credit", { defaultValue: "Original work: Michał Ciesielski, Bipolar Attractors (MIT licence)" })}</a>
            {" · "}{t("ui.adaptation", { defaultValue: "Turkish adaptation: Assoc. Prof. Miraç Barış Usta (2026)" })}
          </p>
        </footer>
      </main>
    </div>
  );
}
