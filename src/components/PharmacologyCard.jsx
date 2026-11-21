import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const CHEMBL_URL = (id) =>
  `https://www.ebi.ac.uk/chembl/compound_report_card/${id}/`;

/* small helper: Ki value → pChEMBL-style bar width (log scale, 0.1–10000 nM → 100%–0%) */
function kiToBarPct(ki) {
  if (ki == null) return 0;
  const logMin = -1;   // 0.1 nM
  const logMax = 4;    // 10000 nM
  const logKi = Math.log10(ki);
  return Math.max(0, Math.min(100, ((logMax - logKi) / (logMax - logMin)) * 100));
}

function kiLabel(ki, unit) {
  if (ki == null) return "—";
  if (ki < 1) return `${ki} ${unit || "nM"}`;
  if (ki >= 1000) return `${(ki / 1000).toFixed(1)} µM`;
  return `${Math.round(ki * 10) / 10} ${unit || "nM"}`;
}

export default function PharmacologyCard({ drugKey, modifier }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const p = modifier?.pharmacology;
  if (!p || !p.chemblId) return null;

  const color = modifier.color || "#8ab";

  return (
    <div style={{
      marginTop: 6,
      borderRadius: 6,
      background: `${color}08`,
      border: `1px solid ${color}18`,
      overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "7px 10px", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{
          color: `${color}b3`, fontSize: 10.5, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: 1,
        }}>
          🧬 {t("ui.pharmacology")}
        </span>
        <span style={{ color: `${color}80`, fontSize: 11, marginLeft: 6 }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div style={{ padding: "0 10px 10px 10px", display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Metadata */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <MetaRow label={t("ui.pharm.formula")} value={p.molecularFormula} color={color} />
            <MetaRow label={t("ui.pharm.mw")} value={p.molecularWeight ? `${p.molecularWeight} Da` : null} color={color} />
            <MetaRow
              label={t("ui.pharm.approved")}
              value={p.firstApproved ? p.firstApproved : (p.maxPhase ? `${t("ui.pharm.phase")} ${p.maxPhase}` : "N/A")}
              color={color}
            />
            {p.qed != null && <MetaRow label="QED" value={p.qed.toFixed(2)} color={color} />}
            {p.blackBoxWarning && (
              <span style={{ fontSize: 10, color: "rgba(255,120,80,0.8)", fontWeight: 600 }}>
                ⬥ {t("ui.pharm.blackBox")}
              </span>
            )}
          </div>

          {/* Mechanisms */}
          {p.mechanisms && p.mechanisms.length > 0 && (
            <div>
              <span style={{
                color: `${color}99`, fontSize: 10, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: 0.8,
              }}>
                {t("ui.pharm.mechanism")}
              </span>
              {p.mechanisms.map((m, i) => (
                <p key={i} style={{
                  color: "rgba(255,255,255,0.5)", fontSize: 11.5,
                  margin: "2px 0", lineHeight: 1.5, paddingLeft: 8,
                }}>
                  <span style={{ color, opacity: 0.6, marginRight: 4 }}>›</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{t(`pharmAction.${m.action}`, { defaultValue: m.action })}</span>
                  {" → "}{t(`pharmTarget.${m.target}`, { defaultValue: m.target })}
                </p>
              ))}
            </div>
          )}

          {/* Key targets binding profile */}
          {p.keyTargets && p.keyTargets.length > 0 && (
            <div>
              <span style={{
                color: `${color}99`, fontSize: 10, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: 0.8,
              }}>
                {t("ui.pharm.bindingProfile")}
              </span>
              <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                {p.keyTargets.map((kt, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{
                        color: "rgba(255,255,255,0.6)", fontSize: 11,
                        fontWeight: 600, minWidth: 62, fontFamily: "'Space Mono', monospace",
                      }}>
                        {kt.target}
                      </span>
                      {kt.Ki != null && (
                        <>
                          <div style={{
                            flex: 1, height: 5, borderRadius: 3,
                            background: "rgba(255,255,255,0.06)", overflow: "hidden",
                          }}>
                            <div style={{
                              height: "100%", borderRadius: 3,
                              width: `${kiToBarPct(kt.Ki)}%`,
                              background: `linear-gradient(90deg, ${color}cc, ${color}55)`,
                              transition: "width 0.4s ease",
                            }} />
                          </div>
                          <span style={{
                            color: "rgba(255,255,255,0.4)", fontSize: 10,
                            minWidth: 48, textAlign: "right",
                            fontFamily: "'Space Mono', monospace",
                          }}>
                            {kiLabel(kt.Ki, kt.unit)}
                          </span>
                        </>
                      )}
                    </div>
                    {kt.note && (
                      <span style={{
                        color: "rgba(255,255,255,0.3)", fontSize: 10,
                        paddingLeft: 68, lineHeight: 1.3,
                      }}>
                        {t(`modifiers.${drugKey}.ktNotes.${i}`, { defaultValue: kt.note })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ChEMBL link */}
          <a
            href={CHEMBL_URL(p.chemblId)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              color, opacity: 0.7, fontSize: 11, textDecoration: "none",
              borderBottom: `1px dotted ${color}55`, alignSelf: "flex-start",
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
            onMouseOut={(e) => (e.currentTarget.style.opacity = 0.7)}
          >
            ↗ {t("ui.pharm.viewOnChembl")} ({p.chemblId})
          </a>
        </div>
      )}
    </div>
  );
}

function MetaRow({ label, value, color }) {
  if (value == null) return null;
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
      <span style={{ color: `${color}88`, fontSize: 10, fontWeight: 600, minWidth: 52 }}>
        {label}
      </span>
      <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 11.5 }}>
        {value}
      </span>
    </div>
  );
}
