import React from "react";
import { useTranslation } from "react-i18next";
import { useSimulation } from "./hooks/useSimulation";
import SimulationCanvas from "./components/SimulationCanvas";
import ModifierControls from "./components/ModifierControls";
import InfoPanel from "./components/InfoPanel";

export default function App() {
  const { t, i18n } = useTranslation();
  const { sim, activeModifiers, toggleModifier, disturb, loop } = useSimulation();

  return (
    <div className="app-container" style={{
      background: "#0a0b18", minHeight: "100vh", display: "flex",
      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif", color: "#ccd6f0",
      overflowX: "hidden", width: "100vw", position: "relative"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        * { box-sizing: border-box; }

        .app-container { flex-direction: row; }

        .sidebar {
          flex: 0 0 210px;
          border-right: 1px solid rgba(255,255,255,0.06);
          padding: 22px 14px 22px 16px;
          background: rgba(0,0,0,0.25);
          overflow-y: auto;
          max-height: 100vh;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }

        .sidebar-wordmark {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(160,200,255,0.3);
          margin-bottom: 22px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .content-area {
          flex: 1;
          padding: 22px 26px;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .app-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 22px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          gap: 12px;
        }

        .header-title { flex: 1; min-width: 0; }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          padding-top: 2px;
        }

        .main-title {
          margin: 0 0 5px 0;
          font-family: 'Space Mono', monospace;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #e8eeff;
          line-height: 1.2;
        }

        .main-subtitle {
          margin: 0;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1.8px;
          color: rgba(255,255,255,0.28);
        }

        .main-visuals {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          width: 100%;
          min-width: 0;
        }

        .canvas-wrapper { flex: 1 1 60%; min-width: 0; }

        .info-wrapper { flex: 0 0 300px; min-width: 260px; }

        canvas { width: 100%; height: auto !important; background: #0a0b18; display: block; border-radius: 12px; }

        /* Language picker */
        .lang-picker {
          display: flex;
          background: rgba(255,255,255,0.03);
          padding: 2px;
          border-radius: 7px;
          gap: 1px;
          position: relative;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .lang-item {
          padding: 4px 9px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 9.5px;
          font-weight: 700;
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.5px;
          color: rgba(255,255,255,0.3);
          transition: color 0.2s;
          border: none;
          background: transparent;
          z-index: 1;
          position: relative;
          min-width: 34px;
          text-align: center;
        }
        .lang-item.active { color: #fff; }
        .lang-item:hover:not(.active) { color: rgba(255,255,255,0.65); }
        .lang-slider {
          position: absolute;
          top: 2px;
          height: calc(100% - 4px);
          background: rgba(255,255,255,0.09);
          border-radius: 5px;
          transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }

        .github-link {
          opacity: 0.4;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
          padding: 4px;
          color: #fff;
          border-radius: 4px;
        }
        .github-link:hover { opacity: 0.9; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

        /* Modifier controls — mobile becomes horizontal scroll */
        .modifier-controls { display: flex; flex-direction: column; gap: 14px; }
        .modifier-category { display: flex; flex-direction: column; gap: 5px; }
        .modifier-items { display: flex; flex-direction: column; gap: 3px; }

        /* Tablet */
        @media (max-width: 1200px) {
          .main-visuals { flex-direction: column; align-items: stretch; }
          .canvas-wrapper, .info-wrapper { flex: 1 1 auto; width: 100%; min-width: 0; }
        }

        /* Mobile — sidebar moves to top, becomes horizontal */
        @media (max-width: 900px) {
          .app-container { flex-direction: column; }
          .sidebar {
            flex: 0 0 auto;
            width: 100%;
            max-height: none;
            overflow-y: visible;
            overflow-x: auto;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding: 10px 14px;
          }
          .sidebar-wordmark { display: none; }
          .modifier-controls { flex-direction: row; align-items: flex-start; gap: 10px; padding-bottom: 2px; }
          .modifier-category { flex: 0 0 auto; min-width: 100px; }
          .content-area { padding: 14px 16px; }
        }

        @media (max-width: 600px) {
          .main-title { font-size: 13px; }
          .main-subtitle { font-size: 9px; letter-spacing: 1px; }
          .content-area { padding: 12px; }
          .app-header { margin-bottom: 12px; padding-bottom: 12px; }
          .info-wrapper { min-width: 0; }
        }
      `}</style>

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
                  onClick={() => i18n.changeLanguage(l)}
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
