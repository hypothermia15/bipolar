import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useSimulation } from "./hooks/useSimulation";
import SimulationCanvas from "./components/SimulationCanvas";
import ModifierControls from "./components/ModifierControls";
import InfoPanel from "./components/InfoPanel";
import "./App.css";

export default function App() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { sim, activeModifiers, toggleModifier, disturb, loop } = useSimulation();

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    // English is default — use root path; other languages get /:lang prefix
    navigate(lang === "en" ? "/" : `/${lang}`, { replace: true });
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
              {["en", "pl", "de"].map((l) => (
                <button
                  key={l}
                  onClick={() => switchLanguage(l)}
                  className={`lang-item ${i18n.language === l ? "active" : ""}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
              <div className="lang-slider" style={{
                width: 34,
                left: 2 + (["en", "pl", "de"].indexOf(i18n.language) * 36)
              }} />
            </div>
            <a href="https://github.com/ciessielski/bipolar" target="_blank" rel="noopener noreferrer" className="github-link">
              <svg height="16" aria-hidden="true" viewBox="0 0 16 16" width="16" style={{ fill: "currentColor" }}>
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
            </a>
          </div>
        </header>

        <div className="main-visuals">
          <div className="canvas-wrapper">
            <SimulationCanvas sim={sim} loop={loop} disturb={disturb} />
          </div>
          <div className="info-wrapper">
            <InfoPanel activeModifiers={activeModifiers} />
          </div>
        </div>
      </main>
    </div>
  );
}
