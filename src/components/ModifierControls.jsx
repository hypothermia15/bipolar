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
    padding: "6px 10px", borderRadius: 6, cursor: "pointer",
    fontWeight: 600, fontSize: 11.5, transition: "all 0.25s", lineHeight: 1.1,
    border: `2px solid ${active ? color : "rgba(255,255,255,0.08)"}`,
    background: active ? `${color}22` : "rgba(255,255,255,0.02)",
    color: active ? color : "rgba(255,255,255,0.35)",
    display: "flex", alignItems: "center", gap: 6,
    width: "100%", textAlign: "left"
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {sections.map((sec) => (
        <div key={sec.title} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{
            color: "rgba(255,255,255,0.15)", fontSize: 9, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: 1.2, borderBottom: "1px solid rgba(255,255,255,0.04)",
            paddingBottom: 4
          }}>
            {sec.title}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {sec.keys.map(k => {
              const d = MODIFIERS[k];
              const isOn = activeModifiers[k]?.on;
              const conc = activeModifiers[k]?.conc || 0;
              return (
                <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <button className="pill-button" onClick={() => toggleModifier(k)} style={pillStyle(isOn, d.color)}>
                    <span style={{ fontSize: 14 }}>{d.icon}</span>
                    <span style={{ flex: 1 }}>{t(`modifiers.${k}.label`)}</span>
                    {conc > 0.01 && <span style={{ fontSize: 9, opacity: 0.6 }}>{Math.round(conc * 100)}%</span>}
                  </button>
                  {conc > 0.005 && (
                    <div style={{ height: 2, background: "rgba(255,255,255,0.04)", borderRadius: 1, overflow: "hidden", margin: "0 2px" }}>
                      <div style={{ width: `${conc * 100}%`, height: "100%", background: d.color, transition: "width 0.1s linear" }} />
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
