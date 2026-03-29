import React from "react";
import { DRUGS } from "../data/drugs";
import { translations } from "../locales";

export default function InfoPanel({ activeDrugs, lang }) {
  const t = translations[lang];
  
  const activeDescs = Object.entries(activeDrugs)
    .filter(([, d]) => d.conc > 0.01)
    .sort((a, b) => b[1].conc - a[1].conc);

  return (
    <div className="description-panel" style={{
      width: "100%", padding: "16px 20px",
      background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)",
      maxHeight: 600, overflowY: "auto",
    }}>
      {activeDescs.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0, lineHeight: 1.7 }}>
          {t.ui.noActive}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {activeDescs.map(([key, state]) => {
            const d = DRUGS[key];
            const loc = t.drugs[key];
            const pct = Math.round(state.conc * 100);
            let phaseLabel = t.ui.phaseOff;
            if (state.phase === "onset") phaseLabel = t.ui.phaseOnset;
            else if (state.on) phaseLabel = state.conc > 0.99 ? t.ui.phaseSteady : t.ui.phaseDecay;

            return (
              <div key={key} style={{ borderLeft: `3px solid ${d.color}55`, paddingLeft: 12, display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ color: d.color, fontWeight: 700, fontSize: 15 }}>{d.icon} {loc.label}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{pct}%{phaseLabel}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13.5, margin: 0, lineHeight: 1.6 }}>{loc.desc}</p>
                
                {loc.detail && (
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12.5, margin: 0, lineHeight: 1.6 }}>
                    {loc.detail}
                  </p>
                )}

                {loc.sections && loc.sections.map((sec, si) => (
                  <div key={si} style={{ marginTop: 4 }}>
                    <p style={{ color: d.color, opacity: 0.75, fontSize: 12, margin: "0 0 4px 0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{sec.heading}</p>
                    {sec.items.map((item, ii) => (
                      <p key={ii} style={{ color: "rgba(255,255,255,0.45)", fontSize: 12.5, margin: "2px 0", lineHeight: 1.55, paddingLeft: 12 }}>
                        <span style={{ color: d.color, opacity: 0.5, marginRight: 5 }}>&#8227;</span>{item}
                      </p>
                    ))}
                  </div>
                ))}

                {loc.refs && loc.refs.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 4 }}>
                    {loc.refs.map((refLabel, i) => (
                      <a key={i} href={d.refs[i].url} target="_blank" rel="noopener noreferrer"
                        style={{
                          color: d.color, opacity: 0.7, fontSize: 11.5,
                          textDecoration: "none", borderBottom: `1px dotted ${d.color}55`,
                          transition: "opacity 0.2s"
                        }}
                        onMouseOver={e => e.currentTarget.style.opacity = 1}
                        onMouseOut={e => e.currentTarget.style.opacity = 0.7}
                      >
                        📄 {refLabel}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
