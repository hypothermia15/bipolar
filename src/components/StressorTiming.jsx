import React, { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { X_LO, X_HI } from "../constants";
import { BASE } from "../data/modifiers";
import { observationSeconds, referenceDelay, simulateTwoImpulses } from "../utils/stressorTiming";

const x = seconds => 40 + 350 * seconds / observationSeconds;
const y = position => 12 + 120 * (X_HI - position) / (X_HI - X_LO);
const toPoints = positions => positions.map((value, i) =>
  x(i * observationSeconds / (positions.length - 1)).toFixed(2) + "," + y(value).toFixed(2)
).join(" ");

export default memo(function StressorTiming({ startIndex, scale }) {
  const { t, i18n } = useTranslation();
  const [delay, setDelay] = useState(0.15);
  const start = BASE.wells[startIndex].cx;
  // Keep direction and magnitude fixed while the interval changes.
  const impulse = -4 * scale;
  const reference = useMemo(() => simulateTwoImpulses(start, impulse, referenceDelay), [start, impulse]);
  const selected = useMemo(() => simulateTwoImpulses(start, impulse, delay), [start, impulse, delay]);
  const format = n => n.toLocaleString(i18n.language, { maximumFractionDigits: 2 });
  return (
    <details className="threshold-experiment timing-experiment">
      <summary>{t("timing.title")}</summary>
      <p>{t("timing.hint")}</p>
      <label className="lab-scrub">{t("timing.interval")} · {format(delay)} s
        <input type="range" min="0" max="6" step="0.05" value={delay}
          aria-valuetext={format(delay) + " s"} onChange={e => setDelay(Number(e.target.value))} />
      </label>
      <div className="timing-legend">
        <span>{t("timing.reference")} · {format(referenceDelay)} s</span>
        <span>{t("timing.selected")} · {format(delay)} s</span>
      </div>
      <figure>
        <figcaption>{t("timing.axes")}</figcaption>
        <svg viewBox="0 0 404 160" role="img" aria-label={t("timing.axes")}>
          {[-1, 0, 1].map(value => <g key={value}>
            <line x1="40" x2="390" y1={y(value)} y2={y(value)} stroke="#38465d" />
            <text x="32" y={y(value) + 4} textAnchor="end">{value}</text>
          </g>)}
          {[0, 2, 4, 6, 8].map(time => <text key={time} x={x(time)} y="151" textAnchor="middle">{time}</text>)}
          <line x1={x(delay)} x2={x(delay)} y1="12" y2="132" stroke="#f7cb72" strokeDasharray="2 4" />
          <polyline points={toPoints(selected.positions)} fill="none" stroke="#f7cb72" strokeWidth="2.5" />
          <polyline points={toPoints(reference.positions)} fill="none" stroke="#83bdf8" strokeWidth="2" strokeDasharray="5 4" />
          <circle cx={x(delay)} cy={y(selected.secondPosition)} r="4" fill="#f7cb72" />
          <circle cx={x(referenceDelay)} cy={y(reference.secondPosition)} r="5" fill="none" stroke="#83bdf8" strokeWidth="2" />
        </svg>
      </figure>
      <p role="status">{t("timing.speed", { before: format(selected.before), after: format(selected.after) })}</p>
    </details>
  );
});
