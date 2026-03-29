import React from "react";
import { DRUGS } from "../data/drugs";
import { translations } from "../locales";

export default function DrugControls({ activeDrugs, toggleDrug, lang }) {
  const t = translations[lang];
  
  const sections = [
    { title: t.sections.stabilizers, keys: ["lithium", "valproate", "lamotrigine"] },
    { title: t.sections.antipsychotics, keys: ["aripiprazole", "quetiapine", "olanzapine", "risperidone"] },
    { title: t.sections.substances, keys: ["ketamine", "mdma", "ayahuasca", "clonazepam", "thc"] },
    { title: t.sections.other, keys: ["ect"] },
  ];

  const pillStyle = (active, color) => ({
    padding: "8px 14px", borderRadius: 8, cursor: "pointer",
    fontWeight: 600, fontSize: 13, transition: "all 0.25s", lineHeight: 1,
    border: `2px solid ${active ? color : "rgba(255,255,255,0.14)"}`,
    background: active ? `${color}22` : "transparent",
    color: active ? color : "rgba(255,255,255,0.42)",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", width: "100%", maxWidth: 1000 }}>
      {sections.map((sec) => (
        <div key={sec.title} className="drug-section" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
          <span className="section-label" style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, minWidth: 100, textAlign: "right" }}>
            {sec.title}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {sec.keys.map(k => {
              const d = DRUGS[k];
              const isOn = activeDrugs[k]?.on;
              return (
                <button key={k} className="pill-button" onClick={() => toggleDrug(k)} style={pillStyle(isOn, d.color)}>
                  {d.icon} {t.drugs[k].label}
                </button>
              );
            })}
          </div>
          <div className="bars-container" style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {sec.keys.map(k => {
              const d = DRUGS[k];
              const conc = activeDrugs[k]?.conc || 0;
              if (conc < 0.005 && !activeDrugs[k]?.on) return null;
              return (
                <div key={k + "_bar"} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 6, background: "rgba(255,255,255,0.04)", fontSize: 11, color: d.color, minWidth: 80 }}>
                  <span style={{ opacity: 0.7 }}>{d.icon}</span>
                  <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ width: `${conc * 100}%`, height: "100%", background: d.color, transition: "width 0.1s linear" }} />
                  </div>
                  <span style={{ fontSize: 10, opacity: 0.6, width: 24, textAlign: "right" }}>{Math.round(conc * 100)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
