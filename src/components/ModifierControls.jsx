import React from "react";
import { useTranslation } from "react-i18next";
import { MODIFIERS } from "../data/modifiers";

const CATEGORY_ORDER = ["stabilizers", "antipsychotics", "psychedelics", "substances", "other"];

export default function ModifierControls({ activeModifiers, toggleModifier }) {
  const { t } = useTranslation();

  const sections = CATEGORY_ORDER.map(cat => ({
    title: t(`sections.${cat}`),
    keys: Object.entries(MODIFIERS)
      .filter(([, d]) => d.category === cat)
      .sort(([, a], [, b]) => (a.order || 0) - (b.order || 0))
      .map(([k]) => k),
  })).filter(s => s.keys.length > 0);

  const pillStyle = (active, color) => ({
    padding: "5px 9px", borderRadius: 5, cursor: "pointer",
    fontWeight: 600, fontSize: 11, transition: "background 0.2s, border-color 0.2s, color 0.2s", lineHeight: 1.2,
    border: `1px solid ${active ? color + "99" : "rgba(255,255,255,0.07)"}`,
    background: active ? `${color}1a` : "rgba(255,255,255,0.02)",
    color: active ? color : "rgba(255,255,255,0.3)",
    display: "flex", alignItems: "center", gap: 6,
    width: "100%", textAlign: "left", boxShadow: active ? `0 0 12px ${color}18` : "none"
  });

  return (
    <div className="modifier-controls">
      {sections.map((sec) => (
        <div key={sec.title} className="modifier-category">
          <span style={{
            color: "rgba(255,255,255,0.18)", fontSize: 8.5, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: 1.5,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            paddingBottom: 4, display: "block", fontFamily: "'Space Mono', monospace"
          }}>
            {sec.title}
          </span>
          <div className="modifier-items">
            {sec.keys.map(k => {
              const d = MODIFIERS[k];
              const isOn = activeModifiers[k]?.on;
              const conc = activeModifiers[k]?.conc || 0;
              return (
                <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <button className="pill-button" onClick={() => toggleModifier(k)} style={pillStyle(isOn, d.color)}>
                    <span style={{ fontSize: 13, lineHeight: 1 }}>{d.icon}</span>
                    <span style={{ flex: 1 }}>{t(`modifiers.${k}.label`)}</span>
                    {conc > 0.01 && <span style={{ fontSize: 8.5, opacity: 0.55, fontFamily: "'Space Mono', monospace" }}>{Math.round(conc * 100)}%</span>}
                  </button>
                  {conc > 0.005 && (
                    <div style={{ height: 1.5, background: "rgba(255,255,255,0.04)", borderRadius: 1, overflow: "hidden", margin: "0 2px" }}>
                      <div style={{ width: `${conc * 100}%`, height: "100%", background: d.color, transition: "width 0.1s linear", opacity: 0.7 }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
