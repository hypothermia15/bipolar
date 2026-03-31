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

        canvas { max-width: 100%; height: auto !important; background: #0d0d1b; }
      `}</style>

      <div style={{ position: "absolute", top: 15, right: 15, display: "flex", gap: 8, zIndex: 100 }}>
        {["pl", "en", "de"].map(l => (
          <button key={l} onClick={() => i18n.changeLanguage(l)} style={{
            background: i18n.language === l ? "rgba(255,255,255,0.15)" : "transparent",
            border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "4px 8px",
            borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: i18n.language === l ? 700 : 400
          }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <aside className="sidebar">
        <ModifierControls activeModifiers={activeModifiers} toggleModifier={toggleModifier} />
      </aside>

      <main className="content-area">
        <header style={{ marginBottom: 30, textAlign: "center" }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 22, fontWeight: 600, letterSpacing: 0.4 }}>
            {t("title")}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.35)", margin: 0, fontSize: 13, maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
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
