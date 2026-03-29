import React, { useState } from "react";
import { useSimulation } from "./hooks/useSimulation";
import SimulationCanvas from "./components/SimulationCanvas";
import DrugControls from "./components/DrugControls";
import InfoPanel from "./components/InfoPanel";
import { translations } from "./locales";

export default function App() {
  const [lang, setLang] = useState("pl");
  const { sim, activeDrugs, toggleDrug, disturb, loop } = useSimulation();
  const t = translations[lang];

  return (
    <div style={{
      background: "#0d0d1b", minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-start", gap: 16, padding: "20px 10px",
      fontFamily: "system-ui, -apple-system, sans-serif", color: "#dde",
    }}>
      <style>{`
        @media (max-width: 600px) {
          h2 { font-size: 18px !important; }
          .pill-button { padding: 6px 10px !important; font-size: 11px !important; }
          .section-label { font-size: 9px !important; min-width: auto !important; margin-bottom: 4px; }
          .drug-section { flex-direction: column !important; align-items: center !important; gap: 4px !important; }
          .bars-container { width: 100%; justify-content: center; }
        }
        @media (max-width: 1100px) {
          .main-content { flex-direction: column !important; align-items: center !important; }
          .description-panel { max-width: 800px !important; width: 100% !important; max-height: none !important; }
        }
        canvas { max-width: 100%; height: auto !important; background: #0d0d1b; }
      `}</style>

      {/* Language Switcher */}
      <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 8 }}>
        {["pl", "en", "de"].map(l => (
          <button key={l} onClick={() => setLang(l)} style={{
            background: lang === l ? "rgba(255,255,255,0.15)" : "transparent",
            border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "4px 8px",
            borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: lang === l ? 700 : 400
          }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <h2 style={{ color: "#dde", margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: 0.4, textAlign: "center" }}>
        {t.title}
      </h2>
      <p style={{ color: "rgba(255,255,255,0.35)", margin: 0, fontSize: 13, textAlign: "center", maxWidth: 700 }}>
        {t.subtitle}
      </p>

      <DrugControls activeDrugs={activeDrugs} toggleDrug={toggleDrug} lang={lang} />

      <div className="main-content" style={{ display: "flex", gap: 16, alignItems: "flex-start", maxWidth: 1240, width: "100%", justifyContent: "center", flexWrap: "wrap" }}>
        <SimulationCanvas sim={sim} loop={loop} disturb={disturb} lang={lang} />
        <InfoPanel activeDrugs={activeDrugs} lang={lang} />
      </div>
    </div>
  );
}
