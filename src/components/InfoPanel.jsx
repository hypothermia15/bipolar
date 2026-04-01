import React from "react";
import { useTranslation } from "react-i18next";
import { MODIFIERS } from "../data/modifiers";

export default function InfoPanel({ activeModifiers }) {
  const { t } = useTranslation();

  const activeDescs = Object.entries(activeModifiers)
    .filter(([, d]) => d.conc > 0.01)
    .sort((a, b) => b[1].conc - a[1].conc);

  return (
    <div className="description-panel" style={{
      width: "100%", padding: "14px 18px",
      background: "rgba(255,255,255,0.025)", borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.06)",
      maxHeight: 600, overflowY: "auto",
    }}>
      {activeDescs.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, margin: 0, fontWeight: 600 }}>
            {t("ui.noActive")}
          </p>
          <div style={{
            padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.04)"
          }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12.5, margin: "0 0 12px 0", lineHeight: 1.55 }}>
              {t("ui.instructions")}
            </p>
            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.05)", margin: "12px 0" }} />
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12.5, margin: "0 0 6px 0", fontWeight: 600 }}>
              {t("ui.attractorTheory.title")}
            </p>
            <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 12, margin: 0, lineHeight: 1.65 }}>
              {t("ui.attractorTheory.description")}
            </p>
            <a
              href="https://www.nature.com/articles/s41398-022-02194-4"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block", marginTop: 12, color: "#8ab", fontSize: 11.5,
                textDecoration: "none", borderBottom: "1px dotted rgba(136,170,187,0.5)",
                transition: "opacity 0.2s"
              }}
              onMouseOver={e => e.currentTarget.style.opacity = 0.8}
              onMouseOut={e => e.currentTarget.style.opacity = 1}
            >
              📄 {t("ui.attractorTheory.link")}
            </a>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {activeDescs.map(([key, state]) => {
            const d = MODIFIERS[key];
            const pct = Math.round(state.conc * 100);
            let phaseLabel = t("ui.phaseOff");
            if (state.phase === "onset") phaseLabel = t("ui.phaseOnset");
            else if (state.on) phaseLabel = state.conc > 0.99 ? t("ui.phaseSteady") : t("ui.phaseDecay");

            const sections = t(`modifiers.${key}.sections`, { returnObjects: true, defaultValue: null });
            const detail = t(`modifiers.${key}.detail`, { defaultValue: "" });

            return (
              <div key={key} style={{ borderLeft: `2px solid ${d.color}60`, paddingLeft: 12, display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ color: d.color, fontWeight: 700, fontSize: 14 }}>{d.icon} {t(`modifiers.${key}.label`)}</span>
                  <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "'Space Mono', monospace" }}>{pct}%{phaseLabel}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{t(`modifiers.${key}.desc`)}</p>

                {detail && (
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0, lineHeight: 1.65 }}>
                    {detail}
                  </p>
                )}

                {Array.isArray(sections) && sections.map((sec, si) => (
                  <div key={si} style={{ marginTop: 4 }}>
                    <p style={{ color: d.color, opacity: 0.7, fontSize: 10.5, margin: "0 0 4px 0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{sec.heading}</p>
                    {sec.items.map((item, ii) => (
                      <p key={ii} style={{ color: "rgba(255,255,255,0.42)", fontSize: 12, margin: "2px 0", lineHeight: 1.6, paddingLeft: 10 }}>
                        <span style={{ color: d.color, opacity: 0.45, marginRight: 5 }}>&#8227;</span>{item}
                      </p>
                    ))}
                  </div>
                ))}

                {d.refs && d.refs.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 4 }}>
                    {d.refs.map((ref, i) => (
                      <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer"
                        style={{
                          color: d.color, opacity: 0.7, fontSize: 11.5,
                          textDecoration: "none", borderBottom: `1px dotted ${d.color}55`,
                          transition: "opacity 0.2s"
                        }}
                        onMouseOver={e => e.currentTarget.style.opacity = 1}
                        onMouseOut={e => e.currentTarget.style.opacity = 0.7}
                      >
                        📄 {ref.cite}
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
