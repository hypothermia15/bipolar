import React, { useState } from "react";
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
      background: "#0d0d1b", minHeight: "100vh", display: "flex",
      fontFamily: "system-ui, -apple-system, sans-serif", color: "#dde",
      overflowX: "hidden", width: "100vw", position: "relative"
    }}>
      <style>{`
        * { box-sizing: border-box; }
        .app-container { flex-direction: row; gap: 0; }
        .sidebar {
          flex: 0 0 15%;
          min-width: 180px;
          max-width: 240px;
          border-right: 1px solid rgba(255,255,255,0.06);
          padding: 24px 16px;
          background: rgba(255,255,255,0.01);
          overflow-y: auto;
          max-height: 100vh;
        }
        .content-area {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .main-visuals {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          width: 100%;
          min-width: 0;
        }
        .canvas-wrapper {
          flex: 1 1 60%;
          min-width: 0;
        }
        .info-wrapper {
          flex: 0 0 320px;
          min-width: 280px;
        }
        
        @media (max-width: 1200px) {
          .main-visuals { flex-direction: column; align-items: center; }
          .canvas-wrapper, .info-wrapper { flex: 1 1 auto; width: 100%; max-width: 800px; }
        }

        @media (max-width: 900px) {
          .app-container { flex-direction: column; }
          .sidebar { width: 100%; max-width: none; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); max-height: none; }
        }

        @media (max-width: 600px) {
          h2 { font-size: 18px !important; }
          .content-area { padding: 12px; }
        }

        canvas { width: 100%; height: auto !important; background: #0d0d1b; display: block; }
        
        .lang-picker {
          display: flex;
          background: rgba(255,255,255,0.04);
          padding: 3px;
          border-radius: 8px;
          gap: 2px;
          position: relative;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .lang-item {
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          background: transparent;
          z-index: 1;
          position: relative;
          min-width: 36px;
        }
        .lang-item.active {
          color: #fff;
        }
        .lang-item:hover:not(.active) {
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.04);
        }
        .lang-slider {
          position: absolute;
          top: 3px;
          height: calc(100% - 6px);
          background: rgba(255,255,255,0.12);
          border-radius: 6px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .github-link { opacity: 0.7; transition: opacity 0.2s; display: flex; align-items: center; padding: 4px; color: #fff; }
        .github-link:hover { opacity: 1; }
      `}</style>

      <div style={{ position: "absolute", top: 15, right: 15, display: "flex", alignItems: "center", gap: 12, zIndex: 100 }}>
        <div className="lang-picker">
          {["en", "pl", "de"].map((l, i) => (
            <button
              key={l}
              onClick={() => i18n.changeLanguage(l)}
              className={`lang-item ${i18n.language === l ? "active" : ""}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
          <div className="lang-slider" style={{
            width: 36, // approximate width
            left: 3 + (["en", "pl", "de"].indexOf(i18n.language) * 38) // 36 + 2 gap
          }} />
        </div>

        <a href="https://github.com/ciessielski/bipolar" target="_blank" rel="noopener noreferrer" className="github-link">
          <svg height="18" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="18" style={{ fill: "currentColor" }}>
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
        </a>
      </div>

      <aside className="sidebar">
        <ModifierControls activeModifiers={activeModifiers} toggleModifier={toggleModifier} />
      </aside>

      <main className="content-area">
        <header style={{ marginBottom: 32, textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 20 }}>
          <h2 style={{ 
            margin: "0 0 6px 0", 
            fontSize: 22, 
            fontWeight: 900, 
            letterSpacing: "2px", 
            textTransform: "uppercase",
            color: "#fff"
          }}>
            {t("title")}
          </h2>
          <p style={{ 
            color: "rgba(255,255,255,0.4)", 
            margin: 0, 
            fontSize: 11, 
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            {t("subtitle")}
          </p>
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
